#!/usr/bin/env node
// refactor/scripts/cache-parity.mjs
//
// The refactor must not change what is cached, for how long, or under which tag.
// This script extracts every function whose first statement is a "use cache"
// directive, with its cacheTag(...) / cacheLife(...) arguments, plus every
// revalidateTag / updateTag call, and compares them with a stored baseline.
// Function NAMES are the identity, so moving a function between files is fine.
//
//   node refactor/scripts/cache-parity.mjs snapshot > refactor/cache-parity.baseline.json
//   node refactor/scripts/cache-parity.mjs check
//
// Exit 0 = identical, 1 = drift.

import fs from "node:fs";
import path from "node:path";

const ROOTS = [
  "app",
  "components",
  "lib",
  "modules",
  "integrations",
  "platform",
];
const BASELINE = "refactor/cache-parity.baseline.json";

function* walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name !== "node_modules" && e.name !== ".next") yield* walk(p);
    } else if (/\.(ts|tsx)$/.test(e.name)) yield p;
  }
}

const norm = (s) => s.replace(/\s+/g, " ").trim();

function extract() {
  const cached = {};
  const invalidations = [];
  for (const root of ROOTS)
    for (const file of walk(root)) {
      const src = fs.readFileSync(file, "utf8");
      const lines = src.split("\n");
      lines.forEach((line, i) => {
        const d = line.match(/^\s*"(use cache[^"]*)";?\s*$/);
        if (d) {
          // enclosing function: nearest preceding declaration
          let name = "?";
          for (let j = i - 1; j >= 0; j--) {
            const m = lines[j].match(
              /(?:function\s+(\w+))|(?:const\s+(\w+)\s*=\s*(?:async\s*)?\()/,
            );
            if (m) {
              name = m[1] ?? m[2];
              break;
            }
          }
          const window = lines.slice(i, i + 14).join("\n");
          const tags = [...window.matchAll(/cacheTag\(([^)]*)\)/g)].map((m) =>
            norm(m[1]),
          );
          const life = [...window.matchAll(/cacheLife\(([^)]*)\)/g)].map((m) =>
            norm(m[1]),
          );
          if (cached[name]) name = `${name}@${file}`; // disambiguate homonyms
          cached[name] = { directive: d[1], tags, life };
        }
        const inv = line.match(/\b(revalidateTag|updateTag)\(([^)]*)\)/);
        if (inv && !/^\s*(import|\/\/|\*)/.test(line)) {
          invalidations.push(`${inv[1]}(${norm(inv[2])})`);
        }
      });
    }
  invalidations.sort();
  return {
    cached: Object.fromEntries(Object.entries(cached).sort()),
    invalidations,
  };
}

const mode = process.argv[2];
const now = extract();
if (mode === "snapshot") {
  console.log(JSON.stringify(now, null, 2));
} else if (mode === "check") {
  const base = JSON.parse(fs.readFileSync(BASELINE, "utf8"));
  const problems = [];
  for (const [n, v] of Object.entries(base.cached)) {
    const cur = now.cached[n];
    if (!cur) problems.push(`missing cached function: ${n}`);
    else if (JSON.stringify(cur) !== JSON.stringify(v))
      problems.push(
        `changed: ${n}\n    was ${JSON.stringify(v)}\n    now ${JSON.stringify(cur)}`,
      );
  }
  for (const n of Object.keys(now.cached))
    if (!base.cached[n])
      problems.push(
        `NEW cached function: ${n} ${JSON.stringify(now.cached[n])}`,
      );
  // invalidation multiset may only change if an allowlist entry says so
  const count = (a) => a.reduce((m, x) => ((m[x] = (m[x] ?? 0) + 1), m), {});
  const b = count(base.invalidations),
    c = count(now.invalidations);
  for (const k of new Set([...Object.keys(b), ...Object.keys(c)]))
    if ((b[k] ?? 0) !== (c[k] ?? 0))
      problems.push(`invalidation count ${k}: ${b[k] ?? 0} -> ${c[k] ?? 0}`);
  if (problems.length) {
    console.log(problems.join("\n"));
    console.log(`\nCache parity: ${problems.length} difference(s)`);
    process.exit(1);
  }
  console.log(
    `Cache parity: identical (${Object.keys(now.cached).length} cached fns, ${now.invalidations.length} invalidation sites)`,
  );
} else {
  console.error("usage: cache-parity.mjs <snapshot|check>");
  process.exit(2);
}

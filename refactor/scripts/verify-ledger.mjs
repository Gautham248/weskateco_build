#!/usr/bin/env node
// refactor/scripts/verify-ledger.mjs
//
// Proves "nothing was missed" mechanically.
//   1. COVERAGE: every source file that existed at the base ref (under lib/,
//      config/, route handlers, components/cart/actions.ts, proxy.ts,
//      drizzle.config.ts) is accounted for by a ledger entry.
//   2. STATE: for phase N, every ledger entry is in the state it should be in
//      after phase N (moved files gone from the old path and present at the new
//      one; not-yet-due entries untouched).
//   3. LEFTOVERS: no file under lib/ at HEAD is unaccounted for.
//
//   node refactor/scripts/verify-ledger.mjs --phase <N> --base <ref>
//
// Exit 0 = ok, 1 = problems.

import { execFileSync } from "node:child_process";
import fs from "node:fs";

const arg = (n) => {
  const i = process.argv.indexOf(n);
  return i > -1 ? process.argv[i + 1] : undefined;
};
const phase = Number(arg("--phase"));
const base = arg("--base");
if (Number.isNaN(phase) || !base) {
  console.error("usage: verify-ledger.mjs --phase N --base <ref>");
  process.exit(2);
}

const ledger = JSON.parse(fs.readFileSync("refactor/move-ledger.json", "utf8"));
const git = (...a) =>
  execFileSync("git", a, { encoding: "utf8", maxBuffer: 1 << 28 });

const globToRe = (g) =>
  new RegExp(
    "^" +
      g
        .replace(/[.+^${}()|[\]\\]/g, "\\$&")
        .replace(/\*\*/g, "§§")
        .replace(/\*/g, "[^/]*")
        .replace(/§§/g, ".*") +
      "$",
  );
const escLit = (p) => p; // literal paths (contain [locale]) are compared by equality first

const isScope = (p) =>
  /^(lib|config)\//.test(p) ||
  p === "components/cart/actions.ts" ||
  p === "proxy.ts" ||
  p === "drizzle.config.ts" ||
  /^app\/.*route\.ts$/.test(p);

const baseFiles = git("ls-tree", "-r", "--name-only", base)
  .split("\n")
  .filter((p) => p && isScope(p));
const headFiles = git("ls-files").split("\n").filter(Boolean);
const headSet = new Set(headFiles);
const exists = (p) =>
  p.includes("*") ? headFiles.some((f) => globToRe(p).test(f)) : headSet.has(p);

const covers = (entry, file) =>
  entry.from &&
  (entry.from === file ||
    (entry.from.includes("*") && globToRe(entry.from).test(file)));

const problems = [];

// 1. coverage
for (const f of baseFiles)
  if (!ledger.some((e) => covers(e, f)))
    problems.push(`UNCOVERED at base: ${f} (add a ledger entry)`);

// 2. state
for (const e of ledger) {
  const due = e.phase !== undefined && e.phase <= phase;
  const tos = [].concat(e.to ?? []);
  switch (e.kind) {
    case "move":
      if (due) {
        if (exists(e.from))
          problems.push(`P${e.phase} move not done: ${e.from} still exists`);
        if (!exists(e.to))
          problems.push(`P${e.phase} move target missing: ${e.to}`);
      } else if (!exists(e.from))
        problems.push(`premature: ${e.from} gone before phase ${e.phase}`);
      break;
    case "extract":
    case "new":
      if (due)
        for (const t of tos)
          if (!exists(t)) problems.push(`P${e.phase} target missing: ${t}`);
      break;
    case "delete":
      if (due && exists(e.from))
        problems.push(`P${e.phase} delete not done: ${e.from}`);
      if (!due && !exists(e.from))
        problems.push(
          `premature delete: ${e.from} gone before phase ${e.phase}`,
        );
      break;
    case "stay":
      if (!exists(e.from)) problems.push(`stay entry vanished: ${e.from}`);
      break;
  }
}

// 3. leftovers under lib/ and config/ at HEAD
for (const f of headFiles.filter((p) => /^(lib|config)\//.test(p))) {
  const known =
    ledger.some(
      (e) =>
        covers(e, f) &&
        (e.kind === "stay" ||
          (e.kind === "move" && !(e.phase <= phase)) ||
          (e.kind === "delete" && !(e.phase <= phase)) ||
          e.kind === "extract"),
    ) || ledger.some((e) => e.to && [].concat(e.to).includes(f));
  if (!known) problems.push(`UNACCOUNTED at HEAD: ${f}`);
}

if (problems.length) {
  console.log(problems.map((p) => "  FAIL  " + p).join("\n"));
  console.log(`\nLedger (phase ${phase}): ${problems.length} problem(s)`);
  process.exit(1);
}
console.log(
  `Ledger (phase ${phase}): ok. ${baseFiles.length} base files covered, ${ledger.length} entries in expected state.`,
);

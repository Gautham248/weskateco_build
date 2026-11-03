#!/usr/bin/env node
// refactor/scripts/ui-guard.mjs
//
// Enforces the UI freeze. Compares every UI-scoped file between a base ref and
// HEAD. A UI file may change ONLY in its import declarations (paths/specifiers).
// Any other change (markup, className, logic, copy) is a violation unless the
// file is listed in refactor/ui-guard.allowlist.json with a reason.
//
//   node refactor/scripts/ui-guard.mjs <base-ref> [--json]
//
// Exit 0 = clean, 1 = violations, 2 = usage error.

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const base = process.argv[2];
if (!base) {
  console.error("usage: ui-guard.mjs <base-ref>");
  process.exit(2);
}

const git = (...args) =>
  execFileSync("git", args, { encoding: "utf8", maxBuffer: 1 << 28 });

// UI scope: everything that can change what a visitor sees.
const UI_INCLUDE = [
  /^components\//,
  /^public\//,
  /^locales\//,
  /^app\/globals\.css$/,
  /^app\/(?!api\/|admin\/api\/).*\/(page|layout|loading|error|not-found|opengraph-image|children-wrapper)\.tsx?$/,
  /^app\/.*-client\.tsx$/,
];
// Not UI even though they sit under components/: server-action files that move.
const UI_EXCLUDE = [/^components\/cart\/actions\.ts$/];

const isUi = (p) =>
  UI_INCLUDE.some((r) => r.test(p)) && !UI_EXCLUDE.some((r) => r.test(p));

const allowPath = "refactor/ui-guard.allowlist.json";
const allow = fs.existsSync(allowPath)
  ? JSON.parse(fs.readFileSync(allowPath, "utf8"))
  : [];
const allowed = new Map(allow.map((a) => [a.path, a]));

const isAsset = (spec) =>
  /\.(png|jpe?g|gif|svg|webp|avif|css|json)$/i.test(spec);

/** Source text with import declarations (that carry a binding and are not
 *  asset imports) removed, whitespace collapsed. */
function normalize(name, text) {
  if (!/\.(tsx?|mts|cts)$/.test(name)) return text;
  const sf = ts.createSourceFile(
    name,
    text,
    ts.ScriptTarget.Latest,
    true,
    name.endsWith("x") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
  const kept = [];
  for (const st of sf.statements) {
    if (ts.isImportDeclaration(st)) {
      const spec = st.moduleSpecifier.text;
      if (st.importClause && !isAsset(spec)) continue; // path-only change allowed
    }
    kept.push(text.slice(st.getFullStart(), st.end));
  }
  return kept.join("\n").replace(/\s+/g, " ").trim();
}

const show = (ref, p) => {
  try {
    return git("show", `${ref}:${p}`);
  } catch {
    return null;
  }
};

const lines = git("diff", "--name-status", "-M60%", `${base}...HEAD`)
  .split("\n")
  .filter(Boolean);

const violations = [];
const warnings = [];

for (const line of lines) {
  const [status, a, b] = line.split("\t");
  const oldPath = status.startsWith("R") ? a : a;
  const newPath = status.startsWith("R") ? b : a;
  if (!isUi(oldPath) && !isUi(newPath)) continue;

  const allow1 = allowed.get(newPath) ?? allowed.get(oldPath);
  const record = (msg) =>
    allow1
      ? warnings.push(`${newPath}: ${msg} [allowlisted: ${allow1.reason}]`)
      : violations.push(`${newPath}: ${msg}`);

  if (status === "D") {
    record("UI file deleted");
    continue;
  }
  if (status.startsWith("R") && isUi(oldPath) !== isUi(newPath)) {
    record(`UI file moved out of scope (${oldPath} -> ${newPath})`);
    continue;
  }
  if (status === "A") {
    record("UI file added");
    continue;
  }

  const before = show(base, oldPath);
  const after = fs.existsSync(newPath)
    ? fs.readFileSync(newPath, "utf8")
    : null;
  if (before === null || after === null) {
    record("unreadable");
    continue;
  }

  if (normalize(oldPath, before) !== normalize(newPath, after)) {
    record(
      status.startsWith("R")
        ? `renamed from ${oldPath} AND non-import content changed`
        : "non-import content changed",
    );
  }
}

if (process.argv.includes("--json")) {
  console.log(JSON.stringify({ violations, warnings }, null, 2));
} else {
  for (const w of warnings) console.log(`  WARN  ${w}`);
  for (const v of violations) console.log(`  FAIL  ${v}`);
  console.log(
    violations.length
      ? `\nUI guard: ${violations.length} violation(s)`
      : `\nUI guard: clean (${warnings.length} allowlisted)`,
  );
}
process.exit(violations.length ? 1 : 0);

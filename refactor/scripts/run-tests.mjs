#!/usr/bin/env node
// refactor/scripts/run-tests.mjs  ->  wired as `pnpm test:all`
// Runs every scripts/test-*.ts (the repo's existing convention) with tsx.
// NODE_ENV=development because test-drag-scroll requires it.
// Exit 1 if any script exits non-zero. Prints a per-script line and a summary.
import { spawnSync } from "node:child_process";
import fs from "node:fs";

const only = process.argv[2]; // optional substring filter
const files = fs
  .readdirSync("scripts")
  .filter((f) => /^test-.*\.ts$/.test(f) && (!only || f.includes(only)))
  .sort();
let failed = 0;
for (const f of files) {
  const r = spawnSync("npx", ["tsx", `scripts/${f}`], {
    encoding: "utf8",
    env: { ...process.env, NODE_ENV: "development" },
  });
  const last =
    (r.stdout + r.stderr).trim().split("\n").filter(Boolean).pop() ?? "";
  if (r.status === 0) console.log(`  PASS  ${f}  (${last.slice(0, 60)})`);
  else {
    failed += 1;
    console.log(
      `  FAIL  ${f}  (exit ${r.status})\n${(r.stdout + r.stderr).split("\n").slice(-12).join("\n")}`,
    );
  }
}
console.log(`\n${files.length - failed}/${files.length} test scripts passed`);
process.exit(failed ? 1 : 0);

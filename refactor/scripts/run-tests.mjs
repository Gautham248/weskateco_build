#!/usr/bin/env node
// refactor/scripts/run-tests.mjs  ->  wired as `pnpm test:all`
// Runs the Vitest suite (every *.test.ts / *.test.tsx; see vitest.config.ts).
// The former scripts/test-*.ts assertion scripts were converted to Vitest
// files next to the code they test, with every check kept.
// Optional argument: a filter passed to Vitest (matches test file paths).
// Exit 1 if any test fails. Prints Vitest's summary lines.
import { spawnSync } from "node:child_process";

const only = process.argv[2]; // optional substring filter
const r = spawnSync("npx", ["vitest", "run", ...(only ? [only] : [])], {
  encoding: "utf8",
});
const output = r.stdout + r.stderr;
const summary = output
  .split("\n")
  .filter((line) => /Test Files|Tests /.test(line));

if (r.status === 0) {
  console.log(summary.join("\n") || "  PASS");
} else {
  console.log(output.split("\n").slice(-40).join("\n"));
}
process.exit(r.status ?? 1);

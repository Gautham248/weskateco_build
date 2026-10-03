#!/usr/bin/env bash
# refactor/scripts/verify-phase.sh <phase 0-9> <base-ref>
# The single command that decides whether a phase is complete.
# Run it locally before pushing; Claude runs the same script when verifying.
set -uo pipefail
PHASE="${1:?phase number}"; BASE="${2:?base ref, e.g. origin/testing/commerce-deployment}"
FAIL=0
run() { local name="$1"; shift; if "$@" >/tmp/vp.out 2>&1; then echo "PASS  $name"; else echo "FAIL  $name"; sed 's/^/        /' /tmp/vp.out | tail -25; FAIL=1; fi; }
skip() { echo "SKIP  $1 ($2)"; }

[ -d node_modules ] || pnpm install --frozen-lockfile --ignore-scripts >/dev/null 2>&1
[ -f next-env.d.ts ] || printf '/// <reference types="next" />\n/// <reference types="next/image-types/global" />\n' > next-env.d.ts

echo "Verifying phase $PHASE against $BASE"
run "tsc --noEmit"                       npx tsc --noEmit
run "all test scripts"                   node refactor/scripts/run-tests.mjs
# prettier: only files touched since base, minus the recorded pre-existing failures
changed=$(git diff --name-only --diff-filter=AMR "$BASE"...HEAD | grep -E '\.(ts|tsx|json|md|css|mjs|cjs)$' | grep -vxFf refactor/prettier-baseline.txt 2>/dev/null || true)
if [ -n "$changed" ]; then run "prettier (changed files)" npx prettier --check $changed; else echo "PASS  prettier (no changed files outside baseline)"; fi
run "UI guard (imports-only in UI files)" node refactor/scripts/ui-guard.mjs "$BASE"
run "move ledger"                         node refactor/scripts/verify-ledger.mjs --phase "$PHASE" --base "$BASE"
run "cache parity"                        node refactor/scripts/cache-parity.mjs check
run "drizzle: no schema drift"            bash -c 'out=$(DATABASE_URL=postgres://u:p@localhost/db DATABASE_URL_UNPOOLED=postgres://u:p@localhost/db npx drizzle-kit generate 2>&1); echo "$out" | tail -3; echo "$out" | grep -q "No schema changes"'
if [ "$PHASE" -ge 1 ]; then
  DIRS=$(for d in app components lib modules integrations platform; do [ -d "$d" ] && printf '%s ' "$d"; done)
  run "dependency-cruiser (no new violations)" npx depcruise $DIRS --config refactor/.dependency-cruiser.cjs --ignore-known refactor/depcruise-known-violations.json
else skip "dependency-cruiser" "installed in phase 1"; fi

# server actions may only live in *.actions.ts under modules/ (or in app/)
if [ "$PHASE" -ge 4 ]; then
  bad=$(grep -rlE '^"use server"' lib components modules integrations platform 2>/dev/null | grep -vE '^modules/.*\.actions\.ts$' || true)
  # lib/admin/actions.ts is a legacy shim until phase 6 splits it
  if [ "$PHASE" -lt 6 ]; then bad=$(printf '%s\n' "$bad" | grep -v '^lib/admin/actions\.ts$' || true); fi
  run "'use server' only in modules/**/*.actions.ts" bash -c "[ -z '$bad' ] || { echo '$bad'; false; }"
fi
# legacy import paths must be gone once their owning phase is done
gone() { local phaseReq="$1" pattern="$2" label="$3"; if [ "$PHASE" -ge "$phaseReq" ]; then run "no imports of $label" bash -c "! grep -rnE '$pattern' app components lib modules integrations platform scripts proxy.ts --include=*.ts --include=*.tsx | head -5 | grep ."; fi; }
gone 3 'from "lib/catalog' 'lib/catalog'
gone 4 'from "lib/shopify"' 'lib/shopify (facade)'
gone 4 'from "lib/configurator|from "config/' 'lib/configurator, config/'
gone 5 'from "lib/contact' 'lib/contact'
gone 6 'from "lib/admin/(actions|queries|auth|session|password|media-probe|imagekit)"' 'lib/admin legacy files'
if [ "$PHASE" -ge 4 ]; then
  run "bundle attribute keys defined once" bash -c '[ "$(grep -rn "_configurator_bundle" app components lib modules --include=*.ts --include=*.tsx | grep -v "^scripts" | wc -l)" -le 2 ]'
fi
echo; [ "$FAIL" -eq 0 ] && echo "PHASE $PHASE: ALL CHECKS PASSED" || echo "PHASE $PHASE: FAILED (see FAIL lines)"
exit "$FAIL"

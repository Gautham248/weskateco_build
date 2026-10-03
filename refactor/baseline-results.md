# Phase 0 baseline results

- Base SHA: `beb1ef238333c6e32b517489b82204b2ea839bc0` (recorded in `refactor/BASE_SHA.txt`), the tip of `refactor/architecture`, which matches `old-origin/testing/commerce-deployment` (`Gautham248/weskateco_build`).
- Date: 2026-10-03
- Branch: `refactor/p0-safety-net`

## Toolchain

- Node: v24.18.0
- pnpm: 11.10.0

## Type check

- `npx tsc --noEmit`: exit 0, no errors. `next-env.d.ts` was present (it is gitignored and generated).

## Test scripts

`pnpm test:all` (`node refactor/scripts/run-tests.mjs`) with `NODE_ENV=development`: **17 of 17 passed**, exit 0.

| Script                           | Result | Assertions        |
| -------------------------------- | ------ | ----------------- |
| test-admin-auth.ts               | PASS   | 17                |
| test-admin-editor-tables.ts      | PASS   | 27                |
| test-admin-pagination.ts         | PASS   | 16                |
| test-admin-product-filters.ts    | PASS   | 52                |
| test-configurator.ts             | PASS   | all checks passed |
| test-contact-enquiries.ts        | PASS   | 60                |
| test-contact-submit.ts           | PASS   | 36                |
| test-drag-scroll.ts              | PASS   | 21                |
| test-filters.ts                  | PASS   | 28                |
| test-hero.ts                     | PASS   | 46                |
| test-image-url.ts                | PASS   | 15                |
| test-newly-released.ts           | PASS   | 34                |
| test-overrides.ts                | PASS   | 26                |
| test-product-description-html.ts | PASS   | 13                |
| test-product-page.ts             | PASS   | 8                 |
| test-shop-now.ts                 | PASS   | 33                |
| test-social-posts.ts             | PASS   | 46                |

These are the current counts on this base. The roadmap's per-script figures were set on an older commit and are not used as pass criteria; `run-tests.mjs` decides on exit codes.

## next build

Not run here. `next build` needs live Shopify credentials to prerender routes such as `/en/products` (finding F-07, section 1.3), and those are not available in this environment. It is left as a manual gate for the developer, and it is unverified by this baseline rather than silently skipped.

## Other baselines recorded in this phase

- Cache parity: 15 cached functions, 19 invalidation sites (`refactor/cache-parity.baseline.json`).
- Schema parity: 10 tables, 18 runtime exports (`refactor/schema-parity.baseline.json`).
- Prettier pre-existing failures: 49 files (`refactor/prettier-baseline.txt`). The roadmap's 64 was from the originally studied commit; 49 is the real number today.
- Move ledger: clean at phase 0, 97 base files covered, 88 entries (`node refactor/scripts/verify-ledger.mjs --phase 0 --base old-origin/testing/commerce-deployment`). No entries needed adding this run.
- Importer lists (`refactor/importers/*.txt`): lib-shopify-index 23, lib-catalog 27, lib-admin-queries-actions 31, lib-contact 9, lib-configurator 8, cart-actions 11.

## Notes

- Phase 0 has no behaviour change and no source move. The only non-kit source change in this phase is the export-only edit scheduled in step 0.6, which has not been made yet.
- No database writes were performed.

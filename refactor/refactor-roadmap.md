# WeSkate Co: Architecture Refactor Roadmap

| | |
|---|---|
| Repository | `Gautham248/weskateco_build` |
| Base branch | `testing/commerce-deployment` |
| Goal | Change the architecture only. Every pixel, string, route and behaviour stays as it is. |
| Target pattern | Modular monolith with hexagonal module internals. In-process domain events and CQRS-style read models arrive with the Phase 2 platform work, not in this refactor. |
| Prepared | 2026-09-27 |
| Verification model | You push one branch per phase. Claude clones it and runs the phase gate. |

Everything marked "verified" was checked against the real branch in a sandbox. Everything marked "unverified" could not be checked there and says why.

---

## Contents

1. How to use this document
2. Rules that never bend (invariants)
3. Decisions log
4. Skills toolkit (dev-agent-skills)
5. Baseline findings (verified facts about the branch today)
6. Functionality inventory (nothing may be lost)
7. Phase 0: Safety net
8. Phase 1: Guard rails
9. Phase 2: Shopify integration layer
10. Phase 3: Catalog module
11. Phase 4: Cart and bundles
12. Phase 5: Enquiries
13. Phase 6: Admin module
14. Phase 7: Data ownership
15. Phase 8: Phase 2 readiness (docs only)
16. Phase 9: Cleanup and documentation
17. Appendix A: Verification kit
18. Appendix B: Prompt preamble
19. Appendix C: Test catalogue
20. Appendix D: Cache and invalidation parity table
21. Appendix E: Manual smoke script
22. Appendix F: Risk register
23. Appendix G: Phase handoff report template
24. Appendix H: Deferred behaviour changes (tracked, not done here)

---

## 1. How to use this document

### 1.1 The loop, per phase

1. Create the phase branch (`refactor/pN-<slug>`) from the integration branch `refactor/architecture`.
2. Work through the phase steps in order. Each step has: objective, checks before you start, actions, a prompt for Claude Code, tests, verification, done-when, rollback.
3. Run `bash refactor/scripts/verify-phase.sh N origin/testing/commerce-deployment`. It must end with `PHASE N: ALL CHECKS PASSED`.
4. Run the checks Claude cannot run (section 1.3) and fill in the handoff report (Appendix G).
5. Push the branch and send Claude the report. Claude verifies and answers PASS, FAIL or RISK per criterion.
6. Only after PASS: merge into `refactor/architecture`.

### 1.2 Step template

Every step uses the same headings so nothing is skipped:

- **Objective**: what is different when the step is done.
- **Before you start**: checks that must be true. If one is false, stop.
- **Actions**: the numbered work, with exact paths.
- **Prompt**: paste into Claude Code (with dev-agent-skills installed). Always prefix with the preamble in Appendix B.
- **Tests**: `generate-tests` invocations and the case list.
- **Verify**: commands and expected output.
- **Done when**: observable exit conditions.
- **Rollback**: how to undo the step alone.

### 1.3 What Claude can run and what you must run

| Check | Claude (from your pushed branch) | You |
|---|---|---|
| `tsc --noEmit` | yes | yes |
| All `scripts/test-*.ts` | yes | yes |
| UI guard (import-only changes in UI files) | yes | yes |
| Move ledger (nothing missed) | yes | yes |
| Cache-parity check | yes | yes |
| `drizzle-kit generate` reports no drift | yes | yes |
| dependency-cruiser rules | yes | yes |
| Mutation gate results | re-runs if asked | yes (you run `generate-tests`) |
| `next build` | **no** (needs live Shopify to prerender; unverified offline) | **yes** |
| HTML snapshot capture and compare | **no** (needs live store data) | **yes** |
| Manual smoke (Appendix E) | no | yes |
| GitHub PR review posting (`review-pr`) | no | yes (optional) |

### 1.4 Branch model

```
testing/commerce-deployment        (base; features continue here)
  └─ refactor/architecture         (integration branch)
       ├─ refactor/p0-safety-net
       ├─ refactor/p1-guardrails
       ├─ refactor/p2-shopify-integration
       ├─ refactor/p3-catalog
       ├─ refactor/p4-cart-bundles
       ├─ refactor/p5-enquiries
       ├─ refactor/p6-admin
       ├─ refactor/p7-data-ownership
       ├─ refactor/p8-phase2-readiness
       └─ refactor/p9-cleanup
```

Merge the base into `refactor/architecture` at least weekly (`/sync-prs` can do this and triage CI). Re-record baselines (Phase 0 step 0.4) after any merge that touches `lib/`, `components/cart`, `app/api` or `lib/db`.

### 1.5 Commit convention

Conventional commits with scope, matching the repo: `refactor(shopify): extract storefront client`, `test(bundles): pin grouping contract`, `chore(refactor): add verification kit`. Pure moves get their own commit (`git mv` only) so history and review tools see renames.

---

## 2. Rules that never bend (invariants)

| ID | Rule | Enforced by |
|---|---|---|
| I-1 | **UI freeze.** No change to markup, `className`, CSS, `locales/*.json`, `public/`. In UI files only `import` declarations may change. | `ui-guard.mjs` |
| I-2 | One named exception: the bundle grouping block in `components/cart/modal.tsx` (Phase 4), allowlisted with a reason, proven equal by a differential test. | allowlist + T-13 |
| I-3 | Imports stay bare (`modules/...`, `integrations/...`, `platform/...`). `baseUrl: "."` already resolves them. No `src/` move, no path aliases. | `tsc` |
| I-4 | Cache tags, `cacheLife` profiles, cache kind and every `revalidateTag`/`updateTag` call stay identical. Functions are identified by name, so moving them is fine. | `cache-parity.mjs` |
| I-5 | **Overrides are applied inside the cache scope**, as today. Cached composition functions in `modules/catalog` include the override merge. Raw integration functions are uncached. | review + T-11 + cache parity |
| I-6 | No schema change and no migration until Phase 7, and Phase 7 must produce zero drift. | `drizzle-kit generate` |
| I-7 | Public routes and URLs never change. Both webhook URLs stay live. | snapshot + ledger |
| I-8 | No new behaviour. Anything that would change behaviour is listed in Appendix H and deferred. | review |
| I-9 | Every phase is independently deployable and revertible. | branch model |
| I-10 | Moves are `git mv` commits with no content edits. Edits happen in a separate commit. | review + `review-pr` rename sweep |
| I-11 | Failing generated tests are defects to report, never assertions to loosen. | `generate-tests` Step 6 |
| I-12 | Database writes (migrations, seeds) are never run by the refactor. `db:migrate` and `scripts/seed-*.ts` are out of scope. | AGENTS Rule 3b |

---

## 3. Decisions log

Change any of these before Phase 0 and the rest of the document still holds.

| ID | Decision | Why |
|---|---|---|
| D-01 | Modular monolith, hexagonal internals; events and read models come with Phase 2 platform work. | One small team, one DB, Vercel serverless. Phase 2 domains (ledger, tiers, clans) are transactional and tightly coupled. |
| D-02 | Module public surface is role-suffixed files: `domain/**`, `*.service.ts`, `*.actions.ts`, `*.types.ts`, `*.events.ts`. No hand-written barrel `index.ts`. | Company coding standard bans barrels. Enforced by dependency-cruiser. This replaces the `index.ts` idea from the earlier chat roadmap. |
| D-03 | Sanity stays for editorial content only. `lib/sanity` moves to `integrations/sanity` in Phase 9. | Storefront reads nothing from Sanity today; contract still promises it. Decide before Phase 9. |
| D-04 | Company style rules (arrow consts, no `!`, no `interface`) apply to **new** files only. Moved files keep their style. | Restyling would bury the behaviour-preserving diff. Style debt is listed in Phase 9. |
| D-05 | Shared kernel stays in `lib/`: `shopify/{types,image-url,description-html}.ts`, `gokwik/`, `i18n/`, `hooks/`, `utils.ts`, `constants.ts`, `type-guards.ts`, `fonts.ts`, `filters/`, guide data folders, `admin/{pagination,product-filters,editor-extensions}.ts`, `db/`. | These are pure or UI-facing; moving them touches 100+ import lines for no gain. **Revised from the chat roadmap:** `lib/gokwik` no longer moves. |
| D-06 | Tests follow the repo convention: `scripts/test-*.ts` assertion scripts run with `tsx`. No new test framework. | `generate-tests` Step 7 says match what exists. Existing scripts prove this works with `mutate-cli.mjs`. |
| D-07 | One lockfile: pnpm. `package-lock.json` is deleted. | `npm ci` fails today (react peer conflict); `pnpm install --frozen-lockfile` works. |
| D-08 | Architecture docs live in `architecture/` and `refactor/`, never `docs/`. | `docs/` is gitignored. |
| D-09 | Neon HTTP driver stays during the refactor. The transaction-capable driver is a Phase 2 entry task. | Driver change alters runtime behaviour. |
| D-10 | Configurator keeps running on mock metafield data through a `sources/` adapter. | It is production behaviour today, and real metafields are still pending. |

---

## 4. Skills toolkit (dev-agent-skills)

Studied from `github.com/Gautham248/dev-agent-skills`. I read the `generate-tests` skill and its references in full, and read the frontmatter plus key sections of the others.

### 4.1 Setup (once)

```bash
git clone https://github.com/Gautham248/dev-agent-skills ~/dev-agent-skills
cd ~/dev-agent-skills && bash setup.sh
bash setup.sh --check-security          # exits non-zero on anything blocking
```

In the WeSkate repo, `.gitignore` already covers `graphify-out/` and `.dev-agent/`. Install the graph hook after the first build: `graphify hook install`.

### 4.2 Where each skill is used

| Skill | Phase / step | Use |
|---|---|---|
| `graphify` | 0.3, and before every move | Build the graph once. `graphify affected --files <file>` lists importers before a move. `graphify update .` after each phase. |
| `architecture-context` | 0.3 and 9.5 | Named subsystems before and after, for a before/after comparison. Consumer of the graph; run `graphify` first. |
| `plan-feature` | 8.2 and Phase 2 build | Per-module plans. `verify_plan_paths.py` checks that a plan only names real files. `deviation-log-cli.mjs record` logs where reality differed from this roadmap. |
| `generate-tests` | every step with a T-ID | Contract-derived cases plus mutation gate. |
| `coding-standards` (dispatch: backend, database, project-organization) | new files only | Handler shape (validate, authorize, service, respond), thin actions, transaction rules, naming. |
| `typescript-conventions` | new files | Types over casts, validate at boundaries. |
| `review-pr` | every phase PR | Renamed-file sweep suits `git mv` PRs. Completeness gate traces state writes, resource cleanup and find-then-create races (relevant to rate limiting and upsert-then-prune saves). |
| `first-principles-review` | every phase PR | Challenges assumptions, blast radius, rollback. Runs first in `review-pr`'s lens registry. |
| `fix-bug` | any failed gate | Minimal fix plus fix-attempt ledger. `generate-tests` then offers a permanent regression test. |
| `sync-prs` | continuous | Merges the base into refactor PRs, triages CI. |
| `investigate-issue` | Appendix H | Turns each deferred behaviour change into a tracked issue. |
| `skill-factory` | 9.6 (optional) | Codifies `verify-phase.sh` as a reusable skill for Phase 2 modules. |
| `eslint-rule-author` | 9.6 (optional) | Encode module boundaries and the `"use server"` placement rule as lint rules. |

### 4.3 Skills deliberately not used

- `coding-standards-frontend`, `coding-standards-tailwind`, `coding-standards-tanstack-query`, `coding-standards-e2e`: they would push changes into the frozen UI (test IDs, tokens, component tiers).
- `webapp-conventions` (SvelteKit), Swift, CloudKit, RevenueCat, ZenStack, Better Auth: not this stack.

### 4.4 Conflicts to know about

1. **Barrels.** Company standard: no hand-written barrels. Resolved by D-02.
2. **Style rules vs legacy code.** Resolved by D-04.
3. **Confirmation gates.** The agent standing rules make skills stop and ask before acting. Every prompt in this roadmap states that the step is pre-approved. The only stops that remain are database mutations and deviations.
4. **`generate-tests` philosophy.** It derives expectations from the contract, not the implementation. For a refactor the contract is the current observable behaviour plus code comments, existing docs and callers. Each test step names its contract sources. The skill stages drafts in `.dev-agent/draft-tests/` and waits for your approval; each test step includes that approval.
5. **`mutate-cli.mjs` limits.** It is a text scanner, dependency-free, and under-mutates JSX and generics. Aim it at pure `.ts` files. Each mutant costs one full run of the test command, so use `--max-mutants` deliberately.

### 4.5 Verified: the mutation gate works on this repo

```
node ~/dev-agent-skills/generate-tests/scripts/mutate-cli.mjs run \
  --file lib/catalog/hero.ts --test-cmd "npx tsx scripts/test-hero.ts" --max-mutants 8
=> 1/8 killed (13%)   survivors: HERO_DEFAULT_SECONDS 6, HERO_MIN_SECONDS 2, HERO_MAX_SECONDS 60, id-radix 36
```

The existing hero tests import the constants instead of pinning their values, so a changed constant would slip through. T-03 fixes this before `hero.ts` moves.

---

## 5. Baseline findings (verified facts about the branch today)

All verified in a sandbox against `testing/commerce-deployment` unless marked otherwise.

| ID | Finding | Consequence |
|---|---|---|
| F-01 | `tsc --noEmit` is clean, but only with `next-env.d.ts` present. That file is gitignored and generated by `next dev/build`. Without it, every `.png/.svg` import errors. | Gate scripts create a stub if missing. |
| F-02 | All 16 `scripts/test-*.ts` pass. Assertion counts: admin-auth 17, admin-editor-tables 27, admin-pagination 16, admin-product-filters 52, configurator "all checks", contact-enquiries 60, contact-submit 36, drag-scroll 21, filters 12, hero 46, image-url 15, newly-released 34, overrides 26, product-description 13, product-page 8, shop-now 33. | Baseline to preserve. `test-drag-scroll` needs `NODE_ENV=development`. |
| F-03 | `npm ci` fails (`@sanity/vision` wants react `^19.2.2`, repo pins `19.0.0`). `pnpm install --frozen-lockfile` succeeds. | Delete `package-lock.json` (D-07). |
| F-04 | `prettier --check` fails on 64 pre-existing files (44 `components`, 7 `lib`, 6 `app`, 4 `scripts`, `tsconfig.json`, `pnpm-lock.yaml`, `ADMIN_PANEL_ONBOARDING.md`). So `pnpm test` is red today. | Record a baseline; check only files you touch. No mass reformat (it would violate I-1 diff purity). |
| F-05 | No CI configuration (`.github/` absent). | Phase 1 adds it. |
| F-06 | `docs/` is gitignored. `app/api/contact/submit/route.ts` cites `docs/contact-enquiry-flow-decisions.md`, which is not in the repo. | D-08. |
| F-07 | `next build` compiles and reaches prerender, then fails without live Shopify (`/en/products`). **Unverified offline beyond that point.** | You run the build. |
| F-08 | No **file-level** import cycle between `lib/shopify`, `lib/catalog`, `lib/admin`. It is a folder-level layering inversion: `lib/shopify/index.ts` -> `lib/catalog/overrides` -> `lib/admin/queries`, and storefront reads flow through a module called "admin". The only file-level cycles are six inside `components/` (`layout/search/filter/*`, `layout/navbar/*`, `board-finder/*`). | The six UI cycles are recorded as known violations and left alone (UI freeze). |
| F-09 | `scripts/test-configurator.ts` never imports the engine. It re-implements logic inline. `lib/configurator/engine.ts` (507 lines, pure) has no real test. | T-01 is the highest-value test in the refactor. |
| F-10 | `test-contact-submit.ts` covers `enquiry-reference` and `rate-limit` helpers only. The route's validation and response contract are untested. | T-16, T-17, T-18. |
| F-11 | Mutation baseline on `lib/catalog/hero.ts`: 1 of 8 killed. | T-03. |
| F-12 | The live configurator runs on `config/mock-configurator-data.json` via `buildConfiguratorItems` (`components/configurator/wizard.tsx`). | It is production behaviour (D-10). Never delete it as "unused". |
| F-13 | Two Shopify webhook endpoints exist with **different mappings**. `/api/webhooks/shopify` (HMAC) revalidates `products` **and** `collections` on product topics. `/[locale]/api/revalidate` (`revalidate()`, secret in query string) revalidates only `products` on product topics. | Preserve both. Alignment is Appendix H item H-3. |
| F-14 | `/cart` (`app/[locale]/cart/page.tsx`, 604 lines) has no bundle grouping. Only the drawer (`modal.tsx`) groups by `_bundle_id`. | Not fixed here (I-1, H-1). |
| F-15 | Sanity is mounted (`/studio`, 13 schemas) but no page imports `lib/sanity`. | D-03. |
| F-16 | `getMenu` has no consumer outside `lib/shopify`. | Kept as-is; flagged in 9.4. |
| F-17 | `/store` and `/store/[collection]` fetch all products (`getProducts({})`) and filter client-side. | Preserve exactly. |
| F-18 | `getCollections` fabricates an "All" collection (`path: "/search"`, `updatedAt: new Date().toISOString()`) and drops handles starting with `hidden`. `getCollection` maps `path` to `/store/<handle>`. | Tests must tolerate the time field. |
| F-19 | `isTransientConnectError` is duplicated in `lib/shopify/index.ts` and `lib/db/index.ts`. | Left duplicated (9.4). |
| F-20 | The cart cookie is set as `cookies().set("cartId", id)` with no options. | Preserve exactly; do not "harden" it (H-5). |
| F-21 | `AGENTS.md` contains absolute paths from one developer's Mac; `claude-init.md` and `README.md` are stale or stock. | Phase 9 docs. |
| F-22 | Two test scripts (`admin-editor-tables`, `drag-scroll`) print node:test style output; the rest print custom `ok/FAIL` lines. | `run-tests.mjs` relies on exit codes only. |

The six known UI cycles (baseline in `refactor/depcruise-known-violations.json`):

```
components/layout/search/filter/index.tsx <-> item.tsx
components/layout/search/filter/dropdown.tsx -> item.tsx -> index.tsx -> dropdown.tsx
components/layout/search/filter/dropdown.tsx <-> index.tsx
components/layout/navbar/index.tsx <-> mobile-menu.tsx
components/board-finder/board-finder-page.tsx <-> size-tool.tsx
components/board-finder/board-finder-page.tsx <-> quiz.tsx
```

---

## 6. Functionality inventory (nothing may be lost)

Tick a row only when its evidence has passed **after the last phase that touches it**. Evidence codes: **S** = snapshot route, **T** = test (Appendix C), **M** = manual smoke item (Appendix E), **C** = cache parity, **L** = move ledger.

### A. Storefront pages, routing, SEO

| ID | Must still work | Lives in today | Touched in | Evidence | Done |
|---|---|---|---|---|---|
| FI-A01 | Locale routing: unprefixed paths rewrite to `/en`; `/en` and `/hi` prefixes; `x-locale` header; skip list (`/api`, `/_next`, assets, `/studio`); `/admin` handled before locale logic | `proxy.ts` | none (pinned) | T-04, S `/`, `/hi`, M-02 | [ ] |
| FI-A02 | Home composition: hero, newly released, category grid, product grid, shop now, about, academy, tips, configurator CTA, brands, footer | `app/[locale]/page.tsx`, `components/home/*` | P3 (imports) | S `/`, M-01 | [ ] |
| FI-A03 | Hero media from admin, with fallback slide when none | `lib/catalog/hero*`, `components/home/hero-*` | P3 | T-03, existing hero tests, M-20 | [ ] |
| FI-A04 | Newly Released carousel; drops deleted products; hides on Shopify failure | `lib/catalog/newly-released*` | P3 | existing tests, M-18, M-28 | [ ] |
| FI-A05 | Shop Now row, 3 image slots, discount percent | `lib/catalog/shop-now*` | P3 | existing tests, M-19 | [ ] |
| FI-A06 | `/store`: all products and collections; client-side filter, sort, `page`; query params | `app/[locale]/store/*`, `lib/filters` | P3 (imports) | S `/store`, existing `test-filters`, M-04 | [ ] |
| FI-A07 | `/store/[collection]`: 404 when missing; metadata from collection SEO | `app/[locale]/store/[collection]/page.tsx` | P3 | S two collections | [ ] |
| FI-A08 | `/products` collections index | `app/[locale]/products/page.tsx` | P3 | S `/products` | [ ] |
| FI-A09 | Product page: three states (ok, missing -> 404, failed -> unavailable), metadata, JSON-LD, noindex when hidden tag, recommendations, gallery, description, tabs | `app/[locale]/products/[handle]/page.tsx`, `lib/catalog/product-page.ts` | P3 | `test-product-page`, S ok/missing, M-05, M-28 | [ ] |
| FI-A10 | Redirects: `/terms`, `/product/:handle`, `/:locale/product/:handle` (permanent) | `next.config.ts` | none | S `/terms`, `/product/__missing__`, M-24 | [ ] |
| FI-A11 | Shopify pages catch-all `/[page]` and its OG image | `app/[locale]/[page]/*` | P3 | M-25 | [ ] |
| FI-A12 | Static pages: about-us, academy, school, skateparks, privacy, terms, refund, shipping | `app/[locale]/*/page.tsx` | none | S each | [ ] |
| FI-A13 | Guides hub plus five guides plus board-finder tools (quiz, size tool, decision helper) | `app/[locale]/guides/*`, `lib/*-guide`, `lib/board-finder` | none | S 6 routes, M-27 | [ ] |
| FI-A14 | Contact page | `app/[locale]/contact/page.tsx`, `components/contact/*` | P5 (imports) | S `/contact`, M-14 | [ ] |
| FI-A15 | Navbar: mega menu, mobile menu, search box (`q`), language switcher, cart button, scroll wrapper | `components/layout/navbar/*` | P3/P4 (imports) | S any page, M-02, M-03 | [ ] |
| FI-A16 | Footer | `components/layout/footer*` | none | S any page | [ ] |
| FI-A17 | SEO: `sitemap.xml` (home, products, collections, products, Shopify pages), `robots.txt`, OG images, `metadataBase`, title template | `app/[locale]/sitemap.ts`, `robots.ts`, `opengraph-image.tsx` | P3 (imports) | S `/robots.txt`, M-26 | [ ] |
| FI-A18 | i18n: en/hi dictionaries; fallback locale -> en -> key; `getLocalizedPath`, `getLocalizedField`; provider | `lib/i18n/*`, `locales/*` | none (pinned) | T-05, S `/hi` | [ ] |
| FI-A19 | Error boundary, loading state, welcome toast, toaster | `app/[locale]/error.tsx`, `store/loading.tsx`, `components/welcome-toast.tsx` | none | M-01 | [ ] |
| FI-A20 | Image handling: Shopify sized variants, `next/image` allowlist (Shopify CDN, ImageKit), avif/webp; PPR and `useCache` flags | `lib/shopify/image-url.ts`, `next.config.ts` | none | `test-image-url`, S | [ ] |

### B. Commerce

| ID | Must still work | Lives in today | Touched in | Evidence | Done |
|---|---|---|---|---|---|
| FI-B01 | Reads hide products tagged `nextjs-frontend-hidden`; collections starting `hidden` dropped; synthetic "All" collection (`/search`); `CREATED_AT` sort maps to `CREATED` | `lib/shopify/index.ts` | P2, P3 | T-07, T-11, S `/store` | [ ] |
| FI-B02 | Override layer on product reads: title, description, gallery `append`/`replace`, cover, removed images, SEO title sync | `lib/catalog/overrides.ts` | P3 | `test-overrides`, T-11, M-16 | [ ] |
| FI-B03 | Cart: create/add/update/remove; `cartId` cookie; optimistic UI; drawer; `/cart`; quantity; variant edit; delete | `components/cart/*`, `lib/shopify/index.ts` | P4 | T-14, M-07..M-09 | [ ] |
| FI-B04 | Drawer groups configurator lines by `_bundle_id` as "Custom Setups" (with totals) | `components/cart/modal.tsx` | P4 (allowlisted) | T-13 (oracle), M-12, M-13 | [ ] |
| FI-B05 | Add to cart, buy-now (single-item cart + GoKwik), quick-buy sidebar | `components/product/*`, `components/cart/actions.ts` | P4 | M-05..M-10 | [ ] |
| FI-B06 | GoKwik: script loader, checkout hook, fallback to Shopify `checkoutUrl`; Snapmint EMI banners | `lib/gokwik/*`, `components/cart/snapmint-*`, `components/product/snapmint-*` | none (stays in `lib`) | M-10, M-11 | [ ] |
| FI-B07 | Configurator: board type -> product selection -> review; compatibility engine; filters sidebar; build summary; progress; out-of-stock toggle; mock metafield data source | `components/configurator/*`, `lib/configurator/*`, `config/*.json` | P4 | T-01, T-02, `test-configurator`, M-12 | [ ] |
| FI-B08 | Webhooks revalidate tags: HMAC endpoint (products and collections) and query-secret endpoint (different mapping, F-13) | `app/api/webhooks/shopify/route.ts`, `lib/shopify/index.ts` `revalidate` | P2, P3 | T-09, C, M-23 | [ ] |
| FI-B09 | Cache tags and lifetimes for the 14 cached functions and 18 invalidation sites | see Appendix D | P2, P3, P4, P6 | C | [ ] |
| FI-B10 | Shopify fetch: 2 retries with 500ms/1000ms backoff on connect errors only; first GraphQL error thrown; error shaping `{cause,status,message,query}` | `shopifyFetch` | P2 | T-08 | [ ] |
| FI-B11 | Admin catalog: up to 4 pages of 250, `truncated`/`failed` flags, never throws | `getAdminProductCatalog` | P2, P3 | M-16, M-28 | [ ] |

### C. Admin panel

| ID | Must still work | Lives in today | Touched in | Evidence | Done |
|---|---|---|---|---|---|
| FI-C01 | Login (bcrypt 12 rounds), 7-day HS256 JWT cookie (`httpOnly`, `sameSite=lax`, `secure` in prod, path `/admin`), `sessionVersion` revocation, proxy cookie-presence gate, `requireAdmin` in actions and routes, logout; password 8..72 chars; `AUTH_SECRET` >= 32 chars | `lib/admin/{auth,session,password}.ts`, `proxy.ts` | P6 | `test-admin-auth`, M-15 | [ ] |
| FI-C02 | Products tab: search, facets (type, vendor, tags, availability, override status), pagination, override editor (rich text with tables, photos hide/reorder/cover, gallery mode), degraded banner when Shopify down; save revalidates products and collections | `app/admin/(dashboard)/products/*`, `components/admin/*`, `lib/admin/*` | P3, P6 | `test-admin-product-filters`, `test-admin-pagination`, `test-admin-editor-tables`, M-16, M-28 | [ ] |
| FI-C03 | Upload route: ImageKit, mime allowlist, 10 MB, folder `/weskateco/products`, 401 JSON when unauthenticated | `app/admin/api/upload/route.ts`, `lib/admin/imagekit.ts` | P2, P6 | T-10, M-17 | [ ] |
| FI-C04 | Newly Released tab: autosave, upsert-then-prune, max 200, revalidates tag | `saveNewlyReleasedItems` | P3, P6 | existing tests, M-18 | [ ] |
| FI-C05 | Shop Now tab | `saveShopNowItems` | P3, P6 | existing tests, M-19 | [ ] |
| FI-C06 | Hero tab: media items, default seconds, bounds 2..60, URL allowlist, probe warnings (video 25 MB, image 5 MB) | `saveHeroConfig`, `media-probe.ts` | P3, P6 | T-03, T-23, M-20 | [ ] |
| FI-C07 | Enquiries tab: read-only list, filter by reason, counts, pagination | `listContactEnquiries` | P5, P6 | `test-contact-enquiries`, M-21 | [ ] |
| FI-C08 | Settings tab: change own password, add admin, list admins; password change signs out other sessions | `lib/admin/actions.ts` | P6 | T-19, `test-admin-auth`, M-22 | [ ] |
| FI-C09 | Zod action schemas: override, newly released, shop now, login, password; `ActionState` shapes | `lib/admin/actions.ts` | P6 | T-19 | [ ] |

### D. Enquiries

| ID | Must still work | Lives in today | Touched in | Evidence | Done |
|---|---|---|---|---|---|
| FI-D01 | Reason routing table (`ROUTES`, `REASON_LABELS`, groups, fields, SLA, prefixes) | `lib/contact/routes.ts` | P5 | `test-contact-enquiries`, M-14 | [ ] |
| FI-D02 | Submit contract: validation messages, honeypot fake success, `secondsOnPage < 3` rule, consent, 400/429/500 shapes, fail-open limiter, stored row shape, `meta` fields | `app/api/contact/submit/route.ts` | P5 | T-16, T-17, M-14 | [ ] |
| FI-D03 | Enquiry reference: alphabet `23456789ABCDEFGHJKMNPQRSTUVWXYZ`, length 6, prefix format | `enquiry-reference.ts` | P5 | `test-contact-submit` | [ ] |
| FI-D04 | Rate limit: 5 hits per 10 minutes per hashed key; window rollover; prune on first hit; header-based client id (`x-vercel-forwarded-for` preferred) | `lib/contact/rate-limit.ts` | P5 | `test-contact-submit`, T-18, M-14 | [ ] |
| FI-D05 | Admin enquiry display formatting | `enquiry-display.ts` | P5 | `test-contact-enquiries` | [ ] |

### E. Data and infrastructure

| ID | Must still work | Lives in today | Touched in | Evidence | Done |
|---|---|---|---|---|---|
| FI-E01 | Ten tables, migrations `0000` to `0007`, unchanged | `lib/db/schema.ts`, `lib/db/migrations/*` | P7 | drizzle no-drift, T-21 | [ ] |
| FI-E02 | Neon HTTP driver with retrying fetch; lazy client (importing never requires `DATABASE_URL`) | `lib/db/index.ts` | none | M-29 | [ ] |
| FI-E03 | Sanity Studio at `/studio` and 13 schemas | `app/studio/*`, `sanity/*` | P9 | M-30 | [ ] |
| FI-E04 | Environment variable contract (`.env.example`) unchanged | `.env.example` | none | review | [ ] |
| FI-E05 | Operational scripts: `create-admin`, `seed-hero`, `seed-newly-released`, `seed-shop-now`, `dump-products`, `deploy.js` still run with updated imports | `scripts/*` | P3..P6 | `tsc` + dry read (no DB writes, I-12) | [ ] |
| FI-E06 | Deploy flow (`pnpm deploy`, `pnpm vercel`) | `scripts/deploy.js` | none | review | [ ] |
| FI-E07 | All 16 existing test scripts stay green, with import-path edits only | `scripts/test-*.ts` | every phase | `run-tests.mjs` | [ ] |

---

## 7. Phase 0: Safety net

**Branch:** `refactor/p0-safety-net`. **No production code moves in this phase.** The only source edits are export-only additions listed in step 0.6.

**Goal:** everything needed to prove "nothing changed" exists, is recorded, and is green before the first file moves.

### Step 0.1 Create branches and install the verification kit

**Objective:** the refactor has a home and the tooling from Appendix A is in the repo.

**Before you start**
- `git status` is clean on `testing/commerce-deployment`, and you have pulled.
- Record the base SHA: `git rev-parse origin/testing/commerce-deployment > /tmp/base_sha`.

**Actions**
1. `git checkout -b refactor/architecture && git checkout -b refactor/p0-safety-net`
2. Unzip `refactor-kit.zip` at the repo root so you get `refactor/` (scripts, ledger, rules, route list).
3. `cp /tmp/base_sha refactor/BASE_SHA.txt`
4. Append `refactor/snapshots/` to `.gitignore`.
5. `npx prettier --write refactor` (the kit is already formatted; this is a no-op check).
6. Commit: `chore(refactor): add verification kit`.

**Verify**
- `ls refactor refactor/scripts` shows: `.dependency-cruiser.cjs`, `move-ledger.json`, `snapshot-routes.json`, `cache-parity.baseline.json`, `prettier-baseline.txt`, `depcruise-known-violations.json`, and six scripts.
- The baselines in the kit were generated on commit `0889a2d`. **Regenerate them in 0.4 for your real base.**

**Done when:** kit committed. **Rollback:** `git revert` the commit.

### Step 0.2 Fix the toolchain

**Objective:** one lockfile, wired test runner, reproducible install.

**Before you start**
- `pnpm install --frozen-lockfile` succeeds on the base. If it does not, stop and fix the lockfile first.
- Confirm the Vercel project's Install Command is empty or `pnpm install` (Vercel Project Settings). Deleting `package-lock.json` must not change which package manager Vercel uses.

**Actions**
1. `git rm package-lock.json`.
2. In `package.json` scripts add exactly:
   ```json
   "test:all": "node refactor/scripts/run-tests.mjs",
   "test:configurator": "tsx scripts/test-configurator.ts",
   "test:filters": "tsx scripts/test-filters.ts",
   "verify:phase": "bash refactor/scripts/verify-phase.sh"
   ```
3. Do not touch dependencies yet (dependency-cruiser is added in Phase 1).
4. Commit: `chore(repo): single lockfile and test:all runner`.

**Prompt**
```
[PREAMBLE from Appendix B]
Step 0.2. Delete package-lock.json, add the four scripts to package.json exactly as
listed, and run `pnpm install --frozen-lockfile` and `pnpm test:all`. Do not change
dependencies. Report the pnpm output tail and the test:all summary line.
```

**Verify:** `pnpm install --frozen-lockfile` exits 0; `pnpm test:all` prints `16/16 test scripts passed`.

**Done when:** both pass and only `package.json` and the deleted lockfile changed. **Rollback:** revert the commit.

### Step 0.3 Knowledge graph and architecture snapshot

**Objective:** a graph for impact analysis, and a written "before" picture of the architecture.

**Before you start**
- dev-agent-skills installed (section 4.1).
- `graphify-out/` and `.dev-agent/` are gitignored (they are).

**Actions**
1. `/graphify .` from the repo root, then `graphify hook install`.
2. `/architecture-context` and copy the resulting subsystem summary into `architecture/BEFORE.md` (committed; not under `docs/`).
3. Record importer lists with deterministic greps (used by later phases to prove every importer moved):
   ```bash
   mkdir -p refactor/importers
   git grep -l -E 'from "lib/shopify"'                  -- app components lib scripts | sort > refactor/importers/lib-shopify-index.txt
   git grep -l -E 'from "lib/catalog'                   -- app components lib scripts | sort > refactor/importers/lib-catalog.txt
   git grep -l -E 'from "lib/admin/(queries|actions)"'  -- app components lib scripts | sort > refactor/importers/lib-admin-queries-actions.txt
   git grep -l -E 'from "lib/contact'                   -- app components lib scripts | sort > refactor/importers/lib-contact.txt
   git grep -l -E 'from "lib/configurator|from "config/' -- app components lib scripts | sort > refactor/importers/lib-configurator.txt
   git grep -l -E 'from "components/cart/actions"'      -- app components lib scripts | sort > refactor/importers/cart-actions.txt
   wc -l refactor/importers/*.txt
   ```
   Expected counts today: `lib-shopify-index` 23 (plus `image-url`/`types` importers, which do not move), `lib-catalog` about 22, `cart-actions` 11. Treat any large deviation as a sign the base changed.

**Prompt**
```
[PREAMBLE]
Step 0.3. Run /graphify on this repo, install the hook, then run /architecture-context
and write its subsystem summary to architecture/BEFORE.md (plain markdown, no em dashes).
Then run the git-grep importer commands from the roadmap and commit refactor/importers/*.
Do not modify any source file.
```

**Verify:** `graphify-out/graph.json` exists; `architecture/BEFORE.md` lists named subsystems; `refactor/importers/*.txt` are non-empty.

**Done when:** committed. **Rollback:** delete the files.

### Step 0.4 Record baselines

**Objective:** machine-readable "before" values for every automated check.

**Before you start:** step 0.2 done; sandbox `node_modules` present.

**Actions**
1. Cache parity:
   `node refactor/scripts/cache-parity.mjs snapshot > refactor/cache-parity.baseline.json`
   Expect 14 cached functions and 18 invalidation sites (Appendix D). Investigate any other number before proceeding.
2. Prettier baseline (pre-existing failures):
   ```bash
   npx prettier --check --ignore-unknown . 2>&1 | grep '^\[warn\]' | sed 's/\[warn\] //' | grep -v 'Code style' | grep -v '^refactor/' | sort > refactor/prettier-baseline.txt
   ```
   Expect 64 lines on the studied commit.
3. Ledger coverage against your base: `node refactor/scripts/verify-ledger.mjs --phase 0 --base origin/testing/commerce-deployment`. If it prints `UNCOVERED at base: <file>`, someone added a source file since the ledger was written. **Add a ledger entry** (kind `move`, `extract`, or `stay`) and re-run until clean.
4. Write `refactor/baseline-results.md` recording: base SHA, date, `tsc` result, the 16 test scripts with assertion counts, `next build` result (you), and Node/pnpm versions.

**Verify:** `bash refactor/scripts/verify-phase.sh 0 origin/testing/commerce-deployment` prints `PHASE 0: ALL CHECKS PASSED`.

**Done when:** all four baseline artifacts are committed. **Rollback:** revert.

### Step 0.5 "Before" snapshot of rendered output

**Objective:** a stored copy of what every public and admin route renders today.

**Before you start**
- A running instance of the **base** branch with the real store and database: a Vercel preview of the base branch is best (`next build` cannot run offline).
- Edit `refactor/snapshot-routes.json`: replace the placeholder collection handles with handles that exist, and add `/products/<real available handle>` and `/products/<real sold-out handle>`.
- For admin routes: log in once and copy the `admin_session` cookie value.

**Actions**
1. Capture:
   ```bash
   node refactor/scripts/snapshot.mjs capture \
     --base https://<base-preview>.vercel.app \
     --out refactor/snapshots/before \
     --cookie "admin_session=<jwt>"
   ```
2. Capture twice and compare the two runs to prove the route list is deterministic:
   `node refactor/scripts/snapshot.mjs compare refactor/snapshots/before refactor/snapshots/before2`
   Anything that differs between two identical captures (a clock, a random id) must be added to the normalizer in `snapshot.mjs` before you rely on the tool.
3. `refactor/snapshots/` is gitignored; keep it locally or in shared storage. Note the date and store state.

**What it compares:** HTTP status, final path, `<title>`, every `<meta>`, canonical/alternate links, JSON-LD blocks, and the `<body>` with scripts removed and hashed asset URLs neutralised. **Verified offline** on `/contact`, `/robots.txt`, `/admin/login`: identical across repeated captures, and a one-class change is detected. **Unverified:** behaviour against live Shopify data.

**Not covered by this tool:** interactive state (cart drawer, configurator), pixel differences, and CSS. Those are covered by manual smoke (Appendix E) and, optionally, screenshots (`npx playwright screenshot --viewport-size=390,844 <url> out.png` at two widths for `/`, `/store`, a product, `/configurator`; compare by eye or with `pixelmatch`; **unverified**).

**Done when:** `before` and `before2` compare identical. **Rollback:** n/a.

### Step 0.6 Characterization tests, batch A

**Objective:** pin the behaviour of code that has no real test today and that later phases will move. Tests are written against the current paths and must pass now.

**Before you start**
- Steps 0.2 to 0.4 done; `node_modules` present.
- Read Appendix C for each T-ID's contract sources and case list.

**Actions** (one commit per test)

| Test | File | Target (pre-move path) | Mutation run |
|---|---|---|---|
| T-01 | `scripts/test-configurator-engine.ts` | `lib/configurator/engine.ts` | `--max-mutants 60` |
| T-02 | `scripts/test-configurator-catalog.ts` | `lib/configurator/mock-data.ts` | `--max-mutants 30` |
| T-03 | `scripts/test-hero-pins.ts` | `lib/catalog/hero.ts` | `--max-mutants 40` (must beat 1/8) |
| T-04 | `scripts/test-proxy.ts` | `proxy.ts` | `--max-mutants 30` |
| T-05 | `scripts/test-i18n.ts` | `lib/i18n/index.ts` | `--max-mutants 30` |
| T-06 | `scripts/test-utils.ts` | `lib/utils.ts` | `--max-mutants 30` |
| T-07 | `scripts/test-shopify-mappers.ts` | mappers in `lib/shopify/index.ts` | `--max-mutants 30` |

For T-07 make one export-only edit first (its own commit, `refactor(shopify): export mappers for characterization`): add the `export` keyword to `removeEdgesAndNodes`, `reshapeCart`, `reshapeCollection`, `reshapeCollections`, `reshapeImages`, `reshapeProduct`, `reshapeProducts` in `lib/shopify/index.ts`. Nothing else changes. Verified: `lib/shopify` and `proxy.ts` both import cleanly under `tsx`.

**Prompt (repeat per test; fill the row)**
```
[PREAMBLE]
/generate-tests
Target: <target path>  (functions: <from Appendix C>)
Scope: single file. This is a behaviour-preserving refactor, so "the contract" is
the CURRENT observable behaviour, derived from: <contract sources from Appendix C>.
Design cases from those sources and the callers (use graphify: callers of each
function) BEFORE reading the implementation body.
Techniques: <from Appendix C>.
Runner: the repo convention. Write scripts/test-<name>.ts as a tsx assertion script
in the style of scripts/test-hero.ts (ok/FAIL lines, non-zero exit on failure).
Mutation gate: node ~/dev-agent-skills/generate-tests/scripts/mutate-cli.mjs run
  --file <target> --test-cmd "npx tsx scripts/test-<name>.ts" --max-mutants <N>
Survivors: write a case for each, or list it as accepted with a reason.
Failing case: report it in refactor/FINDINGS.md as a candidate defect; do NOT loosen
the assertion and do NOT change the target file. Pin current behaviour with a
"KNOWN-BEHAVIOUR" comment instead when the contract source says it is intended.
Stage the draft under .dev-agent/draft-tests/ and stop for approval.
```

**Human gate:** review the staged draft (cases grouped by technique, mutation score, findings). Approve, then copy to `scripts/`, add a `test:<name>` script to `package.json`, and commit.

**Verify**
- Each new script exits 0 against the unmodified target.
- Mutation output for each recorded in `refactor/baseline-results.md` (killed/total and accepted survivors).
- `pnpm test:all` shows the new total (16 + 7 = 23 scripts).

**Done when:** all seven tests committed with mutation results. **Rollback:** revert the test commits; production code is untouched apart from the export-only edit.

### Step 0.7 Sign off the functionality inventory

**Objective:** every row in section 6 has evidence that it works **today**.

**Actions**
1. Run the manual smoke script (Appendix E) against the base preview. Record pass/fail per M-item in `refactor/baseline-results.md`. Anything that fails today is a **pre-existing defect**: log it in `refactor/FINDINGS.md` and mark that row "baseline: fails" so it is not mistaken for a regression later.
2. For each inventory row, confirm that the listed evidence exists (a test file, a route in `snapshot-routes.json`, an M-item). Add missing evidence now.

**Done when:** no inventory row lacks evidence. **Rollback:** n/a.

### Phase 0 gate and handoff

**Definition of done**
- [ ] DoD-0.1 `bash refactor/scripts/verify-phase.sh 0 origin/testing/commerce-deployment` passes.
- [ ] DoD-0.2 `pnpm install --frozen-lockfile` and `pnpm build` pass (you).
- [ ] DoD-0.3 `refactor/snapshots/before` and `before2` compare identical (you).
- [ ] DoD-0.4 Seven new tests committed, each with a recorded mutation score and no unexplained survivors.
- [ ] DoD-0.5 `refactor/FINDINGS.md` lists every failing generated case and every pre-existing smoke failure.
- [ ] DoD-0.6 Manual smoke M-01..M-30 recorded.
- [ ] DoD-0.7 `architecture/BEFORE.md` and `refactor/importers/*` committed.

**Claude verifies:** clones `refactor/p0-safety-net`; runs `verify-phase.sh 0`; confirms the only non-kit source change is the export-only edit (`git diff --stat` on `lib/`); reads each new test for tautologies (does an assertion restate the implementation?); checks mutation survivors are justified; checks `FINDINGS.md`.

---

## 8. Phase 1: Guard rails

**Branch:** `refactor/p1-guardrails`. **No production code moves.**

**Goal:** the target architecture is enforceable by a machine before any code goes there.

### Step 1.1 Install dependency-cruiser and baseline today's violations

**Objective:** eleven architecture rules run in CI; the six known UI cycles are the only allowed violations.

**Before you start:** Phase 0 merged into `refactor/architecture`; branch from it.

**Actions**
1. `pnpm add -D dependency-cruiser@16` (dev-only; no runtime impact).
2. Confirm `refactor/.dependency-cruiser.cjs` is present (from the kit). The rules, in plain words:
   - **no-circular**
   - **integrations-are-leaves**: `integrations/` never imports `modules`, `app`, `components`
   - **platform-is-below-modules**: `platform/` never imports `modules`, `app`, `components`
   - **modules-never-import-ui**
   - **modules-only-cross-public-surface**: cross-module imports only via `domain/**`, `*.service.ts`, `*.actions.ts`, `*.types.ts`, `*.events.ts`
   - **ui-only-imports-public-surface**: `app/` and `components/` import modules only through that surface
   - **components-never-import-integrations-or-db** (`integrations/`, `lib/db/`, `platform/`)
   - **lib-is-a-kernel**: `lib/` never imports `modules`, `integrations`, `platform` (except `*.schema.ts`, and except four legacy shim files that exist only until Phase 6: `lib/shopify/index.ts`, `lib/admin/actions.ts`, `lib/admin/queries.ts` and `lib/admin/auth.ts`; the move ledger forces their removal)
   - **schema-files-are-pure**: `*.schema.ts` import only drizzle and each other
   - **domain-is-pure**: `modules/*/domain` never imports the DB, integrations, platform, `*.data.ts`, `*.service.ts`
   - **data-access-is-private-to-its-module**: `app/` and `components/` never import `*.data.ts`
3. Generate the baseline of existing violations:
   ```bash
   npx depcruise app components lib --config refactor/.dependency-cruiser.cjs \
     --output-type baseline > refactor/depcruise-known-violations.json
   ```
   Expect exactly 6 entries, all `no-circular` (F-08). Any other rule firing on today's code means the rule or the code needs review before you continue.
4. Add script: `"arch": "depcruise app components lib modules integrations platform --config refactor/.dependency-cruiser.cjs --ignore-known refactor/depcruise-known-violations.json"` (only include directories that exist; `verify-phase.sh` does this automatically).

**Tests:** the rules themselves are tested with synthetic files (already done for the kit): a `modules/a -> modules/b/internal.ts` import, an `integrations -> modules` import, a `components -> integrations` import and a `domain -> service` import each fail; a `modules/a -> modules/b/b.service.ts` import passes. Re-run this check yourself once:
```bash
mkdir -p modules/a modules/b integrations/x
echo 'export const b=1;' > modules/b/internal.ts
echo 'import {b} from "modules/b/internal"; export const c=b;' > modules/a/x.ts
npx depcruise modules --config refactor/.dependency-cruiser.cjs | grep modules-only-cross-public-surface
rm -rf modules integrations
```

**Verify:** `verify-phase.sh 1 <base>` passes, including the dependency-cruiser check.

**Prompt**
```
[PREAMBLE]
Step 1.1. Add dependency-cruiser@16 as a devDependency, generate
refactor/depcruise-known-violations.json using the command in the roadmap, and add
the "arch" script. Confirm it contains exactly 6 no-circular entries under components/.
Do not modify any rule. Run `pnpm arch` and paste the tail.
```

**Done when:** `pnpm arch` exits 0 with "6 known violations ignored". **Rollback:** revert.

### Step 1.2 CI workflow

**Objective:** every PR runs the gate without a human remembering to.

**Actions:** create `.github/workflows/ci.yml`:

```yaml
name: ci
on:
  pull_request:
  push:
    branches: [refactor/architecture]
jobs:
  gate:
    runs-on: ubuntu-latest
    env:
      DATABASE_URL: postgres://u:p@localhost/db
      DATABASE_URL_UNPOOLED: postgres://u:p@localhost/db
      SHOPIFY_STORE_DOMAIN: example.invalid
      SHOPIFY_STOREFRONT_ACCESS_TOKEN: x
      SHOPIFY_REVALIDATION_SECRET: x
      AUTH_SECRET: ci-only-secret-at-least-32-characters-long
    steps:
      - uses: actions/checkout@v4
        with: { fetch-depth: 0 }
      - uses: pnpm/action-setup@v4
        with:
          version: 11   # set to the major from `pnpm --version` on your machine
      - uses: actions/setup-node@v4
        with: { node-version: 24, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - run: bash refactor/scripts/verify-phase.sh "$(cat refactor/PHASE.txt)" "origin/${{ github.base_ref || 'testing/commerce-deployment' }}"
```

Also add `refactor/PHASE.txt` containing the current phase number and update it in each phase. CI does **not** run `next build` or the snapshot (they need live Shopify); keep those as manual gates until a staging store is wired in.

**Verify:** open a draft PR; the job runs and passes. **Unverified here:** the workflow itself (no GitHub Actions in the sandbox); the commands it calls were run locally.

**Done when:** green check on a draft PR. **Rollback:** delete the workflow file.

### Step 1.3 PR template

Add `.github/pull_request_template.md` containing the checklist: phase number, `verify-phase.sh` tail pasted, `next build` result, snapshot compare result, ledger rows changed, allowlist changes (must be empty unless the step says so), deviations logged (`deviation-log-cli.mjs show`).

### Phase 1 gate and handoff

- [ ] DoD-1.1 `verify-phase.sh 1 <base>` passes.
- [ ] DoD-1.2 `pnpm arch` shows only the 6 known violations.
- [ ] DoD-1.3 CI green on a draft PR (you).
- [ ] DoD-1.4 `pnpm build` passes (you).
- [ ] DoD-1.5 Only `package.json`, `pnpm-lock.yaml`, `.github/**`, `refactor/**` changed. `git diff --stat origin/testing/commerce-deployment... -- app components lib` is empty.

**Claude verifies:** runs `verify-phase.sh 1`; reads `.dependency-cruiser.cjs` for rule drift against this document; confirms no source file changed.

---

## 9. Phase 2: Shopify integration layer

**Branch:** `refactor/p2-shopify-integration`.

**Goal:** everything that talks to Shopify's Storefront API (and ImageKit) lives under `integrations/`, returns raw data, is uncached and knows nothing about cookies, overrides or Next.js caching. `lib/shopify/index.ts` **survives as a facade** that keeps the exact same 20 exports, with the same cache directives, but now composes the new pieces. The facade is dismantled in Phases 3 and 4.

**Target files (all under `integrations/shopify/storefront/` unless noted)**

| New file | Holds (verbatim from `lib/shopify/index.ts`) |
|---|---|
| `storefront.client.ts` | `domain`, `endpoint`, `key`, `ExtractVariables`, `isTransientConnectError`, `shopifyFetch`, an exported `shopifyEndpoint` |
| `storefront.mapper.ts` | `removeEdgesAndNodes`, `reshapeCart`, `reshapeCollection(s)`, `reshapeImages`, `reshapeProduct(s)` |
| `products.api.ts` | uncached `fetchProduct`, `fetchProducts`, `fetchProductRecommendations`, `fetchConfiguratorProducts`, `fetchCollectionProducts`, `fetchAdminProductPages` |
| `collections.api.ts` | uncached `fetchCollection`, `fetchCollections` (incl. the synthetic "All" and `hidden*` filter) |
| `content.api.ts` | uncached `fetchMenu`, `fetchPage`, `fetchPages` |
| `cart.api.ts` | uncached, cookie-free `createCart`, `addToCart`, `removeFromCart`, `updateCart`, `fetchCart` (each takes `cartId` explicitly) |
| `queries/`, `mutations/`, `fragments/` | moved with `git mv`, no edits |
| `integrations/shopify/webhooks.ts` | `computeShopifyHmac`, `isValidShopifyHmac` |
| `integrations/imagekit/imagekit.client.ts` | moved from `lib/admin/imagekit.ts` |

Stays in `lib/shopify/` (D-05): `types.ts`, `image-url.ts`, `description-html.ts`.

### Step 2.1 Impact analysis and API-surface snapshot

**Before you start:** Phases 0 and 1 merged into `refactor/architecture`; new branch cut from it; `refactor/importers/*.txt` exist.

**Actions**
1. `graphify update .`, then `graphify affected --files lib/shopify/index.ts` and compare with `refactor/importers/lib-shopify-index.txt`. They must agree (23 importers). If not, reconcile before proceeding.
2. Record the facade's public surface, to prove it is unchanged at the end of this phase:
   `grep -E '^export' lib/shopify/index.ts | sed -E 's/\(.*//' | sort > refactor/api/lib-shopify-index.exports.txt`
   (the seven mapper exports added in step 0.6 are part of the baseline; expect about 27 lines including types).
3. Confirm the `"use cache"` inventory for `lib/shopify/index.ts` with `node refactor/scripts/cache-parity.mjs check` (must pass).

**Done when:** importer lists agree and the exports file is committed.

### Step 2.2 Extract the client (T-08 first)

**Objective:** `shopifyFetch` and its retry logic live in `storefront.client.ts`; behaviour identical.

**Before you start**
- Read `shopifyFetch` and `isTransientConnectError` in full. Contract facts: up to 2 retries with 500 ms then 1000 ms backoff, **only** when `error.cause.code` is one of `ECONNREFUSED`, `ENETUNREACH`, `EHOSTUNREACH`, `ENOTFOUND`, `EAI_AGAIN`, or `cause.name === "ConnectTimeoutError"`; the first GraphQL error (`body.errors[0]`) is thrown; Shopify-shaped errors are re-thrown as `{cause, status, message, query}` with defaults `"unknown"` and `500`; other errors as `{error, query}`; an empty endpoint throws `SHOPIFY_STORE_DOMAIN environment variable is not set`.

**Actions**
1. **Test first (T-08)** against the current export `shopifyFetch` from `lib/shopify`. `endpoint` is computed at import time, so set `SHOPIFY_STORE_DOMAIN` before a dynamic `import()` and stub `globalThis.fetch` and `setTimeout`.
2. Commit 1 (create): copy the code verbatim into `storefront.client.ts`, exporting `shopifyFetch` and `shopifyEndpoint`.
3. Commit 2 (switch): in `lib/shopify/index.ts` import from the new file and delete the originals. Nothing else changes.
4. Re-point T-08's import to the new file (import line only) and re-run.

**Prompt**
```
[PREAMBLE]
Step 2.2. First run /generate-tests for T-08 (Appendix C) against shopifyFetch in
lib/shopify/index.ts; stage the draft and stop for my approval. After approval,
create integrations/shopify/storefront/storefront.client.ts by moving domain, endpoint,
key, ExtractVariables, isTransientConnectError and shopifyFetch VERBATIM (no logic edits,
export shopifyEndpoint), and make lib/shopify/index.ts import from it. Two commits:
create, then switch. Run `pnpm test:all` and `npx tsc --noEmit`.
```

**Tests:** T-08 (Appendix C). Mutation: `--file integrations/shopify/storefront/storefront.client.ts --max-mutants 40`.

**Verify:** `verify-phase.sh 2` will still show ledger failures until the phase ends; for this step run only `tsc`, `test:all`, `cache-parity check`.

**Done when:** T-08 passes before and after the move with only an import-line change. **Rollback:** revert the two commits.

### Step 2.3 Extract the mappers

**Objective:** pure reshaping code lives in `storefront.mapper.ts`.

**Before you start:** T-07 exists and passes (step 0.6).

**Actions**
1. Commit 1: copy the seven functions verbatim into `storefront.mapper.ts` (already exported).
2. Commit 2: import them in `lib/shopify/index.ts`, delete originals.
3. Re-point T-07's import; re-run.

**Contract reminders (pinned by T-07):** `reshapeCart` fills a missing `totalTaxAmount` with `"0.0"` and the total's currency; `reshapeCollection` sets `path` to `/store/<handle>` and defaults image alt text to `"<title> collection"`; `reshapeImages` defaults alt text to `"<product title> - <filename without extension>"`; `reshapeProduct` returns `undefined` for a falsy product or when `filterHiddenProducts` (default true) and `tags` includes `nextjs-frontend-hidden`, and defaults `metafields` to `[]`; `reshapeProducts` drops undefined results.

**Prompt**
```
[PREAMBLE]
Step 2.3. Move removeEdgesAndNodes, reshapeCart, reshapeCollection, reshapeCollections,
reshapeImages, reshapeProduct and reshapeProducts VERBATIM into
integrations/shopify/storefront/storefront.mapper.ts (already exported). Two commits
(create, switch). Update scripts/test-shopify-mappers.ts to import from the new file
(import line only). Run pnpm test:all.
```

**Done when:** T-07 green with an import-only edit. **Rollback:** revert.

### Step 2.4 Move queries, mutations, fragments

**Objective:** GraphQL documents live with the integration.

**Before you start:** they are imported only by `lib/shopify/index.ts` (verified).

**Actions**
1. One commit, `git mv` only:
   ```bash
   mkdir -p integrations/shopify/storefront
   git mv lib/shopify/queries   integrations/shopify/storefront/queries
   git mv lib/shopify/mutations integrations/shopify/storefront/mutations
   git mv lib/shopify/fragments integrations/shopify/storefront/fragments
   ```
2. Second commit: update the seven relative imports in `lib/shopify/index.ts` from `./queries/...` to `integrations/shopify/storefront/queries/...` (and mutations). Relative imports **between** the moved files (queries -> fragments) keep working because the folder structure is preserved.

**Verify:** `git diff -M --stat` shows only renames; `tsc` clean; `cache-parity check` passes.

**Done when:** no file under `lib/shopify/` other than `index.ts`, `types.ts`, `image-url.ts`, `description-html.ts`. **Rollback:** revert.

### Step 2.5 Raw API functions and the facade

**Objective:** raw, uncached, override-free, cookie-free reads exist under `integrations/`; the facade composes them and keeps every cache directive.

**Before you start**
- Invariant I-5: overrides are applied **inside** the cache scope. The facade's cached `getProduct` must keep calling the override merge inside its `"use cache"` body.
- Invariant from the repo's own notes: errors must be caught **inside** a `"use cache"` function, not around its call site. `getAdminProductCatalog` catches inside; its try/catch stays in the cached facade function and only the page loop moves.

**Actions**
1. Create the raw functions. Each is the body of the current function minus `"use cache"`, `cacheTag`, `cacheLife`, `withOverrides` and `cookies()`:

| Raw function (new) | Replaces body of | Notes |
|---|---|---|
| `fetchProduct(handle)` | `getProduct`, `getRawProduct` | returns `reshapeProduct(res.body.data.product, false)` (note `false`: hidden products are **not** filtered here, the page checks the tag) |
| `fetchProducts({query, reverse, sortKey})` | `getProducts` | |
| `fetchProductRecommendations(productId)` | `getProductRecommendations` | |
| `fetchConfiguratorProducts()` | `getConfiguratorProducts` | |
| `fetchCollectionProducts({collection, reverse, sortKey})` | `getCollectionProducts` | keeps the `CREATED_AT` -> `CREATED` mapping, the missing-collection `[]`, and the not-configured `[]` |
| `fetchAdminProductPages()` | page loop in `getAdminProductCatalog` | returns `{items, truncated}`; throws on error |
| `fetchCollection(handle)`, `fetchCollections()` | `getCollection`, `getCollections` | `fetchCollections` keeps the synthetic "All" and `hidden*` filter and the not-configured branch |
| `fetchMenu`, `fetchPage`, `fetchPages` | `getMenu`, `getPage`, `getPages` | |
| cart API | `createCart`, `addToCart`, `removeFromCart`, `updateCart`, `getCart` | take `cartId`; `getCart` returns `undefined` when no cart |

2. Rewrite the facade functions in `lib/shopify/index.ts` so each keeps its exact signature, `"use cache"` directive, `cacheTag(...)`, `cacheLife(...)` and, where present, `withOverrides(...)`, but delegates to the raw function. Cookie access (`cookies()`) stays in the facade for the cart functions (removed in Phase 4).
3. Run `node refactor/scripts/cache-parity.mjs check` after **every** function you convert.

**Prompt**
```
[PREAMBLE]
Step 2.5. Create products.api.ts, collections.api.ts, content.api.ts and cart.api.ts under
integrations/shopify/storefront/ with the raw functions from the table in the roadmap.
Then rewrite each function in lib/shopify/index.ts to delegate to them while keeping its
exact signature, "use cache" directive, cacheTag, cacheLife, withOverrides call and
cookies() access. Do NOT add or remove any cache directive. Convert one function per
commit and run `node refactor/scripts/cache-parity.mjs check` and `pnpm test:all`
after each. Report any function whose behaviour you had to think about.
```

**Tests:** none new (behaviour is covered by T-07, T-08 and the cache-parity check); the thin delegations contain no logic. If a delegation needs a branch, stop and log a deviation with `plan-feature`'s `deviation-log-cli.mjs record`.

**Verify**
- `diff <(grep -E '^export' lib/shopify/index.ts | sed -E 's/\(.*//' | sort) refactor/api/lib-shopify-index.exports.txt` prints nothing (public surface unchanged).
- `cache-parity check` passes.

**Done when:** every facade function is a thin composition; the raw files contain no `"use cache"`, no `cookies`, no `withOverrides`. Grep proves it: `grep -rnE '"use cache|cookies\(|withOverrides' integrations/` prints nothing. **Rollback:** revert per-function commits.

### Step 2.6 Webhook verification helper

**Objective:** HMAC logic is testable and shared; both endpoints and their **different** topic mappings stay as they are (F-13).

**Before you start:** read both handlers. Facts to pin: the HMAC key is the value of `SHOPIFY_REVALIDATION_SECRET`; the computed value is Base64 of HMAC-SHA256 over the raw body; the comparison is a plain `!==` (preserve; H-6 records the timing-safe alternative); missing secret -> HTTP 500 `{message:"Not configured"}`; mismatch -> 401 `{message:"Unauthorized"}`; unhandled topic -> 200 `{message:"Unhandled topic"}`. The query-secret endpoint answers `{status: 401}` **with HTTP 200** on a bad secret (the number is in the body only); preserve.

**Actions**
1. **Test first (T-09)**: extract `computeShopifyHmac(body, secret)` verbatim into `integrations/shopify/webhooks.ts`, test it, then call it from `app/api/webhooks/shopify/route.ts`. Topic switch and `revalidateTag` calls remain in the route.
2. Do not touch `revalidate()` in the facade or `app/[locale]/api/revalidate/route.ts`.

**Prompt**
```
[PREAMBLE]
Step 2.6. Run /generate-tests for T-09 on computeShopifyHmac. Extract it VERBATIM from
app/api/webhooks/shopify/route.ts into integrations/shopify/webhooks.ts as
computeShopifyHmac(body: string, secret: string): Promise<string> plus
isValidShopifyHmac(body, hmac, secret). The route keeps its switch and its
revalidateTag calls; response bodies and status codes must be byte-identical. Do not
touch revalidate() in lib/shopify/index.ts.
```

**Tests:** T-09. **Verify:** `cache-parity check` shows invalidation counts unchanged (18 sites). **Rollback:** revert.

### Step 2.7 Move ImageKit

**Objective:** the ImageKit client is an integration.

**Actions**
1. **Test first (T-10)** on `isAllowedImageType`.
2. `git mv lib/admin/imagekit.ts integrations/imagekit/imagekit.client.ts` (own commit).
3. Update the two importers: `app/admin/api/upload/route.ts` and `scripts/seed-hero.ts` (import lines only).

**Verify:** `grep -rn "lib/admin/imagekit" app components lib scripts` prints nothing.

### Step 2.8 Phase 2 gate and handoff

- [ ] DoD-2.1 `verify-phase.sh 2 <base>` passes (ledger phase 2 entries in state: queries, mutations, fragments, imagekit moved; the six new files plus `webhooks.ts` exist).
- [ ] DoD-2.2 Facade export surface identical (`diff` above).
- [ ] DoD-2.3 `grep -rnE '"use cache|cookies\(|withOverrides|from "modules|from "app|from "components' integrations/` prints nothing.
- [ ] DoD-2.4 `pnpm arch` passes with no new violations.
- [ ] DoD-2.5 T-08, T-09, T-10 committed with mutation scores; T-07 green after re-point.
- [ ] DoD-2.6 `pnpm build` passes and `snapshot compare before after` is identical (you).
- [ ] DoD-2.7 Manual: M-05, M-23, M-17, M-28 (you).

**Claude verifies:** runs `verify-phase.sh 2`; diffs `lib/shopify/index.ts` function by function against the base to confirm each delegation carries the same directive, tags, life and override call; reads the raw files for accidental logic changes (rename sweep on the moved GraphQL files); checks T-08 and T-09 for tautologies.

---

## 10. Phase 3: Catalog module

**Branch:** `refactor/p3-catalog`.

**Goal:** everything about products, collections, overrides and the three curated homepage sections lives in `modules/catalog`. Reads compose the raw integration with the override layer **inside the cache scope**. The folder-level inversion (storefront reading through "admin") is gone.

**Target layout**

```
modules/catalog/
  catalog.types.ts             row types (NewlyReleasedItemRow, ShopNowItemRow, HeroItemRow, ProductOverrideWithImages, override inputs)
  products.service.ts          getProduct, getRawProduct, getProducts, getProductRecommendations, getConfiguratorProducts,
                               getCollectionProducts, readProductForPage, getAdminProductCatalog (cached; same tags/life)
  collections.service.ts       getCollection, getCollections
  overrides.service.ts         toOverride, getOverridesForHandles, withOverrides
  hero.service.ts              (was hero-feed.ts)      getHero, loadHeroRows
  newly-released.service.ts    (was newly-released-feed.ts)
  shop-now.service.ts          (was shop-now-feed.ts)
  catalog-admin.service.ts     admin-facing reads and writes, SAME NAMES as today's lib/admin/queries functions
  data/{overrides,newly-released,shop-now,hero}.data.ts
  domain/{overrides,newly-released,shop-now,hero,product-page}.ts   pure only
modules/content/content.service.ts   getMenu, getPage, getPages
```

### Step 3.1 Pre-checks and split plan

**Before you start**
- Phase 2 merged. `refactor/importers/lib-catalog.txt` and `lib-admin-queries-actions.txt` exist.
- `graphify affected --files lib/catalog/overrides.ts lib/admin/queries.ts` matches the importer lists.

**Facts that drive the design (verified)**
- Storefront pages and feeds import `lib/admin/queries` for data (`lib/catalog/*` x6). The admin **pages** import query functions by name (`listHeroItems`, `getHeroSettings`, `listNewlyReleasedItems`, `listShopNowItems`, `listOverridesForHandles`, `getOverrideByHandle`, `listAdminUsers`, `countContactEnquiries`, `listContactEnquiries`). Because admin pages are UI files (import-only edits, I-1), these names **must remain importable under the same names** from a public surface. That is the job of `catalog-admin.service.ts` (and later `admin-users.service.ts`, `enquiries.service.ts`).
- `lib/catalog/newly-released.ts` and `shop-now.ts` mix pure logic with a DB read (`readNewlyReleasedItems`, `readShopNowItems`). `overrides.ts` mixes pure `applyOverride` with `toOverride`, `getOverridesForHandles`, `withOverrides`. The pure part goes to `domain/`; the rest to `data/` or `overrides.service.ts`.
- `getOverridesForHandles` is deliberately **not** cached (a DB blip must not pin a Shopify-only catalog for days). Keep it uncached.
- The three "read...Items" functions catch errors so that a DB outage hides a section instead of throwing; preserve that.
- Row types `NewlyReleasedItemRow`, `ShopNowItemRow`, `HeroItemRow` are plain object types today. They move to `catalog.types.ts` so `domain/` never imports a `.data.ts` file (rule **domain-is-pure** counts type-only imports).

### Step 3.2 Extract data access from `lib/admin/queries.ts`

**Objective:** catalog persistence has an owner; `queries.ts` shrinks.

**Actions** (one commit per file; verbatim)
1. Create `data/overrides.data.ts` with `getOverrideByHandle`, `listOverridesForHandles`, `saveProductOverride`, `deleteProductOverride` and the override record/input types.
2. `data/newly-released.data.ts`: `listNewlyReleasedItems`, `saveNewlyReleasedItems`. `data/shop-now.data.ts`: `listShopNowItems`, `saveShopNowItems`. `data/hero.data.ts`: `listHeroItems`, `getHeroSettings`, `saveHeroConfig`.
3. Move the three row types to `catalog.types.ts`.
4. In `lib/admin/queries.ts` replace the moved bodies with re-exports from the new files **temporarily** (`export { ... } from "modules/catalog/data/..."`), so every existing importer keeps compiling. These re-exports are deleted in Phase 6. `lib/admin/queries.ts` is one of the four legacy shim files that the `lib-is-a-kernel` rule exempts until then, so no baseline change is needed.
5. **Do not change** upsert-then-prune saves, ordering, or transaction-free behaviour (neon-http has none).

**Tests:** existing `test-newly-released`, `test-shop-now`, `test-hero`, `test-overrides` must pass with **import-line edits only**. The data files hit the database, so they have no unit test; their contracts are covered by manual M-16, M-18..M-20.

**Prompt**
```
[PREAMBLE]
Step 3.2. Extract the catalog functions from lib/admin/queries.ts into
modules/catalog/data/{overrides,newly-released,shop-now,hero}.data.ts VERBATIM, move the
three row types to modules/catalog/catalog.types.ts, and leave temporary re-exports in
lib/admin/queries.ts so nothing else breaks. One commit per file. Follow
coding-standards-database for any NEW code only; moved code keeps its style. Do not run
any migration or any script that writes to a database.
```

**Verify:** `tsc`, `test:all`, `cache-parity check`. **Done when:** `queries.ts` contains only admin-user and enquiry functions plus re-exports. **Rollback:** revert.

### Step 3.3 Split pure domain from DB reads (`git mv`, then extract)

**Actions**
1. Pure moves (one commit): `git mv lib/catalog/hero.ts modules/catalog/domain/hero.ts`; same for `newly-released.ts`, `shop-now.ts`, `product-page.ts`, `overrides.ts`.
2. Extract from the moved files (second commit):
   - `readNewlyReleasedItems` -> `newly-released.service.ts`; `readShopNowItems` -> `shop-now.service.ts` (they call the data files; they stay uncached wrappers with their try/catch).
   - `toOverride`, `getOverridesForHandles`, `withOverrides` -> `overrides.service.ts`. `domain/overrides.ts` keeps `GalleryMode`, `ProductOverride`, `applyOverride` and helpers only.
3. Anything left in `domain/` must import only `lib/*`, `next`-free code and other `domain/` files. `pnpm arch` proves it.

**Tests:** T-11 (Appendix C) for `withOverrides` composition, written **before** the extraction against the current `lib/catalog/overrides.ts`. Existing `test-overrides` (26 assertions) keeps covering `applyOverride`.

**Prompt**
```
[PREAMBLE]
Step 3.3. (a) Run /generate-tests for T-11 against lib/catalog/overrides.ts (withOverrides
and getOverridesForHandles, with listOverridesForHandles stubbed); stage and stop for
approval. (b) After approval: `git mv` lib/catalog/{hero,newly-released,shop-now,
product-page,overrides}.ts into modules/catalog/domain/ (pure move commit). (c) Extract
the DB-touching functions into overrides.service.ts, newly-released.service.ts and
shop-now.service.ts as described in the roadmap. Keep try/catch behaviour and keep
getOverridesForHandles UNCACHED. Update existing test import lines only.
```

**Verify:** `pnpm arch` (domain-is-pure), all tests, cache parity. **Done when:** `modules/catalog/domain/*` imports nothing outside `lib/` and itself. **Rollback:** revert.

### Step 3.4 Cached compositions: `products.service.ts`, `collections.service.ts`, `content.service.ts`

**Objective:** the facade functions move into the module and lose the facade.

**Before you start:** this is the riskiest step of the phase (I-4, I-5). Have the Appendix D table open.

**Actions**
1. For each function in Appendix D that belongs to the catalog, create the same-named function in `products.service.ts` / `collections.service.ts` with **identical** directive, `cacheTag(...)`, `cacheLife(...)` and body, calling the raw integration function and, where the facade did, `withOverrides` **inside** the cached body.
   - `getProduct`: cached (products, days); raw `fetchProduct(handle)` -> `reshape` result -> if undefined return undefined -> `withOverrides([product])` -> first element.
   - `getRawProduct`: cached (products, days), no overrides.
   - `getProducts`, `getProductRecommendations`, `getConfiguratorProducts`, `getCollectionProducts`: cached (products or collections+products, days) with `withOverrides`.
   - `getAdminProductCatalog`: cached (products, days); calls `fetchAdminProductPages()` inside a try/catch **inside** the cached function; `failed`/`truncated` semantics unchanged.
   - `readProductForPage`: **not** cached; try/catch around `getProduct` returning `{status:"ok"|"failed"}`.
   - `getCollection`, `getCollections`, `getMenu`: cached (collections, days) with no overrides.
2. `lib/shopify/index.ts` becomes a re-export layer for these names (temporary), then in step 3.5 importers move and the layer shrinks to cart + `revalidate` (removed in Phase 4).
3. Move `revalidate(req)` verbatim from the facade into `modules/catalog/catalog-cache.service.ts` (same exported name) and point `app/[locale]/api/revalidate/route.ts` at it. Keep both quirks: a bad secret answers HTTP 200 with `{status: 401}` in the body, and product topics revalidate **only** `TAGS.products` (F-13). The other endpoint (`/api/webhooks/shopify`) keeps its own switch.
4. Add `catalog-admin.service.ts`: identically-named functions delegating to the data files: `listHeroItems`, `getHeroSettings`, `listNewlyReleasedItems`, `listShopNowItems`, `listOverridesForHandles`, `getOverrideByHandle`, `saveProductOverride`, `deleteProductOverride`, `saveNewlyReleasedItems`, `saveShopNowItems`, `saveHeroConfig` plus the input/record types.

**Prompt**
```
[PREAMBLE]
Step 3.4. Create modules/catalog/{products,collections}.service.ts and
modules/content/content.service.ts containing the cached functions listed in Appendix D
with IDENTICAL directive, cacheTag and cacheLife and a body that calls the raw
integration function and (only where lib/shopify/index.ts did) withOverrides INSIDE the
cached body. readProductForPage stays uncached. getAdminProductCatalog keeps its try/catch
inside the cached function. Then add catalog-admin.service.ts with identically-named
delegating functions. Convert one function per commit; after each run
`node refactor/scripts/cache-parity.mjs check`. Never add or drop a directive.
```

**Tests:** cache-parity per function; T-11 already covers `withOverrides`. A composition test for `getProduct` is not possible under `tsx` (cache directive is compile-time), so **manual M-05, M-16** and the snapshot `/products/<handle>` before/after are the evidence.

**Verify:** `cache-parity check` identical (14 fns, 18 sites). **Rollback:** per-function revert.

### Step 3.5 Move feeds and update every importer

**Actions**
1. `git mv lib/catalog/hero-feed.ts modules/catalog/hero.service.ts`; likewise `newly-released-feed.ts` -> `newly-released.service.ts`, `shop-now-feed.ts` -> `shop-now.service.ts` (pure move commit; then merge the extracted `read...Items` functions from 3.3).
2. Update importers using the lists from step 0.3. **UI files: import lines only** (`ui-guard` enforces it):

| Importer | Old import | New import |
|---|---|---|
| `components/home/hero-media.tsx`, `hero-banner.tsx`, `components/admin/hero-manager.tsx`, `app/admin/(dashboard)/hero/page.tsx` | `lib/catalog/hero` | `modules/catalog/domain/hero` |
| `components/home/hero-banner.tsx` | `lib/catalog/hero-feed` | `modules/catalog/hero.service` |
| `components/home/newly-release.tsx` / `-content.tsx` | `lib/catalog/newly-released-feed`, `.../newly-released` | `modules/catalog/newly-released.service`, `modules/catalog/domain/newly-released` |
| `components/home/shop-now.tsx` / `-content.tsx` | `lib/catalog/shop-now-feed`, `.../shop-now` | `modules/catalog/shop-now.service`, `modules/catalog/domain/shop-now` |
| `app/[locale]/products/[handle]/page.tsx` | `lib/catalog/product-page`, `lib/shopify` | `modules/catalog/domain/product-page`, `modules/catalog/products.service` |
| `app/admin/(dashboard)/*/page.tsx` | `lib/admin/queries` (catalog functions) | `modules/catalog/catalog-admin.service` |
| every other importer of `getProduct`, `getProducts`, `getCollection(s)`, `getCollectionProducts`, `getConfiguratorProducts`, `getProductRecommendations`, `readProductForPage`, `getAdminProductCatalog`, `getPage(s)`, `getMenu` | `lib/shopify` | the service that now owns it |

3. The importers of `lib/shopify` that only take **types, `image-url` or `description-html`** do not change (D-05).
4. Scripts and tests: update import lines in `scripts/seed-*.ts`, `scripts/test-*.ts` that reference moved files.
5. Delete the temporary re-exports for catalog symbols from `lib/admin/queries.ts` only when no importer remains (`git grep` proves it).

**Prompt**
```
[PREAMBLE]
Step 3.5. git mv the three *-feed.ts files to modules/catalog/*.service.ts (pure move
commit), then update every importer listed in refactor/importers/*.txt. In components/
and app/ UI files change IMPORT LINES ONLY. Run
`node refactor/scripts/ui-guard.mjs origin/testing/commerce-deployment` after every batch
of ten files and fix violations by reverting non-import edits. Split imports by module
where one old import now maps to two.
```

**Verify:** `verify-phase.sh 3` (includes: no `from "lib/catalog"` anywhere; ledger phase-3 state; UI guard clean; `pnpm arch`). **Rollback:** revert the importer commits (they are separate).

### Step 3.6 Phase 3 gate and handoff

- [ ] DoD-3.1 `verify-phase.sh 3 <base>` passes.
- [ ] DoD-3.2 `grep -rn 'lib/catalog' app components lib modules scripts` prints nothing.
- [ ] DoD-3.3 `git grep -nE 'from "lib/shopify"' -- app components modules` lists only cart-related importers (Phase 4 removes them).
- [ ] DoD-3.4 Cache parity identical; `lib/shopify/index.ts` exports only the cart functions (and temporary re-exports); `revalidate` lives in `catalog-cache.service.ts`.
- [ ] DoD-3.5 T-11 committed and green; the four existing catalog tests green with import-only edits.
- [ ] DoD-3.6 `pnpm build` passes; snapshot compare identical (you).
- [ ] DoD-3.7 Manual: M-01, M-04, M-05, M-16, M-18, M-19, M-20, M-28, M-29 (you).

**Claude verifies:** runs `verify-phase.sh 3`; diffs each cached function against the Appendix D row; confirms `getOverridesForHandles` is uncached and `withOverrides` sits inside the cached bodies; reads `git diff -M` for the moved files (rename sweep); checks that admin pages changed only in import lines.

---

## 11. Phase 4: Cart and bundles

**Branch:** `refactor/p4-cart-bundles`. **Highest-risk phase**: it touches the checkout path, server actions and the one allowlisted UI logic edit.

**Goal:** the bundle attribute contract lives in one place; cart use-cases are separated from their `"use server"` wrappers and from cookies; the configurator engine and its data source move into `modules/bundles`; `lib/shopify/index.ts` is deleted.

**Target layout**

```
modules/bundles/
  bundles.service.ts                    public: buildConfiguratorItems (delegates to sources/), optional validateBundle seam
  domain/bundle-contract.ts             BUNDLE_ATTR keys, newBundleId, withBundleAttributes, groupBundleLines
  domain/compat/{engine.ts,types.ts,compatibility-rules.json}   (git mv from lib/configurator, config/)
  sources/mock-metafields.source.ts     (was lib/configurator/mock-data.ts)  PRODUCTION data source today
  sources/mock-configurator-data.json   (was config/mock-configurator-data.json)
modules/cart/
  cart.actions.ts                       "use server" wrappers only (was components/cart/actions.ts), same 9 exports and signatures
  cart.service.ts                       use-cases with injectable deps; getCart ("use cache: private")
  cart-session.ts                       reads/writes the cartId cookie
```

### Step 4.1 Pre-checks and contract capture

**Before you start**
- Phase 3 merged. Base preview available for manual comparison.
- Run manual M-07..M-13 on the **base** and keep the results. For M-13, open the browser network tab on a configurator "add to cart" and save the `cartLinesAdd` request payload (attributes per line). It is the ground truth for the attribute contract.

**Contract facts (from `components/cart/actions.ts`, verified)**
- `addConfiguratorBundle(prevState, items)`: empty or missing `items` -> returns `"No items to add"`. Otherwise generates `bundle_${Date.now()}_${Math.random().toString(36).substring(2, 9)}` and maps each item to `{...item, attributes: [...(item.attributes || []), {key:"_configurator_bundle", value:"true"}, {key:"_bundle_id", value: bundleId}]}` (existing attributes first, then the two). Calls `addToCart(lines)`, then `updateTag(TAGS.cart)`. Any failure logs and returns `"Error adding configurator bundle to cart"`.
- `addItem(prevState, variantId)`: falsy id -> `"Error adding item to cart"`. If a `cartId` cookie exists it calls `getCart()`; if there is no cookie or no cart it creates one and sets the cookie (`cookies().set("cartId", id)`, no options; F-20) or returns `"Error creating cart"`. Then `addToCart([{merchandiseId, quantity:1}])` + `updateTag`, or `"Error adding item to cart"`.
- `removeItem`, `updateItemQuantity` (quantity 0 removes; missing line with quantity > 0 adds), `redirectToCheckout` (redirects to `checkoutUrl`), `createCartAndSetCookie`, `createSingleItemCartAction` (returns cart id or `null`), `buyNowAction`, `editCartItemVariantAction`: exact strings and branches as in the source; T-14 pins them.
- 12 importers of `components/cart/actions`: 11 use the bare path, `components/cart/modal.tsx` uses `./actions` (a bare-path grep misses it).
- Drawer grouping (`modal.tsx` lines 124 to 149): a line is bundled only when it has `_configurator_bundle` equal to `"true"` **and** a `_bundle_id`; groups are built in a plain object and read with `Object.entries` (so integer-like ids would sort numerically; a `Map` would not).

**Done when:** base results recorded. **Rollback:** n/a.

### Step 4.2 Bundle contract module (T-13 oracle test first)

**Objective:** one definition of the attribute keys, id generation, stamping and grouping.

**Actions**
1. **Test first (T-13).** The test copies the current inline grouping loop from `modal.tsx` verbatim as an **oracle** and compares `groupBundleLines` against it over generated fixtures (empty cart, only regular, only bundle, mixed, two bundles, a bundle line with the flag but no id, an id but flag `"false"`, an integer-like id such as `"12"`, duplicate merchandise across bundles, 1 000 randomised carts with a seeded generator).
2. Create `modules/bundles/domain/bundle-contract.ts`:
   - `BUNDLE_FLAG_KEY = "_configurator_bundle"`, `BUNDLE_ID_KEY = "_bundle_id"` (the only occurrences of these literals in the repo after this phase; the gate checks it).
   - `newBundleId(now = Date.now, random = Math.random)` producing the identical format.
   - `withBundleAttributes(items, bundleId)` preserving attribute order.
   - `groupBundleLines(lines)` returning `{ bundles: [bundleId, lines][], regularItems }` using a plain object and `Object.entries`.
3. Do not touch `modal.tsx` yet.

**Prompt**
```
[PREAMBLE]
Step 4.2. Run /generate-tests for T-13 (Appendix C): the oracle is the inline grouping
loop in components/cart/modal.tsx lines ~124-149 and the stamping logic in
components/cart/actions.ts addConfiguratorBundle. Stage the draft and stop for approval.
Then create modules/bundles/domain/bundle-contract.ts per the roadmap. Use a plain object
plus Object.entries in groupBundleLines, exactly like the original. New files follow
coding-standards Universal rules (arrow-const named exports, no non-null assertions).
Do not modify modal.tsx or actions.ts in this step.
```

**Tests:** T-13; mutation `--file modules/bundles/domain/bundle-contract.ts --max-mutants 40`.

**Done when:** T-13 green, no survivors unexplained. **Rollback:** revert.

### Step 4.3 Swap the drawer grouping (the one allowlisted UI logic edit)

**Objective:** `modal.tsx` calls the shared function; rendered output is identical.

**Before you start:** T-13 approved and committed. Create `refactor/ui-guard.allowlist.json`:
```json
[
  {
    "path": "components/cart/modal.tsx",
    "phase": 4,
    "reason": "Step 4.3: inline bundle grouping replaced by groupBundleLines(); equality proven by T-13 oracle. Only the block between 'Separate bundle items from regular items' and 'const bundles = Object.entries(bundleItems)' may change."
  }
]
```

**Actions**
1. In `modal.tsx` replace the grouping block with `const { bundles, regularItems } = groupBundleLines(cart.lines);`, keeping the variable names `bundles` and `regularItems` used by the JSX below. Add the import.
2. The remainder of the file (all JSX) is byte-identical. `git diff -U0 components/cart/modal.tsx` must show only the import and that one block.

**Prompt**
```
[PREAMBLE]
Step 4.3. In components/cart/modal.tsx replace ONLY the grouping block (from the comment
"Separate bundle items from regular items" through `const bundles =
Object.entries(bundleItems);`) with a call to groupBundleLines from
modules/bundles/domain/bundle-contract, keeping the names `bundles` and `regularItems`.
Add the import. Change nothing else. Show me `git diff -U0` for this file.
```

**Verify:** `ui-guard` reports exactly one allowlisted WARN for `modal.tsx`; `tsc` clean; manual M-12 (drawer shows "Custom Setups" with the same lines and total as on the base).

**Rollback:** revert the commit and remove the allowlist entry.

### Step 4.4 Cart session and service (T-14 first)

**Objective:** use-cases have no cookies, no `next/cache`, no `redirect` in their logic; they take injectable dependencies with real defaults.

**Actions**
1. **Test first (T-14)** against a fake port. To make the current code testable without behaviour change, write the tests against the **service you are about to create**, with the branch logic copied verbatim from `actions.ts`, then diff the function bodies (`diff` of bodies must show only the dependency-injection edits).
2. Create `cart-session.ts`:
   `getCartId(): Promise<string | undefined>` (reads `cartId`), `setCartId(id): Promise<void>` calling `cookies().set("cartId", id)` **with no options**.
3. Create `cart.service.ts`:
   - `getCart()` keeps `"use cache: private"`, `cacheTag(TAGS.cart)`, `cacheLife("seconds")` and reads the cookie, then calls the integration's `fetchCart(cartId)`; returns `undefined` when there is no cookie or no cart.
   - One service function per action (`addItemToCart`, `removeCartItem`, `updateCartItemQuantity`, `createSingleItemCart`, `addBundleToCart`, `buyNow`, `editCartItemVariant`, `checkoutUrlRedirect`, `createCartAndSetCookie`). Each takes an optional `deps` argument defaulting to the real `{session, api, invalidateCart}`. `invalidateCart` is `() => updateTag(TAGS.cart)`.
   - Return the **same strings** on the same branches.
4. Integration `cart.api.ts` functions already take `cartId` (Phase 2).

**Prompt**
```
[PREAMBLE]
Step 4.4. Run /generate-tests for T-14 (Appendix C) against the new cart service design:
cart-session.ts and cart.service.ts with an injectable deps object
{ session, api, invalidateCart }. Branch logic and return strings are copied VERBATIM
from components/cart/actions.ts. Stage and stop for approval. Then implement the files.
getCart keeps "use cache: private", cacheTag(TAGS.cart), cacheLife("seconds"). The cart
cookie is set with NO options, exactly as today. Follow coding-standards backend (thin
handler, logic in service) for these NEW files. Do not delete anything yet.
```

**Tests:** T-14; mutation `--file modules/cart/cart.service.ts --max-mutants 50`.

**Verify:** `cache-parity check` still sees `getCart` once (the facade copy and the service copy must not coexist at the end of the step: convert, don't duplicate).

**Done when:** T-14 green; the facade's cart functions delegate to `cart.service.ts`. **Rollback:** revert.

### Step 4.5 Move the server actions

**Objective:** `"use server"` wrappers live in the module; all 12 importers point at them.

**Actions**
1. Pure move commit: `git mv components/cart/actions.ts modules/cart/cart.actions.ts`.
2. Second commit: rewrite each exported function to call the service; keep **names, parameters (including the unused `prevState` first arguments) and return values identical**. The file may contain only `"use server"` and `export async function` declarations.
3. Update importers (import lines only): `app/[locale]/cart/page.tsx`, `components/configurator/wizard.tsx`, `components/configurator/steps/review-step.tsx`, `components/cart/delete-item-button.tsx`, `components/cart/edit-item-quantity-button.tsx`, `components/cart/modal.tsx` (`./actions`), `components/home/newly-release-content.tsx`, `components/home/shop-now-content.tsx`, `components/product/quick-buy-sidebar.tsx`, `components/product/product-card.tsx`, `components/product/product-description.tsx`, `components/product/product-actions.tsx`.
4. Update `app/[locale]/layout.tsx` (`getCart` from `modules/cart/cart.service`; import line only).

**Deployment note:** server-action IDs are derived from the file location, so a browser tab open across the deploy can hit "Failed to find Server Action" once. Enable Vercel skew protection or deploy off-peak. This is expected, not a regression.

**Prompt**
```
[PREAMBLE]
Step 4.5. `git mv` components/cart/actions.ts to modules/cart/cart.actions.ts (pure move
commit), then make each exported function a thin wrapper over cart.service with IDENTICAL
names, parameter lists (keep prevState) and return values. Only "use server" and
`export async function` declarations may remain. Update the 12 importers listed in the
roadmap (import lines only) and app/[locale]/layout.tsx (getCart import). Run
ui-guard after the importer commit.
```

**Verify:** `verify-phase.sh 4` sub-checks: `'use server'` only in `modules/**/*.actions.ts`; no `from "components/cart/actions"`; ledger; guard.

**Rollback:** revert both commits (importers are a third, separate commit).

### Step 4.6 Move the configurator engine, rules and data source

**Objective:** compatibility logic and its (mock) data source live in `modules/bundles`; the JSON stays byte-identical.

**Before you start:** T-01 and T-02 (Phase 0) pass. Remember F-12: the mock data is production behaviour.

**Actions**
1. Pure moves (one commit): `lib/configurator/engine.ts` -> `modules/bundles/domain/compat/engine.ts`; `types.ts` -> `domain/compat/types.ts`; `config/compatibility-rules.json` -> `domain/compat/compatibility-rules.json`; `lib/configurator/mock-data.ts` -> `sources/mock-metafields.source.ts`; `config/mock-configurator-data.json` -> `sources/mock-configurator-data.json`.
2. Fix internal imports (engine's `config/compatibility-rules.json`, mock-data's `config/mock-configurator-data.json`, relative `../config/...` requires in `scripts/test-configurator.ts`).
3. Create `bundles.service.ts` exporting `buildConfiguratorItems` (delegating to the source). Delete `lib/configurator/index.ts` (a 3-line barrel).
4. Update the nine import lines in `components/configurator/*` (engine functions -> `modules/bundles/domain/compat/engine`, types -> `.../types`, `buildConfiguratorItems` -> `modules/bundles/bundles.service`).
5. Delete the now-empty `config/` and `lib/configurator/` directories.

**Verify:** `sha256sum` of both JSON files equals the base's; T-01, T-02 and `test-configurator` pass with import edits only.

**Prompt**
```
[PREAMBLE]
Step 4.6. Pure `git mv` commit for the five files listed in the roadmap (engine, types,
compat rules JSON, mock-data.ts, mock JSON). Then fix internal imports, add
modules/bundles/bundles.service.ts exporting buildConfiguratorItems, delete
lib/configurator/index.ts, and update the 9 import lines in components/configurator/*.
Do NOT edit any JSON or engine logic. Print sha256 of both JSON files before and after.
```

**Rollback:** revert the two commits.

### Step 4.7 Optional shadow validation seam

Skip this step if you want zero new code paths in the refactor. It only adds capability for the deferred enforcement (H-2).

**Objective:** a pure `validateBundleLines(lines, items)` exists and is unit-tested; the cart bundle action can log its verdict when `BUNDLE_VALIDATION=shadow` is set. Default off; never blocks.

**Actions:** implement in `modules/bundles/domain/bundle-validation.ts` (pure, uses the engine); call it from `cart.service`'s bundle use-case behind the env flag, logging `console.info("[bundles] shadow validation:", ...)` only.

**Tests:** T-15. **Verify:** with the flag unset, behaviour and network calls are identical (no extra fetch).

### Step 4.8 Delete the facade

**Objective:** `lib/shopify/index.ts` no longer exists.

**Before you start:** `git grep -nE 'from "lib/shopify"' -- app components lib modules scripts` shows only importers whose symbols now live elsewhere.

**Actions**
1. Move any remaining facade symbol to its owner (cart functions are in `cart.service.ts`; catalog and content in Phase 3; `revalidate` in `catalog-cache.service.ts` since Phase 3).
2. Update remaining importers; `git rm lib/shopify/index.ts`.
3. Remove the facade from the `lib-is-a-kernel` legacy list later (Phase 6 does the final tidy).

**Verify:** `git grep -n 'from "lib/shopify"'` prints nothing; `cache-parity check` identical; ledger phase 4 in state.

### Step 4.9 Phase 4 gate and handoff

- [ ] DoD-4.1 `verify-phase.sh 4 <base>` passes (includes "bundle attribute keys defined once", `'use server'` placement, no legacy imports).
- [ ] DoD-4.2 `ui-guard` shows exactly one WARN (`components/cart/modal.tsx`) and no FAIL.
- [ ] DoD-4.3 T-13, T-14 (and T-15 if built) committed with mutation results; T-01, T-02 unchanged apart from import lines.
- [ ] DoD-4.4 `sha256sum` of the two JSON files equals the base.
- [ ] DoD-4.5 `pnpm build` passes; snapshot compare identical (you).
- [ ] DoD-4.6 Manual M-07 through M-13, M-10 and M-11 with the real GoKwik popup on a preview (you). Compare the `cartLinesAdd` payload from M-13 with the base capture: identical attribute order and keys.
- [ ] DoD-4.7 Skew protection on, or off-peak deploy noted.

**Claude verifies:** runs `verify-phase.sh 4`; reads the `modal.tsx` diff line by line; diffs each cart function body against `actions.ts` on the base (branches, strings, `updateTag` calls); checks the cookie call has no options; checks `cart.actions.ts` exports and signatures; checks `getCart` directive, tag and life; checks JSON hashes; rename sweep on the moved engine files.

---

## 12. Phase 5: Enquiries

**Branch:** `refactor/p5-enquiries`.

**Goal:** the enquiry rules, validation, persistence and rate limiting are a module; the route is thin; the response contract is pinned.

**Target layout**

```
modules/enquiries/
  enquiries.service.ts          submitEnquiry(...), countContactEnquiries, listContactEnquiries
  enquiries.data.ts             insert / count / list (from lib/admin/queries.ts)
  domain/routes.ts              (git mv lib/contact/routes.ts, 1370 lines of config)
  domain/enquiry-display.ts     (git mv)
  domain/enquiry-reference.ts   (git mv)
  domain/enquiry-validation.ts  validatePayload, stripEmpty, SubmitPayload, regexes (extracted verbatim)
platform/rate-limit/rate-limit.ts   (git mv lib/contact/rate-limit.ts; name checkContactRateLimit kept)
```

### Step 5.1 Pre-checks

- Phase 4 merged. Read `app/api/contact/submit/route.ts` and `lib/contact/rate-limit.ts` end to end.
- **Constraint:** a Next.js route file may export only HTTP handlers and route config, so `validatePayload` cannot be exported in place. Tests must target an extracted copy.
- Response contract (verified in source):
  - honeypot set and no errors -> HTTP 200 `{success:true, enquiryId: generateEnquiryId("SPAM"), routedTo:"n/a", responseSla:"n/a"}` and an info log; **no row is written**;
  - validation errors -> HTTP 400 `{success:false, errors}`;
  - rate limited -> HTTP 429 `{success:false, errors:["That is a few too many enquiries from this connection. Please try again shortly."]}`;
  - success -> `{success:true, enquiryId, reasonLabel, routedTo, responseSla}` after the insert;
  - any exception (bad JSON, DB failure) -> HTTP 500 `{success:false, errors:["Something went wrong. Please try again."]}`;
  - validation order: unknown or missing reason returns a single message first; then honeypot returns `[]`; then `secondsOnPage < 3`; then required qualifying fields; then required shared fields (`firstName`, `lastName`, `email`, `phone`, `city`, `message`); email format; phone has at least 10 digits; URL fields; consent last.
  - the limiter is checked **after** validation (cheap first) and **fails open** on any limiter error.

### Step 5.2 Extract validation verbatim, then characterize (T-16)

**Actions**
1. Commit 1: create `modules/enquiries/domain/enquiry-validation.ts` as an exact copy of `validatePayload`, `stripEmpty`, `SubmitPayload`, `EMAIL_RE`, `PHONE_DIGITS_RE`, `URL_RE` (import `ROUTES` from the still-old `lib/contact/routes` for now).
2. **Test (T-16)** against the copy; verify byte equality of the function bodies with the route:
   ```bash
   diff <(sed -n '/^function validatePayload/,/^}/p' app/api/contact/submit/route.ts) \
        <(sed -n '/^export const validatePayload\|^function validatePayload\|^export function validatePayload/,/^}/p' modules/enquiries/domain/enquiry-validation.ts)
   ```
   (only the `export` keyword may differ).
3. Commit 2: the route imports the copy and deletes its own.

**Prompt**
```
[PREAMBLE]
Step 5.2. Create modules/enquiries/domain/enquiry-validation.ts as a VERBATIM copy of
validatePayload, stripEmpty, SubmitPayload and the three regexes from
app/api/contact/submit/route.ts (add `export`, change nothing else). Run /generate-tests
for T-16 against it (Appendix C); stage and stop for approval. After approval switch the
route to import from the new file and delete its local copies. Show me the diff of the
function bodies proving they are identical.
```

**Tests:** T-16; mutation `--file modules/enquiries/domain/enquiry-validation.ts --max-mutants 60`.

### Step 5.3 Service and thin route (T-17, T-18)

**Actions**
1. **Tests first.** T-18 for `checkContactRateLimit` needs a database; add an optional trailing `db = getDb()` parameter (default keeps behaviour) so a fake can be injected. T-17 tests `submitEnquiry` with injected `{ checkRateLimit, insertEnquiry, now, generateId }`.
2. `submitEnquiry(payload, request, deps)` returns `{ status: number; body: unknown }` covering all branches above. The route becomes: parse JSON (inside the same try/catch) -> `submitEnquiry` -> `NextResponse.json(body, {status})`. **Status codes, bodies and log lines identical.**
3. Add `countContactEnquiries` and `listContactEnquiries` to `enquiries.service.ts` with identical names and signatures (the admin enquiries page imports them by name).

**Prompt**
```
[PREAMBLE]
Step 5.3. Run /generate-tests for T-17 (submitEnquiry with injected deps) and T-18
(checkContactRateLimit with an injected fake db via an optional trailing parameter that
defaults to getDb()). Stage and stop for approval. Then create
modules/enquiries/enquiries.service.ts and make app/api/contact/submit/route.ts a thin
parse -> service -> NextResponse.json(body, {status}) wrapper. Status codes, bodies and
console.info/console.error lines must be byte-identical to the current route. Follow
coding-standards backend (validate, authorize, service, respond) for the NEW service.
```

**Tests:** T-17, T-18; mutation on `enquiries.service.ts` and `platform/rate-limit/rate-limit.ts` (`--max-mutants 50` each).

### Step 5.4 Pure moves and data extraction

**Actions**
1. Pure moves: `lib/contact/routes.ts`, `enquiry-display.ts`, `enquiry-reference.ts` -> `modules/enquiries/domain/`; `rate-limit.ts` -> `platform/rate-limit/rate-limit.ts`.
2. Extract the enquiry queries from `lib/admin/queries.ts` (`countContactEnquiries`, `listContactEnquiries`, insert) into `enquiries.data.ts` (verbatim) and expose the two read functions through `enquiries.service.ts`.
3. Update importers (import lines only): `components/contact/{contact-page,enquiry-form,reason-picker}.tsx` (`lib/contact/routes` -> `modules/enquiries/domain/routes`), `components/admin/enquiries-browser.tsx` and `app/admin/(dashboard)/enquiries/page.tsx` (`lib/contact/enquiry-display` -> `modules/enquiries/domain/enquiry-display`, queries -> `modules/enquiries/enquiries.service`), tests `test-contact-enquiries`, `test-contact-submit`.

**Verify:** `verify-phase.sh 5` (no `from "lib/contact"`; ledger phase 5; guard; arch).

### Step 5.5 Phase 5 gate and handoff

- [ ] DoD-5.1 `verify-phase.sh 5 <base>` passes.
- [ ] DoD-5.2 T-16, T-17, T-18 committed with mutation results; `test-contact-enquiries` (60) and `test-contact-submit` (36) green with import-only edits.
- [ ] DoD-5.3 The route file is under about 40 lines and contains no validation.
- [ ] DoD-5.4 `pnpm build`, snapshot `/contact` identical (you).
- [ ] DoD-5.5 Manual M-14 (all scenarios including honeypot, 6th-submission 429, and DB-down 500) and M-21 (you).

**Claude verifies:** runs `verify-phase.sh 5`; compares the route's response bodies, status codes and log strings with the base; confirms the limiter is still checked after validation and still fails open; checks the enquiry-validation function bodies are byte-identical to the base route's; checks the `rate_limit_counters` logic diff is confined to the optional `db` parameter.

---

## 13. Phase 6: Admin module

**Branch:** `refactor/p6-admin`.

**Goal:** auth, sessions, actions and admin-user data live in `modules/admin`; `lib/admin/actions.ts` (552 lines) is split by feature; `lib/admin/queries.ts` and the four legacy shim exemptions are gone.

**Target layout**

```
modules/admin/
  auth.service.ts                  getAdminSession, requireAdmin, cookie set/clear (was lib/admin/auth.ts, without its re-exports)
  admin-users.service.ts           listAdminUsers (same name; settings page imports it)
  media-probe.ts                   (git mv)
  domain/session.ts, domain/password.ts   (git mv)
  data/users.data.ts               getAdminUserByUsername, getAdminUserById, listAdminUsers, createAdminUser, updateAdminUserPassword
  actions/
    auth.actions.ts                loginAction, logoutAction, changePasswordAction
    users.actions.ts               createAdminUserAction
    products.actions.ts            saveProductOverrideAction, deleteProductOverrideAction, getProductPhotoOptionsAction
    newly-released.actions.ts      saveNewlyReleasedAction
    shop-now.actions.ts            saveShopNowAction
    hero.actions.ts                saveHeroAction
    admin-action.shared.ts         zod schemas and helpers (not "use server")
    admin-action.types.ts          ActionState, HeroActionState, ProductPhotoOption
```

Stays in `lib/admin/` (D-05): `pagination.ts`, `product-filters.ts`, `editor-extensions.ts` (pure admin-UI support).

### Step 6.1 Pre-checks and tests first (T-19, T-23)

**Before you start**
- Phase 5 merged. Record the action surface: `grep -E '^export (async function|type)' lib/admin/actions.ts | sed -E 's/\(.*//' | sort > refactor/api/admin-actions.exports.txt` (expect 13 lines: 3 types + 10 functions).
- Verified facts: `lib/admin/auth.ts` re-exports `hashPassword`, `verifyPassword`, `MAX_PASSWORD_LENGTH`, `createSessionToken`, `verifySessionToken`, session types; the only consumer of those re-exports is `lib/admin/actions.ts`. `requireAdmin` redirects to `/admin/login`; `getAdminSession` **fails closed** (returns `null`) when the database cannot re-validate the session and when `sessionVersion` differs. Cookie: `httpOnly`, `sameSite: "lax"`, `secure` in production, path `/admin`, max age 7 days.
- Verified importers: `app/admin/api/upload/route.ts` (`getAdminSession`), `app/admin/(dashboard)/layout.tsx` (`requireAdmin`), `components/admin/admin-shell.tsx` (type `AdminSession`), `scripts/create-admin.ts`, `scripts/test-admin-auth.ts`, and 7 components importing `lib/admin/actions`.

**Actions**
1. **T-19**: export the zod schemas from a scratch copy first (they are not exported today), test them, then move. Create `admin-action.shared.ts` by moving `absoluteUrl`, `optionalAbsoluteUrl`, `loginSchema`, `passwordSchema`, `overrideSchema`, `newlyReleasedSchema`, `shopNowSchema` verbatim and exporting them.
2. **T-23**: `probeMediaUrl` with a stubbed `fetch`.

**Prompt**
```
[PREAMBLE]
Step 6.1. Run /generate-tests for T-19 (the zod schemas, moved verbatim into
modules/admin/actions/admin-action.shared.ts and exported) and T-23 (probeMediaUrl with
stubbed fetch and AbortSignal). Stage both drafts and stop for approval. Also generate
refactor/api/admin-actions.exports.txt with the grep in the roadmap.
```

### Step 6.2 Pure moves and auth service

**Actions**
1. Pure move commit: `lib/admin/session.ts` -> `modules/admin/domain/session.ts`; `password.ts` -> `domain/password.ts`; `media-probe.ts` -> `modules/admin/media-probe.ts`; `lib/admin/auth.ts` -> `modules/admin/auth.service.ts`.
2. Edit commit: remove the re-exports from `auth.service.ts` (keep `setSessionCookie`, `clearSessionCookie`, `getAdminSession`, `requireAdmin`); the `COOKIE_OPTIONS` object stays identical.
3. Update importers: `scripts/create-admin.ts`, `scripts/test-admin-auth.ts` (import lines), `app/admin/api/upload/route.ts`, `app/admin/(dashboard)/layout.tsx`, `components/admin/admin-shell.tsx` (`AdminSession` type from `modules/admin/domain/session`; import-only).
4. `proxy.ts` is **not** edited: it imports only `lib/constants` and must stay free of the bcrypt/jose chain.

**Verify:** `test-admin-auth` (17 assertions) green with import-only edits; `proxy.ts` untouched (`git diff --stat proxy.ts` empty).

### Step 6.3 Admin users data and service

**Actions:** extract `getAdminUserByUsername`, `getAdminUserById`, `listAdminUsers`, `createAdminUser`, `updateAdminUserPassword` verbatim from `lib/admin/queries.ts` into `data/users.data.ts`; expose `listAdminUsers` through `admin-users.service.ts` (the settings page imports it by name). Remove the re-exports left in `queries.ts`.

### Step 6.4 Split the actions

**Objective:** six action files with `"use server"`, identical behaviour.

**Actions**
1. Create `admin-action.types.ts` with the three types verbatim.
2. For each action file: start with `"use server"`, import what the moved bodies need, paste the function bodies **verbatim**. Cross-module calls go through public surfaces: `catalog-admin.service` (`saveProductOverride`, `deleteProductOverride`, `saveNewlyReleasedItems`, `saveShopNowItems`, `saveHeroConfig`, `listHeroItems`), `products.service` (`getProduct`), `domain/hero` (`HERO_MIN_SECONDS`, `HERO_MAX_SECONDS`, `isAllowedHeroUrl`), `media-probe`.
3. `revalidateTag` / `updateTag` calls stay in the action bodies unmoved (18-site parity, I-4). Do not centralise them yet.
4. Update the 7 component importers (import lines only; where one old import maps to two files, split the import):

| Component | Symbols |
|---|---|
| `login-form.tsx` | `loginAction`, `type ActionState` |
| `admin-shell.tsx` | `logoutAction` |
| `settings-form.tsx` | `changePasswordAction`, `createAdminUserAction`, types |
| `product-override-form.tsx` | `saveProductOverrideAction`, `deleteProductOverrideAction`, `getProductPhotoOptionsAction`, types |
| `newly-released-manager.tsx` | `saveNewlyReleasedAction`, types |
| `shop-now-manager.tsx` | `saveShopNowAction`, types |
| `hero-manager.tsx` | `saveHeroAction` |

**Prompt**
```
[PREAMBLE]
Step 6.4. Split lib/admin/actions.ts into the six *.actions.ts files, admin-action.shared.ts
and admin-action.types.ts per the roadmap. Function bodies are moved VERBATIM; every
"use server" file may only export async functions; revalidateTag/updateTag calls stay in
the action bodies. After each file run `node refactor/scripts/cache-parity.mjs check`
(invalidation counts must not change) and `npx tsc --noEmit`. Then update the 7 component
importers (import lines only) and run ui-guard. Do not delete actions.ts yet.
```

**Verify:** the union of exports across the six files plus types file equals `refactor/api/admin-actions.exports.txt`:
```bash
grep -rhE '^export (async function|type)' modules/admin/actions | sed -E 's/\(.*//' | sort | diff - refactor/api/admin-actions.exports.txt
```
prints nothing.

**Rollback:** revert per file.

### Step 6.5 Delete the shims and tighten the rules

**Actions**
1. `git rm lib/admin/actions.ts lib/admin/queries.ts` (only after `git grep` shows no importer; the ledger requires both deleted at phase 6).
2. Edit `refactor/.dependency-cruiser.cjs`: remove the `pathNot` legacy list from **lib-is-a-kernel**. Run `pnpm arch`: must pass with only the 6 known UI cycles.
3. `lib/admin/` now contains exactly `pagination.ts`, `product-filters.ts`, `editor-extensions.ts`.
4. Update scripts that imported queries (`scripts/seed-*.ts`, `scripts/create-admin.ts`) to the new paths (import lines only; **do not run them**, I-12).

**Verify:** `verify-phase.sh 6`.

### Step 6.6 Phase 6 gate and handoff

- [ ] DoD-6.1 `verify-phase.sh 6 <base>` passes.
- [ ] DoD-6.2 Action export parity `diff` above is empty.
- [ ] DoD-6.3 T-19, T-23 committed with mutation results; `test-admin-auth` (17), `test-admin-pagination`, `test-admin-product-filters`, `test-admin-editor-tables` green with import-only edits.
- [ ] DoD-6.4 `proxy.ts` unchanged; `grep -rn "bcrypt\|jose" proxy.ts` prints nothing.
- [ ] DoD-6.5 `pnpm arch` passes with the legacy exemption removed.
- [ ] DoD-6.6 `pnpm build`, snapshot compare of all `/admin/*` routes identical (you, with cookie).
- [ ] DoD-6.7 Manual M-15 through M-22 (you), including "change password signs out the other session".

**Claude verifies:** runs `verify-phase.sh 6`; diffs each action body against the base `actions.ts`; checks every `*.actions.ts` for `"use server"` and async-only exports; checks cookie options unchanged; checks `getAdminSession` still fails closed; checks no action lost its `requireAdmin()` call (a completeness-gate style trace on every write path).

---

## 14. Phase 7: Data ownership

**Branch:** `refactor/p7-data-ownership`. **No migration, no database write, no schema change.** The only outcome is where the table definitions live.

**Decision D-11 (introduced here):** `lib/db/schema.ts` stays as a single **aggregator** (`export * from` each schema file). This is the one sanctioned "barrel": `drizzle.config.ts` (`schema: "./lib/db/schema.ts"`) and namespace typing (`schema.AdminUser`, used in `queries` types) both depend on a single module, and it keeps the config byte-identical.

**Target**

| File | Owns |
|---|---|
| `modules/admin/admin.schema.ts` | `admin_users` |
| `modules/catalog/catalog.schema.ts` | `product_overrides`, `product_override_images`, `newly_released_items`, `shop_now_items`, `hero_items`, `hero_settings`, `HERO_SETTINGS_ID`, their relations and types |
| `modules/enquiries/enquiries.schema.ts` | `contact_enquiries` |
| `platform/rate-limit/rate-limit.schema.ts` | `rate_limit_counters` |
| `lib/db/schema.ts` | aggregator |

### Step 7.1 Baselines (before any edit)

1. Record runtime exports and table shapes:
   ```bash
   cat > scripts/_schema-shape.ts <<'TS'
   import * as s from "lib/db/schema";
   import { getTableConfig } from "drizzle-orm/pg-core";
   const keys = Object.keys(s).sort();
   const tables = Object.values(s).filter((v: any) => v && typeof v === "object" && Symbol.for("drizzle:Name") in v) as any[];
   const shape = tables.map((t) => { const c = getTableConfig(t); return { name: c.name, cols: c.columns.map((x) => x.name).sort(), idx: c.indexes.length, fk: c.foreignKeys.length }; }).sort((a, b) => a.name.localeCompare(b.name));
   console.log(JSON.stringify({ keys, shape }, null, 1));
   TS
   npx tsx scripts/_schema-shape.ts > refactor/schema-parity.baseline.json && rm scripts/_schema-shape.ts
   ```
   Expected today (verified): **18** runtime exports: 10 pgTable exports (`adminUsers`, `contactEnquiries`, `heroItems`, `heroSettings`, `newlyReleasedItems`, `productOverrideImages`, `productOverrides`, `rateLimitCounters`, `shopNowItems`, `socialPosts`), 7 relations exports (`heroItemsRelations`, `heroSettingsRelations`, `newlyReleasedItemsRelations`, `productOverrideImagesRelations`, `productOverridesRelations`, `shopNowItemsRelations`, `socialPostsRelations`) and 1 `HERO_SETTINGS_ID` constant; **10** tables.
2. `git ls-files lib/db/migrations | xargs sha256sum > refactor/migrations.sha256`.
3. `DATABASE_URL=postgres://u:p@localhost/db npx drizzle-kit generate` must say `No schema changes, nothing to migrate` (verified today; it works offline because `generate` does not connect).

### Step 7.2 Split (T-21 first)

**Actions**
1. **T-21**: a test that imports `lib/db/schema` and compares `Object.keys` and the table shapes with `refactor/schema-parity.baseline.json`.
2. Move each table, its relations, its `$inferSelect`/`$inferInsert` types and constants **verbatim** into its owning file. `catalog.schema.ts` imports `adminUsers` from `admin.schema.ts` for the `updated_by` foreign keys (allowed: schema files may import each other). Keep foreign keys and `onDelete: "set null"` as they are.
3. Rewrite `lib/db/schema.ts` as four `export * from` lines.
4. `lib/db/index.ts`, `drizzle.config.ts` and `lib/db/migrations/**` are **not touched**.

**Prompt**
```
[PREAMBLE]
Step 7.2. Run /generate-tests for T-21 (schema parity against
refactor/schema-parity.baseline.json); stage and stop for approval. Then split
lib/db/schema.ts into the four *.schema.ts files listed in the roadmap by moving
definitions VERBATIM (tables, relations, inferred types, HERO_SETTINGS_ID), and make
lib/db/schema.ts an aggregator of `export * from` lines. Do NOT touch lib/db/index.ts,
drizzle.config.ts or anything under lib/db/migrations. Do not run db:generate with a real
database URL and never run db:migrate.
```

**Verify**
- `sha256sum -c refactor/migrations.sha256` all OK.
- `DATABASE_URL=postgres://u:p@localhost/db npx drizzle-kit generate` still says `No schema changes` (this is the phase's key check and is part of `verify-phase.sh`).
- `pnpm arch`: `schema-files-are-pure` passes (only drizzle imports and other schema files).
- T-21 green.

**Rollback:** revert; nothing outside source changed.

### Step 7.3 Ownership rules (documented, review-enforced)

Only the owning module writes its tables: `admin` -> `admin_users`; `catalog` -> the six catalog tables; `enquiries` -> `contact_enquiries`; `platform/rate-limit` -> `rate_limit_counters`. Add this table to `architecture/ADR-0001` (Phase 8). Automated enforcement is not built (a static check on `schema.<table>` usage is not reliable without an AST pass); reviewers and `review-pr` check it.

### Step 7.4 Phase 7 gate and handoff

- [ ] DoD-7.1 `verify-phase.sh 7 <base>` passes (`drizzle: no schema drift` is the gate).
- [ ] DoD-7.2 `sha256sum -c refactor/migrations.sha256` OK; `git diff --stat -- lib/db/migrations drizzle.config.ts lib/db/index.ts` empty.
- [ ] DoD-7.3 T-21 green.
- [ ] DoD-7.4 `pnpm build` passes (you).
- [ ] DoD-7.5 Manual M-14, M-16, M-18..M-22, M-29 against a **Neon branch**, never production (you).

**Claude verifies:** runs `verify-phase.sh 7`; compares `refactor/schema-parity.baseline.json` to a fresh shape dump; checks the diff for any column, index or FK edit.

---

## 15. Phase 8: Phase 2 readiness (docs and folders only)

**Branch:** `refactor/p8-phase2-readiness`. **No runtime code.** The refactor must anticipate the community platform without building any of it.

### Step 8.1 Architecture decision records

Create `architecture/` (not `docs/`, F-06). Each ADR: Context, Decision, Consequences, Open questions. Seed content:

| ADR | Decision | Facts to include |
|---|---|---|
| 0001 Modular monolith | Modules with hexagonal internals; public surface by role suffix; table ownership table from step 7.3. | D-01, D-02, dependency rules, why not microservices (one team, one DB, Vercel serverless, transactional domain). |
| 0002 Domain events and outbox | Phase 2 modules publish events through a transactional outbox drained by a durable job; consumers are idempotent. | Candidate events: `OrderPaid`, `CheckInRecorded`, `ReviewApproved`, `BuildSaved`, `ClapGiven`. Fan-out targets: points, quests, badges, clan contribution, leaderboard read model. |
| 0003 Database driver and transactions | The ledger needs real transactions and idempotency keys. `neon-http` has no interactive transactions (known limit); move ledger-touching modules to the Neon WebSocket pool or node-postgres. | D-09; refactor deliberately keeps `neon-http`. `drizzle` `batch` is atomic but cannot do read-then-write. **Unverified here:** batch semantics on your exact driver version; test before relying on it. |
| 0004 Shopify Admin API adapter | New `integrations/shopify/admin/` (webhooks subscription, customer metafields for tier, inventory). Storefront API adapter stays as is. | Today only the Storefront API is used. |
| 0005 Bundle pricing strategy | Keep bundle attribute grouping (done). For pricing choose among: Shopify native automatic discounts (no app), Shopify's first-party Bundles for fixed Completes, or an app with Shopify Functions. | From Shopify's docs and community threads (external sources, not re-verified in your store): custom apps using Functions have been Plus-only, public apps work on all plans, and Cart Transform `lineUpdate` is Plus-only. **Unknown:** whether GoKwik's checkout honours Shopify Functions or automatic discounts; ask GoKwik before committing. |
| 0006 Identity | `members` keyed to the Shopify customer id via the Customer Account API with a phone-OTP bridge. | Also note multi-currency (Shopify Markets) versus GoKwik: put checkout behind an interface when Phase 2 reaches it. |

### Step 8.2 Module conventions and skeletons

- `modules/README.md`: naming (role suffixes), public surface, table ownership, "how to add a module" checklist, the `verify-phase.sh` gate.
- Empty planned-module READMEs are optional; do **not** create empty code folders (your repo convention: no abstractions for a single call site).

### Step 8.3 Phase 2 entry checklist (not built here)

A list in `architecture/PHASE2-ENTRY.md`: driver switch, outbox table and job, webhook inbox table with idempotency keys, Admin API adapter, members table, admin RBAC (contract excludes it today), `events.ts` per module.

**Prompt**
```
[PREAMBLE]
Step 8.1-8.3. Write architecture/ADR-0001..0006, modules/README.md and
architecture/PHASE2-ENTRY.md from the roadmap tables. Markdown only, no code, no em dashes,
no invented facts: where the roadmap says "unverified" or "unknown", keep that wording.
Use /plan-feature only if you need to plan the first Phase 2 module, and save any plan
under architecture/plans/ (not docs/).
```

### Step 8.4 Phase 8 gate

- [ ] DoD-8.1 `verify-phase.sh 8 <base>` passes and `git diff --stat -- app components lib modules integrations platform` is empty (docs only).
- [ ] DoD-8.2 Six ADRs and the entry checklist exist; every "unverified" statement from this roadmap kept its label.

**Claude verifies:** reads the ADRs for claims stated as fact without support.

---

## 16. Phase 9: Cleanup and documentation

**Branch:** `refactor/p9-cleanup`.

### Step 9.1 Sanity boundary (D-03)

`git mv lib/sanity/client.ts integrations/sanity/client.ts` and `queries.ts` likewise (no importers exist; verified). Nothing else changes (`sanity/`, `sanity.config.ts`, `/studio` stay). If you decided against D-03, skip and leave the ledger entries marked "conditional".

### Step 9.2 Dead-code report (report only)

Write `refactor/DEAD-CODE.md`; **delete nothing without your approval**. Known candidates (verified by grep): `getMenu` (no consumer outside its own module), `buyNowAction` (no importer), `lib/sanity/*` (no importers). **Not dead:** `mock-configurator-data.json` and `mock-metafields.source.ts` (production data source, F-12).

### Step 9.3 Style-debt log

`architecture/STYLE-DEBT.md` with counts, so the debt is visible instead of silently accumulating:
```bash
echo "non-null assertions: $(git grep -nE '[A-Za-z0-9_\)\]]!(\.|\)|;|,|\[)' -- 'lib' 'modules' 'integrations' 'platform' 'app' | wc -l)"
echo "interfaces: $(git grep -nE '^\s*(export )?interface ' -- lib modules integrations platform app | wc -l)"
echo "function declarations: $(git grep -nE '^\s*(export )?(async )?function ' -- lib modules integrations platform | wc -l)"
echo ".then chains: $(git grep -nE '\.then\(' -- lib modules integrations platform app | wc -l)"
```
These are heuristics; label them so.

### Step 9.4 Tighten and finish the rules

- Confirm `.dependency-cruiser.cjs` has no legacy exemption (done in 6.5).
- Leave the six UI cycles baselined (UI freeze) and list them in `architecture/STYLE-DEBT.md`.
- Note the duplicated `isTransientConnectError` (F-19) in the debt log.

### Step 9.5 Documentation

- `ARCHITECTURE.md` at repo root: layers, module list, public-surface rule, cache-tag table, how to add a module.
- `architecture/AFTER.md`: run `/architecture-context` again and compare with `BEFORE.md`.
- Update the "Code map" in `ADMIN_PANEL_ONBOARDING.md` to the new paths (this file is in the prettier baseline; keep edits minimal).
- Replace the stale `claude-init.md` and stock `README.md` sections (they still describe old placeholder pages and the Vercel template). `AGENTS.md` contains absolute paths from one developer's machine; flag it, do not rewrite it.

### Step 9.6 Optional automation

- `/skill-factory`: turn `verify-phase.sh` plus the ledger into a `wsc-phase-gate` skill for Phase 2 modules.
- `/eslint-rule-author`: rules for "`use server` only in `*.actions.ts`" and "no bare `_configurator_bundle` string".

### Step 9.7 Final verification

1. `verify-phase.sh 9 origin/testing/commerce-deployment` passes.
2. `node refactor/scripts/verify-ledger.mjs --phase 9 --base origin/testing/commerce-deployment` passes (every base file accounted for; nothing unaccounted at HEAD).
3. Full snapshot compare `before` vs `after` identical (you).
4. Full manual smoke M-01..M-30 (you); results equal or better than `refactor/baseline-results.md`.
5. Every row in section 6 ticked.
6. Run `/review-pr` and `/first-principles-review` once on the aggregated `refactor/architecture` -> base PR (large; expect the rename sweep to matter).

### Phase 9 gate

- [ ] DoD-9.1 All steps above complete.
- [ ] DoD-9.2 Zero unticked inventory rows; zero unexplained mutation survivors; `refactor/FINDINGS.md` triaged (each finding fixed later, accepted, or filed via `/investigate-issue`).
- [ ] DoD-9.3 Appendix H items each have an issue.

**Claude verifies:** runs the final gate; reconciles section 6 against evidence; reviews the aggregate diff for anything outside the ledger.

---

## Completion criteria for the whole refactor

The refactor is complete when: the ledger passes at phase 9; `pnpm arch` passes with only the six known UI cycles; the cache-parity check and drizzle no-drift check pass; the UI guard reports one allowlisted file; `next build` and the full snapshot and smoke pass; the test suite is the original 16 scripts plus every T-ID, all green, with mutation survivors explained; and every functionality row in section 6 is ticked.

---

## Appendix A: Verification kit

Delivered as `refactor-kit.zip`; unzip at the repo root to get `refactor/`. Every script was run against the studied commit (`0889a2d`).

| File | Purpose | Notes |
|---|---|---|
| `scripts/verify-phase.sh N <base>` | The single gate. Runs everything below in order and prints `PHASE N: ALL CHECKS PASSED` or the failing checks. | Phase 0 and 1 verified passing in about 40 s. Creates a stub `next-env.d.ts` if missing. |
| `scripts/run-tests.mjs` | Runs every `scripts/test-*.ts` with `tsx` and `NODE_ENV=development`; exit 1 if any fails. | Wired as `pnpm test:all`. Optional substring filter. |
| `scripts/ui-guard.mjs <base>` | Enforces I-1. For every UI file changed since `<base>`, compares the TypeScript AST **with import declarations removed**. Non-TS files (CSS, JSON, SVG, locales) must be byte-identical. Allowlist: `refactor/ui-guard.allowlist.json`. | Verified: import-path change passes, `className` change fails. Asset imports (`.png`, `.svg`, `.css`, `.json`) are compared, not stripped. `components/cart/actions.ts` is excluded because it moves. |
| `scripts/verify-ledger.mjs --phase N --base <base>` | Proves nothing is missed. (1) Every base source file under `lib/`, `config/`, route handlers, `proxy.ts`, `drizzle.config.ts` and `components/cart/actions.ts` has a ledger entry. (2) Each entry is in the right state for phase N. (3) No unaccounted file under `lib/` or `config/`. | Ledger is `move-ledger.json` (80 entries covering 88 files). Kinds: `move`, `extract`, `new`, `delete`, `stay`. Add entries when the base gains files. |
| `scripts/cache-parity.mjs snapshot\|check` | Extracts every function whose first statement is a `"use cache"` directive with its `cacheTag`/`cacheLife`, plus every `revalidateTag`/`updateTag`. Compares by function name to `cache-parity.baseline.json`. | Baseline: 14 cached functions, 18 invalidation sites. |
| `scripts/snapshot.mjs capture\|compare` | HTML regression without a browser (see step 0.5). | Verified offline on three routes; **unverified against live Shopify data**. |
| `.dependency-cruiser.cjs` | Eleven architecture rules (step 1.1). | Verified with synthetic violations. |
| `depcruise-known-violations.json` | The six UI cycles. | Baseline for `--ignore-known`. |
| `prettier-baseline.txt` | 64 files that fail Prettier today. | `verify-phase.sh` prettier-checks only touched files not listed here. |
| `snapshot-routes.json` | Routes to capture. | Replace placeholder handles with real ones. |
| `move-ledger.json`, `cache-parity.baseline.json` | Data for the two checks above. | Regenerate baselines in step 0.4 for your real base. |

**What `verify-phase.sh` runs, in order:** `tsc --noEmit`; all test scripts; Prettier on touched files; UI guard; move ledger for phase N; cache parity; `drizzle-kit generate` with a dummy URL must say "No schema changes"; dependency-cruiser (phase 1 and later, only over directories that exist); from phase 4, `"use server"` only in `modules/**/*.actions.ts`; legacy import paths gone once their phase is done (`lib/catalog` from 3, `lib/shopify` facade, `lib/configurator` and `config/` from 4, `lib/contact` from 5, legacy `lib/admin` files from 6); from phase 4, the bundle attribute literal appears at most twice.

**Not covered by any script (be honest about it):** rendered pixels and CSS; interactive state (drawer, configurator); `next build` (needs live Shopify); real database behaviour; GoKwik checkout; webhook delivery from Shopify. Those are the manual gates.

---

## Appendix B: Prompt preamble

Paste at the top of **every** Claude Code prompt in this document.

```
CONTEXT
Repo: WeSkate Co (Next.js 15 canary, headless Shopify). Branch: <branch>. I am following
REFACTOR_ROADMAP.md. This is a BEHAVIOUR-PRESERVING, ARCHITECTURE-ONLY refactor.

PRE-APPROVED PLAN
The step below is the confirmed plan (your "clarify then confirm" rule is satisfied for
it). Do not re-ask about it. STOP and ask me before: (a) running any command that writes
to a database (db:migrate, seed-*, create-admin, any script hitting DATABASE_URL);
(b) any deviation from the step as written; (c) editing any file the step does not list.
If reality differs from the roadmap, record it with plan-feature's deviation-log-cli.mjs
and stop.

HARD RULES
1. UI freeze: do not change markup, className, CSS, locales/*.json or public/. In
   components/ and app/ page/layout files ONLY import declarations may change. Run
   `node refactor/scripts/ui-guard.mjs origin/testing/commerce-deployment` after edits.
2. Moves are `git mv` commits with no content edits; edits go in a separate commit.
3. Do not add or remove any "use cache" directive, cacheTag, cacheLife, revalidateTag or
   updateTag. Run `node refactor/scripts/cache-parity.mjs check` after touching them.
4. Move code VERBATIM. No renames of behaviour, no "while I'm here" cleanups, no new
   abstractions. Keep exported names and signatures unless the step says otherwise.
5. New behaviour is forbidden. Anything that would change behaviour goes in
   refactor/FINDINGS.md and stops.
6. Bare imports only (modules/..., integrations/..., platform/..., lib/...). No aliases.

STANDARDS
Apply coding-standards Universal + backend + database + project-organization and
typescript-conventions to NEW files only (arrow-const named exports, no non-null
assertions, no barrels, kebab-case role-suffixed filenames). Do NOT dispatch
coding-standards-frontend/tailwind/tanstack-query/e2e. Moved legacy code keeps its style.

TESTS
Use /generate-tests where the step names a T-ID. Contract = current observable behaviour
+ docs + callers, not the implementation body. A failing generated test is a candidate
defect: report it in refactor/FINDINGS.md, never loosen the assertion, never change the
target. Stage drafts in .dev-agent/draft-tests/ and stop for my approval.

FINISH
Run `bash refactor/scripts/verify-phase.sh <phase> origin/testing/commerce-deployment`
(or the sub-checks the step names) and paste the tail. Commit with a conventional
message. No em dashes in any prose you write.
```

---

## Appendix C: Test catalogue

Existing 16 scripts stay and are edited only on import lines. New scripts follow the repo convention (`scripts/test-<name>.ts`, `tsx`, non-zero exit on failure).

**Invocation template** (fill the row):

```
/generate-tests
Target: <file> (<functions>)
Contract sources: <sources>
Techniques: <techniques>
Runner: scripts/test-<name>.ts  (tsx assertion script; style of scripts/test-hero.ts)
Mutation gate: node ~/dev-agent-skills/generate-tests/scripts/mutate-cli.mjs run \
  --file <target> --test-cmd "npx tsx scripts/test-<name>.ts" --max-mutants <N>
Stage in .dev-agent/draft-tests/, then stop for approval.
```

Legend: **EP** equivalence partitioning, **BVA** boundary values, **NEG** negative, **EG** error guessing, **DT** decision table, **ST** state transition, **KB** "known behaviour" (pin what the code does today, even if it looks wrong, and log it in `refactor/FINDINGS.md`).

| ID | Phase | Script | Target | Mutation |
|---|---|---|---|---|
| T-01 | 0 | `test-configurator-engine.ts` | `lib/configurator/engine.ts` | 60 |
| T-02 | 0 | `test-configurator-catalog.ts` | `lib/configurator/mock-data.ts` | 30 |
| T-03 | 0 | `test-hero-pins.ts` | `lib/catalog/hero.ts` | 40 |
| T-04 | 0 | `test-proxy.ts` | `proxy.ts` | 30 |
| T-05 | 0 | `test-i18n.ts` | `lib/i18n/index.ts` | 30 |
| T-06 | 0 | `test-utils.ts` | `lib/utils.ts` | 30 |
| T-07 | 0 | `test-shopify-mappers.ts` | mappers (`lib/shopify/index.ts`, later `storefront.mapper.ts`) | 30 |
| T-08 | 2 | `test-shopify-fetch.ts` | `shopifyFetch` | 40 |
| T-09 | 2 | `test-shopify-webhooks.ts` | `computeShopifyHmac` | 20 |
| T-10 | 2 | `test-imagekit.ts` | `isAllowedImageType` and constants | 15 |
| T-11 | 3 | `test-catalog-overrides-service.ts` | `withOverrides`, `getOverridesForHandles`, `toOverride` | 40 |
| T-12 | | reserved, unused | existing `test-newly-released` and `test-shop-now` already pin the read-failure resilience | |
| T-13 | 4 | `test-bundle-contract.ts` | `bundle-contract.ts` (with oracle) | 40 |
| T-14 | 4 | `test-cart-service.ts` | `cart.service.ts` | 50 |
| T-15 | 4 (optional) | `test-bundle-validation.ts` | `bundle-validation.ts` | 40 |
| T-16 | 5 | `test-enquiry-validation.ts` | `enquiry-validation.ts` | 60 |
| T-17 | 5 | `test-submit-enquiry.ts` | `enquiries.service.ts` | 50 |
| T-18 | 5 | `test-rate-limit-decision.ts` | `checkContactRateLimit` (injected db) | 50 |
| T-19 | 6 | `test-admin-schemas.ts` | `admin-action.shared.ts` | 40 |
| T-20 | | reserved, unused | `test-admin-auth` (17) already pins session tokens, revocation and password limits | |
| T-21 | 7 | `test-schema-parity.ts` | `lib/db/schema.ts` shape vs baseline | n/a (data test) |
| T-22 | | reserved, unused | architecture rules are covered by dependency-cruiser | |
| T-23 | 6 | `test-media-probe.ts` | `probeMediaUrl` | 30 |

### T-01 Configurator engine

- **Contract sources:** `config/compatibility-rules.json` (offset 2.75, tolerance 0.25, board-type maps, griptape widths, riser map, availability); the project's Compatibility Tree Guide; PRD Feature 06 acceptance criteria ("all 5 board types produce valid builds; incompatible items filtered or shown disabled with an explanation"); the JSDoc in `engine.ts`; callers in `components/configurator/*` (use `graphify query "callers of getCompatibleDecks"`).
- **Techniques:** BVA, EP, DT (board type x truck type x wheel type), NEG, EG.
- **Cases (all verified against the source):**
  - Deck vs truck width, `widthDiff > tolerance` is the failure test: axle `hanger + 2.75` vs `deck_width`; diff exactly 0.25 is **compatible**, 0.26 is not, on both sides (deck narrower and wider); the reason string is `Width mismatch with selected <truck title>: deck <w>" vs axle <x.xx>" (max ±0.25")`.
  - Width check is skipped when `truck_hanger_size` is `null` or `truck_type` is `Surfskate` (decks); trucks skip width matching for Surfskate when `surfskate_skip_width_match` is true; trucks without a selected deck are not width-filtered.
  - Board-type gates: deck reason `This deck is for <X>, not <Y>`; truck reason `<type> trucks are not recommended for <boardType>` when the type is not in `board_type_truck_map[boardType]`; `Not compatible with <boardType>` from the truck's own comma-separated list (empty list means no restriction; whitespace and empty segments trimmed); wheels use `board_type_wheel_map` and their own list.
  - Unknown board type -> empty allowed-type list (all incompatible, none throws).
  - Out-of-stock toggle off excludes items; on: **trucks, wheels, griptape, bearings** move OOS items to `incompatible` with reason `Out of stock`. **KB probe (decks):** with the toggle on, an OOS deck of the right board type passes the main loop into `compatible`; the trailing "Out of stock" block appears unreachable. Confirm and pin; log to FINDINGS (H-9).
  - `empty` / `emptyMessage` strings for every category (`No <boardtype lowercase> decks available yet.`, `No compatible trucks found for your deck. Try a different deck width.`, `No <boardType> trucks available.`, `No compatible wheels found for <boardType>.`, `No bearings available.`, `No griptape wide enough for a <w>" deck.`, `No griptape available.`).
  - Bearings are universal; riser filter ignores the toggle and reports `Riser pads coming soon.` when `allRisers` is empty (`empty: allRisers.length === 0`); hardware always empty with `Hardware is included with your trucks.`
  - Griptape: `griptape_deck_max_width` lookup by stringified grip width (9 -> 8.75, 10 -> 9.75, 11 -> 10.75); deck exactly at the max is compatible (`<=`); reason `Too narrow: <g>" griptape for <d>" deck` only when the width is in the map and the grip is narrower than the deck. **KB probe:** an in-stock grip whose width is **not** in the map is labelled `Out of stock` (misleading). Pin and log (H-9).
  - `calculateBuildTotal`: sums `parseFloat(price.amount)` of non-null items, currency from the first item or `INR` when none; float sums pinned with values like 0.1 + 0.2 shown as-is.
  - `getConfiguratorSteps(hasRisers, hasHardware)`: exactly 9 steps with ids 1..9 and categories `board_type, deck, truck, wheel, bearing, griptape, riser, hardware, review`; steps 7 and 8 optional and `skip` = `!hasRisers` / `!hasHardware` with the skip messages.
  - `isBoardTypeAvailable` / `getBoardTypeUnavailableMessage` for each board type (Skateboard and Old School true; Surfskate, Longboard, Cruiser false), default message `Coming soon.` for an unknown type.
- **Mutation:** expect survivors on message strings only if the test does not assert them; assert them.

### T-02 Configurator catalog (`buildConfiguratorItems`)

- **Contract sources:** the `ConfiguratorItem` and meta types in `types.ts`, the JSDoc ("each product variant becomes a separate ConfiguratorItem"), the shape of `mock-configurator-data.json`, and callers (`components/configurator/wizard.tsx`).
- **Cases:** one item per variant; `*_by_variant` maps resolved by variant id; price, availability, product title and image passed through; a product handle with no mock entry (pin what happens; KB); empty input; a variant missing from a by-variant map (KB). Fixtures are built from the real JSON (load it, do not copy it).

### T-03 Hero pins

- **Contract:** `lib/catalog/hero.ts` JSDoc, `docs` in `ADMIN_PANEL_ONBOARDING.md` (hero section), existing `test-hero`.
- **Cases:** constants pinned by value (`HERO_DEFAULT_SECONDS` 6, `HERO_MIN_SECONDS` 2, `HERO_MAX_SECONDS` 60); `resolveSeconds` at 1, 2, 3, 59, 60, 61, `null`, `undefined`, `NaN`; `nextHeroIndex` wrap and `count` 0 or 1; `newHeroItemId` charset `^[0-9a-z]+$`, no collisions over 1 000 calls (the base-36 mutant survived before); `HERO_FALLBACK_SLIDE` shape.
- **Target:** kill more than 1 of 8 (the baseline); explain any survivors.

### T-04 Proxy (`proxy.ts`)

- **Contract:** comments in `proxy.ts` and the onboarding doc ("admin lives outside the locale tree", "cheap cookie-presence gate", "do not redirect away from /admin/login when a cookie is present").
- **Cases** (use `new NextRequest(url)`): `/` -> rewrite to `/en` with `x-locale: en`; `/store/x` -> `/en/store/x`; `/en`, `/hi`, `/hi/store` pass through with `x-locale`; **BVA `/hinduism` is not a locale** (`/hi/` or exactly `/hi` required) and is rewritten; `/admin` and `/admin/products` without the cookie -> redirect to `/admin/login` with search cleared; with the cookie -> pass; `/admin/login` without cookie passes (no loop) and **with** a cookie also passes; `/admin/api/upload` passes without cookie; skip list `/api`, `/_next`, `/favicon.ico`, `/robots.txt`, `/sitemap.xml`, `/fonts`, `/studio` pass untouched. **KB probes:** the skip list is prefix-based, so `/apiary`, `/studios`, `/fontsize` are skipped from locale rewriting; `/administrator` is **not** treated as admin (only `/admin` and `/admin/`). Also assert the exported `config.matcher` regex.

### T-05 i18n

- **Contract:** JSDoc in `lib/i18n/index.ts`.
- **Cases:** `getTranslation` locale hit; **empty-string translation falls back** (uses `||`) to `en`, then to the key; unknown locale -> `en`; `createTranslator` binds the locale; `getDictionary` unknown -> `en`; `getLocalizedField` precedence `field_<locale>`, `field_en`, `field`, `""`; `getLocalizedPath` adds a missing leading slash, `en` returns the clean path, other locales prefix `/hi`; `""` -> `/` (and `/hi/`); case-sensitive locale. **Data invariant (report, do not assert):** keys present in `hi.json` but not in `en.json`.

### T-06 Utils

- **Cases:** `ensureStartsWith`; `createUrl` (no `?` when params empty); `baseUrl` with and without `VERCEL_PROJECT_PRODUCTION_URL` (evaluated at import; use dynamic imports); `formatArtworkBadgeHtml` (golden output for: plain text, nested `<em><strong>`, `&nbsp;`, terminated by `<br>`, `</p>`, newline and end-of-string; multiple matches; case-insensitive; empty artist returns the match unchanged; empty input `""`). This function emits **UI markup**, so the golden strings protect the rendered badge. `getArtistName` (HTML match wins over text; whitespace trimmed; `null` when neither); `validateEnvironmentVariables` message (read the source and pin).

### T-07 Shopify mappers

- **Contract:** the seven functions' behaviour listed in step 2.3.
- **Cases:** `removeEdgesAndNodes` on empty and populated connections; `reshapeCart` with and without `totalTaxAmount` (currency taken from `totalAmount`); `reshapeCollection(undefined)` -> `undefined`, image alt default, `path`; `reshapeCollections` drops falsy; `reshapeImages` alt default including a URL without an extension; `reshapeProduct` with hidden tag (filtered) and `filterHiddenProducts=false` (kept), missing `metafields`; `reshapeProducts` drops hidden and falsy.

### T-08 `shopifyFetch`

- **Cases** (stub `globalThis.fetch` and `setTimeout`; set `SHOPIFY_STORE_DOMAIN` before a dynamic import): success returns `{status, body}`; `body.errors[0]` is thrown and shaped `{cause, status, message, query}` for Shopify-shaped errors; non-Shopify errors -> `{error, query}`; connect errors (`ECONNREFUSED`, `ENETUNREACH`, `EHOSTUNREACH`, `ENOTFOUND`, `EAI_AGAIN`, `ConnectTimeoutError`) retried exactly twice with delays 500 and 1000 ms then thrown; a non-connect error is **not** retried; success on the second attempt; extra headers merged after the token header; empty endpoint -> `SHOPIFY_STORE_DOMAIN environment variable is not set`. **BVA:** retry count 0, 1, 2, 3 failures.

### T-09 Webhook HMAC

- **Cases:** RFC 4231-style vectors plus an independent `node:crypto` oracle (`createHmac("sha256", secret).update(body).digest("base64")`); empty body; unicode body; different secret differs; trailing whitespace changes the digest; `isValidShopifyHmac` false for empty, wrong-length and near-miss values. **KB:** the comparison is plain string equality today (H-6).

### T-10 ImageKit helpers

- **Cases:** the exact allowlist (`image/jpeg`, `png`, `webp`, `avif`, `gif`) true; `image/svg+xml`, `image/JPEG` (case-sensitive), `""`, `application/pdf` false; constants `MAX_UPLOAD_BYTES` = 10 x 1024 x 1024 and `UPLOAD_FOLDER` = `/weskateco/products`; `getImageKitClient` throws the documented message without `IMAGEKIT_PRIVATE_KEY`.

### T-11 Overrides service

- **Cases:** `withOverrides([])` returns the same array; when no overrides exist returns the **same array reference**; merges by handle; `getOverridesForHandles([])` performs no database read; a thrown read is swallowed, logs `Failed to load product overrides; serving Shopify data as-is:` and returns an empty `Map`; `toOverride`: unknown `galleryMode` -> `"append"`, `null` `altText` -> `""`, `null` width/height -> `0`, `null` `removedImageUrls` -> `[]`.

### T-13 Bundle contract (oracle)

- **Oracle:** copy of the inline `modal.tsx` grouping loop; `groupBundleLines` must equal it on: empty; only regular; only bundle; mixed; two bundles; flag without id; id with flag `"false"`; **integer-like ids** (`"12"`, `"3"`) which `Object.entries` orders numerically; duplicate merchandise across bundles; 1 000 seeded random carts.
- **Other cases:** `newBundleId` matches `^bundle_\d+_[0-9a-z]{1,7}$`, deterministic with injected clock and random, no collisions in 1 000 calls; `withBundleAttributes` keeps existing attributes first then the flag then the id, does not mutate input, works with `attributes` undefined; the two key constants equal the literals used on the base.

### T-14 Cart service (fake deps)

- **Cases per use-case, exact return strings:** `addItemToCart` (falsy id; no cookie -> create, set cookie, add; cookie but cart not found -> recreate; create throws -> `Error creating cart`; add throws -> `Error adding item to cart`; success invalidates once); `removeCartItem` (`Error fetching cart`, `Item not found in cart`, `Error removing item from cart`); `updateCartItemQuantity` (quantity 0 removes; existing updates; missing with quantity > 0 adds; missing with 0 no-op; throws -> `Error updating item quantity`); `createSingleItemCart` (`null` on failure, id on success); `addBundleToCart` (empty -> `No items to add`; attribute stamping via the contract; failure string); `editCartItemVariant`; `checkoutUrlRedirect` (no cart -> no redirect); the cookie is set **without options**.

### T-15 Bundle validation (optional seam)

- Cases derived from the compatibility engine: unknown variant id; two decks; truck/deck width just inside and outside 0.25; surfskate skip; empty lines. Never asserts blocking (validation is log-only).

### T-16 Enquiry validation

- **Cases (order matters, first failing rule wins as in source):** missing or unknown reason -> one message and return; honeypot set -> `[]` even when other fields are invalid; `secondsOnPage` BVA 2.99, 3, 3.01, `undefined`, negative; required qualifying fields single vs `multi` (`[]`, missing, whitespace-only); each shared required field; email valid/invalid forms; phone with 9 and 10 digits, with spaces, dashes, `+91`; URL-typed fields (`http://a.b` vs `ftp://`, empty allowed); consent false. **KB probe:** `answers` undefined throws (route returns 500). `stripEmpty` drops `""`, `undefined`, `null`, `[]` and keeps `0`, `false`.

### T-17 `submitEnquiry` (injected deps)

- **Cases:** exact status and body for honeypot (`SPAM` prefix id, `n/a`), validation 400, rate-limited 429 message, success 200 shape, exception 500 message; limiter called only after validation passes; limiter not called for honeypot or invalid; insert values (`enquiryId` prefix from the route, `reasonLabel` fallback to the raw reason, `routedTo`, `responseSla`, `answers` without `company_website`, `consent`, `reason`, `meta` with `sourcePage: "/contact"`, referer and `accept-language` sliced to 10 chars, `secondsOnForm` default 0); insert failure -> 500 and **no success body**.

### T-18 Rate limit decision (injected fake db)

- **Cases:** first hit creates the bucket and allows (`hits` 1); hits 1..5 allowed, 6 blocked (BVA at `RATE_LIMIT_MAX_HITS`); a stored window older than the current one resets to 0 before counting; the prune runs only on `hits === 1` and a prune failure does not change the verdict (logged); any database error **fails open** (`allowed: true, hits: 0`); key is `contact/submit:<sha256 prefix>` and never contains the raw identifier.

### T-19 Admin zod schemas

- **Cases:** `absoluteUrl` accepts `https://a.b`, rejects `a.b` with `Must be an absolute URL.`; `optionalAbsoluteUrl` maps `""` to `null`; `loginSchema` trims username, messages `Enter a username.` / `Enter a password.`; `passwordSchema` BVA at 7, 8, 72, 73 characters with the two messages; `overrideSchema` defaults (`galleryMode` `append`, `removedImageUrls` `[]`, `images` `[]`), enum rejection, `productHandle` trimmed and non-empty, image `width`/`height` positive ints or nullish; `newlyReleasedSchema` 200 accepted, 201 rejected with `That is more products than one carousel can hold.`; `shopNowSchema` no upper bound (1 000 accepted).

### T-21 Schema parity

- Compares `Object.keys(schema)` (18) and per-table shape (10 tables: column names, index count, foreign-key count) with `refactor/schema-parity.baseline.json`.

### T-23 Media probe

- **Cases** (stub `fetch`): `HEAD` used with `redirect: "follow"`, `cache: "no-store"`; network error -> `unreachable` with the error message or `Request failed.`; non-2xx (including 405, 501) -> `unreachable` `responded <status>`; wrong content type prefix -> `wrong-type` (`video/` for video, `image/` for image), parameters stripped, case-insensitive; **BVA on size:** exactly `MAX_VIDEO_BYTES` and `MAX_IMAGE_BYTES` -> no warning, +1 byte -> warning with rounded MB text; missing `content-type` -> `ok` with the unverified warning; missing or non-numeric `content-length` -> no size warning.

---

## Appendix D: Cache and invalidation parity table

Checked by `cache-parity.mjs` by **function name**, so moving a function between files is fine but changing a directive, tag or life is not.

### Cached functions (14)

| Function | Directive | Tags | Life | Today in | Final owner |
|---|---|---|---|---|---|
| `getProduct` | `use cache` | products | days | `lib/shopify/index.ts` (override merge inside) | `modules/catalog/products.service.ts` |
| `getRawProduct` | `use cache` | products | days | same | `products.service.ts` |
| `getProducts` | `use cache` | products | days | same | `products.service.ts` |
| `getProductRecommendations` | `use cache` | products | days | same | `products.service.ts` |
| `getConfiguratorProducts` | `use cache` | products | days | same | `products.service.ts` |
| `getCollectionProducts` | `use cache` | collections, products | days | same | `products.service.ts` |
| `getAdminProductCatalog` | `use cache` | products | days | same | `products.service.ts` |
| `getCollection` | `use cache` | collections | days | same | `collections.service.ts` |
| `getCollections` | `use cache` | collections | days | same | `collections.service.ts` |
| `getMenu` | `use cache` | collections | days | same | `modules/content/content.service.ts` |
| `getCart` | **`use cache: private`** | cart | seconds | same | `modules/cart/cart.service.ts` |
| `loadHeroRows` | `use cache` | hero | minutes | `lib/catalog/hero-feed.ts` | `modules/catalog/hero.service.ts` |
| `loadNewlyReleasedItems` | `use cache` | newlyReleased | minutes | `lib/catalog/newly-released-feed.ts` | `newly-released.service.ts` |
| `loadShopNowItems` | `use cache` | shopNow | minutes | `lib/catalog/shop-now-feed.ts` | `shop-now.service.ts` |

Deliberately **uncached**: `getOverridesForHandles`, `withOverrides`, `readProductForPage`, `getNewlyReleased`, `getShopNow`, `getHero`, `readNewlyReleasedItems`, `readShopNowItems`.

### Invalidation sites (18)

| Site | Calls |
|---|---|
| `app/api/webhooks/shopify/route.ts` | product topics: `revalidateTag(TAGS.products,"seconds")` and `revalidateTag(TAGS.collections,"seconds")`; collection topics: `revalidateTag(TAGS.collections,"seconds")` (3 sites) |
| `revalidate()` in `lib/shopify/index.ts` -> `catalog-cache.service.ts` | collection topics: collections; product topics: products only (2 sites) |
| `lib/admin/actions.ts` -> `modules/admin/actions/*` | save override: products + collections; delete override: products + collections; `saveNewlyReleased`: newlyReleased; `saveShopNow`: shopNow; `saveHero`: hero (7 sites) |
| `components/cart/actions.ts` -> `modules/cart/cart.actions.ts` | `updateTag(TAGS.cart)` x 6 |

---

## Appendix E: Manual smoke script

Run against the **base preview first** (baseline), then after every phase you touch. Record pass/fail per item.

| ID | Check |
|---|---|
| M-01 | Home loads; hero rotates and pauses; Newly Released and Shop Now carousels scroll; toast and footer present. |
| M-02 | Language switch en <-> hi keeps the path. |
| M-03 | Navbar search box sets `q` and results filter. |
| M-04 | Store filters, sort and pagination via URL params; reload keeps state. |
| M-05 | Product page: variant selection, gallery, description tabs, EMI badge, recommendations. |
| M-06 | Sold-out product shows "Out Of Stock". |
| M-07 | Add to cart: optimistic badge and toast, drawer opens. |
| M-08 | Drawer: change quantity, remove item, edit variant. |
| M-09 | `/cart` mirrors state; quantities editable. |
| M-10 | Buy now opens the GoKwik popup (and falls back to Shopify checkout if the SDK is blocked). |
| M-11 | Checkout from the drawer and from `/cart` triggers GoKwik. |
| M-12 | Configurator: choose board type; select deck, trucks, wheels, bearings, griptape; incompatible items disabled with reasons; out-of-stock toggle; review; add to cart; drawer shows "Custom Setups" with the right lines and total. |
| M-13 | The `cartLinesAdd` request from M-12 carries `_configurator_bundle: "true"` and one shared `_bundle_id` on every line (save the payload from the base and compare). |
| M-14 | Contact: every reason group; valid submit shows the receipt (id, team, SLA); invalid shows messages; honeypot (fill the hidden field) returns success and writes no row; the 6th submission within 10 minutes shows the 429 message. |
| M-15 | Admin login and logout; wrong password error; session survives reload; after a password change the other session is signed out. |
| M-16 | Admin products: filters, open an override, change title, description, photos, cover, gallery mode; storefront reflects immediately. |
| M-17 | Admin upload: valid image ok; wrong type rejected; unauthenticated upload returns 401 JSON. |
| M-18 | Admin Newly Released: add, reorder, remove, subtitle, photos; autosave indicator; homepage reflects. |
| M-19 | Admin Shop Now: same. |
| M-20 | Admin Hero: add image and video, duration, poster; invalid URL rejected; large-media warning; homepage reflects. |
| M-21 | Admin Enquiries: the M-14 submission appears; filter by reason; pagination. |
| M-22 | Admin Settings: change password, add admin, list admins. |
| M-23 | Edit a product in Shopify; the storefront updates within seconds through the webhook (test each subscribed endpoint). |
| M-24 | Redirects: `/terms`, `/product/<handle>`, `/hi/product/<handle>`. |
| M-25 | A Shopify page handle renders at `/<handle>`. |
| M-26 | `sitemap.xml` and `robots.txt` correct. |
| M-27 | Five guides and the board-finder tools (quiz, size tool, decision helper). |
| M-28 | Shopify outage (unset the domain locally): product page shows the unavailable state; admin products shows the degraded banner; homepage sections hide instead of erroring. |
| M-29 | Database outage (bad `DATABASE_URL` on a **branch**, never production): homepage renders without curated sections; contact returns the 500 message; the limiter fails open. |
| M-30 | `/studio` loads. |

---

## Appendix F: Risk register

| ID | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| R-01 | Server-action IDs change when action files move, breaking open sessions once. | Certain | Low | Skew protection or off-peak deploy (Phase 4, 6). |
| R-02 | Cold `"use cache"` after each deploy (cache keys follow function identity). | Likely | Low | Tags unchanged so invalidation still works; expect slower first requests. |
| R-03 | A composed cached function accidentally drops the override merge or caches the uncached override lookup, serving stale or Shopify-only data. | Medium | High | I-5, T-11, cache parity, Claude's function-by-function diff, M-16. |
| R-04 | Cart cookie or attribute contract changes silently. | Low | High | T-13, T-14, M-13 payload comparison, cookie-options check. |
| R-05 | Snapshot noise from live Shopify data hides a real regression or produces false alarms. | Medium | Medium | Capture before and after in one sitting; capture twice to prove determinism; re-capture the baseline if a product is edited. |
| R-06 | The team keeps shipping features on the base while the refactor runs; ledger and baselines drift. | High | Medium | Weekly base merge, re-run step 0.4, `/sync-prs`. |
| R-07 | The public-surface rule blocks a legitimate import late in a phase. | Medium | Low | The rule is data; extend `PUBLIC` deliberately and record the decision. |
| R-08 | `mutate-cli` under-mutates JSX or generic-heavy code and over-reports quality. | Medium | Low | Aim it at pure `.ts`; review survivors manually. |
| R-09 | Characterization tests pin a bug and future fixes look like regressions. | Medium | Low | `KB` labels plus `FINDINGS.md`; Appendix H tracks the fixes. |
| R-10 | `next build` or GoKwik regressions that no automated check sees. | Medium | High | You run build, snapshot and M-10/M-11 on a preview before each merge. |
| R-11 | Moving the schema files subtly changes a column or index. | Low | High | Phase 7 baselines, T-21, `drizzle-kit` no-drift, migration hash check. |
| R-12 | Skill instructions (standing rules in `AGENTS.md`) make the agent stop for confirmation mid-step. | Medium | Low | Preamble pre-approval; deviations recorded instead of silent changes. |

---

## Appendix G: Phase handoff report template

Copy into the message you send Claude after pushing a phase branch.

```
PHASE: N   BRANCH: refactor/pN-...   BASE: origin/testing/commerce-deployment   HEAD SHA: ...

1. verify-phase.sh N output (paste the tail, must end with ALL CHECKS PASSED):
   ...
2. pnpm build: PASS / FAIL (paste the last 30 lines if FAIL)
3. snapshot compare before vs after: identical / N routes differ (paste the diff lines)
4. Manual smoke items run this phase (from the phase gate): M-.. PASS / FAIL, notes
5. Ledger: entries completed this phase (from the phase text). Anything skipped and why.
6. Allowlist changes: none / (paste git diff of refactor/ui-guard.allowlist.json)
7. Deviations from the roadmap (deviation-log-cli.mjs show): none / ...
8. New tests: T-.. mutation scores (killed/total) and accepted survivors with reasons
9. New FINDINGS.md entries: ...
10. Anything I should look at first: ...
```

**What Claude does with it:** clones the branch, re-runs `verify-phase.sh`, reads the diff (`git diff -M`) with the rename sweep in mind, checks each item named under that phase's "Claude verifies", reads the new tests for tautologies and unexplained mutation survivors, and replies per criterion with **PASS**, **FAIL** (with the file and line) or **RISK** (passes the machine checks but needs your judgement). Claude cannot run `next build`, the snapshot, or manual smoke, and will say so explicitly rather than infer them.

---

## Appendix H: Deferred behaviour changes (tracked, not done in the refactor)

File each as an issue (`/investigate-issue` can take it from there). The refactor's tests pin today's behaviour, so each fix can later ship as its own reviewed change.

| ID | Change | Why deferred |
|---|---|---|
| H-1 | Group configurator bundles on the `/cart` page (F-14). Now a one-line call to `groupBundleLines`. | Changes the UI (I-1). |
| H-2 | Enforce server-side bundle validation (turn shadow mode into blocking). | New behaviour; needs a decision on error copy. |
| H-3 | Align the two webhook endpoints' topic mappings (F-13). | Changes cache invalidation behaviour. |
| H-4 | Remove dead code from `refactor/DEAD-CODE.md`. | Needs your approval per item. |
| H-5 | Harden the `cartId` cookie (`httpOnly`, `secure`, `sameSite`, `maxAge`) (F-20). | Can break client code that reads it and changes checkout behaviour. |
| H-6 | Timing-safe HMAC comparison in the webhook route. | Behavioural (security) change. |
| H-7 | Move `revalidateTag` calls into the owning modules (centralise invalidation). | Would alter the 18-site parity baseline. |
| H-8 | Share one connect-retry helper between `storefront.client.ts` and `lib/db/index.ts` (F-19). | Two behaviours, two risk surfaces. |
| H-9 | Fix the engine oddities pinned in T-01 (OOS decks landing in `compatible`; griptape mislabel). | Changes what customers see. |
| H-10 | Replace mock configurator metafields with real Shopify metafields (D-10). | Blocked on client product data. |
| H-11 | Mass-format the 64 Prettier-failing files. | Would violate diff purity for UI files; do it as its own PR after the refactor. |
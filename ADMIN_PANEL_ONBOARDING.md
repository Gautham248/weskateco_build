# Admin Panel — Developer Onboarding

This is the working guide for developing the **WeSkate Co admin panel** at `/admin`.
It covers cloning the repo, the environment variables you need, creating an admin
login, running the app, and the conventions you are expected to follow when you add
or change a feature.

Everything below is grounded in the code as it exists today. If you find something
that no longer matches, fix this file in the same change.

---

## 1. What the admin panel is

The admin panel is a set of Next.js pages that live **outside the locale tree**, at
`/admin`. It lets staff manage content that the storefront reads at runtime:

| Tab            | Route                   | What it does                                                                                                      |
| -------------- | ----------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Products       | `/admin/products`       | Search/filter the Shopify catalog; override titles, descriptions, photos and gallery order; upload product photos |
| Newly Released | `/admin/newly-released` | Curate the homepage "NEWLY RELEASED" carousel                                                                     |
| Shop Now       | `/admin/shop-now`       | Curate the homepage "SHOP NOW" row                                                                                |
| Hero           | `/admin/hero`           | Curate the homepage hero media (images/videos, order, duration)                                                   |
| Settings       | `/admin/settings`       | Change your password, add admin accounts, list accounts                                                           |

The storefront never writes to Shopify. The admin panel only ever writes to the
**app's own Postgres database** (curation + overrides), which the storefront reads
and combines with live Shopify data.

---

## 2. Prerequisites

- **git**, with access to the `LeedsDigital-Dev/weskateco` repository.
- **Node.js 24** (the project currently runs on `v24.18.0`). There is no `.nvmrc`
  or `engines` field, but Node 24 is what the team uses.
- **pnpm** (currently `11.x`). The repo is a pnpm workspace — use `pnpm`, not `npm`.
- A **Postgres** connection string (Neon / Vercel Postgres). See section 4.
- Access to the **shared secrets** (Shopify, ImageKit, database). These are
  write-only in Vercel and cannot be pulled back — get them from a teammate or the
  team password manager.
- _(Optional)_ the Vercel CLI, only if the team wants you to use `vercel env pull`.

---

## 3. Clone and install

```bash
# SSH (preferred if you have a key configured)
git clone git@github.com:LeedsDigital-Dev/weskateco.git
# or HTTPS
git clone https://github.com/LeedsDigital-Dev/weskateco.git

cd weskateco
pnpm install
```

> **Branch note.** The default branch is `main`, but the admin panel is actively
> developed on **`feat/shop-now-admin`**, which is ahead of `main`. Check with the
> team which branch is the current admin integration branch, then base your work on
> that. As of this writing it is `feat/shop-now-admin`:
>
> ```bash
> git checkout feat/shop-now-admin
> git pull
> ```

---

## 4. Environment variables

Copy the template and fill in values:

```bash
cp .env.example .env
```

`.env` and `.env.*` are gitignored (only `.env.example` is tracked), so nothing
secret can be committed.

### 4.1 The variables

| Variable                                                       | Used for                                                      | Needed to work on the admin panel?                            |
| -------------------------------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------- |
| `DATABASE_URL`                                                 | Pooled Postgres connection, used by the app at runtime        | **Yes** — everything persists through it                      |
| `DATABASE_URL_UNPOOLED`                                        | Direct connection, used only by `drizzle-kit` migrations      | **Yes** — needed to run migrations                            |
| `AUTH_SECRET`                                                  | Signs the admin session JWT (HS256)                           | **Yes** — the admin panel refuses to sign sessions without it |
| `SHOPIFY_STORE_DOMAIN`                                         | Shopify Storefront API host (e.g. `your-store.myshopify.com`) | **Yes** — the product pickers read the live catalog           |
| `SHOPIFY_STOREFRONT_ACCESS_TOKEN`                              | Storefront API token                                          | **Yes** — same reason                                         |
| `IMAGEKIT_PRIVATE_KEY`                                         | Server-side key for the admin image uploads                   | **Yes** — if you work on uploads/photos                       |
| `SHOPIFY_REVALIDATION_SECRET`                                  | Webhook revalidation secret                                   | No (storefront only)                                          |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` / `NEXT_PUBLIC_SANITY_DATASET` | Sanity CMS                                                    | No (storefront only)                                          |
| `IMAGEKIT_PUBLIC_KEY`, `IMAGEKIT_URL_ENDPOINT`                 | ImageKit client SDK (if used)                                 | No                                                            |
| `COMPANY_NAME`, `SITE_NAME`, `TWITTER_CREATOR`, `TWITTER_SITE` | Site metadata                                                 | No                                                            |
| `NEXT_PUBLIC_GOKWIK_*`                                         | GoKwik checkout                                               | No                                                            |

### 4.2 Generating `AUTH_SECRET`

It must be **at least 32 characters**. Generate one with:

```bash
openssl rand -base64 32
```

Paste the whole line as the value. `lib/admin/session.ts` throws at runtime if the
secret is missing or shorter than 32 characters.

### 4.3 A warning about `vercel env pull`

The README suggests `vercel env pull`. Be aware of two real gotchas:

1. `vercel env pull` pulls the **Development** environment by default, and this
   project's Development environment currently has **no variables** — you would get
   an empty `.env`.
2. `vercel env pull --environment=production` works, but values stored in Vercel as
   **Secret** (the sensitive ones) cannot be pulled back — they come down as the
   literal placeholder `[SENSITIVE]`.

So in practice: `cp .env.example .env` and fill in the real values from a teammate
or the team password manager. `DATABASE_URL`, `AUTH_SECRET`, the Shopify token and
`IMAGEKIT_PRIVATE_KEY` are the ones that matter for admin work.

---

## 5. Database

The app uses **Drizzle ORM** against Neon/Postgres over HTTP. Schema lives in
`lib/db/schema.ts`; migrations are committed in `lib/db/migrations/`.

```bash
# apply all committed migrations to the database in DATABASE_URL
pnpm db:migrate

# ONLY when you change lib/db/schema.ts: generate a new migration file
pnpm db:generate
# ...then commit the generated .sql + meta snapshot, and migrate.
```

> **Shared-database warning.** If you point `DATABASE_URL` at the production
> database (which is what the team's `.env` files do today), your local admin edits
> write to **production data**. For safe local development, create a **Neon branch**
> of production and put its connection string in `DATABASE_URL` / `DATABASE_URL_UNPOOLED`
> instead. The admin panel has no "staging" notion, so this is on you.

`db:migrate` is the only step that writes to the database; `db:generate` only writes
a migration file.

---

## 6. Create an admin account and log in

Admin accounts are rows in the `admin_users` table (username + bcrypt password hash).
Create one from the command line:

```bash
npx tsx scripts/create-admin.ts <username> <password>
```

- The password must be **8–72 characters** (bcrypt truncates beyond 72).
- The script refuses to overwrite an existing username.

Then start the app:

```bash
pnpm dev
```

and open `http://localhost:3000/admin/login`. The flow:

1. `proxy.ts` redirects any request under `/admin` without a session cookie to
   `/admin/login`.
2. The login form posts `username` + `password` to the `loginAction` server action.
3. The password is verified with bcrypt (12 rounds); on success a 7-day HS256 JWT is
   signed with `AUTH_SECRET` and stored in the `admin_session` cookie
   (httpOnly, sameSite=lax, `secure` in production, scoped to `/admin`).

The session signature is verified in the admin layout and in every server action
(via `requireAdmin()`), not in the edge proxy — the proxy only checks cookie
presence, because it must stay free of the bcrypt/jose dependency chain.

---

## 7. Tour of the tabs

All admin tabs share two conventions worth internalising before you look at code:

- **There is no "Save" button.** Every change persists on its own — adding,
  removing, reordering, editing — after a short debounce. The
  "Saving… / All changes saved" indicator and a "Retry save" affordance are the
  feedback loop.
- **The storefront reads the app's database + live Shopify.** The admin never
  touches Shopify; it stores curation and overrides, and the storefront layers them
  on top.

### Products

- Search + a facet panel (Product type / Vendor / Tags, plus Availability and
  Override status pills) filter the catalog **client-side** over the full catalog
  fetched server-side.
- Clicking a product opens the override editor: title, description (rich text),
  photo management (hide/reorder Shopify photos, upload via ImageKit, choose a
  cover), and gallery mode.

### Newly Released & Shop Now

- Both follow the same shape as the original `newly-released` feature:
  a "search the Shopify catalog" picker (with the same filters) + an ordered list of
  chosen products.
- Each item carries its own photos (card/hero for Newly Released; three slots for
  Shop Now) and an optional subtitle.
- Saving replaces the whole curated list; the storefront drops products that no
  longer exist in Shopify rather than rendering a broken section.

### Hero

- Slides are **media items**: an image URL or a video URL, plus an optional poster,
  alt text, and a per-slide display duration.
- A hero-level **default duration** covers any slide whose duration is blank.
- Slides render in order, each for its own duration, with a pause/play control.
- The current hero asset (a 5MB GIF) was seeded as slide 1; the definitive fix is to
  replace it with a real encoded video, which is now just another slide.

### Social Posts

- Curates the social strip on the home page **and** every `/store` page.
- One **mixed row**: cards from any platform sit side by side, each badged with
  its own platform, in the order given by the arrows. Typical use is 4-5
  Instagram posts plus a couple of LinkedIn or Twitter ones.
- Each post is an uploaded image plus an optional `https://` link. The
  **Platform** dropdown covers Instagram, YouTube, TikTok, Facebook, X, Threads,
  Pinterest and LinkedIn; `twitter` is accepted as an alias for X.
- Only Instagram and TikTok have a named reel format, so the reel toggle appears
  on those two only. The button verb follows the platform — "Watch" on YouTube
  and TikTok, "View Post" / "View Reel" elsewhere.
- Adding a platform is a code change in `lib/catalog/social-posts.ts`
  (`SOCIAL_PLATFORMS`), **not** a migration: `platform` is free text on purpose.
  An unrecognised value falls back to Instagram rather than throwing, so a
  half-finished change cannot take the homepage down.
- **The image field needs an image, not a post's address.** Use the Upload
  button (it puts the file on ImageKit); paste the post URL in the _link_ field.
  A post's web address is not an image, and putting one there renders a broken
  card. The admin warns when both fields hold the same value.
- The strip renders images with a plain `<img>`, deliberately **not**
  `next/image`: that field is free text, `next/image` throws on hosts missing
  from `next.config.ts`, and one bad URL must not be able to 500 the homepage.
  An image that fails to load shows an "Image unavailable" placeholder.
- Only Instagram, Facebook and YouTube ship a brand icon
  (`components/icons/{insta,fb,yt}.svg`). The rest render the platform name in
  words rather than an approximated logo.
- A post with no link is allowed (stage the image first) and its button renders
  inert rather than linking nowhere. The save warns when that happens.
- **An empty list hides the storefront section.** The five original screenshots
  are an error fallback only — they are what made the section look permanently
  stale before this tab existed.
- Capped at 12 posts, because the strip ships into every store page.

### Settings

- Change your own password, add another admin, and list existing accounts.

### Footer social links

- Not a tab — the footer's Instagram/Facebook/YouTube/X links are read from
  Sanity's `siteSettings.socialLinks` by a server wrapper around the footer.
  Edit them in the Sanity Studio, not in code.
- They used to be hardcoded to bare platform roots (`https://instagram.com`),
  which sent people to the platform homepage instead of the brand's profile.

---

## 8. Code map — how the pieces fit

The admin panel follows a strict, repeatable layer cake. The **Newly Released**
feature is the canonical example; every tab copies it.

```
lib/db/schema.ts                      # table + relations + exported types
lib/admin/queries.ts                  # list/save functions + row types (no Date objects)
lib/admin/actions.ts                  # server actions: requireAdmin() -> zod -> save -> revalidateTag
app/admin/(dashboard)/<tab>/page.tsx  # server component, force-dynamic, loads data + error banner
components/admin/<tab>-manager.tsx    # client component: state, autosave, no Save button
components/admin/sidebar-nav.tsx      # NAV_ITEMS entry for the sidebar link

lib/catalog/<thing>.ts                # PURE logic (mapping, validation) - testable without Next/DB
lib/catalog/<thing>-feed.ts           # cached read + uncached assembler for the storefront
components/home/<thing>.tsx           # storefront server component
components/home/<thing>-content.tsx   # storefront client component (if it needs interactivity)
```

To add a new admin feature, mirror those layers in order. The important behaviours:

1. **Pure logic lives in `lib/catalog/`** and is tested by a `tsx` assertion script
   (`scripts/test-<thing>.ts`), never by a browser.
2. **Server actions** do `requireAdmin()`, validate with `zod`, persist, then
   `revalidateTag(TAGS.<thing>, "seconds")` so a save is visible immediately.
3. **Resilience.** A database read failure must hide the section or fall back — it
   must never throw into the homepage render. See `readNewlyReleasedItems()` and
   `getHero()` for the two shapes of this.
4. **Caching.** Storefront reads use `"use cache"` + `cacheTag` with a short
   `cacheLife`. Two gotchas:
   - `revalidateTag` is what makes an admin save refresh the storefront.
   - **Catch inside the `"use cache"` function**, not around the call site: an error
     escaping a `"use cache"` function surfaces as an unhandled 500 even when the
     caller catches it.
5. **No transactions.** The Neon HTTP driver has no interactive transactions, so
   save functions are **upsert-then-prune**, not delete-then-insert — a partial
   failure leaves a superset of correct rows rather than an empty section.

---

## 9. Conventions

- **Package manager:** pnpm.
- **Formatting:** Prettier (with the Tailwind plugin). `pnpm test` runs
  `prettier:check`.
- **Types:** `npx tsc --noEmit` must pass. The tsconfig is `strict` with
  `noUncheckedIndexedAccess`, so indexing is checked.
- **Commit messages:** Conventional Commits with a scope, e.g.
  `feat(admin): …`, `fix(db): …`, `test(shop-now): …`.
- **Delete dead code.** If your change makes something unused, remove it rather than
  leaving a "no longer used" comment or a re-export.
- **No new abstractions for one call site.** Three similar lines beat a premature
  helper — but when a second consumer appears (as happened with pagination and
  filters), extract it.
- **Autosave** everywhere in the admin panel; a visible "Save" button is the
  exception, not the rule.

---

## 10. Testing and checks before you push

```bash
npx tsc --noEmit              # types
pnpm test                     # prettier --check
pnpm test:overrides           # override logic
pnpm test:auth                # session/secret validation
pnpm test:newly-released      # carousel mapping + resilience
pnpm test:shop-now            # Shop Now mapping
pnpm test:admin-filters       # filter/facet logic
pnpm test:admin-pagination    # pager windowing/clamping
pnpm test:hero                # hero duration/url/rotation logic
pnpm test:social-posts        # social post url/permalink validation
npx tsx scripts/test-configurator.ts
npx tsx scripts/test-filters.ts
```

A full `pnpm build` is the strongest local signal that a change is deployable —
run it for anything that touches routes, server actions, or the `"use cache"`
layer.

---

## 11. Common gotchas

- **`AUTH_SECRET` too short** → `/admin/login` 500s with a message from
  `lib/admin/session.ts`. Use a fresh `openssl rand -base64 32`.
- **Throwing out of `"use cache"`** → an unhandled 500 even if the caller catches.
  Catch inside the cached function.
- **`next/image` host allowlist.** `next.config.ts` only permits
  `cdn.shopify.com/s/files/**` and `ik.imagekit.io/kyfkw6hca/**`. A pasted image URL
  from any other host makes `next/image` throw at render. The Hero tab therefore
  renders plain `<img>`/`<video>`, not `next/image`.
- **bcrypt truncates at 72 bytes** — `MAX_PASSWORD_LENGTH` in
  `lib/admin/password.ts` exists for exactly this reason.
- **neon-http has no transactions** — hence upsert-then-prune everywhere.
- **`crypto.randomUUID()` needs a secure context.** The hero item ids use the same
  `Math.random()` + `Date.now()` pattern as `image-manager.tsx` instead, so they work
  over plain http on a LAN address too.
- **The seeded hero GIF is ~5MB.** It's served from ImageKit; replacing it with a
  real video is the intended long-term fix.

---

## 12. Shipping

- Open a PR against the current integration branch (confirm with the team — currently
  `feat/shop-now-admin`).
- Schema changes must include the committed `db:generate` migration and are applied
  to the database **separately** via `pnpm db:migrate` — that step, and any seed
  script (`scripts/seed-*.ts`), are writes to a shared database and are deliberately
  not part of "just deploy".
- Deployment is Vercel. A deploy does not pick up new environment variables until it
  is redeployed after they are added.

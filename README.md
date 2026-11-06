[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fcommerce&project-name=commerce&repo-name=commerce&demo-title=Next.js%20Commerce&demo-url=https%3A%2F%2Fdemo.vercel.store&demo-image=https%3A%2F%2Fbigcommerce-demo-asset-ksvtgfvnd.vercel.app%2Fbigcommerce.png&env=COMPANY_NAME,SHOPIFY_REVALIDATION_SECRET,SHOPIFY_STORE_DOMAIN,SHOPIFY_STOREFRONT_ACCESS_TOKEN,SITE_NAME)

# Next.js Commerce

A high-performance, server-rendered Next.js App Router ecommerce application.

This template uses React Server Components, Server Actions, `Suspense`, `useOptimistic`, and more.

<h3 id="v1-note"></h3>

> Note: Looking for Next.js Commerce v1? View the [code](https://github.com/vercel/commerce/tree/v1), [demo](https://commerce-v1.vercel.store), and [release notes](https://github.com/vercel/commerce/releases/tag/v1).

## Domains and checkout (WeSkate Co)

| Domain               | Serves                                                                                                  |
| -------------------- | ------------------------------------------------------------------------------------------------------- |
| `weskateco.com`      | This site (Vercel)                                                                                      |
| `shop.weskateco.com` | Shopify: checkout, order status, customer accounts. CNAME `shop` → `gumfkb-x7.myshopify.com` at GoDaddy |

- **Keep `shop.weskateco.com` as Shopify's primary domain** (Shopify admin → Settings → Domains). Shopify builds its checkout, thank-you and order-status links from the primary domain, including the "View your order" links in emails and GoKwik's redirect after payment. If it's set to `weskateco.com`, all of those land on this site and 404, and so do the Shopify-checkout fallbacks in `lib/gokwik/checkout.ts` and `lib/gokwik/use-gokwik-checkout.ts`. Nothing in the code or tests would catch it.
- **Shopify's online store runs a redirect theme** ([Hydrogen redirect theme](https://github.com/Shopify/hydrogen-redirect-theme), storefront hostname `weskateco.com`). It sends visits to the old Liquid store on `shop.weskateco.com` to the same page here.
- **Checkout:** shoppers in India pay through GoKwik's popup. Shopify's own checkout is the fallback when GoKwik can't open. Once #90 lands, it's also the checkout for shoppers outside India (outside India, GoKwik's popup opens blank). It takes international cards through Easebuzz, in INR, for the international market.
- **`/cart/checkout`:** GoKwik's script sends shoppers to this Shopify theme URL when it can't run. `app/[locale]/cart/checkout/route.ts` answers it by redirecting to the Shopify checkout of the right cart.

## Providers

Vercel will only be actively maintaining a Shopify version [as outlined in our vision and strategy for Next.js Commerce](https://github.com/vercel/commerce/pull/966).

Vercel is happy to partner and work with any commerce provider to help them get a similar template up and running and listed below. Alternative providers should be able to fork this repository and swap out the `lib/shopify` file with their own implementation while leaving the rest of the template mostly unchanged.

- Shopify (this repository)
- [BigCommerce](https://github.com/bigcommerce/nextjs-commerce) ([Demo](https://next-commerce-v2.vercel.app/))
- [Ecwid by Lightspeed](https://github.com/Ecwid/ecwid-nextjs-commerce/) ([Demo](https://ecwid-nextjs-commerce.vercel.app/))
- [Geins](https://github.com/geins-io/vercel-nextjs-commerce) ([Demo](https://geins-nextjs-commerce-starter.vercel.app/))
- [Medusa](https://github.com/medusajs/vercel-commerce) ([Demo](https://medusa-nextjs-commerce.vercel.app/))
- [Prodigy Commerce](https://github.com/prodigycommerce/nextjs-commerce) ([Demo](https://prodigy-nextjs-commerce.vercel.app/))
- [Saleor](https://github.com/saleor/nextjs-commerce) ([Demo](https://saleor-commerce.vercel.app/))
- [Shopware](https://github.com/shopwareLabs/vercel-commerce) ([Demo](https://shopware-vercel-commerce-react.vercel.app/))
- [Swell](https://github.com/swellstores/verswell-commerce) ([Demo](https://verswell-commerce.vercel.app/))
- [Umbraco](https://github.com/umbraco/Umbraco.VercelCommerce.Demo) ([Demo](https://vercel-commerce-demo.umbraco.com/))
- [Wix](https://github.com/wix/headless-templates/tree/main/nextjs/commerce) ([Demo](https://wix-nextjs-commerce.vercel.app/))
- [Fourthwall](https://github.com/FourthwallHQ/vercel-commerce) ([Demo](https://vercel-storefront.fourthwall.app/))

> Note: Providers, if you are looking to use similar products for your demo, you can [download these assets](https://drive.google.com/file/d/1q_bKerjrwZgHwCw0ovfUMW6He9VtepO_/view?usp=sharing).

## Integrations

Integrations enable upgraded or additional functionality for Next.js Commerce

- [Orama](https://github.com/oramasearch/nextjs-commerce) ([Demo](https://vercel-commerce.oramasearch.com/))

  - Upgrades search to include typeahead with dynamic re-rendering, vector-based similarity search, and JS-based configuration.
  - Search runs entirely in the browser for smaller catalogs or on a CDN for larger.

- [React Bricks](https://github.com/ReactBricks/nextjs-commerce-rb) ([Demo](https://nextjs-commerce.reactbricks.com/))
  - Edit pages, product details, and footer content visually using [React Bricks](https://www.reactbricks.com) visual headless CMS.

## Running locally

You will need to use the environment variables [defined in `.env.example`](.env.example) to run Next.js Commerce. It's recommended you use [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables) for this, but a `.env` file is all that is necessary.

> Note: You should not commit your `.env` file or it will expose secrets that will allow others to control your Shopify store.

1. Install Vercel CLI: `npm i -g vercel`
2. Link local instance with Vercel and GitHub accounts (creates `.vercel` directory): `vercel link`
3. Download your environment variables: `vercel env pull`

```bash
pnpm install
pnpm dev
```

Your app should now be running on [localhost:3000](http://localhost:3000/).

If you use an AI coding assistant (Claude Code, OpenCode) on this repo, also
install graphify, the Python tool that builds the codebase knowledge graph
`AGENTS.md` relies on. Section 3.1 of
[ADMIN_PANEL_ONBOARDING.md](ADMIN_PANEL_ONBOARDING.md) has the steps.

### Local databases

The admin panel and the admin-managed storefront sections (hero, Newly Released,
Shop Now, social posts, product overrides) read from Postgres. Docker runs it
locally with two separate databases:

- **`dev`**: yours, with seed data, used by `pnpm dev`
- **`test`**: the end-to-end suite's, emptied and migrated on every run

To set up the dev database with seed data (needs Docker):

1. Add the dev connection string to `.env.local`:

   ```bash
   DATABASE_URL=postgres://postgres:postgres@db.localtest.me:5432/dev
   ```

2. Start the containers, then create, migrate and seed the dev database:

   ```bash
   pnpm db:reset
   ```

3. Run `pnpm dev`. The admin panel is at `/admin`, and the seeded login is at the
   top of `scripts/seed-dev.ts`.

`pnpm db:seed` reloads the seed data at any time, and `pnpm db:down` stops the
containers.

To run the end-to-end tests, the containers must be running (`pnpm db:up`).
`pnpm test:e2e` then resets the test database and points the app at it, so your
dev data never affects a test. See section 5.1 of
[ADMIN_PANEL_ONBOARDING.md](ADMIN_PANEL_ONBOARDING.md) for every command and how
it works.

<details>
  <summary>Expand if you work at Vercel and want to run locally and / or contribute</summary>

1. Run `vc link`.
1. Select the `Vercel Solutions` scope.
1. Connect to the existing `commerce-shopify` project.
1. Run `vc env pull` to get environment variables.
1. Run `pnpm dev` to ensure everything is working correctly.
</details>

## Vercel, Next.js Commerce, and Shopify Integration Guide

You can use this comprehensive [integration guide](https://vercel.com/docs/integrations/ecommerce/shopify) with step-by-step instructions on how to configure Shopify as a headless CMS using Next.js Commerce as your headless Shopify storefront on Vercel.

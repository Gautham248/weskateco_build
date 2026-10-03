# Architecture: BEFORE

The "before" picture of the system's subsystems, recorded at the start of the refactor (Phase 0, commit `4435972` on `refactor/p0-safety-net`). Phase 9 writes `architecture/AFTER.md` for comparison.

Produced by the `architecture-context` skill from the `graphify` structural graph (`graphify-out/graph.json`, 1998 nodes, 3049 edges, 140 communities). Each subsystem below is a graph community that reads as a coherent architectural unit, ordered by size (largest first). Clusters that are only configuration or documentation (package.json, tsconfig.json, the onboarding docs and this roadmap) are omitted because they are not architectural subsystems. Summaries describe structure and ownership, not runtime behaviour claims.

## Subsystems

- **catalog-home-feeds** (`c60`, 57 nodes): Homepage curated catalog sections. Owns the Newly Released and Shop Now catalog logic, their feeds, the home row components, the newly-released error boundary and their test scripts.
  Anchor files: `lib/catalog/newly-released.ts`, `lib/catalog/shop-now.ts`, `lib/catalog/newly-released-feed.ts`, `lib/catalog/shop-now-feed.ts`, `components/home/newly-release.tsx`
- **truck-guide-data** (`c14`, 56 nodes): Content data for the truck guide.
  Anchor files: `lib/truck-guide/data.ts`
- **social-posts** (`c5`, 55 nodes): Social posts feature. Catalog data and feed, the admin manager and page, and the homepage tips carousel and section that consume it, plus tests.
  Anchor files: `lib/catalog/social-posts.ts`, `lib/catalog/social-posts-feed.ts`, `components/admin/social-posts-manager.tsx`, `components/home/tips-carousel.tsx`
- **store-filters** (`c33`, 55 nodes): Store browsing filters and sorting. Derived filters, category filter config, the search filter/sort UI and banner, and the collection page client.
  Anchor files: `lib/filters/derive.ts`, `lib/filters/category-filter-config.ts`, `components/layout/search/filter-sort-bar.tsx`, `app/[locale]/store/[collection]/store-collection-client.tsx`
- **deck-guide-data** (`c27`, 50 nodes): Content data for the deck guide.
  Anchor files: `lib/deck-guide/data.ts`
- **contact-enquiries** (`c57`, 47 nodes): Contact enquiry flow. Reason routing table, rate limiting, reference generation, the submit route and the contact UI components, plus tests.
  Anchor files: `lib/contact/routes.ts`, `lib/contact/rate-limit.ts`, `app/api/contact/submit/route.ts`, `components/contact/enquiry-form.tsx`
- **surfskate-guide-data** (`c32`, 45 nodes): Content data for the surfskate guide, grouped with the shared guide wear and care sections.
  Anchor files: `lib/surfskate-guide/data.ts`, `components/griptape-guide/wear.tsx`, `components/wheel-guide/wear.tsx`
- **shopify-storefront** (`c1`, 42 nodes): Shopify Storefront integration. The facade module, the shared commerce types and the configurator and menu GraphQL queries.
  Anchor files: `lib/shopify/index.ts`, `lib/shopify/types.ts`, `lib/shopify/queries/configurator.ts`
- **guides-ui** (`c65`, 42 nodes): Shared guide UI primitives used across all guide pages. Layout, rich text, icons, anchor navigation, FAQ and range layouts.
  Anchor files: `components/guides/ui.tsx`, `components/guides/rich.tsx`, `components/guides/anchor-nav.tsx`
- **database** (`c37`, 39 nodes): Drizzle schema and the Neon HTTP database client.
  Anchor files: `lib/db/schema.ts`, `lib/db/index.ts`
- **griptape-guide-data** (`c58`, 34 nodes): Content data for the griptape guide.
  Anchor files: `lib/griptape-guide/data.ts`
- **cart-and-product-ui** (`c122`, 34 nodes): Cart page and product surfaces. Quick buy sidebar, collections grid, product card, Snapmint EMI badge, the admin product table and the modal history hook.
  Anchor files: `app/[locale]/cart/page.tsx`, `components/product/quick-buy-sidebar.tsx`, `components/product/product-card.tsx`
- **school-page** (`c46`, 32 nodes): The school page and its section components.
  Anchor files: `app/[locale]/school/page.tsx`, `components/school/safe-structured-section.tsx`, `components/school/why-schools-choose.tsx`
- **shared-utils** (`c13`, 31 nodes): Shared utilities. `lib/utils`, Shopify description HTML, the search filter UI, and sitemap and robots.
  Anchor files: `lib/utils.ts`, `lib/shopify/description-html.ts`, `components/layout/search/filter/index.tsx`
- **cart-actions** (`c11`, 28 nodes): Cart server actions and the cart drawer UI. The actions module, the modal, quantity edit and delete buttons and the Snapmint cart banner.
  Anchor files: `components/cart/actions.ts`, `components/cart/modal.tsx`, `lib/shopify/index.ts`
- **board-finder** (`c4`, 27 nodes): Board finder tools. Quiz, size tool, anatomy, trucks section, decision helper and maintenance.
  Anchor files: `components/board-finder/board-finder-page.tsx`, `components/board-finder/quiz.tsx`, `components/board-finder/size-tool.tsx`
- **surfskate-guide-page** (`c68`, 27 nodes): The surfskate guide page and its section components.
  Anchor files: `app/[locale]/guides/surfskate-guide/page.tsx`, `components/surfskate-guide/bits.tsx`, `components/surfskate-guide/mechanism.tsx`
- **i18n** (`c8`, 26 nodes): Internationalization. TranslationProvider plus localized navigation and language UI.
  Anchor files: `lib/i18n/TranslationProvider.tsx`, `components/layout/language-switcher.tsx`
- **board-finder-data** (`c69`, 25 nodes): Board finder data and decision helper logic.
  Anchor files: `lib/board-finder/data.ts`, `components/board-finder/decision-helper.tsx`
- **admin-queries** (`c54`, 24 nodes): Admin data queries and the admin enquiries and product pages.
  Anchor files: `lib/admin/queries.ts`, `app/admin/(dashboard)/enquiries/page.tsx`
- **wheel-guide** (`c55`, 23 nodes): Wheel guide content and page. Shape, durometer and range sections plus the shared drag scroll area.
  Anchor files: `app/[locale]/guides/wheels-guide/page.tsx`, `components/wheel-guide/shape.tsx`, `components/wheel-guide/durometer.tsx`
- **product-page** (`c72`, 23 nodes): Product detail page. Variant selector, product actions, draggable prose, footer menu and the admin dashboard root.
  Anchor files: `app/[locale]/products/[handle]/page.tsx`, `components/product/variant-selector.tsx`
- **truck-guide-page** (`c90`, 22 nodes): Truck guide page sections. Size, turn, build, bushings, care and height.
  Anchor files: `app/[locale]/guides/truck-guide/page.tsx`, `components/truck-guide/size.tsx`, `components/truck-guide/turn.tsx`
- **admin-media** (`c38`, 20 nodes): Admin media management. Hero manager, product photo picker, confirm dialog, newly released and shop now managers, results pager and the Shopify image URL helper.
  Anchor files: `components/admin/hero-manager.tsx`, `components/admin/product-photo-picker.tsx`, `lib/shopify/image-url.ts`
- **catalog-hero** (`c52`, 20 nodes): Homepage hero catalog config and its tests.
  Anchor files: `lib/catalog/hero.ts`, `scripts/test-hero.ts`
- **wheel-guide-data** (`c93`, 20 nodes): Content data for the wheel guide.
  Anchor files: `lib/wheel-guide/data.ts`
- **admin-actions** (`c56`, 19 nodes): Admin server actions and the admin auth service.
  Anchor files: `lib/admin/actions.ts`, `lib/admin/auth.ts`
- **admin-auth** (`c102`, 19 nodes): Admin authentication. Login form and page, logout, change password, settings page and the create-admin script.
  Anchor files: `components/admin/login-form.tsx`, `lib/admin/auth.ts`, `scripts/create-admin.ts`
- **site-navbar** (`c121`, 19 nodes): Site navigation. Desktop navbar, mobile menu, search, scroll wrapper and the open cart control.
  Anchor files: `components/layout/navbar/index.tsx`, `components/layout/navbar/mobile-menu.tsx`
- **opengraph-seo** (`c9`, 18 nodes): OpenGraph images and SEO for the Shopify pages catch-all.
  Anchor files: `app/[locale]/opengraph-image.tsx`, `app/[locale]/[page]/page.tsx`
- **sanity-studio** (`c12`, 18 nodes): Sanity Studio and the editorial content schemas.
  Anchor files: `sanity/schemas/index.ts`, `sanity.config.ts`
- **localized-navigation** (`c62`, 18 nodes): Localized link consumers across cart, home, guides and board finder. Lower coherence than the others and the most likely to split in later phases.
  Anchor files: `app/[locale]/cart/page.tsx`, `components/cart/cart-context.tsx`
- **griptape-guide-page** (`c80`, 18 nodes): Griptape guide page sections. Grit, layers, conditions, grades and grain.
  Anchor files: `app/[locale]/guides/griptape-guide/page.tsx`, `components/griptape-guide/grit.tsx`
- **deck-guide-page** (`c91`, 18 nodes): Deck guide page sections. Concave, plies, epoxy, finish and maple.
  Anchor files: `app/[locale]/guides/deck-guide/page.tsx`, `components/deck-guide/concave.tsx`

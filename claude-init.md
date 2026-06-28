# WESKATECO — TEMPLATE PAGES IMPLEMENTATION

## PROJECT CONTEXT

You are working on a Next.js 15.6.0-canary.60 App Router project (forked from Vercel Commerce) for WeSkate Co, a skateboarding brand. The project is a headless Shopify storefront hosted on Vercel.

**Current state**: The engineering foundation is complete — Shopify integration, i18n (English + Hindi), Sanity CMS with 13 schemas, a skateboard configurator, GoKwik checkout, and cart with bundle support. But the user-facing pages are either blank (homepage) or minimal (product pages use Vercel Commerce's default layout, collections only show via search).

**Your task**: Build three template pages that pull real product data from the WeSkate Shopify store and present it in a clean, functional layout. These are **placeholder templates** — the design team is creating the final UI in parallel. Engineers will replace these templates with the designed pages later. The templates should be **well-structured, component-based, and easy to restyle** — not throwaway code.

## TECHNICAL CONSTRAINTS

- **Bare imports** — the project uses `import { x } from "lib/shopify"`, NOT `import { x } from "@/lib/shopify"`. No `@/` alias.
- **Tailwind CSS 4** — utility-first styling. Use neutral, functional colors. No brand colors yet (design team hasn't delivered the palette).
- **i18n** — every user-facing string must use translation keys via `useTranslation()` (client components) or `createTranslator(locale)` (server components). Import from `lib/i18n/TranslationProvider` and `lib/i18n` respectively.
- **Next.js Image** — use `next/image` for all product images. Shopify CDN images are already configured in `next.config.ts`.
- **ISR/Caching** — use the existing `"use cache"` and `cacheTag`/`cacheLife` patterns from `lib/shopify/index.ts` where applicable (follow existing patterns in the codebase).
- **The `params` prop is a Promise** in Next.js 15 — always `await props.params` before accessing `locale`, `handle`, `collection`, etc.
- **`generateStaticParams`** — every dynamic page under `app/[locale]/` must have `export const dynamicParams = true;` and `export async function generateStaticParams() { return []; }` (the locale is handled by the layout's `generateStaticParams`).

## EXISTING SHOPIFY FUNCTIONS

These are already built and working in `lib/shopify/index.ts`. Use them — do NOT create new Shopify functions:

```typescript
// Products
getProduct(handle: string): Promise<Product | undefined>
getProducts({ query, reverse, sortKey }): Promise<Product[]>
getProductRecommendations(productId: string): Promise<Product[]>
getConfiguratorProducts(): Promise<Product[]>

// Collections
getCollection(handle: string): Promise<Collection | undefined>
getCollectionProducts({ collection, reverse, sortKey }): Promise<Product[]>
getCollections(): Promise<Collection[]>

// Cart (already working — don't modify)
getCart, addToCart, removeFromCart, updateCart, createCart

// Other
getMenu(handle: string): Promise<Menu[]>
```

## REAL SHOPIFY COLLECTION HANDLES

These are the actual collection handles in WeSkate's Shopify store (from the live site navigation):

**Main categories:**

- `skateboards` — all skateboard products
- `surfskates` — all surfskate products
- `apparel-1` — all apparel
- `protection-gears` — protective gear

**Skateboard sub-collections:**

- `skateboard-completes` — complete skateboards
- `decks` — skateboard decks only
- `skateboard-trucks` — trucks
- `skateboard-wheels` — wheels
- `skateboard-accessories` — accessories (griptape, hardware, bearings)

**Surfskate sub-collections:**

- `surfskate-completes` — complete surfskates
- `surfskate-decks` — surfskate decks
- `surfskate-trucks` — surfskate trucks
- `surfskate-wheels` — surfskate wheels
- `surfskate-accessories` — surfskate accessories

**Brand collections:**

- `sphere` — Sphere Skateboards
- `wasted-angels` — Wasted Angels
- `toucan` — Toucan Accessories
- `baker-skateboards` — Baker
- `disorder-skateboards` — Disorder
- `girl-skateboards` — Girl
- `macba-life` — MACBA Life
- `mon-amour-nepal` — Mon Amour Nepal

**Apparel:**

- `apparel` — T-Shirts

## TRANSLATION KEYS TO ADD

Add these to `locales/en.json` and `locales/hi.json`. The agent MUST add both English and Hindi versions.

**English (`locales/en.json`)** — add these keys:

```json
"home.hero_title": "India's Home for Skateboards & Surfskates",
"home.hero_subtitle": "Born from busted decks, scraped knees, and the spirit of One Last Try",
"home.shop_skateboards": "Shop Skateboards",
"home.shop_surfskates": "Shop Surfskates",
"home.build_your_setup": "Build Your Setup",
"home.featured_products": "Featured Products",
"home.new_arrivals": "New Arrivals",
"home.shop_by_category": "Shop by Category",
"home.browse_all": "Browse All Products",
"home.skateboards": "Skateboards",
"home.surfskates": "Surfskates",
"home.apparel": "Apparel",
"home.protective_gear": "Protective Gear",
"home.brands_title": "Brands We Carry",
"home.configurator_cta": "Can't decide? Build your perfect setup",
"home.configurator_desc": "Use our configurator to pick compatible parts and build your dream skateboard",

"collection.title": "Collections",
"collection.products_count": "products",
"collection.sort_by": "Sort by",
"collection.filter": "Filter",
"collection.no_products": "No products found in this collection",
"collection.all_products": "All Products",
"collection.price_low_high": "Price: Low to High",
"collection.price_high_low": "Price: High to Low",
"collection.newest": "Newest",
"collection.best_selling": "Best Selling",

"product.add_to_cart": "Add To Cart",
"product.out_of_stock": "Out Of Stock",
"product.select_variant": "Select an option",
"product.description": "Description",
"product.specifications": "Specifications",
"product.related_products": "You Might Also Like",
"product.share": "Share",
"product.quantity": "Quantity",
"product.price": "Price",
"product.brand": "Brand",
"product.availability": "Availability",
"product.in_stock": "In Stock",
"product.sold_out": "Sold Out",
"product.buy_now": "Buy Now",
"product.free_shipping": "Free shipping on orders above ₹2,000",
"product.secure_payment": "100% Secure Payment",
"product.easy_returns": "Easy Returns"
```

**Hindi (`locales/hi.json`)** — add these keys:

```json
"home.hero_title": "भारत का स्केटबोर्ड और सर्फस्केट का घर",
"home.hero_subtitle": "टूटे डेक, छिले घुटने, और 'एक आखिरी कोशिश' की भावना से जन्मा",
"home.shop_skateboards": "स्केटबोर्ड खरीदें",
"home.shop_surfskates": "सर्फस्केट खरीदें",
"home.build_your_setup": "अपना सेटअप बनाएं",
"home.featured_products": "चुनिंदा उत्पाद",
"home.new_arrivals": "नए उत्पाद",
"home.shop_by_category": "श्रेणी के अनुसार खरीदें",
"home.browse_all": "सभी उत्पाद देखें",
"home.skateboards": "स्केटबोर्ड",
"home.surfskates": "सर्फस्केट",
"home.apparel": "कपड़े",
"home.protective_gear": "सुरक्षा गियर",
"home.brands_title": "हमारे ब्रांड्स",
"home.configurator_cta": "फैसला नहीं कर पा रहे? अपना सेटअप बनाएं",
"home.configurator_desc": "हमारे कॉन्फिगरेटर से अनुकूल पार्ट्स चुनें और अपना सपनों का स्केटबोर्ड बनाएं",

"collection.title": "संग्रह",
"collection.products_count": "उत्पाद",
"collection.sort_by": "क्रमबद्ध करें",
"collection.filter": "फ़िल्टर",
"collection.no_products": "इस संग्रह में कोई उत्पाद नहीं मिला",
"collection.all_products": "सभी उत्पाद",
"collection.price_low_high": "कीमत: कम से अधिक",
"collection.price_high_low": "कीमत: अधिक से कम",
"collection.newest": "नवीनतम",
"collection.best_selling": "सबसे ज़्यादा बिकने वाले",

"product.specifications": "विशिष्टताएं",
"product.related_products": "आपको ये भी पसंद आ सकते हैं",
"product.quantity": "मात्रा",
"product.price": "कीमत",
"product.brand": "ब्रांड",
"product.availability": "उपलब्धता",
"product.in_stock": "स्टॉक में",
"product.sold_out": "बिक गया",
"product.buy_now": "अभी खरीदें",
"product.free_shipping": "₹2,000 से ऊपर के ऑर्डर पर मुफ़्त शिपिंग",
"product.secure_payment": "100% सुरक्षित भुगतान",
"product.easy_returns": "आसान रिटर्न"
```

Note: Some keys like `product.add_to_cart`, `product.out_of_stock`, `product.select_variant`, `product.description`, `product.share` may already exist in the locale files. Do NOT duplicate them. Only add keys that don't already exist.

---

## PAGE 1: HOMEPAGE

**File**: `app/[locale]/page.tsx` (REPLACE the existing file)

The homepage should have these sections, top to bottom:

### Section 1: Hero Banner

- Full-width section with a dark background
- Large heading: translation key `home.hero_title`
- Subtitle: translation key `home.hero_subtitle`
- Two CTA buttons: "Shop Skateboards" (links to `/search/skateboard-completes`) and "Shop Surfskates" (links to `/search/surfskate-completes`)
- A third CTA: "Build Your Setup" (links to `/configurator`)
- No hero image needed — use a solid dark gradient background (the design team will add the video/image later)

### Section 2: Shop by Category

- Heading: translation key `home.shop_by_category`
- 4 category cards in a grid (2x2 on mobile, 4 across on desktop):
  - Skateboards → links to `/search/skateboards`
  - Surfskates → links to `/search/surfskates`
  - Apparel → links to `/search/apparel-1`
  - Protective Gear → links to `/search/protection-gears`
- Each card: a colored background block with the category name and a simple icon or emoji. No images needed (design team will provide).

### Section 3: Featured Products

- Heading: translation key `home.featured_products`
- Fetch products from the `skateboard-completes` collection using `getCollectionProducts({ collection: 'skateboard-completes' })`
- Show first 4 products in a grid
- Each product card: image, title, price, link to `/product/{handle}`
- "Browse All" link at the bottom → `/search/skateboard-completes`

### Section 4: New Arrivals

- Heading: translation key `home.new_arrivals`
- Fetch products using `getProducts({ sortKey: 'CREATED_AT', reverse: true })` — get latest products
- Show first 8 products in a scrollable horizontal carousel or a 4-column grid
- Same product card style as Section 3

### Section 5: Configurator CTA

- Full-width banner section
- Heading: translation key `home.configurator_cta`
- Description: translation key `home.configurator_desc`
- CTA button: "Build Your Setup" → `/configurator`
- Styled as a standout section (different background color)

### Section 6: Brands

- Heading: translation key `home.brands_title`
- Grid of brand names (no logos yet — design team will provide):
  - Sphere Skateboards, Toucan Accessories, Baker, Girl, Disorder, MACBA Life, Wasted Angels, Mon Amour Nepal
- Each brand name links to its collection: `/search/{brand-collection-handle}`

### Component structure

Create reusable components so the design team can restyle each section independently:

```
components/home/
  hero-banner.tsx          — Section 1 (server component)
  category-grid.tsx        — Section 2 (server component)
  product-grid-section.tsx — Reusable: Sections 3 & 4 (server component with product cards)
  configurator-cta.tsx     — Section 5 (server component)
  brands-section.tsx       — Section 6 (server component)
```

The homepage `page.tsx` composes these sections. Each section is a standalone component that receives its data via props.

### Data fetching

The homepage is a **server component**. All data fetching happens at the page level:

- `getCollectionProducts({ collection: 'skateboard-completes' })` for featured products
- `getProducts({ sortKey: 'CREATED_AT', reverse: true })` for new arrivals
- Pass results as props to section components

### Product Card Component

Create a shared product card component at `components/product/product-card.tsx` that both the homepage and collection pages use:

```typescript
interface ProductCardProps {
  product: Product;
  locale: string;
}
```

The card shows:

- Product image (using `next/image`)
- Product title
- Price (formatted with currency — use the existing `Price` component from `components/price.tsx` if it exists)
- Link to `/product/{handle}` (locale-aware: for Hindi, prefix with `/hi`)
- "Sold Out" badge if `!availableForSale`

Use the `getLocalizedPath` helper from `lib/i18n` if it exists, or build the path manually: for locale `"en"` use `/product/{handle}`, for other locales use `/{locale}/product/{handle}`.

---

## PAGE 2: COLLECTION / CATEGORY PAGE

**File**: `app/[locale]/search/[collection]/page.tsx` (REPLACE the existing file)

This page already exists but shows a basic layout. Replace it with a proper template.

### Layout

- Collection title at the top (from `getCollection(handle)`)
- Collection description below the title (if available)
- Product count: "{N} products"
- Sort dropdown (Price Low-High, Price High-Low, Newest, Best Selling) — this should use the existing sorting mechanism from Vercel Commerce. Check if `app/[locale]/search/layout.tsx` already has sorting UI. If it does, don't duplicate — just improve the product grid.
- Product grid: 2 columns on mobile, 3 on tablet, 4 on desktop
- Uses the same `ProductCard` component from the homepage

### Data fetching

- `getCollection(params.collection)` for collection metadata
- `getCollectionProducts({ collection: params.collection, sortKey, reverse })` for products
- Read sort params from searchParams

### Empty state

- If collection has no products, show a message using translation key `collection.no_products`

### Important

- Check the existing `app/[locale]/search/[collection]/page.tsx` — it may already have `generateStaticParams`, `generateMetadata`, and some data fetching logic. **Preserve the metadata generation and static params**. Only replace the rendering/UI portion.
- Also check `app/[locale]/search/layout.tsx` — it likely provides the sidebar with collection filters. **Don't break this layout**. Your changes should work within it.

---

## PAGE 3: PRODUCT DETAIL PAGE

**File**: `app/[locale]/product/[handle]/page.tsx` (MODIFY the existing file)

The existing product page already works — it fetches the product, shows images, variant selector, add to cart, and related products. **Don't rebuild it from scratch.** Enhance it with better structure and template sections that can be restyled later.

### Enhancements to add

**1. Trust badges below Add to Cart**
After the existing AddToCart component, add a row of trust badges:

- 🚚 "Free shipping on orders above ₹2,000" (translation key `product.free_shipping`)
- 🔒 "100% Secure Payment" (translation key `product.secure_payment`)
- ↩️ "Easy Returns" (translation key `product.easy_returns`)

**2. Product information tabs/accordion**
Below the main product section, add a tabbed or accordion section:

- **Description** tab — renders `product.description` (already available from Shopify)
- **Specifications** tab — if the product has metafields with specs, show them. Otherwise show "Specifications coming soon."

**3. Improved Related Products section**
The existing `RelatedProducts` component at the bottom of the page works but uses basic styling. Restyle it to use the shared `ProductCard` component for visual consistency with the homepage.

**4. Breadcrumb**
At the top of the page, add a simple breadcrumb:
`Home > {Collection Name} > {Product Title}`
Use the product's first collection (from `product.collections` if available, otherwise skip the collection segment).

### Important

- **Preserve all existing functionality** — the variant selector, AddToCart, gallery, JSON-LD schema, metadata generation. Only add to it, don't replace working code.
- The existing page component props use `params: Promise<{ handle: string }>`. Update to `params: Promise<{ locale: string; handle: string }>` if not already done.

---

## ADDITIONAL: COLLECTIONS INDEX PAGE

**File**: `app/[locale]/search/page.tsx` (MODIFY the existing file)

This is the `/search` page that shows when no collection is selected. Currently it shows all products. Enhance it to also show a **collection grid** at the top before the product list:

- Fetch all collections using `getCollections()`
- Show a grid of collection cards at the top (similar to the category grid on the homepage)
- Each card: collection title, product count (if available), link to `/search/{collection.handle}`
- Below the collection grid, show the existing "All Products" listing

---

## NAVIGATION UPDATE

The header currently shows just "WESKATE CO" and a search bar. It needs navigation links to the main collections. However, the existing Navbar component (`components/layout/navbar/index.tsx`) likely reads from `getMenu()` which pulls from Shopify's menu system.

**Check**: Does the Shopify store have a menu configured? The `getMenu('next-js-frontend-header-menu')` call in the navbar might be returning empty because the menu handle doesn't match what's in Shopify.

If the navbar is empty, add static navigation links as a temporary measure. Create a component:

**File**: `components/layout/navbar/nav-links.tsx`

Static links to:

- Shop (dropdown or mega-menu with: Skateboards, Surfskates, Apparel, Protective Gear)
- Brands
- Configurator (`/configurator`)
- Academy (placeholder — `/academy`)
- Skateparks (placeholder — `/skateparks`)

These use translation keys from the locale files. When the Sanity navigation schema is wired up later, these static links get replaced with dynamic ones.

---

## VERIFICATION

After all changes:

1. **Homepage** (`/`): Shows hero banner, category grid (4 categories), featured products (from skateboard-completes collection), new arrivals (latest products), configurator CTA, and brands section. All with real product data and images from Shopify.

2. **Collection page** (`/search/decks`): Shows collection title "Decks", product count, grid of deck products with images, titles, and prices. Try multiple collections: `/search/skateboard-trucks`, `/search/surfskate-completes`, `/search/apparel`.

3. **Product page** (`/product/{any-handle}`): Shows the existing product layout PLUS trust badges, description section, and improved related products. Variant selection and Add to Cart still work.

4. **Search index** (`/search`): Shows collection cards at the top, then all products below.

5. **Hindi**: Navigate to `/hi/` — all added sections show Hindi text. `/hi/search/decks` works.

6. **Mobile**: All pages are responsive at 375px width.

7. **Cart**: Adding products from any page still works. Configurator still works at `/configurator`.

8. **Navigation**: Header has links to main categories.

9. `pnpm build` passes without errors.

## FILES CREATED

- [x] `components/home/hero-banner.tsx`
- [x] `components/home/category-grid.tsx`
- [x] `components/home/product-grid-section.tsx`
- [x] `components/home/configurator-cta.tsx`
- [x] `components/home/brands-section.tsx`
- [x] `components/product/product-card.tsx`
- [x] `components/layout/navbar/nav-links.tsx`

## FILES MODIFIED

- [x] `app/[locale]/page.tsx` (replace with new homepage)
- [x] `app/[locale]/search/[collection]/page.tsx` (enhance collection page)
- [x] `app/[locale]/search/page.tsx` (add collection grid)
- [x] `app/[locale]/product/[handle]/page.tsx` (add trust badges, tabs, breadcrumb)
- [x] `components/layout/navbar/index.tsx` (add nav links)
- [x] `locales/en.json` (add translation keys)
- [x] `locales/hi.json` (add translation keys)

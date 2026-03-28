# DAY 2 IMPLEMENTATION — SHOPIFY INTEGRATION LAYER EXTENSIONS

## CONTEXT

This is a Next.js 15 App Router project forked from Vercel Commerce (<https://github.com/vercel/commerce>), connected to a Shopify store for WeSkate Co (a skateboarding brand). The existing Shopify integration in `lib/shopify/` already works — products load, cart works, collections work.

We need to extend the existing integration with three additions:

1. Metafield support in product queries (for a skateboard configurator feature)
2. A new configurator-specific product query
3. Cart attribute support for configurator bundles
4. Webhook handler for ISR revalidation

DO NOT replace or rewrite any existing working code. Only extend and add.

---

## TASK 1: Add metafield support to the product fragment

**File**: `lib/shopify/fragments/product.ts` (or wherever the product GraphQL fragment is defined)

**What to do**: Find the existing `productFragment` GraphQL fragment. Add a `metafields` field to it. The metafields query should request specific configurator-related fields by namespace and key.

Add this inside the product fragment, at the same level as other product fields like `title`, `handle`, `images`, etc:

```graphql
metafields(identifiers: [
  { namespace: "configurator", key: "deck_width" }
  { namespace: "configurator", key: "deck_board_type" }
  { namespace: "configurator", key: "truck_type" }
  { namespace: "configurator", key: "truck_hanger_size" }
  { namespace: "configurator", key: "truck_max_wheel_diameter" }
  { namespace: "configurator", key: "truck_sold_as" }
  { namespace: "configurator", key: "truck_compatible_board_types" }
  { namespace: "configurator", key: "wheel_diameter" }
  { namespace: "configurator", key: "wheel_hardness" }
  { namespace: "configurator", key: "wheel_type" }
  { namespace: "configurator", key: "wheel_compatible_board_types" }
  { namespace: "configurator", key: "bearing_type" }
  { namespace: "configurator", key: "hardware_length" }
  { namespace: "configurator", key: "hardware_head_type" }
  { namespace: "configurator", key: "griptape_width" }
  { namespace: "configurator", key: "riser_height" }
  { namespace: "configurator", key: "riser_type" }
]) {
  key
  value
  namespace
  type
}
```

**ALSO**: Update the TypeScript types in `lib/shopify/types.ts` to include metafields on the Product type. Find the existing `Product` type/interface and add:

```typescript
metafields?: {
  key: string;
  value: string;
  namespace: string;
  type: string;
}[];
```

**ALSO**: Find the `reshapeProduct` or similar product reshaping/mapping function in `lib/shopify/index.ts`. If it exists and transforms the raw Shopify GraphQL response into the app's Product type, make sure it passes through the `metafields` array. It might look like:

```typescript
function reshapeProduct(product: ShopifyProduct): Product {
  // ... existing reshaping ...
  // Add: metafields: product.metafields || []
}
```

If there's no reshaping function and the raw GraphQL response is used directly, then just the type update is sufficient.

---

## TASK 2: Create the configurator product query

**File**: `lib/shopify/queries/configurator.ts` (this is a new empty file)

**What to write**: A standalone GraphQL query that fetches ALL products from specific collections with their metafields and variants. This query will be used by the configurator page to prefetch the entire hardgoods catalog in one call.

```typescript
export const getConfiguratorProductsQuery = /* GraphQL */ `
  query getConfiguratorProducts($first: Int = 100) {
    products(first: $first) {
      edges {
        node {
          id
          title
          handle
          productType
          availableForSale
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }
          featuredImage {
            url
            altText
            width
            height
          }
          images(first: 5) {
            edges {
              node {
                url
                altText
                width
                height
              }
            }
          }
          variants(first: 20) {
            edges {
              node {
                id
                title
                availableForSale
                price {
                  amount
                  currencyCode
                }
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
          metafields(identifiers: [
            { namespace: "configurator", key: "deck_width" }
            { namespace: "configurator", key: "deck_board_type" }
            { namespace: "configurator", key: "truck_type" }
            { namespace: "configurator", key: "truck_hanger_size" }
            { namespace: "configurator", key: "truck_max_wheel_diameter" }
            { namespace: "configurator", key: "truck_sold_as" }
            { namespace: "configurator", key: "truck_compatible_board_types" }
            { namespace: "configurator", key: "wheel_diameter" }
            { namespace: "configurator", key: "wheel_hardness" }
            { namespace: "configurator", key: "wheel_type" }
            { namespace: "configurator", key: "wheel_compatible_board_types" }
            { namespace: "configurator", key: "bearing_type" }
            { namespace: "configurator", key: "hardware_length" }
            { namespace: "configurator", key: "hardware_head_type" }
            { namespace: "configurator", key: "griptape_width" }
            { namespace: "configurator", key: "riser_height" }
            { namespace: "configurator", key: "riser_type" }
          ]) {
            key
            value
            namespace
            type
          }
          collections(first: 5) {
            edges {
              node {
                handle
                title
              }
            }
          }
        }
      }
    }
  }
`;
```

**ALSO**: In `lib/shopify/index.ts`, add a new exported function that uses this query:

```typescript
export async function getConfiguratorProducts(): Promise<Product[]> {
  const res = await shopifyFetch<{ products: ShopifyProductsOperation }>({
    query: getConfiguratorProductsQuery,
  });

  return reshapeProducts(removeEdgesAndNodes(res.body.data.products));
}
```

Adapt this to match the existing patterns in the file. Look at how `getProducts()` is implemented and follow the same pattern for error handling, caching tags, and response transformation. Import `getConfiguratorProductsQuery` from the new query file.

---

## TASK 3: Extend the addToCart function to support line item attributes

The configurator needs to add items to the cart with custom attributes (to group them as a "bundle" in the cart UI). The existing `addToCart` function in `lib/shopify/index.ts` needs to accept optional attributes per line item.

**File**: `lib/shopify/index.ts`

**What to do**: Find the existing `addToCart` function. It currently accepts an array of `{ merchandiseId: string; quantity: number }`. Extend the type to also accept optional `attributes`:

```typescript
// Find the existing type for cart line items and extend it:
type CartLineInput = {
  merchandiseId: string;
  quantity: number;
  attributes?: { key: string; value: string }[];
};
```

Then find the GraphQL mutation for `cartLinesAdd` (likely in `lib/shopify/mutations/cart.ts` or similar). The mutation should already include the `lines` variable. Make sure the mutation's `CartLineInput` includes `attributes`:

Look at the existing `cartLinesAdd` mutation. If it doesn't already include `attributes` in the lines input, the GraphQL mutation needs to be updated. The Shopify Storefront API CartLineInput type supports `attributes` natively — we just need to pass it through. The mutation should look something like:

```graphql
mutation addToCart($cartId: ID!, $lines: [CartLineInput!]!) {
  cartLinesAdd(cartId: $cartId, lines: $lines) {
    cart {
      ...cart
    }
  }
}
```

The `CartLineInput` in Shopify's schema already accepts `attributes: [AttributeInput!]` where `AttributeInput` is `{ key: String!, value: String! }`. So the mutation itself probably doesn't need changing — we just need to make sure our TypeScript types and the function signature allow passing attributes through.

**ALSO**: In `components/cart/actions.ts`, add a new server action for adding configurator builds to cart:

```typescript
export async function addConfiguratorBundle(
  prevState: any,
  items: { merchandiseId: string; quantity: number; attributes?: { key: string; value: string }[] }[]
) {
  if (!items || items.length === 0) {
    return "No items to add";
  }

  try {
    // Generate a unique bundle ID to group these items in the cart
    const bundleId = `bundle_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    // Add bundle attributes to each item
    const linesWithBundleAttributes = items.map((item) => ({
      ...item,
      attributes: [
        ...(item.attributes || []),
        { key: "_configurator_bundle", value: "true" },
        { key: "_bundle_id", value: bundleId },
      ],
    }));

    await addToCart(linesWithBundleAttributes);
    updateTag(TAGS.cart);
  } catch (e) {
    console.error("Error adding configurator bundle to cart:", e);
    return "Error adding configurator bundle to cart";
  }
}
```

Make sure the imports at the top of `actions.ts` include `updateTag` from `next/cache` (it's currently imported as `updateTag` — verify this is correct for the Next.js version being used; it might be `revalidateTag` instead).

**IMPORTANT**: Check whether the existing code uses `updateTag` or `revalidateTag`. In Next.js 15, the correct function is `revalidateTag` from `next/cache`. The existing `actions.ts` has `import { updateTag } from "next/cache"` — if this is working in the current build, keep it. If it's actually supposed to be `revalidateTag`, fix all occurrences.

---

## TASK 4: Create the webhook handler for ISR revalidation

**File**: `app/[locale]/api/webhooks/shopify/route.ts` (currently empty)

**WAIT**: This file path is wrong. API routes in Next.js App Router should NOT be inside the `[locale]` directory — they don't need locale routing. The correct path is `app/api/webhooks/shopify/route.ts`. Move the route.ts file (or create it) at this path instead.

**What to write**:

```typescript
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// Shopify sends webhooks as POST requests with an HMAC signature
export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = await headers();
  const topic = headersList.get("x-shopify-topic") || "";
  const hmac = headersList.get("x-shopify-hmac-sha256") || "";

  // Verify the webhook signature
  const secret = process.env.SHOPIFY_REVALIDATION_SECRET;

  if (!secret) {
    console.error("SHOPIFY_REVALIDATION_SECRET is not set");
    return NextResponse.json({ message: "Not configured" }, { status: 500 });
  }

  // HMAC verification using Web Crypto API (Edge-compatible)
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(body));
  const computedHmac = Buffer.from(signature).toString("base64");

  if (computedHmac !== hmac) {
    console.error("Invalid webhook signature");
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Revalidate based on the webhook topic
  switch (topic) {
    case "products/create":
    case "products/update":
    case "products/delete":
      revalidateTag("products");
      revalidateTag("collection"); // Product changes can affect collections
      break;
    case "collections/create":
    case "collections/update":
    case "collections/delete":
      revalidateTag("collection");
      break;
    default:
      console.log(`Unhandled webhook topic: ${topic}`);
      return NextResponse.json({ message: "Unhandled topic" }, { status: 200 });
  }

  return NextResponse.json({
    message: "Revalidated",
    topic,
    now: Date.now(),
  });
}
```

**IMPORTANT**: Check what revalidation tags are used in the existing codebase. Look in `lib/constants.ts` for a `TAGS` object — it likely has values like `TAGS.products`, `TAGS.collections`, `TAGS.cart`. Use those exact tag strings in the webhook handler instead of hardcoded strings. For example, if `TAGS.products === 'products'`, use `revalidateTag(TAGS.products)`.

---

## VERIFICATION

After making all changes:

1. Run `pnpm build` — it should compile without errors
2. Run `pnpm dev` — the store should load with products as before
3. Test cart: add an item, change quantity, remove it — should work exactly as before
4. Check the browser console / network tab: the product GraphQL queries should now include `metafields` in the response (they'll be null/empty until metafields are populated, but the field should be present)
5. The `/api/webhooks/shopify` route should be accessible (test with a curl POST — it will return 401 because the HMAC won't match, which is correct)

## FILES MODIFIED

List every file you created or modified when done.

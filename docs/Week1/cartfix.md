# Cart Synchronization Fix

**Task**: Fix cart state synchronization issues by reverting two changes that broke the Vercel Commerce cache invalidation chain.

**Context**: This is a Next.js 15 App Router project forked from Vercel Commerce, using Next.js canary version 15.6.0-canary.60. The project uses experimental Next.js cache features (`"use cache"`, `cacheTag`, `cacheLife`, `updateTag`) that work as a cohesive system. A previous change replaced `updateTag` with `revalidateTag` and removed the `"use cache"` directive from `getCart()`, which broke the cart state synchronization. Mutations succeed on the server but the client-side optimistic state doesn't sync — items only appear after page refresh, quantity changes revert after a second, and deletions reappear.

**Root Cause**: `updateTag` (canary-specific) invalidates `"use cache"` tagged functions. `revalidateTag` (stable API) invalidates `fetch`-level caching. They are NOT interchangeable. By switching to `revalidateTag`, the `"use cache: private"` tagged `getCart()` function never gets invalidated after cart mutations, so the layout re-renders with stale cart data that overwrites the optimistic state.

**What to do**:

## Change 1: Revert `getCart()` in `lib/shopify/index.ts`

Find the current `getCart` function and replace it with the original version that includes the experimental cache directives:

```typescript
export async function getCart(): Promise<Cart | undefined> {
  "use cache: private";
  cacheTag(TAGS.cart);
  cacheLife("seconds");

  const cartId = (await cookies()).get("cartId")?.value;

  if (!cartId) {
    return undefined;
  }

  const res = await shopifyFetch<ShopifyCartOperation>({
    query: getCartQuery,
    variables: { cartId },
  });

  if (!res.body.data.cart) {
    return undefined;
  }

  return reshapeCart(res.body.data.cart);
}
```

Make sure the following imports exist at the top of `lib/shopify/index.ts`:

```typescript
import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
} from "next/cache";
```

## Change 2: Revert `revalidateTag` back to `updateTag` in `components/cart/actions.ts`

Change the import from:

```typescript
import { revalidateTag } from "next/cache";
```

to:

```typescript
import { updateTag } from "next/cache";
```

Then find and replace every occurrence of `revalidateTag(` with `updateTag(` in this file. This includes all calls like:

- `revalidateTag(TAGS.cart)` → `updateTag(TAGS.cart)`

There should be approximately 4-5 occurrences in the file (inside `addItem`, `removeItem`, `updateItemQuantity`, and `addConfiguratorBundle`).

## Change 3: Verify — do NOT change these

- `lib/constants.ts` should keep `SHOPIFY_GRAPHQL_API_ENDPOINT = "/api/2025-01/graphql.json"` — this was a correct update, do not revert it.
- The webhook handler at `app/api/webhooks/shopify/route.ts` correctly uses `revalidateTag` from `next/cache` — this is fine because it's a Route Handler, not a `"use cache"` context. Do not change it.
- The `addConfiguratorBundle` function added to `actions.ts` should also use `updateTag(TAGS.cart)`, not `revalidateTag`. Make sure it was updated along with the other functions.

## Verification

1. Run `pnpm build` — should compile without errors
2. Run `pnpm dev`
3. Test the following cart operations:
   - Navigate to a product page and click "Add to Cart" — the cart icon in the header should update immediately without a page refresh
   - Open the cart drawer — the item should be visible
   - Click the + button to increase quantity — it should stay at the new quantity without reverting
   - Click the - button to decrease quantity — it should stay at the new quantity without reverting
   - Delete an item — it should disappear and stay gone
   - Navigate to a different product, add it to cart — the "Add to Cart" button should remain enabled and the item should appear in the cart alongside the first item
4. If all cart operations work correctly without needing a page refresh, the fix is successful

## Files to modify

- `lib/shopify/index.ts` — revert `getCart()` function
- `components/cart/actions.ts` — revert `revalidateTag` to `updateTag`

List every change made when done.

---

# DAY 8 IMPLEMENTATION — CONFIGURATOR EDGE CASES + CART BUNDLE DISPLAY

## CONTEXT

This is a Next.js 15.6.0-canary.60 App Router project for WeSkate Co. The skateboard configurator wizard (built on Day 7) is functional — users can walk through the full Skateboard flow, select components, and add them to cart. Today we fix edge cases and add visual bundle grouping in the cart.

The project uses bare imports (no `@/` alias). Translation keys via `useTranslation()` from `lib/i18n/TranslationProvider`.

The cart modal is at `components/cart/modal.tsx`. Cart items are rendered as a flat `<ul>` sorted alphabetically by product title. When a configurator build is added to cart, the `addConfiguratorBundle` action in `components/cart/actions.ts` attaches two attributes to each line item:

- `{ key: "_configurator_bundle", value: "true" }`
- `{ key: "_bundle_id", value: "bundle_<timestamp>_<random>" }`

However, these attributes are NOT currently accessible in the cart display. The Shopify Cart API returns line item attributes, but the existing cart query and types may not include them. We need to check and fix this.

---

## TASK 1: Ensure cart line attributes are returned from Shopify

**Check file**: `lib/shopify/queries/cart.ts`

Find the cart GraphQL query (`getCartQuery`). Look at the `lines` fragment. It likely returns fields like `id`, `quantity`, `cost`, `merchandise`. Check if it includes `attributes`. If NOT, add it:

```graphql
lines(first: 100) {
  edges {
    node {
      id
      quantity
      attributes {
        key
        value
      }
      cost {
        totalAmount {
          amount
          currencyCode
        }
      }
      merchandise {
        ... on ProductVariant {
          id
          title
          selectedOptions {
            name
            value
          }
          product {
            id
            handle
            title
            featuredImage {
              url
              altText
              width
              height
            }
          }
        }
      }
    }
  }
}
```

The key addition is the `attributes { key value }` block inside the line node.

**Check file**: `lib/shopify/types.ts`

Find the `CartItem` type (or whatever type represents a cart line item). Add `attributes` if missing:

```typescript
attributes?: {
  key: string;
  value: string;
}[];
```

**Check file**: `lib/shopify/index.ts`

If the `reshapeCart` function transforms cart lines, ensure it passes through the `attributes` array. It likely already does since it uses spread operators, but verify.

---

## TASK 2: Modify the cart modal to display configurator bundles

**Modify file**: `components/cart/modal.tsx`

The current cart renders all items in a flat list. We need to:

1. Detect items that belong to a configurator bundle (have `_configurator_bundle: "true"` attribute)
2. Group items with the same `_bundle_id` value
3. Render bundles with a visual wrapper and header
4. Non-bundle items render as before

Replace the cart items rendering section. Find the `<ul>` that maps over `cart.lines` and replace the entire list rendering logic.

**Current code** (the section to replace — find the `<ul>` element inside the cart modal):

```typescript
<ul className="grow overflow-auto py-4">
  {cart.lines
    .sort((a, b) =>
      a.merchandise.product.title.localeCompare(
        b.merchandise.product.title,
      ),
    )
    .map((item, i) => {
      // ... existing item rendering ...
    })}
</ul>
```

**Replace with:**

```typescript
<ul className="grow overflow-auto py-4">
  {(() => {
    // Separate bundle items from regular items
    const bundleItems: Record<string, typeof cart.lines> = {};
    const regularItems: typeof cart.lines = [];

    for (const item of cart.lines) {
      const bundleAttr = item.attributes?.find(
        (attr) => attr.key === "_configurator_bundle" && attr.value === "true"
      );
      const bundleIdAttr = item.attributes?.find(
        (attr) => attr.key === "_bundle_id"
      );

      if (bundleAttr && bundleIdAttr) {
        const bundleId = bundleIdAttr.value;
        if (!bundleItems[bundleId]) {
          bundleItems[bundleId] = [];
        }
        bundleItems[bundleId]!.push(item);
      } else {
        regularItems.push(item);
      }
    }

    const bundles = Object.entries(bundleItems);

    return (
      <>
        {/* Configurator Bundles */}
        {bundles.map(([bundleId, items]) => {
          const bundleTotal = items.reduce(
            (sum, item) => sum + Number(item.cost.totalAmount.amount),
            0
          );
          const currencyCode =
            items[0]?.cost.totalAmount.currencyCode || "INR";

          return (
            <li
              key={bundleId}
              className="mb-4 rounded-lg border-2 border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/30"
            >
              {/* Bundle header */}
              <div className="flex items-center justify-between border-b border-blue-200 px-3 py-2 dark:border-blue-800">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                    🛹 Custom Setup
                  </span>
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                    {items.length} items
                  </span>
                </div>
                <span className="text-sm font-bold text-blue-700 dark:text-blue-300">
                  {currencyCode === "INR" ? "₹" : "$"}
                  {bundleTotal.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>

              {/* Bundle items */}
              <ul className="divide-y divide-blue-100 dark:divide-blue-900">
                {items.map((item, i) => {
                  const merchandiseSearchParams =
                    {} as MerchandiseSearchParams;

                  item.merchandise.selectedOptions.forEach(
                    ({ name, value }) => {
                      if (value !== DEFAULT_OPTION) {
                        merchandiseSearchParams[name.toLowerCase()] =
                          value;
                      }
                    }
                  );

                  const merchandiseUrl = createUrl(
                    `/product/${item.merchandise.product.handle}`,
                    new URLSearchParams(merchandiseSearchParams)
                  );

                  return (
                    <li
                      key={i}
                      className="relative flex w-full flex-row justify-between px-3 py-3"
                    >
                      <div className="absolute z-40 -ml-1 -mt-1">
                        <DeleteItemButton
                          item={item}
                          optimisticUpdate={updateCartItem}
                        />
                      </div>
                      <div className="flex flex-row">
                        <div className="relative h-12 w-12 overflow-hidden rounded-md border border-neutral-300 bg-neutral-300 dark:border-neutral-700 dark:bg-neutral-900">
                          <Image
                            className="h-full w-full object-cover"
                            width={48}
                            height={48}
                            alt={
                              item.merchandise.product.featuredImage
                                ?.altText ||
                              item.merchandise.product.title
                            }
                            src={
                              item.merchandise.product.featuredImage
                                ?.url || ""
                            }
                          />
                        </div>
                        <Link
                          href={merchandiseUrl}
                          onClick={closeCart}
                          className="z-30 ml-2 flex flex-row space-x-4"
                        >
                          <div className="flex flex-1 flex-col text-sm">
                            <span className="leading-tight">
                              {item.merchandise.product.title}
                            </span>
                            {item.merchandise.title !==
                            DEFAULT_OPTION ? (
                              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                {item.merchandise.title}
                              </p>
                            ) : null}
                          </div>
                        </Link>
                      </div>
                      <div className="flex h-12 flex-col justify-between">
                        <Price
                          className="flex justify-end text-right text-xs"
                          amount={item.cost.totalAmount.amount}
                          currencyCode={
                            item.cost.totalAmount.currencyCode
                          }
                        />
                        <div className="ml-auto flex h-8 flex-row items-center rounded-full border border-neutral-200 dark:border-neutral-700">
                          <EditItemQuantityButton
                            item={item}
                            type="minus"
                            optimisticUpdate={updateCartItem}
                          />
                          <p className="w-5 text-center">
                            <span className="w-full text-xs">
                              {item.quantity}
                            </span>
                          </p>
                          <EditItemQuantityButton
                            item={item}
                            type="plus"
                            optimisticUpdate={updateCartItem}
                          />
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </li>
          );
        })}

        {/* Regular (non-bundle) items */}
        {regularItems
          .sort((a, b) =>
            a.merchandise.product.title.localeCompare(
              b.merchandise.product.title
            )
          )
          .map((item, i) => {
            const merchandiseSearchParams =
              {} as MerchandiseSearchParams;

            item.merchandise.selectedOptions.forEach(
              ({ name, value }) => {
                if (value !== DEFAULT_OPTION) {
                  merchandiseSearchParams[name.toLowerCase()] = value;
                }
              }
            );

            const merchandiseUrl = createUrl(
              `/product/${item.merchandise.product.handle}`,
              new URLSearchParams(merchandiseSearchParams)
            );

            return (
              <li
                key={i}
                className="flex w-full flex-col border-b border-neutral-300 dark:border-neutral-700"
              >
                <div className="relative flex w-full flex-row justify-between px-1 py-4">
                  <div className="absolute z-40 -ml-1 -mt-2">
                    <DeleteItemButton
                      item={item}
                      optimisticUpdate={updateCartItem}
                    />
                  </div>
                  <div className="flex flex-row">
                    <div className="relative h-16 w-16 overflow-hidden rounded-md border border-neutral-300 bg-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800">
                      <Image
                        className="h-full w-full object-cover"
                        width={64}
                        height={64}
                        alt={
                          item.merchandise.product.featuredImage
                            ?.altText ||
                          item.merchandise.product.title
                        }
                        src={
                          item.merchandise.product.featuredImage
                            ?.url || ""
                        }
                      />
                    </div>
                    <Link
                      href={merchandiseUrl}
                      onClick={closeCart}
                      className="z-30 ml-2 flex flex-row space-x-4"
                    >
                      <div className="flex flex-1 flex-col text-base">
                        <span className="leading-tight">
                          {item.merchandise.product.title}
                        </span>
                        {item.merchandise.title !== DEFAULT_OPTION ? (
                          <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            {item.merchandise.title}
                          </p>
                        ) : null}
                      </div>
                    </Link>
                  </div>
                  <div className="flex h-16 flex-col justify-between">
                    <Price
                      className="flex justify-end space-y-2 text-right text-sm"
                      amount={item.cost.totalAmount.amount}
                      currencyCode={
                        item.cost.totalAmount.currencyCode
                      }
                    />
                    <div className="ml-auto flex h-9 flex-row items-center rounded-full border border-neutral-200 dark:border-neutral-700">
                      <EditItemQuantityButton
                        item={item}
                        type="minus"
                        optimisticUpdate={updateCartItem}
                      />
                      <p className="w-6 text-center">
                        <span className="w-full text-sm">
                          {item.quantity}
                        </span>
                      </p>
                      <EditItemQuantityButton
                        item={item}
                        type="plus"
                        optimisticUpdate={updateCartItem}
                      />
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
      </>
    );
  })()}
</ul>
```

**IMPORTANT**: The `item.attributes` field will only work if Task 1 is completed — the cart query must include `attributes` and the `CartItem` type must have it. Make sure Task 1 is done before testing Task 2.

Also note: `item.merchandise.product.featuredImage` may be `null` for some products. The current code accesses `.altText` and `.url` directly without null checks. The replacement code above uses optional chaining (`?.`) and fallbacks (`|| ""`). Apply the same safety to the regular items section.

---

## TASK 3: Add translation keys for cart bundles

**Modify file**: `locales/en.json`

Add:

```json
"cart.custom_setup": "Custom Setup",
"cart.bundle_items": "items",
"cart.remove_bundle": "Remove entire setup"
```

**Modify file**: `locales/hi.json`

Add:

```json
"cart.custom_setup": "कस्टम सेटअप",
"cart.bundle_items": "आइटम",
"cart.remove_bundle": "पूरा सेटअप हटाएं"
```

---

## TASK 4: Handle cart context type for attributes

**Check file**: `components/cart/cart-context.tsx`

The `CartItem` type used in the cart context must also include `attributes`. Find where the cart item type is defined or imported. If the `CartItem` type comes from `lib/shopify/types.ts`, and you've already added `attributes` there in Task 1, this should be covered.

However, the `createOrUpdateCartItem` function in `cart-context.tsx` creates cart items for optimistic updates. These locally-created items won't have `attributes` from Shopify. This is fine — when the server re-fetches the cart, the real attributes will be present. But make sure the code doesn't crash when `attributes` is `undefined` on optimistically-created items.

Verify that all code accessing `item.attributes` uses optional chaining: `item.attributes?.find(...)` — never `item.attributes.find(...)`.

---

## VERIFICATION — MANUAL UI TESTING

### Test 1: Configurator bundle in cart

1. Navigate to `/configurator`
2. Build a complete Skateboard setup (deck → trucks → wheels → bearings → griptape → review)
3. Click "Add Complete Setup to Cart"
4. Open the cart drawer
5. **Expected**: Items should be grouped inside a blue-bordered box with a "🛹 Custom Setup" header showing the item count and bundle total. Each item inside the box shows its image, name, variant, price, and quantity controls.

### Test 2: Mixed cart (bundle + regular items)

1. With the configurator bundle already in cart, navigate to `/search`
2. Find a product (e.g., a t-shirt or protection gear) and add it to cart
3. Open the cart drawer
4. **Expected**: The configurator bundle appears grouped at the top. The regular item appears below as a standard cart line item.

### Test 3: Multiple bundles

1. Go to `/configurator` again
2. Build a different setup (different deck width, different wheels)
3. Add to cart
4. Open cart drawer
5. **Expected**: Two separate bundle groups, each with their own "Custom Setup" header and items

### Test 4: Delete individual bundle item

1. Inside a bundle group, click the delete button (X) on one item
2. **Expected**: That item is removed. The remaining items stay in the bundle group. The bundle total updates.

### Test 5: Quantity adjustment in bundle

1. Inside a bundle group, click + or - on an item
2. **Expected**: Quantity updates correctly. The bundle total updates.

### Test 6: Regular cart still works

1. Clear the cart entirely
2. Add a regular product (not from configurator)
3. Open cart drawer
4. **Expected**: Regular item displays as before — no bundle wrapper, normal styling

### Test 7: Empty cart

1. Remove all items
2. **Expected**: "Your cart is empty." message with shopping cart icon

### Test 8: Checkout button still works

1. Add items to cart (bundle or regular)
2. Click "Proceed to Checkout"
3. **Expected**: Redirects to Shopify checkout (GoKwik integration is Day 9 — for now the redirect is expected behavior)

### FILES MODIFIED

- `lib/shopify/queries/cart.ts` (add `attributes` to line items query)
- `lib/shopify/types.ts` (add `attributes` to CartItem type)
- `components/cart/modal.tsx` (bundle grouping logic and display)
- `locales/en.json` (bundle translation keys)
- `locales/hi.json` (bundle translation keys)

### FILES POTENTIALLY MODIFIED

- `lib/shopify/index.ts` (if reshapeCart needs to pass through attributes)
- `components/cart/cart-context.tsx` (if CartItem type needs updating)

List every file created and modified when done.

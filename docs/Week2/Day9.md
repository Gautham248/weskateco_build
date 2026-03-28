Here's the prompt:

---

**Task**: Revert all Day 9 (GoKwik checkout integration) changes, restoring the codebase to the Day 8 state. Do NOT touch any files that were created or modified before Day 9.

**What to do**:

### DELETE these files (created on Day 9)

- `lib/gokwik/types.d.ts`
- `lib/gokwik/gokwik-script.tsx`
- `lib/gokwik/use-gokwik-checkout.ts`
- `lib/gokwik/index.ts`

Delete the entire `lib/gokwik/` directory if it's now empty.

### REVERT `app/[locale]/layout.tsx`

Remove the GoKwik import line:

```typescript
import { GoKwikScript } from "lib/gokwik";
```

Remove the `<GoKwikScript />` component from inside the `<body>` tag. Leave everything else in the layout exactly as it is — do not touch CartProvider, TranslationProvider, Navbar, or any other part of the layout.

### REVERT `components/cart/modal.tsx`

Find the GoKwik checkout section that replaced the original checkout form. It currently has a conditional rendering with `useFallback`, `triggerCheckout`, `gokwikReady`, etc.

Replace the entire GoKwik checkout block with the original Shopify checkout form:

```typescript
<form action={redirectToCheckout}>
  <CheckoutButton />
</form>
```

Remove the GoKwik hook call inside the `CartModal` component. It looks something like:

```typescript
const { isReady: gokwikReady, isError: gokwikError, isCheckingOut, triggerCheckout, useFallback } = useGoKwikCheckout({
  cartId: cart?.id,
});
```

Delete this line.

Remove the GoKwik import at the top:

```typescript
import { useGoKwikCheckout } from "lib/gokwik";
```

Leave everything else in `modal.tsx` exactly as it is — the bundle grouping logic from Day 8 must remain intact.

### REVERT `locales/en.json`

Remove these keys (and only these keys):

```json
"cart.processing": "Processing...",
"cart.loading_checkout": "Loading checkout...",
"cart.proceed_to_checkout": "Proceed to Checkout",
"cart.checkout_fallback": "Checkout (alternative)"
```

Do NOT remove any other keys — especially not the Day 8 bundle keys (`cart.custom_setup`, `cart.bundle_items`, `cart.remove_bundle`).

### REVERT `locales/hi.json`

Remove these keys (and only these keys):

```json
"cart.processing": "प्रोसेसिंग...",
"cart.loading_checkout": "चेकआउट लोड हो रहा है...",
"cart.proceed_to_checkout": "चेकआउट करें",
"cart.checkout_fallback": "चेकआउट (वैकल्पिक)"
```

### VERIFICATION

1. Run `pnpm build` — should compile without errors
2. Run `pnpm dev`
3. Add an item to cart, open cart drawer — checkout button should show "Proceed to Checkout" (the original Shopify redirect button)
4. Click checkout — should redirect to Shopify's hosted checkout (not GoKwik popup)
5. Navigate to `/configurator` — configurator should still work end-to-end
6. Cart bundle display should still show grouped "Custom Setup" cards
7. No references to `gokwik` should exist anywhere in the codebase. Verify with: `grep -r "gokwik" --include="*.ts" --include="*.tsx" --include="*.json" lib/ components/ app/ locales/` — should return zero results
8. The `lib/gokwik/` directory should not exist

### FILES DELETED

- `lib/gokwik/types.d.ts`
- `lib/gokwik/gokwik-script.tsx`
- `lib/gokwik/use-gokwik-checkout.ts`
- `lib/gokwik/index.ts`

### FILES MODIFIED (reverted)

- `app/[locale]/layout.tsx`
- `components/cart/modal.tsx`
- `locales/en.json`
- `locales/hi.json`

List every file deleted and modified when done.

---

After this runs and passes verification, commit everything (Day 8 + clean revert of Day 9) immediately:

```bash
git add .
git commit -m "feat: day 8 — cart bundle display, configurator edge cases"
```

Then we redo Day 9 from a clean state.

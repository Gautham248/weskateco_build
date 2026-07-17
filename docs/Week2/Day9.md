# DAY 9 IMPLEMENTATION — GOKWIK CHECKOUT INTEGRATION

## CONTEXT

This is a Next.js 15.6.0-canary.60 App Router project for WeSkate Co. We are replacing Shopify's hosted checkout with GoKwik's one-click checkout popup. GoKwik's SDK runs client-side — it loads a script, we pass the Shopify cart ID, and GoKwik handles everything (OTP login, address, payment) in a popup overlay on our site.

The project uses bare imports (no `@/` alias). Translation keys via `useTranslation()` from `lib/i18n/TranslationProvider`.

## GOKWIK INTEGRATION DETAILS

**Integration type**: Scenario 2 — custom storefront with Shopify backend.

**How it works**:

1. Load GoKwik's merchant integration script on every page
2. Configure `window.merchantInfo` with merchant credentials
3. When user clicks "Checkout," pass the Shopify cart ID to GoKwik and call `triggerGokwikCustomCheckout()`
4. GoKwik opens a popup overlay — handles login, address, payment
5. Order is created in Shopify by GoKwik
6. User returns to our site

**Cart ID format**: The Shopify Storefront API returns cart IDs in the format `gid://shopify/Cart/<ID>`. This is the exact format GoKwik expects.

**Environment variables** (already set in `.env.local`):

```
NEXT_PUBLIC_GOKWIK_MERCHANT_ID=d3simbhmubfg
NEXT_PUBLIC_GOKWIK_STORE_ID=70281068696
NEXT_PUBLIC_GOKWIK_ENVIRONMENT=sandbox
NEXT_PUBLIC_GOKWIK_FB_PIXEL=
```

---

## FILE 1: Create GoKwik TypeScript declarations

**Create file**: `lib/gokwik/types.d.ts`

```typescript
/**
 * GoKwik SDK global type declarations.
 * The GoKwik merchant integration script adds these to the window object.
 */

interface GoKwikMerchantInfo {
  mid?: string;
  environment?: string;
  type?: string;
  storeId?: number;
  fbPixel?: string;
  cart?: {
    id: string;
  };
}

declare global {
  interface Window {
    merchantInfo?: GoKwikMerchantInfo;
    gokwikSdk?: {
      init: () => void;
      [key: string]: any;
    };
    triggerGokwikCustomCheckout?: () => void;
  }
}

export {};
```

---

## FILE 2: Create GoKwik SDK loader component

**Create file**: `lib/gokwik/gokwik-script.tsx`

```typescript
"use client";

import Script from "next/script";
import { useCallback } from "react";

/**
 * Loads the GoKwik merchant integration SDK and configures merchantInfo.
 * Place this component in the root layout — it loads once and is available on every page.
 */
export function GoKwikScript() {
  const handleLoad = useCallback(() => {
    if (typeof window === "undefined") return;

    window.merchantInfo = {
      mid: process.env.NEXT_PUBLIC_GOKWIK_MERCHANT_ID || "",
      environment: process.env.NEXT_PUBLIC_GOKWIK_ENVIRONMENT || "sandbox",
      type: "merchantInfo",
      storeId: Number(process.env.NEXT_PUBLIC_GOKWIK_STORE_ID) || 0,
      fbPixel: process.env.NEXT_PUBLIC_GOKWIK_FB_PIXEL || "",
    };

    console.log("[GoKwik] SDK loaded, merchantInfo configured:", {
      mid: window.merchantInfo.mid,
      environment: window.merchantInfo.environment,
      storeId: window.merchantInfo.storeId,
    });
  }, []);

  const handleError = useCallback(() => {
    console.error("[GoKwik] Failed to load SDK script");
  }, []);

  return (
    <Script
      src="https://pdp.gokwik.co/merchant-integration/build/merchant.integration.js?v4"
      strategy="afterInteractive"
      onLoad={handleLoad}
      onError={handleError}
    />
  );
}
```

---

## FILE 3: Create GoKwik checkout hook

**Create file**: `lib/gokwik/use-gokwik-checkout.ts`

```typescript
"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface UseGoKwikCheckoutOptions {
  /** Cart ID from Shopify in format gid://shopify/Cart/<ID> */
  cartId: string | undefined;
  /** Timeout in ms before marking SDK as failed. Default: 15000 */
  timeout?: number;
}

interface UseGoKwikCheckoutReturn {
  /** Whether the GoKwik SDK is loaded and ready */
  isReady: boolean;
  /** Whether the SDK failed to load */
  isError: boolean;
  /** Whether checkout is currently in progress */
  isCheckingOut: boolean;
  /** Trigger the GoKwik checkout popup */
  triggerCheckout: () => void;
  /** Fallback: get the Shopify native checkout URL */
  useFallback: boolean;
}

export function useGoKwikCheckout({
  cartId,
  timeout = 15000,
}: UseGoKwikCheckoutOptions): UseGoKwikCheckoutReturn {
  const [isReady, setIsReady] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Check if SDK is already loaded
    if (typeof window !== "undefined" && window.gokwikSdk) {
      setIsReady(true);
      return;
    }

    // Poll for SDK readiness
    checkIntervalRef.current = setInterval(() => {
      if (typeof window !== "undefined" && window.gokwikSdk) {
        setIsReady(true);
        if (checkIntervalRef.current) clearInterval(checkIntervalRef.current);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      }
    }, 500);

    // Timeout — mark as error if SDK doesn't load
    timeoutRef.current = setTimeout(() => {
      if (!isReady) {
        setIsError(true);
        if (checkIntervalRef.current) clearInterval(checkIntervalRef.current);
        console.warn(
          "[GoKwik] SDK did not load within timeout. Fallback available.",
        );
      }
    }, timeout);

    return () => {
      if (checkIntervalRef.current) clearInterval(checkIntervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [timeout, isReady]);

  const triggerCheckout = useCallback(() => {
    if (!cartId) {
      console.error("[GoKwik] No cart ID available");
      return;
    }

    if (!window.merchantInfo) {
      console.error("[GoKwik] merchantInfo not configured");
      return;
    }

    if (typeof window.triggerGokwikCustomCheckout !== "function") {
      console.error("[GoKwik] triggerGokwikCustomCheckout not available");
      return;
    }

    // Set the cart ID on merchantInfo
    window.merchantInfo.cart = { id: cartId };

    console.log("[GoKwik] Triggering checkout with cart:", cartId);
    setIsCheckingOut(true);

    try {
      window.triggerGokwikCustomCheckout();
    } catch (error) {
      console.error("[GoKwik] Error triggering checkout:", error);
      setIsCheckingOut(false);
    }
  }, [cartId]);

  return {
    isReady,
    isError,
    isCheckingOut,
    triggerCheckout,
    useFallback: isError,
  };
}
```

---

## FILE 4: Create GoKwik index export

**Create file**: `lib/gokwik/index.ts`

```typescript
export { GoKwikScript } from "./gokwik-script";
export { useGoKwikCheckout } from "./use-gokwik-checkout";
```

---

## CHANGE 5: Add GoKwikScript to root layout

**Modify file**: `app/[locale]/layout.tsx`

Add the GoKwik script import at the top with the other imports:

```typescript
import { GoKwikScript } from "lib/gokwik";
```

Then add `<GoKwikScript />` inside the `<body>` tag, after the closing `</main>` tag but before the closing `</body>` tag:

```typescript
<body className="...">
  <CartProvider cartPromise={cart}>
    <TranslationProvider locale={params.locale} dictionary={dictionary}>
      <Navbar />
      <main>
        {children}
        <Toaster closeButton />
        <WelcomeToast />
      </main>
    </TranslationProvider>
  </CartProvider>
  <GoKwikScript />
</body>
```

The script loads `afterInteractive` so it won't block page rendering.

---

## CHANGE 6: Replace checkout button in cart modal with GoKwik

**Modify file**: `components/cart/modal.tsx`

This is the key change. The current checkout is a form that calls `redirectToCheckout()` server action, which redirects to Shopify's hosted checkout. We replace this with GoKwik while keeping Shopify as fallback.

**Step 1**: Add imports at the top of the file:

```typescript
import { useGoKwikCheckout } from "lib/gokwik";
```

**Step 2**: Inside the `CartModal` component function, after the existing hooks (`useCart`, `useState`, etc.), add the GoKwik hook:

```typescript
const {
  isReady: gokwikReady,
  isError: gokwikError,
  isCheckingOut,
  triggerCheckout,
  useFallback,
} = useGoKwikCheckout({
  cartId: cart?.id,
});
```

**Step 3**: Find the checkout form at the bottom of the cart modal. It currently looks like:

```typescript
<form action={redirectToCheckout}>
  <CheckoutButton />
</form>
```

Replace it with:

```typescript
{useFallback ? (
  /* Fallback: Shopify native checkout (GoKwik failed to load) */
  <form action={redirectToCheckout}>
    <CheckoutButton />
  </form>
) : (
  /* Primary: GoKwik checkout */
  <button
    onClick={triggerCheckout}
    disabled={!gokwikReady || isCheckingOut || !cart?.id}
    className={`block w-full rounded-full p-3 text-center text-sm font-medium text-white transition-opacity ${
      !gokwikReady || isCheckingOut
        ? "cursor-not-allowed bg-blue-400 opacity-70"
        : "bg-blue-600 opacity-90 hover:opacity-100"
    }`}
  >
    {isCheckingOut
      ? "Processing..."
      : !gokwikReady
        ? "Loading checkout..."
        : "Proceed to Checkout"}
  </button>
)}
```

**Step 4**: The existing `CheckoutButton` component (used for fallback) can stay as-is:

```typescript
function CheckoutButton() {
  const { pending } = useFormStatus();
  return (
    <button
      className="block w-full rounded-full bg-blue-600 p-3 text-center text-sm font-medium text-white opacity-90 hover:opacity-100"
      type="submit"
      disabled={pending}
    >
      {pending ? <LoadingDots className="bg-white" /> : "Proceed to Checkout"}
    </button>
  );
}
```

---

## CHANGE 7: Add translation keys for checkout states

**Modify file**: `locales/en.json`

Add:

```json
"cart.processing": "Processing...",
"cart.loading_checkout": "Loading checkout...",
"cart.proceed_to_checkout": "Proceed to Checkout",
"cart.checkout_fallback": "Checkout (alternative)"
```

**Modify file**: `locales/hi.json`

Add:

```json
"cart.processing": "प्रोसेसिंग...",
"cart.loading_checkout": "चेकआउट लोड हो रहा है...",
"cart.proceed_to_checkout": "चेकआउट करें",
"cart.checkout_fallback": "चेकआउट (वैकल्पिक)"
```

---

## CHANGE 8: Add GoKwik env vars to Vercel (reminder)

This is a manual step, not code. The developer should run:

```bash
vercel env add NEXT_PUBLIC_GOKWIK_MERCHANT_ID
# Value: d3simbhmubfg

vercel env add NEXT_PUBLIC_GOKWIK_STORE_ID
# Value: 70281068696

vercel env add NEXT_PUBLIC_GOKWIK_ENVIRONMENT
# Value: sandbox
```

These are `NEXT_PUBLIC_` prefixed and not sensitive — add to all environments.

---

## VERIFICATION

### Test 1: GoKwik SDK loads

1. Run `pnpm dev`
2. Open any page
3. Open browser DevTools → Console
4. Look for: `[GoKwik] SDK loaded, merchantInfo configured: { mid: "d3simbhmubfg", environment: "sandbox", storeId: 70281068696 }`
5. In console, type `window.merchantInfo` — should show the configured object
6. Type `typeof window.triggerGokwikCustomCheckout` — should return `"function"` (if SDK loaded) or `"undefined"` (if it hasn't loaded yet — refresh and check again)

### Test 2: Checkout button states

1. Add an item to cart
2. Open the cart drawer
3. The checkout button should initially show "Loading checkout..." (while SDK loads)
4. After a moment, it should change to "Proceed to Checkout"
5. If the GoKwik SDK fails to load (unlikely in normal conditions, but possible behind ad blockers), after 15 seconds the button should fall back to the Shopify redirect version

### Test 3: GoKwik checkout trigger

1. With items in cart, click "Proceed to Checkout"
2. **Expected in sandbox**: GoKwik's checkout popup should appear as an overlay on the page. It will show a phone number input for OTP login.
3. The browser console should show: `[GoKwik] Triggering checkout with cart: gid://shopify/Cart/<ID>`
4. **Note**: In sandbox mode, you may not be able to complete a real transaction. That's expected. The test passes if the popup appears.

### Test 4: Fallback behavior

1. To test the fallback, temporarily block the GoKwik script:
   - Open DevTools → Network → filter by "gokwik" → right-click → Block request URL
   - Or temporarily change the script URL in `lib/gokwik/gokwik-script.tsx` to an invalid URL
2. Refresh the page, add items, open cart
3. After 15 seconds, the checkout button should show "Proceed to Checkout" (the Shopify fallback version)
4. Clicking it should redirect to Shopify's hosted checkout page
5. **Revert any test changes after verifying**

### Test 5: No cart edge case

1. Clear all cookies (or open incognito)
2. Navigate to the site — cart should be empty
3. Open cart drawer — "Your cart is empty" message should show
4. No console errors about GoKwik or missing cart ID

### Test 6: Build still passes

1. Run `pnpm build`
2. Should compile without TypeScript errors

### FILES CREATED

- `lib/gokwik/types.d.ts`
- `lib/gokwik/gokwik-script.tsx`
- `lib/gokwik/use-gokwik-checkout.ts`
- `lib/gokwik/index.ts`

### FILES MODIFIED

- `app/[locale]/layout.tsx` (add GoKwikScript)
- `components/cart/modal.tsx` (replace checkout with GoKwik + fallback)
- `locales/en.json` (checkout state translation keys)
- `locales/hi.json` (checkout state translation keys)

List every file created and modified when done.

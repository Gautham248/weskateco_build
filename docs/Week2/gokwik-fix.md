Good news — the GoKwik SDK is actually loading successfully. I can see in your console:

```
[GoKwik] SDK loaded, merchantInfo configured:
{mid: 'd3simbhmubfg', environment: 'sandbox', stored: 70281068696}
```

The error `Uncaught TypeError: Cannot read properties of undefined (reading 'environment')` is coming from **GoKwik's own script** (`merchant.integration.js?v4:1`), not from your code. This happens because GoKwik's SDK tries to read `window.merchantInfo.environment` before your `onLoad` callback sets it — there's a race condition in their script.

The fix is to set `window.merchantInfo` **before** the script loads, not in the `onLoad` callback.

Give this to the agent:

---

**Task**: Fix GoKwik SDK race condition — `window.merchantInfo` must be set before the script loads, not after.

**Context**: GoKwik's merchant integration script reads `window.merchantInfo` immediately on execution, before our `onLoad` callback fires. This causes `Cannot read properties of undefined (reading 'environment')`. The fix is to set `merchantInfo` via an inline script that runs before the GoKwik SDK script loads.

**Modify file**: `lib/gokwik/gokwik-script.tsx`

Replace the entire file contents with:

```typescript
"use client";

import Script from "next/script";

export function GoKwikScript() {
  return (
    <>
      {/* Set merchantInfo BEFORE GoKwik SDK loads — their script reads it immediately on execution */}
      <Script
        id="gokwik-config"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.merchantInfo = {
              mid: "${process.env.NEXT_PUBLIC_GOKWIK_MERCHANT_ID || ""}",
              environment: "${process.env.NEXT_PUBLIC_GOKWIK_ENVIRONMENT || "sandbox"}",
              type: "merchantInfo",
              storeId: ${Number(process.env.NEXT_PUBLIC_GOKWIK_STORE_ID) || 0},
              fbPixel: "${process.env.NEXT_PUBLIC_GOKWIK_FB_PIXEL || ""}"
            };
          `,
        }}
      />
      {/* Load GoKwik SDK after merchantInfo is set */}
      <Script
        id="gokwik-sdk"
        src="https://pdp.gokwik.co/merchant-integration/build/merchant.integration.js?v4"
        strategy="afterInteractive"
        onLoad={() => {
          console.log("[GoKwik] SDK loaded successfully");
        }}
        onError={() => {
          console.error("[GoKwik] Failed to load SDK script");
        }}
      />
    </>
  );
}
```

**Key change**: `window.merchantInfo` is set via an inline `<script>` tag with `strategy="beforeInteractive"`, which runs before any other scripts. The GoKwik SDK loads `afterInteractive` and finds `merchantInfo` already available.

**Note**: `strategy="beforeInteractive"` in Next.js App Router requires the script to be in the root layout. It's already there (`app/[locale]/layout.tsx` includes `<GoKwikScript />`). If Next.js throws a warning about `beforeInteractive` scripts needing to be in a custom `_document`, change the strategy to `"lazyOnload"` for the config script, or simply use a regular `<script>` tag instead of the `Script` component for the config portion:

If `beforeInteractive` causes issues, use this alternative approach instead:

```typescript
"use client";

import Script from "next/script";
import { useEffect } from "react";

export function GoKwikScript() {
  // Set merchantInfo immediately on component mount — before SDK loads
  useEffect(() => {
    window.merchantInfo = {
      mid: process.env.NEXT_PUBLIC_GOKWIK_MERCHANT_ID || "",
      environment: process.env.NEXT_PUBLIC_GOKWIK_ENVIRONMENT || "sandbox",
      type: "merchantInfo",
      storeId: Number(process.env.NEXT_PUBLIC_GOKWIK_STORE_ID) || 0,
      fbPixel: process.env.NEXT_PUBLIC_GOKWIK_FB_PIXEL || "",
    };
    console.log("[GoKwik] merchantInfo pre-configured:", {
      mid: window.merchantInfo.mid,
      environment: window.merchantInfo.environment,
    });
  }, []);

  return (
    <Script
      id="gokwik-sdk"
      src="https://pdp.gokwik.co/merchant-integration/build/merchant.integration.js?v4"
      strategy="lazyOnload"
      onLoad={() => {
        console.log("[GoKwik] SDK loaded successfully");
      }}
      onError={() => {
        console.error("[GoKwik] Failed to load SDK script");
      }}
    />
  );
}
```

The `useEffect` runs before `lazyOnload` fires the script. Try the `dangerouslySetInnerHTML` approach first. If it causes Next.js issues, use the `useEffect` approach.

**Verification**:

1. Run `pnpm dev`
2. Open any page
3. Console should show `[GoKwik] merchantInfo pre-configured` THEN `[GoKwik] SDK loaded successfully`
4. The `Uncaught TypeError: Cannot read properties of undefined (reading 'environment')` error should be gone
5. Type `window.merchantInfo` in console — should show the configured object
6. Add items to cart, click "Proceed to Checkout" — GoKwik popup should appear

**Files modified**: `lib/gokwik/gokwik-script.tsx`

---

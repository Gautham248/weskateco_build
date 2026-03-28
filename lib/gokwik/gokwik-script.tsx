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

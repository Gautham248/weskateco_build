"use client";

import { GA_MEASUREMENT_ID } from "lib/analytics";
import Script from "next/script";
import { useEffect, useState } from "react";
import { isGoKwikCountry } from "./country";
import { GOKWIK_LOADED_EVENT } from "./use-gokwik-checkout";

export function GoKwikScript() {
  // Only load GoKwik's SDK for shoppers in India; decided after mount, where
  // the country cookie can be read
  const [loadSdk, setLoadSdk] = useState(false);
  useEffect(() => {
    setLoadSdk(isGoKwikCountry(document.cookie));
  }, []);

  return (
    <>
      {/* Set merchantInfo BEFORE GoKwik SDK loads — their script reads it immediately on execution */}
      <Script
        id="gokwik-config"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            // GoKwik checkout reads this to send GA4 events (incl. purchase)
            window.gaTag = { ga4: "${GA_MEASUREMENT_ID || ""}" };
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
      {loadSdk && (
        <Script
          id="gokwik-sdk"
          src="https://pdp.gokwik.co/merchant-integration/build/merchant.integration.js?v4"
          strategy="afterInteractive"
          onLoad={() => {
            console.log("[GoKwik] SDK loaded successfully");
            // Lets useGoKwikCheckout mark checkout ready immediately
            window.dispatchEvent(new Event(GOKWIK_LOADED_EVENT));
          }}
          onError={() => {
            console.error("[GoKwik] Failed to load SDK script");
          }}
        />
      )}
    </>
  );
}

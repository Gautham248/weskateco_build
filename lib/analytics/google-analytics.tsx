"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect } from "react";
import {
  GA_MEASUREMENT_ID,
  GOOGLE_ADS_ID,
  GOOGLE_TAG_ID,
  trackPageView,
} from "./events";

/**
 * Loads gtag.js for GA4, Google Ads and the Merchant Center Google tag.
 * Renders nothing when none of their NEXT_PUBLIC_* IDs are set, so local/dev
 * builds don't send data.
 *
 * GA4 page views on client-side navigation come from Enhanced Measurement
 * ("Page changes based on browser history events", on by default), so we
 * don't send them manually — that would double count.
 */
export function GoogleAnalytics() {
  const pathname = usePathname();
  const tagIds = [GA_MEASUREMENT_ID, GOOGLE_ADS_ID, GOOGLE_TAG_ID].filter(
    Boolean,
  );

  useEffect(() => {
    trackPageView();
  }, [pathname]);

  if (tagIds.length === 0) return null;

  return (
    <>
      {/* Define gtag before hydration so events fired on mount are queued, not dropped */}
      <Script
        id="ga-init"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('js', new Date());
            ${tagIds.map((id) => `gtag('config', '${id}');`).join("\n")}
          `,
        }}
      />
      <Script
        id="ga-gtag"
        src={`https://www.googletagmanager.com/gtag/js?id=${tagIds[0]}`}
        strategy="afterInteractive"
      />
    </>
  );
}

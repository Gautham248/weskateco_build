// GoKwik (and Snapmint EMI, which runs through it) is only set up for India.
// Shoppers elsewhere check out with Shopify's own checkout.
export const GOKWIK_COUNTRIES = ["IN"];

// Set by proxy.ts from Vercel's x-vercel-ip-country header; read in the browser
export const COUNTRY_COOKIE = "country";

/**
 * Whether GoKwik checkout applies to a shopper, from a `document.cookie`
 * string. With no country (local development, or no geolocation) it
 * defaults to available, matching the store's main market.
 */
export function isGoKwikCountry(cookieString: string): boolean {
  const match = cookieString.match(
    new RegExp(`(?:^|;\\s*)${COUNTRY_COOKIE}=([^;]*)`),
  );
  const country = match?.[1] ? decodeURIComponent(match[1]).toUpperCase() : "";
  return !country || GOKWIK_COUNTRIES.includes(country);
}

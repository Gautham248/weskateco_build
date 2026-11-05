import { readCookie } from "./cookies";

// GoKwik (and Snapmint EMI, which runs through it) is only set up for India.
// Shoppers elsewhere check out with Shopify's own checkout.
export const GOKWIK_COUNTRIES = ["IN"];

// Set by proxy.ts from Vercel's x-vercel-ip-country header; read in the browser
export const COUNTRY_COOKIE = "country";

/**
 * The country to assume when it's unknown, in development only: there's no
 * Vercel geolocation locally. Set NEXT_PUBLIC_GOKWIK_DEFAULT_COUNTRY=IN in
 * .env.local to work on GoKwik. Production builds ignore it.
 */
function developmentCountry(): string {
  return process.env.NODE_ENV === "production"
    ? ""
    : (process.env.NEXT_PUBLIC_GOKWIK_DEFAULT_COUNTRY ?? "");
}

/**
 * Whether GoKwik checkout applies to a shopper, from a `document.cookie`
 * string. Only shoppers known to be in India get GoKwik. When the country is
 * unknown (Vercel couldn't locate the IP) they get Shopify's checkout, which
 * works from anywhere, while GoKwik's popup opens blank outside India.
 */
export function isGoKwikCountry(cookieString: string): boolean {
  const country = (
    readCookie(cookieString, COUNTRY_COOKIE) || developmentCountry()
  ).toUpperCase();
  return GOKWIK_COUNTRIES.includes(country);
}

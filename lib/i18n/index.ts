import en from "locales/en.json";
import hi from "locales/hi.json";

export const locales = ["en", "hi"] as const;
export const defaultLocale = "en" as const;
export type Locale = (typeof locales)[number];

// Every key must exist in both files. Write Hindi following
// locales/hindi-glossary.md.
const dictionaries: Record<string, Record<string, string>> = { en, hi };

/**
 * Get a translated string by key.
 * Falls back to English if the key is missing in the target locale.
 * Falls back to the key itself if missing in all locales.
 */
export function getTranslation(locale: string, key: string): string {
  return (
    dictionaries[locale]?.[key] || dictionaries[defaultLocale]?.[key] || key
  );
}

/**
 * Create a translator function bound to a specific locale.
 * Use in Server Components:
 *
 *   const t = createTranslator(locale);
 *   return <h1>{t("nav.home")}</h1>;
 */
export function createTranslator(locale: string) {
  return (key: string): string => getTranslation(locale, key);
}

/**
 * Get the full dictionary for a locale.
 * Useful for passing to client-side TranslationProvider.
 */
export function getDictionary(locale: string): Record<string, string> {
  return dictionaries[locale] || dictionaries[defaultLocale]!;
}

/**
 * Get a localized field from a Sanity document.
 * Sanity documents use the pattern: title_en, title_hi
 *
 *   getLocalizedField(doc, "title", "hi") → doc.title_hi || doc.title_en
 */
export function getLocalizedField(
  doc: Record<string, any>,
  field: string,
  locale: string,
): string {
  return (
    doc[`${field}_${locale}`] ||
    doc[`${field}_${defaultLocale}`] ||
    doc[field] ||
    ""
  );
}

/**
 * The Storefront API `LanguageCode` to request for a locale, or undefined for
 * the default locale (Shopify then answers in the store's primary language).
 * Queries take it as `$language: LanguageCode = EN` with `@inContext`, so
 * leaving it out keeps the English behaviour unchanged.
 */
export function getShopifyLanguage(locale?: string): string | undefined {
  if (
    !locale ||
    locale === defaultLocale ||
    !(locales as readonly string[]).includes(locale)
  ) {
    return undefined;
  }
  return locale.toUpperCase();
}

/**
 * Paths that live outside the locale tree, mirroring the exclusions in
 * proxy.ts: Shopify customer accounts, APIs, the admin panel, Sanity Studio
 * and public assets. Prefixing them with a locale would 404.
 */
const UNLOCALIZED_PREFIXES = [
  "/account",
  "/services",
  "/api",
  "/admin",
  "/studio",
  "/_next",
  "/fonts",
  "/hero",
  "/icons",
];

/**
 * An internal href as it should be linked from a `locale` page: English is
 * unchanged, other locales gain their /<locale> prefix. Leaves alone external
 * URLs, hrefs already carrying a locale, and paths outside the locale tree, so
 * it is safe to apply to every link (see components/localized-link.tsx).
 */
export function localizeHref(href: string, locale: string): string {
  if (
    locale === defaultLocale ||
    !href.startsWith("/") ||
    href.startsWith("//")
  ) {
    return href;
  }

  const path = href.split(/[?#]/)[0] || "/";

  if (
    locales.some((l) => path === `/${l}` || path.startsWith(`/${l}/`)) ||
    UNLOCALIZED_PREFIXES.some((p) => path === p || path.startsWith(`${p}/`)) ||
    /\.[a-zA-Z0-9]+$/.test(path)
  ) {
    return href;
  }

  // "/" and "/?q=…" become "/hi" and "/hi?q=…", not "/hi/".
  return path === "/" ? `/${locale}${href.slice(1)}` : `/${locale}${href}`;
}

/**
 * Helper to build locale-aware paths.
 * If locale is "en" (default), returns the path as is.
 * Otherwise, prefixes the path with the locale (e.g., /hi/path).
 */
export function getLocalizedPath(path: string, locale: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  if (locale === "en") {
    return cleanPath;
  }
  // The locale's home page is /hi, not /hi/ (which redirects to /hi)
  return cleanPath === "/" ? `/${locale}` : `/${locale}${cleanPath}`;
}

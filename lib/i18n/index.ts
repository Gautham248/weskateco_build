import en from "locales/en.json";
import hi from "locales/hi.json";

export const locales = ["en", "hi"] as const;
export const defaultLocale = "en" as const;
export type Locale = (typeof locales)[number];

const dictionaries: Record<string, Record<string, string>> = { en, hi };

/**
 * Get a translated string by key.
 * Falls back to English if the key is missing in the target locale.
 * Falls back to the key itself if missing in all locales.
 */
export function getTranslation(locale: string, key: string): string {
  return dictionaries[locale]?.[key] || dictionaries[defaultLocale]?.[key] || key;
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
  locale: string
): string {
  return doc[`${field}_${locale}`] || doc[`${field}_${defaultLocale}`] || doc[field] || "";
}

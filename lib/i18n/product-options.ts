import { defaultLocale } from "lib/i18n";

/**
 * Shopify option names and values (Size, Concave, Mellow…) stay English in the
 * data: the variant selector matches on them, puts them in URLs and adds them
 * to the cart by them, so a translated value would break all three. What the
 * shopper reads is translated here instead, from `option.*` dictionary keys.
 *
 * Text without a key (sizes like 8.25", most codes) is shown as Shopify sends
 * it, and English pages always show Shopify's text unchanged.
 */

/** Dictionary key for an option name or value: "Wheel Size" → "option.wheel_size". */
export function productOptionKey(text: string): string {
  const slug = text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  return `option.${slug}`;
}

/** An option name or value as the shopper should read it in `locale`. */
export function translateProductOption(
  t: (key: string) => string,
  locale: string,
  text: string,
): string {
  if (locale === defaultLocale) return text;
  const key = productOptionKey(text);
  const value = t(key);
  return value && value !== key ? value : text;
}

/** A variant title ("8.25 / Mellow"), translated value by value. */
export function translateVariantTitle(
  t: (key: string) => string,
  locale: string,
  title: string,
): string {
  if (locale === defaultLocale) return title;
  return title
    .split(" / ")
    .map((part) => translateProductOption(t, locale, part))
    .join(" / ");
}

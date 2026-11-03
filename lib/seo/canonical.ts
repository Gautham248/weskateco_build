import { getLocalizedPath } from "lib/i18n";
import type { Metadata } from "next";

/**
 * Adds a canonical URL to a page's fixed metadata. Static `metadata` exports
 * can't see the locale, so this returns a generateMetadata function instead:
 *
 *   export const generateMetadata = withCanonical("/about-us", {
 *     title: "About Us",
 *   });
 *
 * The canonical is the page's clean URL (/about-us, or /hi/about-us for
 * Hindi), so query strings and the redirected /en/... form don't count as
 * separate pages.
 */
export function withCanonical(path: string, metadata: Metadata) {
  return async function generateMetadata(props: {
    params: Promise<{ locale: string }>;
  }): Promise<Metadata> {
    const { locale } = await props.params;
    return {
      ...metadata,
      alternates: { canonical: getLocalizedPath(path, locale) },
    };
  };
}

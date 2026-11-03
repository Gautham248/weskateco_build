import { defaultLocale, getLocalizedPath, locales } from "lib/i18n";
import type { Metadata } from "next";

type Alternates = NonNullable<Metadata["alternates"]>;

/**
 * Canonical and hreflang links for a page served at `path` in every locale.
 * The canonical is the page's clean URL in its own locale (/about-us, or
 * /hi/about-us for Hindi), so query strings and the redirected /en/... form
 * don't count as separate pages. `query` is kept on every link (e.g. ?page=2).
 */
export function localeAlternates(
  path: string,
  locale: string,
  query = "",
): Alternates {
  const languages: Record<string, string> = {};
  for (const each of locales) {
    languages[each] = getLocalizedPath(path, each) + query;
  }
  languages["x-default"] = getLocalizedPath(path, defaultLocale) + query;
  return { canonical: getLocalizedPath(path, locale) + query, languages };
}

/**
 * `?page=N` for the pages of a listing after the first. Each page of a listing
 * shows different products, so each is its own canonical URL; pointing them
 * all at page one would hide the later products from search engines.
 */
export function pageQuery(page: unknown): string {
  const number = Number(page);
  return Number.isInteger(number) && number > 1 ? `?page=${number}` : "";
}

/**
 * Adds canonical and hreflang links to a page's fixed metadata. Static
 * `metadata` exports can't see the locale, so this returns a generateMetadata
 * function instead:
 *
 *   export const generateMetadata = withCanonical("/about-us", {
 *     title: "About Us",
 *   });
 *
 * Pass `{ paginated: true }` for listings that take a ?page= param.
 */
export function withCanonical(
  path: string,
  metadata: Metadata,
  { paginated = false }: { paginated?: boolean } = {},
) {
  return async function generateMetadata(props: {
    params: Promise<{ locale: string }>;
    searchParams?: Promise<Record<string, string | string[] | undefined>>;
  }): Promise<Metadata> {
    const { locale } = await props.params;
    const query = paginated ? pageQuery((await props.searchParams)?.page) : "";
    return {
      ...metadata,
      alternates: localeAlternates(path, locale, query),
    };
  };
}

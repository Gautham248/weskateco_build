import { defaultLocale, getLocalizedPath, locales } from "lib/i18n";
import type { Metadata } from "next";

type OpenGraph = NonNullable<Metadata["openGraph"]>;
type Alternates = NonNullable<Metadata["alternates"]>;

export const SITE_NAME = process.env.SITE_NAME || "WeSkate Co";

/** Open Graph locale for a site locale, e.g. "hi" -> "hi_IN". */
export function openGraphLocale(locale: string): string {
  return locale === "hi" ? "hi_IN" : "en_IN";
}

/**
 * Open Graph tags for a page. Next.js replaces (rather than merges) the
 * layout's openGraph when a page sets its own, so every page builds the full
 * set here: site name, canonical URL and locale, plus page-specific fields.
 */
export function openGraph(
  locale: string,
  path: string,
  extra: OpenGraph = {},
): OpenGraph {
  return {
    siteName: SITE_NAME,
    type: "website",
    locale: openGraphLocale(locale),
    url: getLocalizedPath(path, locale),
    ...extra,
  } as OpenGraph;
}

/**
 * The site's share image (app/[locale]/opengraph-image.tsx), for pages with no
 * image of their own. Only that segment gets it automatically; nested pages
 * would otherwise share with no image. Don't use it where a segment has its
 * own opengraph-image file: this would replace it.
 */
export function siteShareImage(locale: string): OpenGraph["images"] {
  return [getLocalizedPath("/opengraph-image", locale)];
}

/**
 * Shortens text for meta and social descriptions, which search results and
 * link previews cut off at roughly 160 characters. Ends at a sentence when one
 * fits, otherwise at a word, with an ellipsis.
 */
export function summarize(text: string, maxLength = 160): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= maxLength) return clean;

  const cut = clean.slice(0, maxLength);
  const sentenceEnd = Math.max(
    cut.lastIndexOf(". "),
    cut.lastIndexOf("! "),
    cut.lastIndexOf("? "),
  );
  if (sentenceEnd >= maxLength / 2) return cut.slice(0, sentenceEnd + 1);

  const wordEnd = cut.lastIndexOf(" ");
  return `${cut.slice(0, wordEnd > 0 ? wordEnd : maxLength - 1).replace(/[,;:.\s]+$/, "")}…`;
}

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

/** Open Graph title for a page title: Open Graph doesn't apply the layout's "%s | site name" template. */
function openGraphTitle(title: Metadata["title"]): string | undefined {
  if (!title) return undefined;
  if (typeof title === "string") return `${title} | ${SITE_NAME}`;
  if ("absolute" in title && title.absolute) return title.absolute;
  return undefined;
}

/**
 * Turns a page's fixed metadata into a generateMetadata function that also
 * sets its canonical and hreflang links and Open Graph tags. Static `metadata` exports can't
 * see the locale, which both need:
 *
 *   export const generateMetadata = withPageMetadata("/about-us", {
 *     title: "About Us",
 *     description: "…",
 *   });
 *
 * See localeAlternates for the canonical. Pass `{ paginated: true }` for
 * listings that take a ?page= param. Open Graph reuses the title and
 * description, and any openGraph fields the page sets win.
 */
export function withPageMetadata(
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
    const title = openGraphTitle(metadata.title);
    const description =
      typeof metadata.description === "string"
        ? metadata.description
        : undefined;

    return {
      ...metadata,
      alternates: localeAlternates(path, locale, query),
      openGraph: openGraph(locale, path + query, {
        images: siteShareImage(locale),
        ...(title ? { title } : {}),
        ...(description ? { description } : {}),
        ...(metadata.openGraph ?? {}),
      } as OpenGraph),
    };
  };
}

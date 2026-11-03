import { getLocalizedPath } from "lib/i18n";
import type { Metadata } from "next";

type OpenGraph = NonNullable<Metadata["openGraph"]>;

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

/** Open Graph title for a page title: Open Graph doesn't apply the layout's "%s | site name" template. */
function openGraphTitle(title: Metadata["title"]): string | undefined {
  if (!title) return undefined;
  if (typeof title === "string") return `${title} | ${SITE_NAME}`;
  if ("absolute" in title && title.absolute) return title.absolute;
  return undefined;
}

/**
 * Turns a page's fixed metadata into a generateMetadata function that also
 * sets its canonical URL and Open Graph tags. Static `metadata` exports can't
 * see the locale, which both need:
 *
 *   export const generateMetadata = withPageMetadata("/about-us", {
 *     title: "About Us",
 *     description: "…",
 *   });
 *
 * The canonical is the page's clean URL (/about-us, or /hi/about-us for
 * Hindi), so query strings and the redirected /en/... form don't count as
 * separate pages. Open Graph reuses the title and description, and any
 * openGraph fields the page sets win.
 */
export function withPageMetadata(path: string, metadata: Metadata) {
  return async function generateMetadata(props: {
    params: Promise<{ locale: string }>;
  }): Promise<Metadata> {
    const { locale } = await props.params;
    const title = openGraphTitle(metadata.title);
    const description =
      typeof metadata.description === "string"
        ? metadata.description
        : undefined;

    return {
      ...metadata,
      alternates: { canonical: getLocalizedPath(path, locale) },
      openGraph: openGraph(locale, path, {
        ...(title ? { title } : {}),
        ...(description ? { description } : {}),
        ...(metadata.openGraph ?? {}),
      } as OpenGraph),
    };
  };
}

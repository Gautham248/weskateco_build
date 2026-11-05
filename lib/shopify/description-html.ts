import { getLocalizedPath, getTranslation } from "lib/i18n";

/**
 * The storefront serves product pages from `/products/<handle>`. Shopify
 * descriptions already use that shape; this normalises them to the active
 * locale and also rescues any legacy singular `/product/<handle>` links.
 * External links, query strings, and fragments are left intact.
 */
function rewriteProductLinks(html: string, locale: string): string {
  const productPath = getLocalizedPath("/products/", locale);

  return html.replace(/(\shref\s*=\s*["'])\/products?\//gi, `$1${productPath}`);
}

/** Wrap Shopify rich-text tables in a keyboard-focusable scroll region. */
function wrapTables(html: string, locale: string): string {
  const label = getTranslation(locale, "product.specs_scroll_aria");
  return html.replace(
    /<table\b[^>]*>[\s\S]*?<\/table\s*>/gi,
    (table) =>
      `<div class="product-description-table-scroll" role="region" aria-label="${label}" tabindex="0">${table}</div>`,
  );
}

/**
 * A deck's artist credit, written in the description as "Deck Artwork by
 * <artist>" or, in Hindi translations, "डेक आर्टवर्क: <artist>" (see
 * locales/hindi-glossary.md). The artist may be wrapped in inline tags and
 * runs to the end of the line or paragraph.
 */
const ARTWORK_CREDIT =
  /(?:Deck\s+Artwork\s+by|डेक\s+आर्टवर्क\s*:)[\s\u00a0&nbsp;]*((?:<[^>]+>|[^<>\n\r])+?)(?:<br\s*\/?>|<\/p>|\n|(?=<span[^>]*><br)|$)/gi;

/** Turn the artist credit into the artist badge, labelled in `locale`. */
function formatArtworkBadge(html: string, locale: string): string {
  return html.replace(ARTWORK_CREDIT, (match, rawArtist: string) => {
    const artist = rawArtist
      .replace(/<[^>]+>/g, "")
      .replace(/&nbsp;|\u00a0/g, " ")
      .trim();
    if (!artist) return match;
    const label = getTranslation(locale, "product.deck_artwork_by").replace(
      "{artist}",
      () => artist,
    );
    return `
          <div class="my-4 flex items-center gap-2 rounded-md bg-[#F4FFCD] dark:bg-lime-950/20 p-2 w-fit">
            <div class="flex h-7 w-7 items-center justify-center rounded-full bg-[#E8FF8D] dark:bg-lime-900 text-sm font-bold text-[#55631F] dark:text-lime-300">
              ${artist.charAt(0).toUpperCase()}
            </div>
            <span class="text-[14px] font-medium text-[#55631F] dark:text-lime-400">
              ${label}
            </span>
          </div>
        `;
  });
}

export function prepareProductDescriptionHtml(
  html: string,
  locale: string,
): string {
  if (!html) return "";

  return wrapTables(
    rewriteProductLinks(formatArtworkBadge(html, locale), locale),
    locale,
  );
}

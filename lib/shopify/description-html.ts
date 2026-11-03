import { getLocalizedPath } from "lib/i18n";

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
function wrapTables(html: string): string {
  return html.replace(
    /<table\b[^>]*>[\s\S]*?<\/table\s*>/gi,
    (table) =>
      `<div class="product-description-table-scroll" role="region" aria-label="Scrollable product specifications" tabindex="0">${table}</div>`,
  );
}

export function prepareProductDescriptionHtml(
  html: string,
  locale: string,
): string {
  if (!html) return "";

  return wrapTables(rewriteProductLinks(html, locale));
}

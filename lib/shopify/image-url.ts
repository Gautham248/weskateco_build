const SHOPIFY_CDN_HOST = "cdn.shopify.com";

/**
 * Source widths, in pixels, to ask Shopify's CDN for.
 *
 * Shopify serves a resized derivative from a `?width=` parameter rather than the
 * original file, which matters because the originals on this store run to 16 MB.
 * Every `<Image>` goes through Next's optimizer, which downloads the whole source
 * before producing any output width — so the original is fetched once per source,
 * not once per rendered size, and a 16 MB original exceeds the optimizer's fetch
 * timeout and returns a 500.
 *
 * Each bucket is the largest a matching `sizes` prop resolves to at 2x, rounded up.
 * The optimizer resizes with `withoutEnlargement`, so this value is a ceiling on
 * quality as well as on transfer: too small renders soft, too large is waste.
 */
export const SHOPIFY_IMAGE_WIDTH = {
  /** Slots up to ~112px: cart lines, sidebar thumbs, admin table rows. */
  thumb: 256,
  /** Cards up to ~500px: product grid tiles, Shop Now, newly-released cards. */
  card: 1024,
  /** Full-width and gallery images up to ~800px. */
  hero: 1600,
} as const;

/**
 * Points a Shopify CDN image URL at a resized derivative.
 *
 * Only `cdn.shopify.com` is touched: ImageKit uploads, local assets and anything
 * else come back unchanged, so this is safe to wrap around a URL whose host
 * varies (admin overrides can swap a Shopify image for an uploaded one).
 *
 * The `?v=` cache-busting parameter is preserved, and an existing `width` is
 * replaced rather than appended so a caller can ask for something smaller than a
 * previously-encoded size.
 */
export function shopifyImageUrl(url: string, width: number): string {
  if (!url || !Number.isFinite(width) || width <= 0) {
    return url;
  }

  let parsed: URL;

  try {
    parsed = new URL(url);
  } catch {
    return url;
  }

  if (parsed.hostname !== SHOPIFY_CDN_HOST) {
    return url;
  }

  parsed.searchParams.set("width", String(Math.round(width)));

  return parsed.toString();
}

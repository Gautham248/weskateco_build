import type { ImageLoaderProps } from "next/image";

const DEFAULT_QUALITY = 75;

function isShopifyImage(url: URL) {
  if (url.hostname === "cdn.shopify.com") return true;

  return (
    (url.hostname === "weskateco.com" ||
      url.hostname.endsWith(".weskateco.com")) &&
    url.pathname.startsWith("/cdn/shop/")
  );
}

/**
 * Shopify already performs resizing on its CDN. Sending Shopify images straight
 * to that CDN avoids proxying large originals through `/_next/image`, which can
 * time out on slow upstream connections. Every other source keeps the standard
 * Next image pipeline.
 */
export default function storefrontImageLoader({
  src,
  width,
  quality = DEFAULT_QUALITY,
}: ImageLoaderProps) {
  if (/^https?:\/\//i.test(src)) {
    try {
      const url = new URL(src);

      if (isShopifyImage(url)) {
        url.searchParams.set("width", String(width));
        url.searchParams.delete("q");
        url.searchParams.set("quality", String(quality));
        return url.toString();
      }
    } catch {
      // Malformed absolute URLs fall through to the built-in optimizer, which
      // will surface the normal Next.js image error.
    }
  }

  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality}`;
}

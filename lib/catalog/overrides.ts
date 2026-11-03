import {
  listOverridesForHandles,
  type ProductOverrideWithImages,
} from "lib/admin/queries";
import type { Image, Product } from "lib/shopify/types";

export type GalleryMode = "append" | "replace";

/**
 * Normalised, database-independent shape of a product override. Keeping the
 * merge logic free of Drizzle types means `applyOverride` stays a pure function
 * that the test scripts can exercise without a database.
 */
export type ProductOverride = {
  title: string | null;
  descriptionHtml: string | null;
  galleryMode: GalleryMode;
  coverImageUrl: string | null;
  removedImageUrls: string[];
  images: Image[];
};

function htmlToPlainText(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/(p|div|li|h[1-6])>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function mergeImages(product: Product, override: ProductOverride): Image[] {
  const removed = new Set(override.removedImageUrls ?? []);

  const base =
    override.galleryMode === "replace"
      ? []
      : (product.images || []).filter((image) => !removed.has(image.url));

  const seen = new Set(base.map((image) => image.url));
  const appended = (override.images || []).filter((image) => !seen.has(image.url));

  return base.length === 0 && appended.length === 0
    ? []
    : [...base, ...appended];
}

/**
 * Returns a product with the override applied. Pure and synchronous — the
 * database read happens in `withOverrides` so this stays trivially testable.
 */
export function applyOverride(
  product: Product,
  override?: ProductOverride,
): Product {
  if (!override) {
    return product;
  }

  const next: Product = { ...product };

  if (override.title) {
    next.title = override.title;

    // Keep the <title>/OpenGraph metadata in step with the visible heading, but
    // only when Shopify's SEO title was simply mirroring the product title - a
    // deliberately different SEO title is left alone.
    if (!product.seo?.title || product.seo.title === product.title) {
      next.seo = { ...product.seo, title: override.title };
    }
  }

  if (override.descriptionHtml) {
    next.descriptionHtml = override.descriptionHtml;
    next.description = htmlToPlainText(override.descriptionHtml);
  }

  const images = mergeImages(product, override);

  if (images.length > 0) {
    const cover = override.coverImageUrl
      ? images.find((image) => image.url === override.coverImageUrl)
      : undefined;

    next.images = images;
    // `noUncheckedIndexedAccess` means images[0] is possibly undefined; the
    // length check above proves otherwise, so the fallback is unreachable.
    next.featuredImage = cover ?? images[0] ?? product.featuredImage;
  }

  return next;
}

function toOverride(row: ProductOverrideWithImages): ProductOverride {
  return {
    title: row.title,
    descriptionHtml: row.descriptionHtml,
    galleryMode: row.galleryMode === "replace" ? "replace" : "append",
    coverImageUrl: row.coverImageUrl,
    removedImageUrls: row.removedImageUrls ?? [],
    images: row.images.map((image) => ({
      url: image.url,
      altText: image.altText ?? "",
      width: image.width ?? 0,
      height: image.height ?? 0,
    })),
  };
}

/**
 * Reads overrides for a batch of handles in a single query.
 *
 * Deliberately NOT wrapped in Next's `"use cache"`: these getters run inside
 * functions already tagged with TAGS.products and cached for days, and caching
 * the empty-Map fallback below would pin a Shopify-only catalog for that whole
 * window after a brief database blip.
 */
export async function getOverridesForHandles(
  handles: string[],
): Promise<Map<string, ProductOverride>> {
  const overrides = new Map<string, ProductOverride>();

  if (handles.length === 0) {
    return overrides;
  }

  try {
    const rows = await listOverridesForHandles(handles);

    for (const row of rows) {
      overrides.set(row.productHandle, toOverride(row));
    }
  } catch (error) {
    // An overrides outage must never take the storefront down - log it and fall
    // back to the unmerged Shopify catalog.
    console.error(
      "Failed to load product overrides; serving Shopify data as-is:",
      error,
    );
  }

  return overrides;
}

export async function withOverrides(products: Product[]): Promise<Product[]> {
  if (products.length === 0) {
    return products;
  }

  const overrides = await getOverridesForHandles(
    products.map((product) => product.handle),
  );

  if (overrides.size === 0) {
    return products;
  }

  return products.map((product) =>
    applyOverride(product, overrides.get(product.handle)),
  );
}

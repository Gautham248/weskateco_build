import { listShopNowItems, type ShopNowItemRow } from "lib/admin/queries";
import { narrowProduct } from "lib/catalog/newly-released";
import type { Image, Money, Product } from "lib/shopify/types";

/**
 * Framework-free on purpose: this module holds the data read and the pure slide
 * mapping, so test scripts can exercise both without a Next.js runtime.
 */

/** The homepage card slides through up to three photos. */
export const SLOT_COUNT = 3;

export type ShopNowSlideImage = {
  url: string;
  altText: string;
};

export type ShopNowSlide = {
  handle: string;
  /** In slide order, 1-3 entries. */
  images: ShopNowSlideImage[];
  title: string;
  vendor: string;
  price: Money;
  compareAtPrice: Money | null;
  /** Whole number, e.g. 33. Null when the product is not discounted. */
  discountPercent: number | null;
  availableForSale: boolean;
  hasVariants: boolean;
  /** Narrowed product, used for add-to-cart and the quick-buy sidebar. */
  product: Product;
};

/**
 * The photo a slot falls back to when the admin has not chosen one: the product's
 * own nth photo, then its first, then the Shopify featured image.
 */
function fallbackForSlot(product: Product, slot: number): Image | null {
  return (
    product.images[slot] ?? product.images[0] ?? product.featuredImage ?? null
  );
}

/**
 * A chosen URL wins for its slot even when it is not one of the product's photos
 * — that is the uploaded case, and it has to display rather than silently
 * falling back to a Shopify photo.
 *
 * A slot whose photo is already showing earlier in the row is dropped rather
 * than repeated: a product with a single photo would otherwise render that same
 * photo three times and claim three slides.
 */
export function resolveImages(
  product: Product,
  chosen: (string | null)[],
): ShopNowSlideImage[] {
  const images: ShopNowSlideImage[] = [];
  const usedUrls = new Set<string>();

  for (let slot = 0; slot < SLOT_COUNT; slot += 1) {
    const chosenUrl = chosen[slot] ?? null;

    if (chosenUrl) {
      const source =
        product.images.find((image) => image.url === chosenUrl) ?? null;

      usedUrls.add(chosenUrl);
      images.push({
        url: chosenUrl,
        altText: source?.altText || product.title,
      });
      continue;
    }

    const fallback = fallbackForSlot(product, slot);

    if (!fallback || usedUrls.has(fallback.url)) {
      continue;
    }

    usedUrls.add(fallback.url);
    images.push({
      url: fallback.url,
      altText: fallback.altText || product.title,
    });
  }

  return images;
}

/**
 * Whole-number percentage off, or null when there is no genuine markdown —
 * a compareAtPrice at or below the price is not a discount.
 */
export function discountPercent(
  price: Money,
  compareAtPrice: Money | null,
): number | null {
  if (!compareAtPrice) {
    return null;
  }

  const priceAmount = Number.parseFloat(price.amount);
  const compareAtAmount = Number.parseFloat(compareAtPrice.amount);

  if (!Number.isFinite(priceAmount) || !Number.isFinite(compareAtAmount)) {
    return null;
  }

  if (compareAtAmount <= priceAmount) {
    return null;
  }

  return Math.round(((compareAtAmount - priceAmount) / compareAtAmount) * 100);
}

/**
 * Pure and synchronous so it can be tested without a database or Shopify.
 */
export function buildSlide(
  item: ShopNowItemRow,
  product: Product,
): ShopNowSlide {
  const price = product.priceRange.minVariantPrice;
  const compareAtPrice = product.variants[0]?.compareAtPrice ?? null;

  return {
    handle: product.handle,
    images: resolveImages(product, [
      item.imageUrl1,
      item.imageUrl2,
      item.imageUrl3,
    ]),
    title: product.title,
    vendor: product.vendor,
    price,
    compareAtPrice,
    discountPercent: discountPercent(price, compareAtPrice),
    availableForSale: product.availableForSale,
    hasVariants: product.variants.length > 1,
    product: narrowProduct(product),
  };
}

/**
 * Maps stored rows onto fetched products, preserving the stored order and
 * dropping any item whose product no longer exists in Shopify.
 */
export function composeSlides(
  items: ShopNowItemRow[],
  products: (Product | undefined)[],
): ShopNowSlide[] {
  const slides: ShopNowSlide[] = [];

  for (const [index, item] of items.entries()) {
    const product = products[index];

    if (!product) {
      continue;
    }

    slides.push(buildSlide(item, product));
  }

  return slides;
}

/**
 * The resilience lives here rather than in the cached wrapper next door, so it
 * can be asserted directly: a database outage must hide the section, never throw
 * into the homepage render.
 */
export async function readShopNowItems(): Promise<ShopNowItemRow[]> {
  try {
    return await listShopNowItems();
  } catch (error) {
    console.error(
      "Failed to load Shop Now items; hiding the section for this render:",
      error,
    );
    return [];
  }
}

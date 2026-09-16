import type { ShopNowItemRow } from "lib/admin/queries";
import { composeSlides, readShopNowItems } from "lib/catalog/shop-now";
import type { ShopNowSlide } from "lib/catalog/shop-now";
import { TAGS } from "lib/constants";
import { getProduct } from "lib/shopify";
import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
} from "next/cache";

/**
 * Caches only the small curated rows, for minutes, under its own tag so an admin
 * save refreshes the section immediately.
 */
export async function loadShopNowItems(): Promise<ShopNowItemRow[]> {
  "use cache";
  cacheTag(TAGS.shopNow);
  cacheLife("minutes");

  return readShopNowItems();
}

/**
 * Deliberately NOT cached. Products come from `getProduct`, which is already
 * cached for days under TAGS.products, so the only uncached work here is one
 * cached row read plus N cache lookups. A database blip during a cache miss then
 * hides the section for a single render instead of poisoning a cached empty
 * section for days.
 */
export async function getShopNow(): Promise<ShopNowSlide[]> {
  const items = await loadShopNowItems();

  if (items.length === 0) {
    return [];
  }

  const products = await Promise.all(
    items.map((item) => getProduct(item.productHandle)),
  );

  // Products deleted or unpublished in Shopify are dropped by composeSlides
  // rather than blanking the whole section.
  return composeSlides(items, products);
}

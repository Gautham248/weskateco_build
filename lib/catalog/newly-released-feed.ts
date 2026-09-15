import {
  composeSlides,
  readNewlyReleasedItems,
} from "lib/catalog/newly-released";
import type { NewlyReleasedItemRow } from "lib/admin/queries";
import type { NewlyReleasedSlide } from "lib/catalog/newly-released";
import { TAGS } from "lib/constants";
import { getProduct } from "lib/shopify";
import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
} from "next/cache";

/**
 * Caches only the small curated rows, for an hour, under its own tag so an admin
 * save refreshes the section immediately.
 */
export async function loadNewlyReleasedItems(): Promise<
  NewlyReleasedItemRow[]
> {
  "use cache";
  cacheTag(TAGS.newlyReleased);
  // Minutes, not hours: this is one indexed read on a tiny table, and a long
  // profile would also leave the section empty for that long right after seeding
  // or a database blip.
  cacheLife("minutes");

  return readNewlyReleasedItems();
}

/**
 * Deliberately NOT cached. Products come from `getProduct`, which is already
 * cached for days under TAGS.products, so the only uncached work here is one
 * cached row read plus N cache lookups. That means a database blip during a
 * cache miss hides the section for a single render instead of poisoning a cached
 * empty section for days.
 */
export async function getNewlyReleased(): Promise<NewlyReleasedSlide[]> {
  const items = await loadNewlyReleasedItems();

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

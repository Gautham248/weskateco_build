import {
  composeSlides,
  readNewlyReleasedItems,
} from "lib/catalog/newly-released";
import type { NewlyReleasedItemRow } from "lib/admin/queries";
import type { NewlyReleasedSlide } from "lib/catalog/newly-released";
import { TAGS } from "lib/constants";
import { getProduct } from "lib/shopify";
import type { Product } from "lib/shopify/types";
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

  const { products, failures, firstError } = await loadProducts(items);

  if (failures.length > 0) {
    console.error(
      `Newly released: ${failures.length} of ${items.length} product(s) could not be read from Shopify, hiding them (${failures.join(", ")}):`,
      firstError,
    );
  }

  // Products deleted or unpublished in Shopify are dropped by composeSlides
  // rather than blanking the whole section.
  return composeSlides(items, products);
}

/**
 * Reads each curated handle from Shopify, resolving a failure to `undefined`
 * instead of throwing.
 *
 * Shopify is a separate failure domain from the database: an outage there must
 * hide this section, not abort the render. `composeSlides` already drops an
 * `undefined` product, so a single dead handle costs one slide and a full outage
 * costs the section. Nothing here is cached, so an outage is never remembered as
 * an empty section once Shopify recovers.
 */
async function loadProducts(items: NewlyReleasedItemRow[]): Promise<{
  products: (Product | undefined)[];
  failures: string[];
  firstError: unknown;
}> {
  const failures: string[] = [];
  let firstError: unknown;

  const products = await Promise.all(
    items.map(async (item) => {
      try {
        return await getProduct(item.productHandle);
      } catch (error) {
        firstError ??= error;
        failures.push(item.productHandle);
        return undefined;
      }
    }),
  );

  return { products, failures, firstError };
}

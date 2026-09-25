import type { ProductReadResult } from "lib/shopify";
import type { Product } from "lib/shopify/types";

/**
 * What a product page should actually do with a product read.
 *
 * Three outcomes, not two, and the distinction is the whole point of this module: a read
 * that *failed* has to be told apart from a read that *succeeded and found nothing*,
 * because only the second is a 404. Sending a fetch failure to `notFound()` would tell a
 * customer — and any crawler that cached the response — that a real product does not
 * exist, which is worse than an error page and far harder to undo.
 *
 * Kept free of any runtime import (the `ProductReadResult` import is type-only) so a test
 * script can exercise the decision without a Next runtime or a Shopify connection, the
 * same reason lib/catalog/hero.ts is framework-free.
 */
export type ProductReadState =
  | { kind: "ok"; product: Product }
  | { kind: "missing" }
  | { kind: "unavailable" };

export function productReadState(result: ProductReadResult): ProductReadState {
  if (result.status === "failed") {
    return { kind: "unavailable" };
  }

  return result.product
    ? { kind: "ok", product: result.product }
    : { kind: "missing" };
}

"use client";

import type { Product } from "lib/shopify/types";
import { useEffect } from "react";
import { trackViewItem } from "./events";

/** Fires GA4 view_item once per product page. Drop into a server component. */
export function ViewItemTracker({ product }: { product: Product }) {
  useEffect(() => {
    trackViewItem(product);
  }, [product.id]);

  return null;
}

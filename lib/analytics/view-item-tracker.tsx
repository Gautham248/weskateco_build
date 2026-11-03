"use client";

import type { Product, ProductVariant } from "lib/shopify/types";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { trackViewItem } from "./events";

/**
 * Fires GA4 view_item once per product page, for the variant selected in the
 * URL when the page loads. Render inside <Suspense> (uses useSearchParams).
 */
export function ViewItemTracker({ product }: { product: Product }) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const selected = product.variants.find((variant: ProductVariant) =>
      variant.selectedOptions.every(
        (option) =>
          option.value === searchParams.get(option.name.toLowerCase()),
      ),
    );
    trackViewItem(product, selected);
    // Only once per product: switching variants isn't a new product view.
  }, [product.id]);

  return null;
}

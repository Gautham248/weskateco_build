"use client";

import { ProductFilters } from "components/admin/product-filters";
import { ProductTable } from "components/admin/product-table";
import {
  applyAdminProductFilters,
  countActiveAdminFilters,
  deriveAdminFacets,
  EMPTY_ADMIN_PRODUCT_FILTERS,
  toggleFacetValue,
  type AdminProductFilters,
  type AdminProductOverrideSummary,
} from "lib/admin/product-filters";
import type { ShopifyProductSummary } from "lib/shopify/types";
import { useMemo, useState } from "react";

export function AdminProductsBrowser({
  products,
  overrides,
  truncated,
}: {
  products: ShopifyProductSummary[];
  overrides: AdminProductOverrideSummary[];
  truncated: boolean;
}) {
  const [filters, setFilters] = useState<AdminProductFilters>(
    EMPTY_ADMIN_PRODUCT_FILTERS,
  );

  const facets = useMemo(() => deriveAdminFacets(products), [products]);

  const visible = useMemo(
    () => applyAdminProductFilters(products, overrides, filters),
    [products, overrides, filters],
  );

  const activeCount = countActiveAdminFilters(filters);

  return (
    <div className="space-y-6">
      <ProductFilters
        facets={facets}
        filters={filters}
        activeCount={activeCount}
        resultCount={visible.length}
        totalCount={products.length}
        onChange={(patch) => setFilters((prev) => ({ ...prev, ...patch }))}
        onToggleFacet={(key, value) =>
          setFilters((prev) => ({
            ...prev,
            [key]: toggleFacetValue(prev[key], value),
          }))
        }
        onClear={() => setFilters(EMPTY_ADMIN_PRODUCT_FILTERS)}
      />

      {truncated ? (
        <p className="rounded-sm border border-amber-300 bg-amber-50 px-3 py-2.5 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300">
          This store has more products than the admin list loads at once, so the
          list below is partial.
        </p>
      ) : null}

      {visible.length === 0 ? (
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          No products match these filters.
        </p>
      ) : (
        <ProductTable products={visible} overrides={overrides} />
      )}
    </div>
  );
}

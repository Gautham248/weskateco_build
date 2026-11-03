"use client";

import { ProductFilters } from "components/admin/product-filters";
import { ProductTable } from "components/admin/product-table";
import { ResultsPager } from "components/admin/results-pager";
import {
  applyAdminProductFilters,
  countActiveAdminFilters,
  deriveAdminFacets,
  EMPTY_ADMIN_PRODUCT_FILTERS,
  toggleFacetValue,
  type AdminProductFilters,
  type AdminProductOverrideSummary,
} from "lib/admin/product-filters";
import { paginate } from "lib/admin/pagination";
import type { ShopifyProductSummary } from "lib/shopify/types";
import { useEffect, useMemo, useState } from "react";

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
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [page, setPage] = useState(1);

  // Facets follow the other active filters, so each selection narrows what the
  // remaining groups offer.
  const facets = useMemo(
    () => deriveAdminFacets(products, overrides, filters),
    [products, overrides, filters],
  );

  const visible = useMemo(
    () => applyAdminProductFilters(products, overrides, filters),
    [products, overrides, filters],
  );

  const activeCount = countActiveAdminFilters(filters);

  // A changed filter set is a new result set, so start it at the first page.
  useEffect(() => {
    setPage(1);
  }, [filters]);

  const {
    items: pageItems,
    currentPage,
    totalPages,
    rangeStart,
    rangeEnd,
  } = paginate(visible, page);

  return (
    <div className="space-y-6">
      <ProductFilters
        facets={facets}
        filters={filters}
        activeCount={activeCount}
        isOpen={isFilterPanelOpen}
        onToggleOpen={() => setIsFilterPanelOpen((open) => !open)}
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
        <>
          <ProductTable products={pageItems} overrides={overrides} />

          <ResultsPager
            rangeStart={rangeStart}
            rangeEnd={rangeEnd}
            total={visible.length}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}

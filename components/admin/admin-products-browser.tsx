"use client";

import { ProductFilters } from "components/admin/product-filters";
import { ProductTable } from "components/admin/product-table";
import clsx from "clsx";
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
import { useEffect, useMemo, useState } from "react";

const PAGE_SIZE = 12;

/** Windowed page numbers, so a large catalog doesn't render 40 buttons. */
function pageList(current: number, total: number): (number | "gap")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  const wanted = new Set([1, total, current, current - 1, current + 1]);
  const sorted = [...wanted]
    .filter((page) => page >= 1 && page <= total)
    .sort((a, b) => a - b);

  const output: (number | "gap")[] = [];
  let previous = 0;

  for (const page of sorted) {
    if (previous !== 0 && page - previous > 1) {
      output.push("gap");
    }
    output.push(page);
    previous = page;
  }

  return output;
}

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

  const totalPages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageItems = visible.slice(start, start + PAGE_SIZE);
  const rangeStart = visible.length === 0 ? 0 : start + 1;
  const rangeEnd = Math.min(start + PAGE_SIZE, visible.length);

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

          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              Showing {rangeStart}–{rangeEnd} of {visible.length} product
              {visible.length === 1 ? "" : "s"}
            </span>

            {totalPages > 1 ? (
              <nav
                aria-label="Product pages"
                className="flex items-center gap-1"
              >
                <button
                  type="button"
                  onClick={() => setPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="cursor-pointer rounded-sm border border-neutral-300 px-2.5 py-1 text-xs font-semibold transition-colors hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-700 dark:hover:bg-neutral-900"
                >
                  ← Prev
                </button>

                {pageList(currentPage, totalPages).map((entry, index) =>
                  entry === "gap" ? (
                    <span
                      key={`gap-${index}`}
                      className="px-1 text-xs text-neutral-400"
                    >
                      …
                    </span>
                  ) : (
                    <button
                      key={entry}
                      type="button"
                      onClick={() => setPage(entry)}
                      aria-current={entry === currentPage ? "page" : undefined}
                      className={clsx(
                        "min-w-8 cursor-pointer rounded-sm border px-2.5 py-1 text-xs font-semibold transition-colors",
                        entry === currentPage
                          ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                          : "border-neutral-300 hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-900",
                      )}
                    >
                      {entry}
                    </button>
                  ),
                )}

                <button
                  type="button"
                  onClick={() => setPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="cursor-pointer rounded-sm border border-neutral-300 px-2.5 py-1 text-xs font-semibold transition-colors hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-700 dark:hover:bg-neutral-900"
                >
                  Next →
                </button>
              </nav>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
}

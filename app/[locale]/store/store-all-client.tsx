"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import FilterSortBar from "components/layout/search/filter-sort-bar";
import ProductCard from "components/product/product-card";
import Link from "next/link";
import { Product } from "lib/shopify/types";
import { sorting } from "lib/constants";

interface StoreAllClientProps {
  products: Product[];
  locale: string;
}

export default function StoreAllClient({
  products,
  locale,
}: StoreAllClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Generalised filter map
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>(
    {},
  );
  const [sort, setSort] = useState<string>("");
  const [page, setPage] = useState<number>(1);

  // Stable initial index map for relevance/trending sort
  const initialIndexMap = useRef<Record<string, number>>({});
  useEffect(() => {
    const map: Record<string, number> = {};
    products.forEach((p, idx) => {
      map[p.handle] = idx;
    });
    initialIndexMap.current = map;
  }, [products]);

  // Sync state from URL (back/forward navigation)
  useEffect(() => {
    const filters: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      if (key !== "sort" && key !== "page" && key !== "filter")
        filters[key] = value;
    });
    setActiveFilters(filters);
    setSort(searchParams.get("sort") || "");
    setPage(Number(searchParams.get("page")) || 1);
  }, [searchParams]);

  // Push updated URL without full navigation
  const updateParams = (
    newFilters: Record<string, string>,
    newSort: string,
    newPage: number,
  ) => {
    const params = new URLSearchParams();
    const filterParam = searchParams.get("filter");
    if (filterParam) params.set("filter", filterParam);

    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    if (newSort) params.set("sort", newSort);
    if (newPage > 1) params.set("page", String(newPage));

    const searchStr = params.toString();
    const fullUrl = searchStr ? `${pathname}?${searchStr}` : pathname;
    window.history.pushState(null, "", fullUrl);

    setActiveFilters(newFilters);
    setSort(newSort);
    setPage(newPage);
  };

  const handleFilterChange = (filters: Record<string, string>) => {
    updateParams(filters, sort, 1);
  };

  const handleSortChange = (newSort: string) => {
    updateParams(activeFilters, newSort, 1);
  };

  /** Single atomic handler — prevents the two-call race that stales filters/sort */
  const handleApplyAll = (filters: Record<string, string>, newSort: string) => {
    updateParams(filters, newSort, 1);
  };

  // When a category is selected from within the drawer, navigate to that route
  const handleCategoryChange = (handle: string) => {
    const params = new URLSearchParams();
    const filterParam = searchParams.get("filter");
    if (filterParam) params.set("filter", filterParam);
    const searchStr = params.toString();

    if (handle === "") {
      router.push(searchStr ? `/store?${searchStr}` : `/store`, {
        scroll: false,
      });
    } else {
      router.push(
        searchStr ? `/store/${handle}?${searchStr}` : `/store/${handle}`,
        { scroll: false },
      );
    }
  };

  // Apply all active filters generically
  let filteredProducts = [...products];

  Object.entries(activeFilters).forEach(([key, value]) => {
    if (!value) return;
    const values = value.split(",").filter(Boolean);
    if (values.length === 0) return;

    if (key === "price") {
      filteredProducts = filteredProducts.filter((product) => {
        const productPrice = Number(product.priceRange.minVariantPrice.amount);
        return values.some((val) => {
          const parts = val.split("-").map(Number);
          const minPrice = parts[0] ?? 0;
          const maxPrice = parts[1] ?? Infinity;
          return productPrice >= minPrice && productPrice <= maxPrice;
        });
      });
    } else if (key === "color") {
      filteredProducts = filteredProducts.filter((product) => {
        return values.some((val) => {
          const valLower = val.toLowerCase();
          const matchesOption = product.options?.some(
            (opt) =>
              opt.name.toLowerCase() === "color" &&
              opt.values.some((v) => v.toLowerCase() === valLower),
          );
          const matchesTag = product.tags?.some(
            (tag) => tag.toLowerCase() === valLower,
          );
          const matchesTitle = product.title.toLowerCase().includes(valLower);
          const matchesDesc = product.description
            ?.toLowerCase()
            .includes(valLower);
          return matchesOption || matchesTag || matchesTitle || matchesDesc;
        });
      });
    } else if (key === "level") {
      filteredProducts = filteredProducts.filter((product) => {
        return values.some((val) => {
          const valLower = val.toLowerCase();
          const matchesTag = product.tags?.some(
            (tag) => tag.toLowerCase() === valLower,
          );
          const matchesTitle = product.title.toLowerCase().includes(valLower);
          const matchesDesc = product.description
            ?.toLowerCase()
            .includes(valLower);
          return matchesTag || matchesTitle || matchesDesc;
        });
      });
    } else if (key === "size") {
      filteredProducts = filteredProducts.filter((product) => {
        return values.some((val) => {
          const valLower = val.toLowerCase();
          const matchesOption = product.options?.some((opt) =>
            opt.values.some((v) => v.toLowerCase() === valLower),
          );
          const matchesTag = product.tags?.some((tag) =>
            tag.toLowerCase().includes(valLower),
          );
          return matchesOption || matchesTag;
        });
      });
    } else if (key === "brand") {
      filteredProducts = filteredProducts.filter((product) => {
        return values.some((val) => {
          const valLower = val.toLowerCase();
          const vendorMatch =
            product.vendor?.toLowerCase().replace(/\s+/g, "-") === valLower;
          const tagMatch = product.tags?.some(
            (tag) => tag.toLowerCase() === valLower,
          );
          const titleMatch = product.title.toLowerCase().includes(valLower);
          return vendorMatch || tagMatch || titleMatch;
        });
      });
    } else {
      filteredProducts = filteredProducts.filter((product) => {
        return values.some((val) => {
          const valLower = val.toLowerCase();
          const matchesTag = product.tags?.some((tag) =>
            tag.toLowerCase().includes(valLower),
          );
          const matchesTitle = product.title.toLowerCase().includes(valLower);
          const matchesOption = product.options?.some((opt) =>
            opt.values.some((v) => v.toLowerCase().includes(valLower)),
          );
          return matchesTag || matchesTitle || matchesOption;
        });
      });
    }
  });

  // Sort
  const idxMap = initialIndexMap.current;
  if (sort === "price-asc") {
    filteredProducts.sort(
      (a, b) =>
        Number(a.priceRange.minVariantPrice.amount) -
        Number(b.priceRange.minVariantPrice.amount),
    );
  } else if (sort === "price-desc") {
    filteredProducts.sort(
      (a, b) =>
        Number(b.priceRange.minVariantPrice.amount) -
        Number(a.priceRange.minVariantPrice.amount),
    );
  } else if (sort === "latest-desc") {
    filteredProducts.sort((a, b) => {
      const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return dateB - dateA;
    });
  } else {
    // Restore original order
    filteredProducts.sort((a, b) => {
      const idxA = idxMap[a.handle] ?? 9999;
      const idxB = idxMap[b.handle] ?? 9999;
      return idxA - idxB;
    });
  }

  // Pagination
  const ITEMS_PER_PAGE = 12;
  const totalProducts = filteredProducts.length;
  const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);
  const currentPage = Math.max(1, Math.min(page, totalPages || 1));
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const createPageUrl = (pageNumber: number) => {
    const paramsObj = new URLSearchParams();
    Object.entries(activeFilters).forEach(([k, v]) => {
      if (v) paramsObj.set(k, v);
    });
    if (sort) paramsObj.set("sort", sort);
    if (pageNumber > 1) paramsObj.set("page", String(pageNumber));
    const searchStr = paramsObj.toString();
    return searchStr ? `?${searchStr}` : pathname;
  };

  const getPagesArray = (current: number, total: number) => {
    if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
    const pages: (number | string)[] = [];
    if (current <= 3) {
      pages.push(1, 2, 3, "...", total);
    } else if (current >= total - 2) {
      pages.push(1, "...", total - 2, total - 1, total);
    } else {
      pages.push(1, "...", current - 1, current, current + 1, "...", total);
    }
    return pages;
  };

  return (
    <section className="w-full">
      <div className="mb-6">
        <FilterSortBar
          title="All Products"
          totalProducts={totalProducts}
          locale={locale}
          collections={[]}
          activeCollectionHandle=""
          products={products}
          activeFilters={activeFilters}
          currentSort={sort}
          onFilterChange={handleFilterChange}
          onSortChange={handleSortChange}
          onApplyAll={handleApplyAll}
          onCategoryChange={handleCategoryChange}
        />
      </div>

      {paginatedProducts.length === 0 ? (
        <div className="flex min-h-[200px] flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 p-8 text-center dark:border-neutral-800">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            No products found
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 md:gap-6">
            {paginatedProducts.map((product) => (
              <ProductCard
                key={product.handle}
                product={product}
                locale={locale}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2 py-4">
              {currentPage > 1 ? (
                <Link
                  href={createPageUrl(currentPage - 1)}
                  onClick={(e) => {
                    e.preventDefault();
                    updateParams(activeFilters, sort, currentPage - 1);
                  }}
                  className="flex items-center gap-1 text-sm font-medium text-black hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors mr-2"
                >
                  &lt; Previous
                </Link>
              ) : (
                <span className="flex items-center gap-1 text-sm font-medium text-neutral-400 dark:text-neutral-700 cursor-not-allowed mr-2">
                  &lt; Previous
                </span>
              )}

              <div className="flex items-center gap-1">
                {getPagesArray(currentPage, totalPages).map((p, idx) => {
                  if (p === "...") {
                    return (
                      <span
                        key={`ellipse-${idx}`}
                        className="px-2 text-neutral-400 dark:text-neutral-600"
                      >
                        ...
                      </span>
                    );
                  }
                  const isCurrent = p === currentPage;
                  return (
                    <Link
                      key={p}
                      href={createPageUrl(Number(p))}
                      onClick={(e) => {
                        e.preventDefault();
                        updateParams(activeFilters, sort, Number(p));
                      }}
                      className={`flex h-10 w-10 items-center justify-center rounded-md text-sm font-medium transition-all ${
                        isCurrent
                          ? "border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-xs"
                          : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      }`}
                    >
                      {p}
                    </Link>
                  );
                })}
              </div>

              {currentPage < totalPages ? (
                <Link
                  href={createPageUrl(currentPage + 1)}
                  onClick={(e) => {
                    e.preventDefault();
                    updateParams(activeFilters, sort, currentPage + 1);
                  }}
                  className="flex items-center gap-1 text-sm font-medium text-black hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors ml-2"
                >
                  Next &gt;
                </Link>
              ) : (
                <span className="flex items-center gap-1 text-sm font-medium text-neutral-400 dark:text-neutral-700 cursor-not-allowed ml-2">
                  Next &gt;
                </span>
              )}
            </div>
          )}
        </>
      )}
    </section>
  );
}

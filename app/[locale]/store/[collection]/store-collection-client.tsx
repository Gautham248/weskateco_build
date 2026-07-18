"use client";

import { useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import StoreBanner from "components/layout/search/banner";
import FilterSortBar from "components/layout/search/filter-sort-bar";
import ProductCard from "components/product/product-card";
import Link from "next/link";
import { Product } from "lib/shopify/types";

interface CollectionItem {
  handle: string;
  title: string;
  path: string;
}

interface CollectionMeta {
  title: string;
  description?: string;
}

interface StoreCollectionClientProps {
  initialCollectionHandle: string;
  productsByCollection: Record<string, Product[]>;
  collections: CollectionItem[];
  collectionsMeta: Record<string, CollectionMeta>;
  locale: string;
  noProductsText: string;
}

export default function StoreCollectionClient({
  initialCollectionHandle,
  productsByCollection,
  collections,
  collectionsMeta,
  locale,
  noProductsText,
}: StoreCollectionClientProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Local state for active tab and filters
  const [activeHandle, setActiveHandle] = useState(initialCollectionHandle);
  const [color, setColor] = useState<string | null>(null);
  const [level, setLevel] = useState<string | null>(null);
  const [price, setPrice] = useState<string | null>(null);
  const [sort, setSort] = useState<string>("");
  const [page, setPage] = useState<number>(1);

  // Initialize and sync state with URL (handles back/forward navigation and initial load)
  useEffect(() => {
    const parts = pathname.split("/");
    const handle = parts[parts.length - 1] === "store" ? "" : parts[parts.length - 1];

    setActiveHandle(handle || "");
    setColor(searchParams.get("color"));
    setLevel(searchParams.get("level"));
    setPrice(searchParams.get("price"));
    setSort(searchParams.get("sort") || "");
    setPage(Number(searchParams.get("page")) || 1);
  }, [pathname, searchParams]);

  // Map to store initial indexing for sorting stability (relevance/trending)
  const [initialIndexMap, setInitialIndexMap] = useState<Record<string, Record<string, number>>>({});

  useEffect(() => {
    const newMap: Record<string, Record<string, number>> = {};
    Object.entries(productsByCollection).forEach(([handle, prods]) => {
      const handleMap: Record<string, number> = {};
      prods.forEach((p, idx) => {
        handleMap[p.handle] = idx;
      });
      newMap[handle] = handleMap;
    });
    setInitialIndexMap(newMap);
  }, [productsByCollection]);

  // Helper to sync states and push to URL history silently
  const updateParams = (
    newHandle: string,
    newFilters: { color: string | null; level: string | null; price: string | null },
    newSort: string,
    newPage: number
  ) => {
    // Reconstruct path with newHandle
    const pathParts = pathname.split("/");
    const storeIdx = pathParts.indexOf("store");
    if (storeIdx !== -1) {
      pathParts.splice(storeIdx + 1);
      if (newHandle !== "") {
        pathParts.push(newHandle);
      }
    }
    const newPath = pathParts.join("/");

    const params = new URLSearchParams();
    if (newFilters.color) params.set("color", newFilters.color);
    if (newFilters.level) params.set("level", newFilters.level);
    if (newFilters.price) params.set("price", newFilters.price);
    if (newSort) params.set("sort", newSort);
    if (newPage > 1) params.set("page", String(newPage));

    const searchStr = params.toString();
    const fullUrl = searchStr ? `${newPath}?${searchStr}` : newPath;

    window.history.pushState(null, "", fullUrl);

    // Update states locally
    setActiveHandle(newHandle);
    setColor(newFilters.color);
    setLevel(newFilters.level);
    setPrice(newFilters.price);
    setSort(newSort);
    setPage(newPage);
  };

  // Handlers for FilterSortBar callbacks
  const handleTabChange = (handle: string) => {
    updateParams(handle, { color, level, price }, sort, 1);
  };

  const handleFilterChange = (filters: { color: string | null; level: string | null; price: string | null }) => {
    updateParams(activeHandle, filters, sort, 1);
  };

  const handleSortChange = (newSort: string) => {
    updateParams(activeHandle, { color, level, price }, newSort, 1);
  };

  // Get products of the active collection
  const rawProducts = productsByCollection[activeHandle] || [];

  // Filter
  let filteredProducts = [...rawProducts];

  if (color) {
    const colorLower = color.toLowerCase();
    filteredProducts = filteredProducts.filter((product) => {
      const matchesOption = product.options?.some(
        (opt) =>
          opt.name.toLowerCase() === "color" &&
          opt.values.some((val) => val.toLowerCase() === colorLower)
      );
      const matchesTag = product.tags?.some((tag) => tag.toLowerCase() === colorLower);
      const matchesTitle = product.title.toLowerCase().includes(colorLower);
      const matchesDesc = product.description?.toLowerCase().includes(colorLower);
      return matchesOption || matchesTag || matchesTitle || matchesDesc;
    });
  }

  if (level) {
    const levelLower = level.toLowerCase();
    filteredProducts = filteredProducts.filter((product) => {
      const matchesTag = product.tags?.some((tag) => tag.toLowerCase() === levelLower);
      const matchesTitle = product.title.toLowerCase().includes(levelLower);
      const matchesDesc = product.description?.toLowerCase().includes(levelLower);
      return matchesTag || matchesTitle || matchesDesc;
    });
  }

  if (price) {
    const parts = price.split("-").map(Number);
    const minPrice = parts[0];
    const maxPrice = parts[1];
    if (
      minPrice !== undefined &&
      maxPrice !== undefined &&
      !isNaN(minPrice) &&
      !isNaN(maxPrice)
    ) {
      filteredProducts = filteredProducts.filter((product) => {
        const productPrice = Number(product.priceRange.minVariantPrice.amount);
        return productPrice >= minPrice && productPrice <= maxPrice;
      });
    }
  }

  // Sort in-memory
  const activeIndexMap = initialIndexMap[activeHandle] || {};
  if (sort) {
    if (sort === "price-asc") {
      filteredProducts.sort(
        (a, b) =>
          Number(a.priceRange.minVariantPrice.amount) -
          Number(b.priceRange.minVariantPrice.amount)
      );
    } else if (sort === "price-desc") {
      filteredProducts.sort(
        (a, b) =>
          Number(b.priceRange.minVariantPrice.amount) -
          Number(a.priceRange.minVariantPrice.amount)
      );
    } else if (sort === "latest-desc") {
      filteredProducts.sort((a, b) => {
        const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
        const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
        return dateB - dateA;
      });
    } else {
      // Default / Relevance / Trending (restore original order)
      filteredProducts.sort((a, b) => {
        const idxA = activeIndexMap[a.handle] ?? 9999;
        const idxB = activeIndexMap[b.handle] ?? 9999;
        return idxA - idxB;
      });
    }
  } else {
    // Restore default Shopify fetch order
    filteredProducts.sort((a, b) => {
      const idxA = activeIndexMap[a.handle] ?? 9999;
      const idxB = activeIndexMap[b.handle] ?? 9999;
      return idxA - idxB;
    });
  }

  // Pagination
  const ITEMS_PER_PAGE = 12;
  const totalProducts = filteredProducts.length;
  const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);

  // Guard page range
  const currentPage = Math.max(1, Math.min(page, totalPages || 1));

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const createPageUrl = (pageNumber: number) => {
    const paramsObj = new URLSearchParams();
    if (color) paramsObj.set("color", color);
    if (level) paramsObj.set("level", level);
    if (price) paramsObj.set("price", price);
    if (sort) paramsObj.set("sort", sort);
    if (pageNumber > 1) paramsObj.set("page", String(pageNumber));
    const searchStr = paramsObj.toString();
    return searchStr ? `?${searchStr}` : pathname;
  };

  const getPagesArray = (current: number, total: number) => {
    if (total <= 5) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
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

  const activeMeta = collectionsMeta[activeHandle] || { title: activeHandle };

  return (
    <section className="w-full">
      <StoreBanner
        title={activeMeta.title}
        description={activeMeta.description}
      />

      <div className="mb-6">
        <FilterSortBar
          title={activeMeta.title}
          totalProducts={totalProducts}
          locale={locale}
          collections={collections}
          activeCollectionHandle={activeHandle}
          onTabChange={handleTabChange}
          activeColor={color}
          activeLevel={level}
          activePrice={price}
          currentSort={sort}
          onFilterChange={handleFilterChange}
          onSortChange={handleSortChange}
        />
      </div>

      {paginatedProducts.length === 0 ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 p-8 text-center dark:border-neutral-800">
          <p className="text-base text-neutral-500 dark:text-neutral-400">
            {noProductsText}
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
                    updateParams(activeHandle, { color, level, price }, sort, currentPage - 1);
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
                        updateParams(activeHandle, { color, level, price }, sort, Number(p));
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
                    updateParams(activeHandle, { color, level, price }, sort, currentPage + 1);
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

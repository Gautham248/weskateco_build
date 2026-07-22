"use client";

import StoreBanner from "components/layout/search/banner";
import FilterSortBar from "components/layout/search/filter-sort-bar";
import ProductCard, {
  ProductCardSkeleton,
} from "components/product/product-card";
import { createTranslator } from "lib/i18n";
import { Collection, Product } from "lib/shopify/types";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";

interface CollectionItem {
  handle: string;
  title: string;
  path: string;
}

interface StoreCollectionClientProps {
  initialCollectionHandle: string;
  allProducts: Product[];
  allCollections: Collection[];
  locale: string;
  noProductsText: string;
  initialFilters?: Record<string, string>;
  initialSort?: string;
  initialPage?: number;
}

export default function StoreCollectionClient({
  initialCollectionHandle,
  allProducts,
  allCollections,
  locale,
  noProductsText,
  initialFilters = {},
  initialSort = "",
  initialPage = 1,
}: StoreCollectionClientProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Local state
  const [activeHandle, setActiveHandle] = useState(initialCollectionHandle);
  // Generalised filter map: { color: "blue", price: "0-2000", size: "8.0", ... }
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>(
    initialFilters,
  );
  const [sort, setSort] = useState<string>(initialSort);
  const [page, setPage] = useState<number>(initialPage);
  const [isPending, startTransition] = useTransition();

  // Guards so URL-sync useEffect doesn't undo pushState-based state updates
  const skipNextSyncRef = useRef(false);

  // Sync state from URL (only for back/forward navigation, not our own pushState)
  useEffect(() => {
    if (skipNextSyncRef.current) {
      skipNextSyncRef.current = false;
      return;
    }
    const parts = pathname.split("/");
    const handle =
      parts[parts.length - 1] === "store" ? "" : parts[parts.length - 1];
    setActiveHandle(handle || "");

    const filters: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      if (key !== "sort" && key !== "page" && key !== "filter")
        filters[key] = value;
    });
    setActiveFilters(filters);
    setSort(searchParams.get("sort") || "");
    setPage(Number(searchParams.get("page")) || 1);
  }, [pathname, searchParams]);

  // Build productsByCollection dynamically
  const productsByCollection = useMemo(() => {
    const map: Record<string, Product[]> = {
      "": allProducts,
    };

    allProducts.forEach((product) => {
      product.collections?.edges?.forEach((edge) => {
        const handle = edge.node.handle;
        if (!map[handle]) {
          map[handle] = [];
        }
        map[handle].push(product);
      });
    });

    return map;
  }, [allProducts]);

  const t = useMemo(() => createTranslator(locale), [locale]);

  // Build collectionsMeta dynamically
  const collectionsMeta = useMemo(() => {
    const meta: Record<string, { title: string; description?: string }> = {};

    allCollections.forEach((c) => {
      if (c.handle !== "") {
        meta[c.handle] = {
          title: c.title,
          description: c.description,
        };
      }
    });

    // Root page metadata (All Products)
    meta[""] = {
      title: t("collection.all_products"),
      description: t("collection.all_products_description"),
    };

    return meta;
  }, [allCollections, t]);

  // Store initial index map for stable sort order
  const initialIndexMap = useMemo(() => {
    const map: Record<string, Record<string, number>> = {};
    Object.entries(productsByCollection).forEach(([handle, prods]) => {
      const handleMap: Record<string, number> = {};
      prods.forEach((p, idx) => {
        handleMap[p.handle] = idx;
      });
      map[handle] = handleMap;
    });
    return map;
  }, [productsByCollection]);

  const knownHandles = useMemo(() => {
    const handles = new Set(Object.keys(productsByCollection));
    allCollections.forEach((c) => handles.add(c.handle));
    return handles;
  }, [productsByCollection, allCollections]);

  // Mapping of subcollection handles to their main category handle
  const SUB_TO_PARENT: Record<string, string> = {
    // Skateboards
    skateboards: "skateboards",
    decks: "skateboards",
    trucks: "skateboards",
    wheels: "skateboards",
    completes: "skateboards",
    accessories: "skateboards",
    "skateboard-completes": "skateboards",
    "skateboard-decks": "skateboards",
    "skateboard-trucks": "skateboards",
    "skateboard-wheels": "skateboards",
    "skateboard-accessories": "skateboards",

    // Surfskates
    surfskates: "surfskates",
    "surfskate-completes": "surfskates",
    "surfskate-decks": "surfskates",
    "surfskate-trucks": "surfskates",
    "surfskate-wheels": "surfskates",
    "surfskate-accessories": "surfskates",

    // Apparel
    "apparel-1": "apparel-1",
    apparel: "apparel-1",

    // Protection Gears
    "protection-gears": "protection-gears",
    "protective-gears": "protection-gears",
    helmets: "protection-gears",
    pads: "protection-gears",
    gloves: "protection-gears",
  };

  const CATEGORY_PREFIXES: Record<string, string> = {
    skateboards: "skateboard",
    surfskates: "surfskate",
    "apparel-1": "apparel",
    "protection-gears": "protection",
  };

  const activeParent = useMemo(() => {
    let parent = SUB_TO_PARENT[activeHandle];
    if (!parent && activeHandle) {
      const handleLower = activeHandle.toLowerCase();
      if (handleLower.includes("skateboard")) {
        parent = "skateboards";
      } else if (handleLower.includes("surfskate")) {
        parent = "surfskates";
      } else if (handleLower.includes("apparel")) {
        parent = "apparel-1";
      } else if (
        handleLower.includes("protect") ||
        handleLower.includes("helmet") ||
        handleLower.includes("pad")
      ) {
        parent = "protection-gears";
      }
    }
    return parent;
  }, [activeHandle]);

  // Compute collections dynamically for tab/subcollection pills
  const collections = useMemo(() => {
    let filtered = allCollections;

    if (activeParent) {
      const prefix = CATEGORY_PREFIXES[activeParent];
      if (prefix) {
        filtered = allCollections.filter((c) =>
          c.title.toLowerCase().startsWith(prefix),
        );
      }
    } else {
      // If we are on "/store" or a brand page (not in SUB_TO_PARENT), don't show any pills
      filtered = [];
    }

    const prefix = activeParent ? CATEGORY_PREFIXES[activeParent] : null;

    return filtered
      .filter((c) => {
        const titleLower = c.title.toLowerCase();
        const handleLower = c.handle.toLowerCase();
        if (c.handle === "") return false;
        if (
          titleLower === "skateboard and surfskate full-setups" ||
          handleLower === "surfboard full-setups"
        )
          return false;
        return true;
      })
      .map((c) => {
        let displayTitle = c.title;
        const isSameAsNav =
          displayTitle.toLowerCase() === activeHandle.toLowerCase() ||
          (prefix && displayTitle.toLowerCase() === prefix + "s");

        if (isSameAsNav) {
          displayTitle = "All";
        } else if (prefix) {
          const regex = new RegExp(`^(${prefix}s?)\\s+`, "i");
          displayTitle = displayTitle.replace(regex, "");
        }
        return {
          handle: c.handle,
          title: displayTitle,
          path: c.path,
        };
      })
      .sort((a, b) => {
        if (a.title === "All") return -1;
        if (b.title === "All") return 1;
        return 0;
      });
  }, [allCollections, activeHandle, activeParent]);

  // Sync all state and push to URL history (no router navigation — no remount)
  const updateParams = (
    newHandle: string,
    newFilters: Record<string, string>,
    newSort: string,
    newPage: number,
  ) => {
    const pathParts = pathname.split("/");
    const storeIdx = pathParts.indexOf("store");
    if (storeIdx !== -1) {
      pathParts.splice(storeIdx + 1);
      if (newHandle !== "") pathParts.push(newHandle);
    }
    const newPath = pathParts.join("/");

    const params = new URLSearchParams();
    const filterParam = searchParams.get("filter");
    if (filterParam) params.set("filter", filterParam);

    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    if (newSort) params.set("sort", newSort);
    if (newPage > 1) params.set("page", String(newPage));

    const searchStr = params.toString();
    const fullUrl = searchStr ? `${newPath}?${searchStr}` : newPath;

    // Skip the next URL-sync effect so it doesn't re-apply state from URL
    skipNextSyncRef.current = true;
    window.history.pushState(null, "", fullUrl);

    setActiveHandle(newHandle);
    setActiveFilters(newFilters);
    setSort(newSort);
    setPage(newPage);
  };

  // Callbacks for FilterSortBar
  const handleTabChange = (handle: string) => {
    updateParams(handle, activeFilters, sort, 1);
  };

  const handleFilterChange = (filters: Record<string, string>) => {
    updateParams(activeHandle, filters, sort, 1);
  };

  const handleSortChange = (newSort: string) => {
    updateParams(activeHandle, activeFilters, newSort, 1);
  };

  /** Single atomic handler — prevents the two-call race that stales filters/sort */
  const handleApplyAll = (filters: Record<string, string>, newSort: string) => {
    updateParams(activeHandle, filters, newSort, 1);
  };

  const handleCategoryChange = (handle: string) => {
    // Since all collections data is preloaded, we switch inline client-side
    if (knownHandles.has(handle) || handle === "") {
      updateParams(handle, {}, sort, 1);
      return;
    }

    // Unknown handle (fallback router.push if any)
    const pathParts = pathname.split("/");
    const storeIdx = pathParts.indexOf("store");
    if (storeIdx !== -1) {
      pathParts.splice(storeIdx + 1);
      if (handle !== "") pathParts.push(handle);
    }
    const newPath = pathParts.join("/");
    const params = new URLSearchParams();
    const filterParam = searchParams.get("filter");
    if (filterParam) params.set("filter", filterParam);
    const searchStr = params.toString();
    startTransition(() => {
      router.push(searchStr ? `${newPath}?${searchStr}` : newPath, {
        scroll: false,
      });
    });
  };

  // Raw products for the active collection
  const rawProducts = productsByCollection[activeHandle] || [];

  // Apply all active filters generically
  let filteredProducts = [...rawProducts];

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
  const activeIndexMap = initialIndexMap[activeHandle] || {};
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
          products={rawProducts}
          onTabChange={handleTabChange}
          activeFilters={activeFilters}
          currentSort={sort}
          onFilterChange={handleFilterChange}
          onSortChange={handleSortChange}
          onApplyAll={handleApplyAll}
          onCategoryChange={handleCategoryChange}
        />
      </div>

      {isPending ? (
        <div className="grid grid-cols-2 gap-x-2.5 gap-y-11 sm:grid-cols-3 lg:grid-cols-4 md:gap-x-2.5 md:gap-y-20">
          {Array.from({ length: 8 }).map((_, idx) => (
            <ProductCardSkeleton key={idx} />
          ))}
        </div>
      ) : paginatedProducts.length === 0 ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 p-8 text-center dark:border-neutral-800">
          <p className="text-base text-neutral-500 dark:text-neutral-400">
            {noProductsText}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-x-2.5 gap-y-11 sm:grid-cols-3 lg:grid-cols-4 md:gap-x-2.5 md:gap-y-20">
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
                    updateParams(
                      activeHandle,
                      activeFilters,
                      sort,
                      currentPage - 1,
                    );
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
                        updateParams(
                          activeHandle,
                          activeFilters,
                          sort,
                          Number(p),
                        );
                      }}
                      className={`flex h-10 w-10 items-center justify-center rounded-md text-sm font-medium transition-all ${isCurrent
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
                    updateParams(
                      activeHandle,
                      activeFilters,
                      sort,
                      currentPage + 1,
                    );
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

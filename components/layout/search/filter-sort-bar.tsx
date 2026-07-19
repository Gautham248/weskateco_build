"use client";

import {
  ChevronDownIcon,
  ChevronUpIcon,
  FunnelIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import {
  FilterGroup,
  deriveFiltersForCategory,
  getLabelForFilterValue,
  getHexForColorValue,
} from "lib/filters/category-filter-config";
import { sorting } from "lib/constants";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Product } from "lib/shopify/types";

interface CollectionItem {
  handle: string;
  title: string;
  path: string;
}

interface FilterSortBarProps {
  title: string;
  totalProducts: number;
  locale: string;
  collections: CollectionItem[];
  activeCollectionHandle?: string;
  products?: Product[];
  onTabChange?: (handle: string) => void;
  activeFilters?: Record<string, string>;
  currentSort?: string;
  onFilterChange?: (filters: Record<string, string>) => void;
  onSortChange?: (sort: string) => void;
  /** Preferred: atomically applies both filters and sort in one call */
  onApplyAll?: (filters: Record<string, string>, sort: string) => void;
  onCategoryChange?: (handle: string) => void;
}

// ---------------------------------------------------------------------------
// Utility: simulate filtering products against a filter map
// Used for computing per-option disabled states in the drawer
// ---------------------------------------------------------------------------

export function toggleFilterValue(
  currentVal: string | undefined,
  optionVal: string
): string | null {
  const list = currentVal ? currentVal.split(",").filter(Boolean) : [];
  const idx = list.indexOf(optionVal);
  if (idx > -1) {
    list.splice(idx, 1);
  } else {
    list.push(optionVal);
  }
  return list.length > 0 ? list.join(",") : null;
}

function applyFilterMap(
  products: Product[],
  filters: Record<string, string>
): Product[] {
  let result = [...products];

  Object.entries(filters).forEach(([key, value]) => {
    if (!value || key === "sort") return;
    const values = value.split(",").filter(Boolean);
    if (values.length === 0) return;

    if (key === "price") {
      result = result.filter((p) => {
        const price = Number(p.priceRange.minVariantPrice.amount);
        return values.some((val) => {
          const parts = val.split("-").map(Number);
          const min = parts[0] ?? 0;
          const max = parts[1] ?? Infinity;
          return price >= min && price <= max;
        });
      });
    } else if (key === "color") {
      result = result.filter((p) => {
        return values.some((val) => {
          const vl = val.toLowerCase();
          return (
            p.options?.some(
              (o) =>
                o.name.toLowerCase() === "color" &&
                o.values.some((v) => v.toLowerCase() === vl)
            ) ||
            p.tags?.some((t) => t.toLowerCase() === vl) ||
            p.title.toLowerCase().includes(vl)
          );
        });
      });
    } else if (key === "level") {
      result = result.filter((p) => {
        return values.some((val) => {
          const vl = val.toLowerCase();
          return (
            p.tags?.some((t) => t.toLowerCase() === vl) ||
            p.title.toLowerCase().includes(vl)
          );
        });
      });
    } else if (key === "size") {
      result = result.filter((p) => {
        return values.some((val) => {
          const vl = val.toLowerCase();
          return (
            p.options?.some((o) =>
              o.values.some((v) => v.toLowerCase() === vl)
            ) || p.tags?.some((t) => t.toLowerCase().includes(vl))
          );
        });
      });
    } else if (key === "brand") {
      result = result.filter((p) => {
        return values.some((val) => {
          const vl = val.toLowerCase();
          return (
            p.vendor?.toLowerCase().replace(/\s+/g, "-") === vl ||
            p.tags?.some((t) => t.toLowerCase() === vl) ||
            p.title.toLowerCase().includes(vl)
          );
        });
      });
    } else {
      result = result.filter((p) => {
        return values.some((val) => {
          const vl = val.toLowerCase();
          return (
            p.tags?.some((t) => t.toLowerCase().includes(vl)) ||
            p.title.toLowerCase().includes(vl) ||
            p.options?.some((o) =>
              o.values.some((v) => v.toLowerCase().includes(vl))
            )
          );
        });
      });
    }
  });

  return result;
}

function simulateCount(
  products: Product[],
  activeFilters: Record<string, string>,
  groupId: string,
  optionValue: string
): number {
  const testFilters = { ...activeFilters };
  testFilters[groupId] = optionValue;
  return applyFilterMap(products, testFilters).length;
}

// ---------------------------------------------------------------------------
// Main FilterSortBar
// ---------------------------------------------------------------------------

export default function FilterSortBar({
  title,
  totalProducts,
  locale,
  collections,
  activeCollectionHandle = "",
  products = [],
  onTabChange,
  activeFilters: propFilters,
  currentSort: propSort,
  onFilterChange,
  onSortChange,
  onApplyAll,
  onCategoryChange,
}: FilterSortBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Filter drawer state bound to URL parameter
  const isFilterOpen = searchParams.get("filter") === "open";

  // Resolve active values — from props (controlled) or URL (uncontrolled)
  const activeFilters: Record<string, string> =
    propFilters !== undefined
      ? propFilters
      : (() => {
          const result: Record<string, string> = {};
          searchParams.forEach((value, key) => {
            if (key !== "sort" && key !== "page" && key !== "filter") result[key] = value;
          });
          return result;
        })();

  const currentSort =
    propSort !== undefined ? propSort : searchParams.get("sort") || "";

  const openFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("filter", "open");
    router.push(`${pathname}?${params.toString()}`);
  };

  const closeFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("filter");
    router.push(`${pathname}?${params.toString()}`);
  };

  // Instant update callback triggered on every option change
  const handleUpdate = (
    filters: Record<string, string>,
    sort: string
  ) => {
    if (onApplyAll) {
      onApplyAll(filters, sort);
    } else if (onFilterChange || onSortChange) {
      onFilterChange?.(filters);
      onSortChange?.(sort);
    } else {
      const params = new URLSearchParams(searchParams.toString());
      Array.from(searchParams.keys()).forEach((k) => {
        if (k !== "page") params.delete(k);
      });
      Object.entries(filters).forEach(([k, v]) => {
        if (v) params.set(k, v);
      });
      if (sort) params.set("sort", sort);
      else params.delete("sort");
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    }
  };

  const removeFilter = (key: string) => {
    const next = { ...activeFilters };
    delete next[key];
    handleUpdate(next, currentSort);
  };

  const clearAllFilters = () => {
    handleUpdate({}, "");
  };

  const filterGroups = deriveFiltersForCategory(activeCollectionHandle);
  const activeFilterEntries = Object.entries(activeFilters).filter(([, v]) => v);
  const activeFiltersCount = activeFilterEntries.length;
  const hasActiveFilters = activeFiltersCount > 0;

  // Count badge: active filters + non-default sort
  const badgeCount = activeFiltersCount + (currentSort ? 1 : 0);

  return (
    <div className="w-full bg-white text-black py-4 border-b border-neutral-100 dark:bg-neutral-950 dark:text-white dark:border-neutral-900">
      {/* Top Row */}
      <div className="flex flex-col px-0 md:px-2">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex-1 min-w-[180px]">
            <h2
              className="text-[clamp(1.5rem,3.5vw,2rem)] font-extrabold tracking-[-1%] uppercase leading-tight"
              style={{ fontFamily: "'Clash Display', sans-serif" }}
            >
              {title}
              <span className="hidden md:inline-block ml-2 text-xs md:text-sm font-medium text-neutral-500 dark:text-neutral-400 whitespace-nowrap normal-case font-sans tracking-normal align-middle">
                (Showing 1 – {totalProducts} products of {totalProducts}{" "}
                products)
              </span>
            </h2>
          </div>

          {/* Single "Filter & Sort" button — mobile */}
          <div className="flex items-center gap-3 text-neutral-800 dark:text-neutral-200 md:hidden ml-auto">
            <button
              onClick={openFilters}
              aria-label="Filter and Sort"
              className="p-1 cursor-pointer hover:opacity-75 transition-opacity relative"
            >
              <FunnelIcon className="h-6 w-6 stroke-[1.8]" />
              {badgeCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#CCFF02] text-[10px] font-black text-black shadow-sm">
                  {badgeCount}
                </span>
              )}
            </button>
          </div>

          {/* Single "Filter & Sort" button — desktop */}
          <div className="hidden md:flex items-center gap-4 text-sm font-semibold tracking-wider uppercase">
            <button
              onClick={openFilters}
              className="flex items-center gap-2 cursor-pointer hover:opacity-75 transition-opacity py-1.5"
            >
              <div className="relative">
                <FunnelIcon className="h-4 w-4" />
                {badgeCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#CCFF02] text-[8px] font-black text-black shadow-sm">
                    {badgeCount}
                  </span>
                )}
              </div>
              <span>Filter &amp; Sort</span>
            </button>
          </div>
        </div>

        {/* Mobile showing count */}
        <div className="mt-1 md:hidden">
          <span className="text-xs md:text-sm font-medium text-neutral-600 dark:text-neutral-400">
            (Showing 1 – {totalProducts} products of {totalProducts} products)
          </span>
        </div>
      </div>

      {/* Subcollection pills + Active filter chips */}
      {(collections.length > 0 || hasActiveFilters) && (
        <div className="mt-5 flex flex-col gap-4 px-0 md:px-2">
          {collections.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none max-w-full">
              {collections.map((coll) => {
                const isActive = activeCollectionHandle === coll.handle;
                const linkHref =
                  coll.handle === "" ? `/store` : `/store/${coll.handle}`;
                return (
                  <Link
                    key={coll.handle}
                    href={linkHref}
                    prefetch={true}
                    onClick={(e) => {
                      if (onTabChange) {
                        e.preventDefault();
                        onTabChange(coll.handle);
                      }
                    }}
                    className={clsx(
                      "px-3 py-2 md:px-6 md:py-3 rounded-[6px] text-[clamp(0.813rem,2vw,1rem)] font-medium whitespace-nowrap transition-all duration-200 border",
                      isActive
                        ? "bg-black text-white border-black dark:bg-white dark:text-black dark:border-white"
                        : "bg-neutral-100 text-neutral-800 border-transparent hover:bg-neutral-200 dark:bg-neutral-900/35 dark:text-neutral-200 dark:hover:bg-neutral-800"
                    )}
                  >
                    {coll.title}
                  </Link>
                );
              })}
            </div>
          )}

          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2.5">
              {activeFilterEntries.flatMap(([key, value]) => {
                const values = value.split(",").filter(Boolean);
                return values.map((val) => {
                  const label = getLabelForFilterValue(key, val, filterGroups);
                  const hex = getHexForColorValue(val, filterGroups);
                  return (
                    <span
                      key={`${key}-${val}`}
                      className="flex items-center gap-2 px-2 py-1.5 md:px-3 md:py-2 bg-neutral-100 dark:bg-neutral-900 rounded-[6px] text-[clamp(0.75rem,1.5vw,0.875rem)] text-neutral-800 dark:text-neutral-200 font-medium"
                    >
                      {hex && (
                        <span
                          className="w-3.5 h-3.5 rounded-full inline-block border border-black/10 flex-shrink-0"
                          style={{ backgroundColor: hex }}
                        />
                      )}
                      {label}
                      <button
                        onClick={() => {
                          const nextVal = toggleFilterValue(activeFilters[key], val);
                          const nextFilters = { ...activeFilters };
                          if (nextVal === null) {
                            delete nextFilters[key];
                          } else {
                            nextFilters[key] = nextVal;
                          }
                          handleUpdate(nextFilters, currentSort);
                        }}
                        className="ml-1 hover:text-black dark:hover:text-white cursor-pointer font-bold text-xs opacity-70 hover:opacity-100"
                      >
                        &#x2715;
                      </button>
                    </span>
                  );
                });
              })}

              <button
                onClick={clearAllFilters}
                className="text-xs font-semibold underline text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white cursor-pointer ml-1"
              >
                Clear All
              </button>
            </div>
          )}
        </div>
      )}

      {/* Filter + Sort Drawer */}
      {isFilterOpen && (
        <FilterDrawer
          filterGroups={filterGroups}
          activeFilters={activeFilters}
          currentSort={currentSort}
          products={products}
          onUpdate={handleUpdate}
          onClose={closeFilters}
          activeCollectionHandle={activeCollectionHandle}
          onCategoryChange={onCategoryChange}
          collections={collections}
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Checkbox
// ---------------------------------------------------------------------------

function Checkbox({ checked, disabled }: { checked: boolean; disabled?: boolean }) {
  return (
    <span
      className={clsx(
        "w-5 h-5 rounded-[4px] border flex items-center justify-center transition-colors flex-shrink-0 pointer-events-none",
        checked
          ? "bg-rose-500 border-rose-500 text-white"
          : "border-neutral-300 dark:border-neutral-700 bg-white dark:bg-black",
        disabled && "opacity-40"
      )}
    >
      {checked && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="3.5"
          stroke="currentColor"
          className="w-3.5 h-3.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m4.5 12.75 6 6 9-13.5"
          />
        </svg>
      )}
    </span>
  );
}

// ---------------------------------------------------------------------------
// FilterDrawer
// ---------------------------------------------------------------------------

function FilterDrawer({
  filterGroups,
  activeFilters,
  currentSort,
  products,
  onUpdate,
  onClose,
  activeCollectionHandle,
  onCategoryChange,
  collections,
}: {
  filterGroups: FilterGroup[];
  activeFilters: Record<string, string>;
  currentSort: string;
  products: Product[];
  onUpdate: (filters: Record<string, string>, sort: string) => void;
  onClose: () => void;
  activeCollectionHandle: string;
  onCategoryChange?: (handle: string) => void;
  collections: CollectionItem[];
}) {
  const router = useRouter();
  const pathname = usePathname();

  // ALL sections collapsed by default
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    filterGroups.forEach((g) => {
      initial[g.id] = false;
    });
    return initial;
  });

  const toggleGroup = (id: string) =>
    setOpenGroups((prev) => ({ ...prev, [id]: !prev[id] }));

  const setFilterValue = (groupId: string, value: string | null) => {
    if (value === null) {
      const next = { ...activeFilters };
      delete next[groupId];
      onUpdate(next, currentSort);
    } else {
      if (groupId === "price") {
        const next = { ...activeFilters };
        next[groupId] = value;
        onUpdate(next, currentSort);
      } else {
        const nextVal = toggleFilterValue(activeFilters[groupId], value);
        const next = { ...activeFilters };
        if (nextVal === null) {
          delete next[groupId];
        } else {
          next[groupId] = nextVal;
        }
        onUpdate(next, currentSort);
      }
    }
  };

  const handleCategorySelect = (handle: string) => {
    if (onCategoryChange) {
      onCategoryChange(handle);
    } else {
      const pathParts = pathname.split("/");
      const storeIdx = pathParts.indexOf("store");
      if (storeIdx !== -1) {
        pathParts.splice(storeIdx + 1);
        if (handle !== "") pathParts.push(handle);
      }
      router.push(pathParts.join("/"));
    }
  };

  const clearPending = () => {
    onUpdate({}, "");
    if (activeCollectionHandle) {
      handleCategorySelect("");
    }
  };

  // Preview count: how many products would result from active filters
  const previewCount = applyFilterMap(products, activeFilters).length;

  // Derive active tags for the drawer list
  const activeDrawerFilters: { id: string; label: string; type: "category" | "filter" | "sort" }[] = [];

  if (activeCollectionHandle) {
    const catGroup = filterGroups.find((g) => g.id === "category");
    const catOpt = catGroup?.options.find((o) => o.value === activeCollectionHandle);
    if (catOpt) {
      activeDrawerFilters.push({
        id: "category",
        label: catOpt.label,
        type: "category",
      });
    } else {
      const coll = collections.find((c) => c.handle === activeCollectionHandle);
      if (coll && coll.title && coll.title !== "All") {
        activeDrawerFilters.push({
          id: "category",
          label: coll.title,
          type: "category",
        });
      } else {
        activeDrawerFilters.push({
          id: "category",
          label: activeCollectionHandle.charAt(0).toUpperCase() + activeCollectionHandle.slice(1),
          type: "category",
        });
      }
    }
  }

  Object.entries(activeFilters).forEach(([key, value]) => {
    if (value) {
      const values = value.split(",").filter(Boolean);
      values.forEach((val) => {
        const label = getLabelForFilterValue(key, val, filterGroups);
        activeDrawerFilters.push({
          id: `${key}:${val}`,
          label,
          type: "filter",
        });
      });
    }
  });

  if (currentSort) {
    const sortObj = sorting.find((s) => s.slug === currentSort);
    if (sortObj) {
      activeDrawerFilters.push({
        id: "sort",
        label: sortObj.title,
        type: "sort",
      });
    }
  }

  const removeDrawerFilterTag = (tag: { id: string; label: string; type: "category" | "filter" | "sort" }) => {
    if (tag.type === "category") {
      handleCategorySelect("");
    } else if (tag.type === "sort") {
      onUpdate(activeFilters, "");
    } else {
      const [groupId, optionVal] = tag.id.split(":");
      if (groupId && optionVal) {
        const nextVal = toggleFilterValue(activeFilters[groupId], optionVal);
        const nextFilters = { ...activeFilters };
        if (nextVal === null) {
          delete nextFilters[groupId];
        } else {
          nextFilters[groupId] = nextVal;
        }
        onUpdate(nextFilters, currentSort);
      }
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-neutral-950 shadow-2xl z-50 flex flex-col transition-transform duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-100 dark:border-neutral-900">
          <div className="flex items-center gap-3">
            <FunnelIcon className="h-5 w-5" />
            <h3
              className="text-xl font-bold uppercase tracking-wider"
              style={{ fontFamily: "'Clash Display', sans-serif" }}
            >
              Filter Items
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 flex items-center justify-center transition-colors"
          >
            <XMarkIcon className="h-5 w-5 text-black dark:text-white" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          {/* Active Filters Panel */}
          {activeDrawerFilters.length > 0 && (
            <div className="px-6 py-5 border-b border-neutral-100 dark:border-neutral-900 bg-neutral-50/50 dark:bg-neutral-900/10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400"
                    style={{ fontFamily: "Archivo, sans-serif" }}
                  >
                    Active Filters
                  </span>
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black text-white dark:bg-white dark:text-black text-[10px] font-bold">
                    {activeDrawerFilters.length}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={clearPending}
                  className="flex items-center gap-1 text-xs font-semibold text-neutral-500 hover:text-black dark:hover:text-white cursor-pointer"
                >
                  <span>Remove all filters</span>
                  <span className="text-[10px]">✕</span>
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {activeDrawerFilters.map((tag) => (
                  <span
                    key={`${tag.type}-${tag.id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-[6px] text-xs font-medium text-neutral-800 dark:text-neutral-200"
                  >
                    <span>{tag.label}</span>
                    <button
                      type="button"
                      onClick={() => removeDrawerFilterTag(tag)}
                      className="hover:text-rose-500 cursor-pointer font-bold ml-0.5 text-neutral-400 hover:text-rose-500"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {filterGroups.map((group, idx) => {
            const isOpen = openGroups[group.id] ?? false;
            const isLast = idx === filterGroups.length - 1;

            // Compute active counts for number ticker beside heading (splits commas)
            const filterVal = activeFilters[group.id];
            const activeCount =
              group.id === "sort"
                ? (currentSort ? 1 : 0)
                : group.id === "category"
                ? (activeCollectionHandle ? 1 : 0)
                : (filterVal ? filterVal.split(",").filter(Boolean).length : 0);

            return (
              <div
                key={group.id}
                className={clsx(
                  "border-b border-neutral-100 dark:border-neutral-900",
                  isLast ? "border-b-0" : ""
                )}
              >
                {/* Group header */}
                <button
                  type="button"
                  onClick={() => toggleGroup(group.id)}
                  className="flex w-full items-center justify-between px-6 py-4 text-base font-bold uppercase tracking-wider text-black dark:text-white"
                  style={{ fontFamily: "'Clash Display', sans-serif" }}
                >
                  <span className="flex items-center gap-2">
                    <span className={clsx(activeCount > 0 && "text-rose-600 dark:text-rose-400 font-bold")}>
                      {group.label}
                    </span>
                    {activeCount > 0 && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black text-white dark:bg-white dark:text-black text-[10px] font-black">
                        {activeCount}
                      </span>
                    )}
                  </span>
                  {isOpen ? (
                    <ChevronUpIcon className="w-4 h-4 stroke-[2.5] flex-shrink-0" />
                  ) : (
                    <ChevronDownIcon className="w-4 h-4 stroke-[2.5] flex-shrink-0" />
                  )}
                </button>

                {/* Group content */}
                {isOpen && (
                  <div className="px-6 pb-5">
                    {group.id === "sort" ? (
                      <SortGroup
                        group={group}
                        currentSort={currentSort}
                        onUpdateSort={(s) => onUpdate(activeFilters, s)}
                      />
                    ) : group.type === "color-swatch" ? (
                      <ColorSwatchGroup
                        group={group}
                        activeFilters={activeFilters}
                        setFilterValue={setFilterValue}
                        products={products}
                      />
                    ) : group.type === "range-radio" ? (
                      <PriceSliderGroup
                        activeFilters={activeFilters}
                        setFilterValue={setFilterValue}
                        products={products}
                      />
                    ) : group.type === "category" ? (
                      <CategoryGroup
                        group={group}
                        activeCollectionHandle={activeCollectionHandle}
                        onCategorySelect={handleCategorySelect}
                      />
                    ) : (
                      <CheckboxGroup
                        group={group}
                        activeFilters={activeFilters}
                        setFilterValue={setFilterValue}
                        products={products}
                      />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-neutral-100 dark:border-neutral-900">
          <p className="text-center text-sm text-neutral-500 dark:text-neutral-400 mb-4">
            &#x24D8;&nbsp;{previewCount} items were found
          </p>
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-4 text-center bg-black text-white dark:bg-white dark:text-black rounded-lg text-sm font-bold uppercase tracking-widest hover:opacity-90 transition-opacity cursor-pointer"
              style={{ fontFamily: "Archivo, sans-serif" }}
            >
              DONE
            </button>
            <button
              type="button"
              onClick={clearPending}
              className="w-full py-4 text-center border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-black text-black dark:text-white rounded-lg text-sm font-bold uppercase tracking-widest hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors cursor-pointer"
              style={{ fontFamily: "Archivo, sans-serif" }}
            >
              CLEAR ALL
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Group renderers
// ---------------------------------------------------------------------------

function SortGroup({
  group,
  currentSort,
  onUpdateSort,
}: {
  group: FilterGroup;
  currentSort: string;
  onUpdateSort: (s: string) => void;
}) {
  return (
    <div className="flex flex-col gap-4 pl-1">
      {group.options.map((opt) => {
        const isSelected = currentSort === opt.value;
        return (
          <button
            type="button"
            key={opt.value}
            onClick={() => onUpdateSort(isSelected ? "" : opt.value)}
            className="flex items-center gap-3 w-full text-left text-sm font-medium text-neutral-800 dark:text-neutral-200 cursor-pointer hover:opacity-80 transition-opacity"
            style={{ fontFamily: "Archivo, sans-serif" }}
          >
            <Checkbox checked={isSelected} />
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function CheckboxGroup({
  group,
  activeFilters,
  setFilterValue,
  products,
}: {
  group: FilterGroup;
  activeFilters: Record<string, string>;
  setFilterValue: (id: string, value: string | null) => void;
  products: Product[];
}) {
  return (
    <div className="flex flex-col gap-4 pl-1">
      {group.options.map((opt) => {
        const isSelected = activeFilters[group.id]?.split(",").includes(opt.value) ?? false;
        const count = simulateCount(products, activeFilters, group.id, opt.value);
        const isDisabled = count === 0 && !isSelected;
        return (
          <button
            type="button"
            key={opt.value}
            onClick={() =>
              !isDisabled &&
              setFilterValue(group.id, opt.value)
            }
            disabled={isDisabled}
            className={clsx(
              "flex items-center gap-3 w-full text-left text-sm font-medium text-neutral-800 dark:text-neutral-200 transition-opacity",
              isDisabled
                ? "opacity-35 cursor-not-allowed"
                : "cursor-pointer hover:opacity-80"
            )}
            style={{ fontFamily: "Archivo, sans-serif" }}
          >
            <Checkbox checked={isSelected} disabled={isDisabled} />
            <span className="flex-1">{opt.label}</span>
            {!isDisabled && (
              <span className="text-xs text-neutral-400 dark:text-neutral-600">
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function ColorSwatchGroup({
  group,
  activeFilters,
  setFilterValue,
  products,
}: {
  group: FilterGroup;
  activeFilters: Record<string, string>;
  setFilterValue: (id: string, value: string | null) => void;
  products: Product[];
}) {
  return (
    <div className="flex flex-col gap-4 pl-1">
      {group.options.map((opt) => {
        const isSelected = activeFilters[group.id]?.split(",").includes(opt.value) ?? false;
        const count = simulateCount(products, activeFilters, group.id, opt.value);
        const isDisabled = count === 0 && !isSelected;
        return (
          <button
            type="button"
            key={opt.value}
            onClick={() =>
              !isDisabled &&
              setFilterValue(group.id, opt.value)
            }
            disabled={isDisabled}
            className={clsx(
              "flex items-center gap-3 w-full text-left text-sm font-medium text-neutral-800 dark:text-neutral-200 transition-opacity",
              isDisabled
                ? "opacity-35 cursor-not-allowed"
                : "cursor-pointer hover:opacity-80"
            )}
            style={{ fontFamily: "Archivo, sans-serif" }}
          >
            <Checkbox checked={isSelected} disabled={isDisabled} />
            {opt.hex && (
              <span
                className="w-5 h-5 rounded-full border border-black/10 inline-block flex-shrink-0"
                style={{ backgroundColor: opt.hex }}
              />
            )}
            <span className="flex-1">{opt.label}</span>
            {!isDisabled && (
              <span className="text-xs text-neutral-400 dark:text-neutral-600">
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function PriceSliderGroup({
  activeFilters,
  setFilterValue,
  products,
}: {
  activeFilters: Record<string, string>;
  setFilterValue: (id: string, value: string | null) => void;
  products: Product[];
}) {
  const prices = products.map((p) => Number(p.priceRange.minVariantPrice.amount));
  const absoluteMin = prices.length > 0 ? Math.min(...prices) : 0;
  const absoluteMax = prices.length > 0 ? Math.max(...prices) : 10000;
  const range = absoluteMax - absoluteMin || 1;

  // Sync tempMin/tempMax with activeFilters or absolute limits
  const [tempMin, setTempMin] = useState(absoluteMin);
  const [tempMax, setTempMax] = useState(absoluteMax);

  useEffect(() => {
    if (activeFilters.price) {
      const parts = activeFilters.price.split("-").map(Number);
      const pMin = parts[0] ?? absoluteMin;
      const pMax = parts[1] ?? absoluteMax;
      setTempMin(pMin);
      setTempMax(pMax);
    } else {
      setTempMin(absoluteMin);
      setTempMax(absoluteMax);
    }
  }, [activeFilters.price, absoluteMin, absoluteMax]);

  // Compute histogram bins (24 bars)
  const binCount = 24;
  const bins = Array(binCount).fill(0);
  prices.forEach((price) => {
    const binIdx = Math.min(
      Math.floor(((price - absoluteMin) / range) * binCount),
      binCount - 1
    );
    if (binIdx >= 0 && binIdx < binCount) {
      bins[binIdx]++;
    }
  });
  const maxBinCount = Math.max(...bins, 1);

  const handleMinChange = (val: number) => {
    const newMin = Math.min(val, tempMax - 1);
    setTempMin(newMin);
    updateFilter(newMin, tempMax);
  };

  const handleMaxChange = (val: number) => {
    const newMax = Math.max(val, tempMin + 1);
    setTempMax(newMax);
    updateFilter(tempMin, newMax);
  };

  const updateFilter = (minVal: number, maxVal: number) => {
    if (minVal === absoluteMin && maxVal === absoluteMax) {
      setFilterValue("price", null);
    } else {
      setFilterValue("price", `${minVal}-${maxVal}`);
    }
  };

  return (
    <div className="px-1 py-2 dual-range-slider">
      {/* Local styles for overlay sliders and thumbs */}
      <style>{`
        .dual-range-slider .slider-container {
          position: relative;
          width: 100%;
          height: 16px;
        }
        .dual-range-slider input[type="range"] {
          position: absolute;
          width: 100%;
          height: 6px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          pointer-events: none;
          -webkit-appearance: none;
        }
        .dual-range-slider input[type="range"]::-webkit-slider-thumb {
          pointer-events: auto;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #ffffff;
          border: 3px solid #000000;
          cursor: pointer;
          -webkit-appearance: none;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
        }
        .dual-range-slider input[type="range"]::-moz-range-thumb {
          pointer-events: auto;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #ffffff;
          border: 3px solid #000000;
          cursor: pointer;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
        }
        .dark .dual-range-slider input[type="range"]::-webkit-slider-thumb {
          background: #171717;
          border: 3px solid #ffffff;
        }
        .dark .dual-range-slider input[type="range"]::-moz-range-thumb {
          background: #171717;
          border: 3px solid #ffffff;
        }
      `}</style>

      {/* Histogram */}
      <div className="flex items-end justify-between gap-[2px] h-12 w-full mb-3 px-1">
        {bins.map((count, idx) => {
          const binMin = absoluteMin + (idx / binCount) * range;
          const binMax = absoluteMin + ((idx + 1) / binCount) * range;
          const isSelected = binMin >= tempMin && binMax <= tempMax;
          const heightPct = (count / maxBinCount) * 100;
          return (
            <div
              key={idx}
              className="flex-1 rounded-[1px] transition-colors duration-150"
              style={{
                height: `${Math.max(heightPct, 4)}%`,
                backgroundColor: count === 0 ? "transparent" : (isSelected ? "#ef4444" : "#e5e5e5"),
              }}
            />
          );
        })}
      </div>

      {/* Sliders Container */}
      <div className="slider-container mb-4">
        {/* Underlay Track */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-neutral-200 dark:bg-neutral-800 rounded-full" />
        
        {/* Selected Fill Track */}
        <div
          className="absolute top-1/2 -translate-y-1/2 h-1 bg-black dark:bg-white rounded-full"
          style={{
            left: `${((tempMin - absoluteMin) / range) * 100}%`,
            right: `${100 - ((tempMax - absoluteMin) / range) * 100}%`,
          }}
        />

        {/* Min Range Slider */}
        <input
          type="range"
          min={absoluteMin}
          max={absoluteMax}
          value={tempMin}
          onChange={(e) => handleMinChange(Number(e.target.value))}
          style={{ zIndex: tempMin > absoluteMax - range / 2 ? 5 : 3 }}
        />

        {/* Max Range Slider */}
        <input
          type="range"
          min={absoluteMin}
          max={absoluteMax}
          value={tempMax}
          onChange={(e) => handleMaxChange(Number(e.target.value))}
          style={{ zIndex: 4 }}
        />
      </div>

      {/* Label and Matches count */}
      <div className="mt-2 text-center text-xs font-semibold text-neutral-800 dark:text-neutral-200" style={{ fontFamily: "Archivo, sans-serif" }}>
        <span>
          ₹{tempMin.toLocaleString()} - ₹{tempMax.toLocaleString()}{" "}
          ({applyFilterMap(products, { ...activeFilters, price: `${tempMin}-${tempMax}` }).length})
        </span>
      </div>
    </div>
  );
}

function CategoryGroup({
  group,
  activeCollectionHandle,
  onCategorySelect,
}: {
  group: FilterGroup;
  activeCollectionHandle: string;
  onCategorySelect: (handle: string) => void;
}) {
  return (
    <div className="flex flex-col gap-4 pl-1">
      {group.options.map((opt) => {
        const isActive = activeCollectionHandle === opt.value;
        return (
          <button
            type="button"
            key={opt.value}
            onClick={() => onCategorySelect(opt.value)}
            className="flex items-center gap-3 w-full text-left text-sm font-medium text-neutral-800 dark:text-neutral-200 cursor-pointer hover:opacity-80 transition-opacity"
            style={{ fontFamily: "Archivo, sans-serif" }}
          >
            <Checkbox checked={isActive} />
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}


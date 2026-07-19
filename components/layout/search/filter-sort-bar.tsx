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
import { useState } from "react";
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
  // Optional controlled props for client-side state
  onTabChange?: (handle: string) => void;
  activeFilters?: Record<string, string>;
  currentSort?: string;
  onFilterChange?: (filters: Record<string, string>) => void;
  onSortChange?: (sort: string) => void;
  onCategoryChange?: (handle: string) => void;
}

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
  onCategoryChange,
}: FilterSortBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  // Resolve active filters — from props (controlled) or from URL (uncontrolled)
  const activeFilters: Record<string, string> = propFilters !== undefined
    ? propFilters
    : (() => {
        const result: Record<string, string> = {};
        searchParams.forEach((value, key) => {
          if (key !== "sort" && key !== "page") result[key] = value;
        });
        return result;
      })();

  const currentSort =
    propSort !== undefined
      ? propSort
      : searchParams.get("sort") || "";

  // Local (pending) filter state inside the drawer — only applied on APPLY
  const [pendingFilters, setPendingFilters] = useState<Record<string, string>>({});

  const openFilters = () => {
    setPendingFilters({ ...activeFilters });
    setIsFilterOpen(true);
  };

  const applyFilters = () => {
    if (onFilterChange) {
      onFilterChange(pendingFilters);
      setIsFilterOpen(false);
    } else {
      const params = new URLSearchParams(searchParams.toString());
      // Remove all old filter params first
      Array.from(searchParams.keys()).forEach((k) => {
        if (k !== "sort" && k !== "page") params.delete(k);
      });
      // Apply pending filters
      Object.entries(pendingFilters).forEach(([k, v]) => {
        if (v) params.set(k, v);
      });
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
      setIsFilterOpen(false);
    }
  };

  const clearPendingFilters = () => {
    setPendingFilters({});
  };

  const clearAllFilters = () => {
    if (onFilterChange) {
      onFilterChange({});
    } else {
      const params = new URLSearchParams(searchParams.toString());
      Array.from(searchParams.keys()).forEach((k) => {
        if (k !== "sort" && k !== "page") params.delete(k);
      });
      router.push(`${pathname}?${params.toString()}`);
    }
  };

  const removeFilter = (key: string) => {
    if (onFilterChange) {
      const next = { ...activeFilters };
      delete next[key];
      onFilterChange(next);
    } else {
      const params = new URLSearchParams(searchParams.toString());
      params.delete(key);
      router.push(`${pathname}?${params.toString()}`);
    }
  };

  const updateSort = (value: string | null) => {
    if (onSortChange) {
      onSortChange(value || "");
    } else {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set("sort", value);
      else params.delete("sort");
      router.push(`${pathname}?${params.toString()}`);
    }
  };

  // Derived display values
  const filterGroups = deriveFiltersForCategory(activeCollectionHandle);
  const activeSortObj = sorting.find((s) => s.slug === currentSort) || sorting[0];

  const activeFilterEntries = Object.entries(activeFilters).filter(
    ([, v]) => v
  );
  const activeFiltersCount = activeFilterEntries.length;
  const hasActiveFilters = activeFiltersCount > 0;

  return (
    <div className="w-full bg-white text-black py-4 border-b border-neutral-100 dark:bg-neutral-950 dark:text-white dark:border-neutral-900">
      {/* Top Row: Title, showing count, Filter & Sort buttons */}
      <div className="flex flex-col px-0 md:px-2">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex-1 min-w-[180px]">
            <h2
              className="text-[clamp(1.5rem,3.5vw,2rem)] font-extrabold tracking-[-1%] uppercase leading-tight"
              style={{ fontFamily: "'Clash Display', sans-serif" }}
            >
              {title}
              <span className="hidden md:inline-block ml-2 text-xs md:text-sm font-medium text-neutral-500 dark:text-neutral-400 whitespace-nowrap normal-case font-sans tracking-normal align-middle">
                (Showing 1 – {totalProducts} products of {totalProducts} products)
              </span>
            </h2>
          </div>

          {/* Mobile Filter / Sort Icons */}
          <div className="flex items-center gap-3 text-neutral-800 dark:text-neutral-200 md:hidden ml-auto">
            <button
              onClick={openFilters}
              aria-label="Filter"
              className="p-1 cursor-pointer hover:opacity-75 transition-opacity relative"
            >
              <FunnelIcon className="h-6 w-6 stroke-[1.8]" />
              {activeFiltersCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#CCFF02] text-[10px] font-black text-black shadow-sm">
                  {activeFiltersCount}
                </span>
              )}
            </button>
            <div className="h-6 w-px bg-neutral-200 dark:bg-neutral-800" />
            <div className="relative">
              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                aria-label="Sort"
                className="p-1 cursor-pointer hover:opacity-75 transition-opacity"
              >
                <svg
                  className="h-6 w-6 stroke-[1.8]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 6h18 M6 12h12 M9 18h6"
                  />
                </svg>
              </button>
              {isSortOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsSortOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-52 bg-white border border-neutral-200 rounded-lg shadow-xl z-20 overflow-hidden dark:bg-neutral-900 dark:border-neutral-800">
                    {sorting.map((option) => (
                      <button
                        key={option.slug || "default"}
                        onClick={() => {
                          updateSort(option.slug);
                          setIsSortOpen(false);
                        }}
                        className={clsx(
                          "w-full text-left px-4 py-2.5 text-xs hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors",
                          {
                            "bg-neutral-50 font-bold dark:bg-neutral-800":
                              currentSort === (option.slug || ""),
                          }
                        )}
                      >
                        {option.title}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Desktop Filter / Sort Buttons */}
          <div className="hidden md:flex items-center gap-4 text-sm font-semibold tracking-wider uppercase">
            <button
              onClick={openFilters}
              className="flex items-center gap-2 cursor-pointer hover:opacity-75 transition-opacity py-1.5"
            >
              <div className="relative">
                <FunnelIcon className="h-4 w-4" />
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#CCFF02] text-[8px] font-black text-black shadow-sm">
                    {activeFiltersCount}
                  </span>
                )}
              </div>
              <span>Filter</span>
            </button>

            <div className="h-4 w-px bg-neutral-300 dark:bg-neutral-800" />

            <div className="relative">
              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex items-center gap-2 cursor-pointer hover:opacity-75 transition-opacity py-1.5"
              >
                <svg
                  className="h-5 w-5 stroke-[1.8]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 6h18 M6 12h12 M9 18h6"
                  />
                </svg>
                <span className="cursor-pointer">
                  Sort By: {activeSortObj?.title}
                </span>
              </button>

              {isSortOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsSortOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-52 bg-white border border-neutral-200 rounded-lg shadow-xl z-20 overflow-hidden dark:bg-neutral-900 dark:border-neutral-800">
                    {sorting.map((option) => (
                      <button
                        key={option.slug || "default"}
                        onClick={() => {
                          updateSort(option.slug);
                          setIsSortOpen(false);
                        }}
                        className={clsx(
                          "cursor-pointer w-full text-left px-4 py-2.5 text-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors",
                          {
                            "bg-neutral-100 font-bold dark:bg-neutral-800":
                              currentSort === (option.slug || ""),
                          }
                        )}
                      >
                        {option.title}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile showing count */}
        <div className="mt-1 md:hidden">
          <span className="text-xs md:text-sm font-medium text-neutral-600 dark:text-neutral-400">
            (Showing 1 – {totalProducts} products of {totalProducts} products)
          </span>
        </div>
      </div>

      {/* Bottom Row: Subcollection pills + Active filter chips */}
      {(collections.length > 0 || hasActiveFilters) && (
        <div className="mt-5 flex flex-col gap-4 px-0 md:px-2">
          {/* Subcollection pills */}
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

          {/* Active filter chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2.5">
              {activeFilterEntries.map(([key, value]) => {
                const label = getLabelForFilterValue(key, value, filterGroups);
                const hex = getHexForColorValue(value, filterGroups);
                return (
                  <span
                    key={key}
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
                      onClick={() => removeFilter(key)}
                      className="ml-1 hover:text-black dark:hover:text-white cursor-pointer font-bold text-xs opacity-70 hover:opacity-100"
                    >
                      &#x2715;
                    </button>
                  </span>
                );
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

      {/* Slide-over Filter Panel */}
      {isFilterOpen && (
        <FilterDrawer
          filterGroups={filterGroups}
          pendingFilters={pendingFilters}
          setPendingFilters={setPendingFilters}
          totalProducts={totalProducts}
          applyFilters={applyFilters}
          clearPendingFilters={clearPendingFilters}
          onClose={() => setIsFilterOpen(false)}
          activeCollectionHandle={activeCollectionHandle}
          onCategoryChange={onCategoryChange}
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Checkbox component (unchanged from original)
// ---------------------------------------------------------------------------

function Checkbox({ checked }: { checked: boolean }) {
  return (
    <span
      className={clsx(
        "w-5 h-5 rounded-[4px] border flex items-center justify-center transition-colors flex-shrink-0 pointer-events-none",
        checked
          ? "bg-rose-500 border-rose-500 text-white"
          : "border-neutral-300 dark:border-neutral-700 bg-white dark:bg-black"
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
// FilterDrawer — dynamic, config-driven
// ---------------------------------------------------------------------------

function FilterDrawer({
  filterGroups,
  pendingFilters,
  setPendingFilters,
  totalProducts,
  applyFilters,
  clearPendingFilters,
  onClose,
  activeCollectionHandle,
  onCategoryChange,
}: {
  filterGroups: FilterGroup[];
  pendingFilters: Record<string, string>;
  setPendingFilters: (f: Record<string, string>) => void;
  totalProducts: number;
  applyFilters: () => void;
  clearPendingFilters: () => void;
  onClose: () => void;
  activeCollectionHandle: string;
  onCategoryChange?: (handle: string) => void;
}) {
  const router = useRouter();
  const pathname = usePathname();

  // Track which groups are open (default: all open)
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    filterGroups.forEach((g) => {
      initial[g.id] = true;
    });
    return initial;
  });

  const toggleGroup = (id: string) => {
    setOpenGroups((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const setFilterValue = (groupId: string, value: string | null) => {
    const next = { ...pendingFilters };
    if (value === null || value === "") {
      delete next[groupId];
    } else {
      next[groupId] = value;
    }
    setPendingFilters(next);
  };

  const handleCategorySelect = (handle: string) => {
    // Close drawer first, then navigate
    onClose();
    if (onCategoryChange) {
      onCategoryChange(handle);
    } else {
      // Navigate to the collection route
      const pathParts = pathname.split("/");
      const storeIdx = pathParts.indexOf("store");
      if (storeIdx !== -1) {
        pathParts.splice(storeIdx + 1);
        if (handle !== "") pathParts.push(handle);
      }
      router.push(pathParts.join("/"));
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
          {filterGroups.map((group, idx) => {
            const isOpen = openGroups[group.id] ?? true;
            const isLast = idx === filterGroups.length - 1;

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
                  <span>{group.label}</span>
                  {isOpen ? (
                    <ChevronUpIcon className="w-4 h-4 stroke-[2.5] flex-shrink-0" />
                  ) : (
                    <ChevronDownIcon className="w-4 h-4 stroke-[2.5] flex-shrink-0" />
                  )}
                </button>

                {/* Group content */}
                {isOpen && (
                  <div className="px-6 pb-5">
                    {group.type === "color-swatch" ? (
                      <ColorSwatchGroup
                        group={group}
                        pendingFilters={pendingFilters}
                        setFilterValue={setFilterValue}
                      />
                    ) : group.type === "range-radio" ? (
                      <RangeRadioGroup
                        group={group}
                        pendingFilters={pendingFilters}
                        setFilterValue={setFilterValue}
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
                        pendingFilters={pendingFilters}
                        setFilterValue={setFilterValue}
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
          {/* Results count */}
          <p className="text-center text-sm text-neutral-500 dark:text-neutral-400 mb-4">
            &#x24D8;&nbsp;{totalProducts} items were found
          </p>
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={applyFilters}
              className="w-full py-4 text-center bg-black text-white dark:bg-white dark:text-black rounded-lg text-sm font-bold uppercase tracking-widest hover:opacity-90 transition-opacity cursor-pointer"
              style={{ fontFamily: "Archivo, sans-serif" }}
            >
              APPLY
            </button>
            <button
              type="button"
              onClick={clearPendingFilters}
              className="w-full py-4 text-center border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-black text-black dark:text-white rounded-lg text-sm font-bold uppercase tracking-widest hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors cursor-pointer"
              style={{ fontFamily: "Archivo, sans-serif" }}
            >
              CLEAR
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Sub-group renderers
// ---------------------------------------------------------------------------

function CheckboxGroup({
  group,
  pendingFilters,
  setFilterValue,
}: {
  group: FilterGroup;
  pendingFilters: Record<string, string>;
  setFilterValue: (id: string, value: string | null) => void;
}) {
  return (
    <div className="flex flex-col gap-4 pl-1">
      {group.options.map((opt) => {
        const isSelected = pendingFilters[group.id] === opt.value;
        return (
          <button
            type="button"
            key={opt.value}
            onClick={() => setFilterValue(group.id, isSelected ? null : opt.value)}
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

function ColorSwatchGroup({
  group,
  pendingFilters,
  setFilterValue,
}: {
  group: FilterGroup;
  pendingFilters: Record<string, string>;
  setFilterValue: (id: string, value: string | null) => void;
}) {
  return (
    <div className="flex flex-col gap-4 pl-1">
      {group.options.map((opt) => {
        const isSelected = pendingFilters[group.id] === opt.value;
        return (
          <button
            type="button"
            key={opt.value}
            onClick={() => setFilterValue(group.id, isSelected ? null : opt.value)}
            className="flex items-center gap-3 w-full text-left text-sm font-medium text-neutral-800 dark:text-neutral-200 cursor-pointer hover:opacity-80 transition-opacity"
            style={{ fontFamily: "Archivo, sans-serif" }}
          >
            <Checkbox checked={isSelected} />
            {opt.hex && (
              <span
                className="w-5 h-5 rounded-full border border-black/10 inline-block flex-shrink-0"
                style={{ backgroundColor: opt.hex }}
              />
            )}
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function RangeRadioGroup({
  group,
  pendingFilters,
  setFilterValue,
}: {
  group: FilterGroup;
  pendingFilters: Record<string, string>;
  setFilterValue: (id: string, value: string | null) => void;
}) {
  return (
    <div className="flex flex-col gap-4 pl-1">
      {group.options.map((opt) => {
        const isSelected = pendingFilters[group.id] === opt.value;
        return (
          <button
            type="button"
            key={opt.value}
            onClick={() => setFilterValue(group.id, isSelected ? null : opt.value)}
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

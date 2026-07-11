"use client";

import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import { FunnelIcon, AdjustmentsHorizontalIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { sorting } from "lib/constants";
import clsx from "clsx";

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
}

const COLORS = [
  { name: "Orange", value: "orange", hex: "#f97316" },
  { name: "Blue", value: "blue", hex: "#3b82f6" },
  { name: "Yellow", value: "yellow", hex: "#eab308" },
  { name: "Black", value: "black", hex: "#000000" },
  { name: "White", value: "white", hex: "#ffffff" },
];

const SKILL_LEVELS = [
  { name: "Beginner", value: "beginner" },
  { name: "Intermediate", value: "intermediate" },
  { name: "Professional", value: "professional" },
];

const PRICE_RANGES = [
  { name: "Under ₹2,000", value: "0-2000" },
  { name: "₹2,000 - ₹5,000", value: "2000-5000" },
  { name: "₹5,000 - ₹10,000", value: "5000-10000" },
  { name: "Over ₹10,000", value: "10000-999999" },
];

export default function FilterSortBar({
  title,
  totalProducts,
  locale,
  collections,
  activeCollectionHandle = "",
}: FilterSortBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  // Active filters from URL
  const activeColor = searchParams.get("color");
  const activeLevel = searchParams.get("level");
  const activePrice = searchParams.get("price");
  const currentSort = searchParams.get("sort") || "";

  // Helper to update URL params
  const updateUrlParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearAllFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("color");
    params.delete("level");
    params.delete("price");
    router.push(`${pathname}?${params.toString()}`);
  };

  // Find active items for display
  const activeColorObj = COLORS.find((c) => c.value === activeColor);
  const activeLevelObj = SKILL_LEVELS.find((l) => l.value === activeLevel);
  const activePriceObj = PRICE_RANGES.find((p) => p.value === activePrice);
  const activeSortObj = sorting.find((s) => s.slug === currentSort) || sorting[0];

  const hasActiveFilters = !!(activeColor || activeLevel || activePrice);

  return (
    <div className="w-full bg-white text-black py-4 border-b border-neutral-100 dark:bg-neutral-950 dark:text-white dark:border-neutral-900">
      {/* Top Row: Title, showing count, Filter & Sort buttons */}
      <div className="flex flex-col px-4 md:px-2">
        <div className="flex items-center justify-between">
          <h2 className="text-[28px] md:text-3xl font-extrabold tracking-tight uppercase leading-tight">
            {title}
          </h2>

          {/* Mobile Filter / Sort Icons */}
          <div className="flex items-center gap-3 text-neutral-800 dark:text-neutral-200 md:hidden">
            <button
              onClick={() => setIsFilterOpen(true)}
              aria-label="Filter"
              className="p-1 cursor-pointer hover:opacity-75 transition-opacity"
            >
              <FunnelIcon className="h-6 w-6 stroke-[1.8]" />
            </button>
            <div className="h-6 w-px bg-neutral-200 dark:bg-neutral-800" />
            <div className="relative">
              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                aria-label="Sort"
                className="p-1 cursor-pointer hover:opacity-75 transition-opacity"
              >
                <svg className="h-6 w-6 stroke-[1.8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M3 12h14M3 18h10" />
                </svg>
              </button>
              
              {/* Sort Dropdown */}
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
                          updateUrlParam("sort", option.slug);
                          setIsSortOpen(false);
                        }}
                        className={clsx(
                          "w-full text-left px-4 py-2.5 text-xs hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors",
                          {
                            "bg-neutral-50 font-bold dark:bg-neutral-800": currentSort === (option.slug || ""),
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
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-2 cursor-pointer hover:opacity-75 transition-opacity py-1.5"
            >
              <FunnelIcon className="h-4 w-4" />
              <span>Filter</span>
            </button>
            
            <div className="h-4 w-px bg-neutral-300 dark:bg-neutral-800" />

            <div className="relative">
              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex items-center gap-2 cursor-pointer hover:opacity-75 transition-opacity py-1.5"
              >
                <AdjustmentsHorizontalIcon className="h-4 w-4" />
                <span>Sort By: {activeSortObj?.title}</span>
              </button>

              {/* Sort Dropdown */}
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
                          updateUrlParam("sort", option.slug);
                          setIsSortOpen(false);
                        }}
                        className={clsx(
                          "w-full text-left px-4 py-2.5 text-xs hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors",
                          {
                            "bg-neutral-50 font-bold dark:bg-neutral-800": currentSort === (option.slug || ""),
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

        {/* Showing Count */}
        <div className="mt-1">
          <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
            (Showing 1 – {totalProducts} products of {totalProducts} products)
          </span>
        </div>
      </div>

      {/* Bottom Row: Subcollection pills + Active filters chips */}
      <div className="mt-5 flex flex-col gap-4 px-4 md:px-2">
        {/* Subcollection pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none max-w-full">
          {collections.map((coll) => {
            const isActive = activeCollectionHandle === coll.handle;
            const linkHref = coll.handle === "" ? `/search` : `/search/${coll.handle}`;
            
            return (
              <Link
                key={coll.handle}
                href={linkHref}
                className={clsx(
                  "px-6 py-3 rounded-[6px] text-[15px] font-medium whitespace-nowrap transition-all duration-200 border",
                  isActive
                    ? "bg-black text-white border-black dark:bg-white dark:text-black dark:border-white"
                    : "bg-neutral-100 text-neutral-800 border-transparent hover:bg-neutral-200 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                )}
              >
                {coll.title}
              </Link>
            );
          })}
        </div>

        {/* Active filters chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2.5">
            {activeColorObj && (
              <span className="flex items-center gap-2 px-3 py-2 bg-neutral-100 dark:bg-neutral-900 rounded-[6px] text-[14px] text-neutral-800 dark:text-neutral-200 font-medium">
                <span
                  className="w-3.5 h-3.5 rounded-full inline-block border border-black/10"
                  style={{ backgroundColor: activeColorObj.hex }}
                />
                {activeColorObj.name} Color
                <button
                  onClick={() => updateUrlParam("color", null)}
                  className="ml-1 hover:text-black dark:hover:text-white cursor-pointer font-bold text-xs opacity-70 hover:opacity-100"
                >
                  &#x2715;
                </button>
              </span>
            )}

            {activeLevelObj && (
              <span className="flex items-center gap-2 px-3 py-2 bg-neutral-100 dark:bg-neutral-900 rounded-[6px] text-[14px] text-neutral-800 dark:text-neutral-200 font-medium">
                {activeLevelObj.name}
                <button
                  onClick={() => updateUrlParam("level", null)}
                  className="ml-1 hover:text-black dark:hover:text-white cursor-pointer font-bold text-xs opacity-70 hover:opacity-100"
                >
                  &#x2715;
                </button>
              </span>
            )}

            {activePriceObj && (
              <span className="flex items-center gap-2 px-3 py-2 bg-neutral-100 dark:bg-neutral-900 rounded-[6px] text-[14px] text-neutral-800 dark:text-neutral-200 font-medium">
                {activePriceObj.name.replace("₹", "Rs. ")}
                <button
                  onClick={() => updateUrlParam("price", null)}
                  className="ml-1 hover:text-black dark:hover:text-white cursor-pointer font-bold text-xs opacity-70 hover:opacity-100"
                >
                  &#x2715;
                </button>
              </span>
            )}

            <button
              onClick={clearAllFilters}
              className="text-xs font-semibold underline text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white cursor-pointer ml-1"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Slide-over Filter Panel */}
      {isFilterOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 transition-opacity"
            onClick={() => setIsFilterOpen(false)}
          />
          {/* Drawer Content */}
          <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-neutral-950 shadow-2xl z-50 flex flex-col transition-transform duration-300">
            <div className="flex items-center justify-between p-6 border-b border-neutral-100 dark:border-neutral-900">
              <h3 className="text-lg font-bold uppercase tracking-wider">Filters</h3>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Color Filter */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-4 dark:text-neutral-400">
                  Color
                </h4>
                <div className="flex flex-wrap gap-3">
                  {COLORS.map((c) => (
                    <button
                      key={c.value}
                      onClick={() => {
                        updateUrlParam("color", activeColor === c.value ? null : c.value);
                      }}
                      className={clsx(
                        "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer",
                        activeColor === c.value
                          ? "bg-black border-black text-white dark:bg-white dark:border-white dark:text-black"
                          : "bg-neutral-50 border-neutral-200 text-neutral-800 hover:bg-neutral-100 dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-800"
                      )}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/10 inline-block"
                        style={{ backgroundColor: c.hex }}
                      />
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Skill Level Filter */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-4 dark:text-neutral-400">
                  Skill Level
                </h4>
                <div className="flex flex-wrap gap-3">
                  {SKILL_LEVELS.map((level) => (
                    <button
                      key={level.value}
                      onClick={() => {
                        updateUrlParam("level", activeLevel === level.value ? null : level.value);
                      }}
                      className={clsx(
                        "px-4 py-2 rounded-lg text-xs font-medium border transition-all cursor-pointer",
                        activeLevel === level.value
                          ? "bg-black border-black text-white dark:bg-white dark:border-white dark:text-black"
                          : "bg-neutral-50 border-neutral-200 text-neutral-800 hover:bg-neutral-100 dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-800"
                      )}
                    >
                      {level.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-4 dark:text-neutral-400">
                  Price Range
                </h4>
                <div className="flex flex-col gap-2">
                  {PRICE_RANGES.map((price) => (
                    <button
                      key={price.value}
                      onClick={() => {
                        updateUrlParam("price", activePrice === price.value ? null : price.value);
                      }}
                      className={clsx(
                        "w-full text-left px-4 py-3 rounded-lg text-xs font-medium border transition-all cursor-pointer flex justify-between items-center",
                        activePrice === price.value
                          ? "bg-black border-black text-white dark:bg-white dark:border-white dark:text-black"
                          : "bg-neutral-50 border-neutral-200 text-neutral-800 hover:bg-neutral-100 dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-200"
                      )}
                    >
                      <span>{price.name}</span>
                      {activePrice === price.value && (
                        <span className="w-1.5 h-1.5 bg-white dark:bg-black rounded-full" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-neutral-100 dark:border-neutral-900 flex items-center justify-between gap-4">
              <button
                onClick={clearAllFilters}
                className="flex-1 py-3 text-center border border-neutral-200 rounded-xl text-xs font-semibold tracking-wider uppercase hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-900 transition-colors cursor-pointer"
              >
                Clear All
              </button>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="flex-1 py-3 text-center bg-black text-white dark:bg-white dark:text-black rounded-xl text-xs font-semibold tracking-wider uppercase hover:opacity-90 transition-opacity cursor-pointer"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

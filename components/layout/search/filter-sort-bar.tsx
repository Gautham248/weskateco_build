"use client";

import {
  AdjustmentsHorizontalIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  FunnelIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { sorting } from "lib/constants";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

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

  // Local selection states inside the filter drawer
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null);

  const openFilters = () => {
    setSelectedColor(activeColor);
    setSelectedLevel(activeLevel);
    setSelectedPrice(activePrice);
    setIsFilterOpen(true);
  };

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (selectedColor) params.set("color", selectedColor);
    else params.delete("color");

    if (selectedLevel) params.set("level", selectedLevel);
    else params.delete("level");

    if (selectedPrice) params.set("price", selectedPrice);
    else params.delete("price");

    params.delete("page");

    router.push(`${pathname}?${params.toString()}`);
    setIsFilterOpen(false);
  };

  const clearLocalFilters = () => {
    setSelectedColor(null);
    setSelectedLevel(null);
    setSelectedPrice(null);
  };

  // Helper to update URL params (for instant chips/sort updates outside drawer)
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
  const activeSortObj =
    sorting.find((s) => s.slug === currentSort) || sorting[0];

  const hasActiveFilters = !!(activeColor || activeLevel || activePrice);

  return (
    <div className="w-full bg-white text-black py-4 border-b border-neutral-100 dark:bg-neutral-950 dark:text-white dark:border-neutral-900">
      {/* Top Row: Title, showing count, Filter & Sort buttons */}
      <div className="flex flex-col px-0 md:px-2">
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <h2
              className="text-[clamp(1.5rem,3.5vw,2rem)] font-extrabold tracking-[-1%] uppercase leading-tight"
              style={{ fontFamily: "'Clash Display', sans-serif" }}
            >
              {title}
            </h2>
            <span className="hidden md:inline text-xs md:text-sm font-medium text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
              (Showing 1 – {totalProducts} products of {totalProducts} products)
            </span>
          </div>

          {/* Mobile Filter / Sort Icons */}
          <div className="flex items-center gap-3 text-neutral-800 dark:text-neutral-200 md:hidden">
            <button
              onClick={openFilters}
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
                <svg
                  className="h-6 w-6 stroke-[1.8]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 6h18M3 12h14M3 18h10"
                  />
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
                            "bg-neutral-50 font-bold dark:bg-neutral-800":
                              currentSort === (option.slug || ""),
                          },
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
                <span className="cursor-pointer">
                  Sort By: {activeSortObj?.title}
                </span>
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
                          "cursor-pointer w-full text-left px-4 py-2.5 text-xs hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors",
                          {
                            "bg-neutral-50 font-bold dark:bg-neutral-800":
                              currentSort === (option.slug || ""),
                          },
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
        <div className="mt-1 md:hidden">
          <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
            (Showing 1 – {totalProducts} products of {totalProducts} products)
          </span>
        </div>
      </div>

      {/* Bottom Row: Subcollection pills + Active filters chips */}
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
                    className={clsx(
                      "px-6 py-3 rounded-[6px] text-[clamp(0.813rem,2vw,1rem)] font-medium whitespace-nowrap transition-all duration-200 border",
                      isActive
                        ? "bg-black text-white border-black dark:bg-white dark:text-black dark:border-white"
                        : "bg-neutral-100 text-neutral-800 border-transparent hover:bg-neutral-200 dark:bg-neutral-900/35 dark:text-neutral-200 dark:hover:bg-neutral-800",
                    )}
                  >
                    {coll.title}
                  </Link>
                );
              })}
            </div>
          )}

          {/* Active filters chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2.5">
              {activeColorObj && (
                <span className="flex items-center gap-2 px-3 py-2 bg-neutral-100 dark:bg-neutral-900 rounded-[6px] text-[clamp(0.75rem,1.5vw,0.875rem)] text-neutral-800 dark:text-neutral-200 font-medium">
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
                <span className="flex items-center gap-2 px-3 py-2 bg-neutral-100 dark:bg-neutral-900 rounded-[6px] text-[clamp(0.75rem,1.5vw,0.875rem)] text-neutral-800 dark:text-neutral-200 font-medium">
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
                <span className="flex items-center gap-2 px-3 py-2 bg-neutral-100 dark:bg-neutral-900 rounded-[6px] text-[clamp(0.75rem,1.5vw,0.875rem)] text-neutral-800 dark:text-neutral-200 font-medium">
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
      )}

      {/* Slide-over Filter Panel */}
      {isFilterOpen && (
        <FilterDrawer
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          selectedLevel={selectedLevel}
          setSelectedLevel={setSelectedLevel}
          selectedPrice={selectedPrice}
          setSelectedPrice={setSelectedPrice}
          applyFilters={applyFilters}
          clearLocalFilters={clearLocalFilters}
          onClose={() => setIsFilterOpen(false)}
        />
      )}
    </div>
  );
}

function Checkbox({ checked }: { checked: boolean }) {
  return (
    <span
      className={clsx(
        "w-5 h-5 rounded-[4px] border flex items-center justify-center transition-colors flex-shrink-0 pointer-events-none",
        checked
          ? "bg-rose-500 border-rose-500 text-white"
          : "border-neutral-300 dark:border-neutral-700 bg-white dark:bg-black",
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

function FilterDrawer({
  selectedColor,
  setSelectedColor,
  selectedLevel,
  setSelectedLevel,
  selectedPrice,
  setSelectedPrice,
  applyFilters,
  clearLocalFilters,
  onClose,
}: {
  selectedColor: string | null;
  setSelectedColor: (c: string | null) => void;
  selectedLevel: string | null;
  setSelectedLevel: (l: string | null) => void;
  selectedPrice: string | null;
  setSelectedPrice: (p: string | null) => void;
  applyFilters: () => void;
  clearLocalFilters: () => void;
  onClose: () => void;
}) {
  const [openGroups, setOpenGroups] = useState({
    level: true,
    color: true,
    price: true,
  });

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 transition-opacity"
        onClick={onClose}
      />
      {/* Drawer Content */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-neutral-950 shadow-2xl z-50 flex flex-col transition-transform duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-100 dark:border-neutral-900">
          <h3
            className="text-xl font-bold uppercase tracking-wider"
            style={{ fontFamily: "'Clash Display', sans-serif" }}
          >
            Filters
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 flex items-center justify-center transition-colors"
          >
            <XMarkIcon className="h-5 w-5 text-black dark:text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Skill Level Filter (Size equivalent) */}
          <div className="border-b border-neutral-100 dark:border-neutral-900 pb-6">
            <button
              type="button"
              onClick={() =>
                setOpenGroups((prev) => ({ ...prev, level: !prev.level }))
              }
              className="flex w-full items-center justify-between text-base font-bold uppercase tracking-wider text-black dark:text-white py-2"
              style={{ fontFamily: "'Clash Display', sans-serif" }}
            >
              <span>Size</span>
              {openGroups.level ? (
                <ChevronUpIcon className="w-4 h-4 stroke-[2.5]" />
              ) : (
                <ChevronDownIcon className="w-4 h-4 stroke-[2.5]" />
              )}
            </button>
            {openGroups.level && (
              <div className="mt-4 flex flex-col gap-4 pl-1">
                {SKILL_LEVELS.map((level) => {
                  const isSelected = selectedLevel === level.value;
                  return (
                    <button
                      type="button"
                      key={level.value}
                      onClick={() =>
                        setSelectedLevel(isSelected ? null : level.value)
                      }
                      className="flex items-center gap-3 w-full text-left text-sm font-medium text-neutral-800 dark:text-neutral-200 cursor-pointer hover:opacity-80 transition-opacity"
                      style={{ fontFamily: "Archivo" }}
                    >
                      <Checkbox checked={isSelected} />
                      <span>{level.name}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Color Filter */}
          <div className="border-b border-neutral-100 dark:border-neutral-900 pb-6">
            <button
              type="button"
              onClick={() =>
                setOpenGroups((prev) => ({ ...prev, color: !prev.color }))
              }
              className="flex w-full items-center justify-between text-base font-bold uppercase tracking-wider text-black dark:text-white py-2"
              style={{ fontFamily: "'Clash Display', sans-serif" }}
            >
              <span>Colour</span>
              {openGroups.color ? (
                <ChevronUpIcon className="w-4 h-4 stroke-[2.5]" />
              ) : (
                <ChevronDownIcon className="w-4 h-4 stroke-[2.5]" />
              )}
            </button>
            {openGroups.color && (
              <div className="mt-4 flex flex-col gap-4 pl-1">
                {COLORS.map((c) => {
                  const isSelected = selectedColor === c.value;
                  return (
                    <button
                      type="button"
                      key={c.value}
                      onClick={() =>
                        setSelectedColor(isSelected ? null : c.value)
                      }
                      className="flex items-center gap-3 w-full text-left text-sm font-medium text-neutral-800 dark:text-neutral-200 cursor-pointer hover:opacity-80 transition-opacity"
                      style={{ fontFamily: "Archivo" }}
                    >
                      <Checkbox checked={isSelected} />
                      <span
                        className="w-5 h-5 rounded-full border border-black/10 inline-block flex-shrink-0"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span>{c.name}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Price Range Filter (Wheel size equivalent) */}
          <div className="pb-6">
            <button
              type="button"
              onClick={() =>
                setOpenGroups((prev) => ({ ...prev, price: !prev.price }))
              }
              className="flex w-full items-center justify-between text-base font-bold uppercase tracking-wider text-black dark:text-white py-2"
              style={{ fontFamily: "'Clash Display', sans-serif" }}
            >
              <span>Price Range</span>
              {openGroups.price ? (
                <ChevronUpIcon className="w-4 h-4 stroke-[2.5]" />
              ) : (
                <ChevronDownIcon className="w-4 h-4 stroke-[2.5]" />
              )}
            </button>
            {openGroups.price && (
              <div className="mt-4 flex flex-col gap-4 pl-1">
                {PRICE_RANGES.map((price) => {
                  const isSelected = selectedPrice === price.value;
                  return (
                    <button
                      type="button"
                      key={price.value}
                      onClick={() =>
                        setSelectedPrice(isSelected ? null : price.value)
                      }
                      className="flex items-center gap-3 w-full text-left text-sm font-medium text-neutral-800 dark:text-neutral-200 cursor-pointer hover:opacity-80 transition-opacity"
                      style={{ fontFamily: "Archivo" }}
                    >
                      <Checkbox checked={isSelected} />
                      <span>{price.name}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-6 border-t border-neutral-100 dark:border-neutral-900 flex flex-col gap-3">
          <button
            type="button"
            onClick={applyFilters}
            className="w-full py-4 text-center bg-black text-white dark:bg-white dark:text-black rounded-lg text-sm font-bold uppercase tracking-widest hover:opacity-90 transition-opacity cursor-pointer"
            style={{ fontFamily: "Archivo" }}
          >
            APPLY
          </button>
          <button
            type="button"
            onClick={clearLocalFilters}
            className="w-full py-4 text-center border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-black text-black dark:text-white rounded-lg text-sm font-bold uppercase tracking-widest hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors cursor-pointer"
            style={{ fontFamily: "Archivo" }}
          >
            CLEAR
          </button>
        </div>
      </div>
    </>
  );
}

"use client";

import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

export interface FilterGroupOption {
  label: string;
  value: string;
  count?: number;
}

export interface ConfiguratorFilterGroup {
  id: string;
  label: string;
  options: FilterGroupOption[];
}

interface FilterSidebarProps {
  compatibilityFilterOn: boolean;
  onToggleCompatibilityFilter: (enabled: boolean) => void;
  showOutOfStock: boolean;
  onToggleOutOfStock: (enabled: boolean) => void;
  filterGroups: ConfiguratorFilterGroup[];
  selectedFilters: Record<string, string[]>;
  onFilterChange: (groupId: string, value: string) => void;
  onClearAllFilters: () => void;
}

export function FilterSidebar({
  compatibilityFilterOn,
  onToggleCompatibilityFilter,
  showOutOfStock,
  onToggleOutOfStock,
  filterGroups,
  selectedFilters,
  onFilterChange,
  onClearAllFilters,
}: FilterSidebarProps) {
  // Accordion collapsed state — open by default
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (groupId: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupId]: prev[groupId] === undefined ? false : !prev[groupId],
    }));
  };

  const activeChipsCount = Object.values(selectedFilters).reduce(
    (acc, arr) => acc + arr.length,
    0,
  );

  return (
    <aside className="flex h-full w-full flex-col rounded-xl border border-neutral-200 bg-white p-5 md:w-64 lg:w-72 dark:border-neutral-800 dark:bg-neutral-950">
      {/* Top Header section - fixed */}
      <div className="flex-shrink-0">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-4 dark:border-neutral-900">
          <h2
            className="text-lg font-bold uppercase tracking-tight text-black dark:text-white"
            style={{ fontFamily: "'Clash Display', sans-serif" }}
          >
            Filter By
          </h2>
          {activeChipsCount > 0 && (
            <button
              onClick={onClearAllFilters}
              className="text-xs font-semibold text-neutral-500 uppercase underline transition-colors hover:text-black dark:text-neutral-400 dark:hover:text-white"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Compatibility Filter Switch */}
        <div className="mt-5 border-b border-neutral-100 pb-4 dark:border-neutral-900">
          <div className="flex items-center justify-between">
            <div>
              <span className="block text-sm font-bold text-neutral-900 dark:text-neutral-100">
                Compatibility
              </span>
              <span className="text-[10px] text-neutral-500 dark:text-neutral-400">
                {compatibilityFilterOn ? "Hiding incompatible" : "Showing all"}
              </span>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={compatibilityFilterOn}
              onClick={() => onToggleCompatibilityFilter(!compatibilityFilterOn)}
              className={clsx(
                "relative inline-flex h-6 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                compatibilityFilterOn ? "bg-rose-500" : "bg-neutral-300 dark:bg-neutral-700",
              )}
            >
              <span
                className={clsx(
                  "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                  compatibilityFilterOn ? "translate-x-6" : "translate-x-0",
                )}
              />
            </button>
          </div>
        </div>

        {/* Out of Stock Toggle */}
        <div className="mb-5 border-b border-neutral-100 pb-4 dark:border-neutral-900">
          <div className="flex items-center justify-between">
            <div>
              <span className="block text-sm font-bold text-neutral-900 dark:text-neutral-100">
                Show Out of Stock
              </span>
              <span className="text-[10px] text-neutral-500 dark:text-neutral-400">
                {showOutOfStock ? "Showing unavailable" : "In-stock only"}
              </span>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={showOutOfStock}
              onClick={() => onToggleOutOfStock(!showOutOfStock)}
              className={clsx(
                "relative inline-flex h-6 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                showOutOfStock ? "bg-neutral-800 dark:bg-white" : "bg-neutral-300 dark:bg-neutral-700",
              )}
            >
              <span
                className={clsx(
                  "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out dark:bg-neutral-900",
                  showOutOfStock ? "translate-x-6" : "translate-x-0",
                )}
              />
            </button>
          </div>
        </div>

        {/* Active Filter Chips */}
        {activeChipsCount > 0 && (
          <div className="mb-5 flex flex-wrap gap-2 border-b border-neutral-100 pb-4 dark:border-neutral-900">
            {Object.entries(selectedFilters).flatMap(([groupId, values]) =>
              values.map((val) => (
                <span
                  key={`${groupId}-${val}`}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-800 dark:bg-neutral-900 dark:text-neutral-200"
                >
                  <span>{val}</span>
                  <button
                    type="button"
                    onClick={() => onFilterChange(groupId, val)}
                    className="font-bold text-neutral-400 transition-colors hover:text-rose-500"
                  >
                    ✕
                  </button>
                </span>
              )),
            )}
          </div>
        )}
      </div>

      {/* Scrollable Accordions */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-4">
        {filterGroups.map((group) => {
          const isOpen = openGroups[group.id] !== false; // open by default
          const selectedForGroup = selectedFilters[group.id] || [];

          if (group.options.length === 0) return null;

          return (
            <div
              key={group.id}
              className="border-b border-neutral-100 pb-4 last:border-none dark:border-neutral-900"
            >
              <button
                type="button"
                onClick={() => toggleGroup(group.id)}
                className="flex w-full items-center justify-between text-left text-sm font-semibold uppercase tracking-wider text-neutral-800 dark:text-neutral-200"
              >
                <span>{group.label}</span>
                {isOpen ? (
                  <ChevronUpIcon className="h-4 w-4 text-neutral-500" />
                ) : (
                  <ChevronDownIcon className="h-4 w-4 text-neutral-500" />
                )}
              </button>

              {isOpen && (
                <div className="mt-3 max-h-56 space-y-2 overflow-y-auto pr-1">
                  {group.options.map((opt) => {
                    const isChecked = selectedForGroup.includes(opt.value);
                    return (
                      <label
                        key={opt.value}
                        className="flex cursor-pointer items-center justify-between text-xs text-neutral-600 transition-colors hover:text-black dark:text-neutral-400 dark:hover:text-white"
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => onFilterChange(group.id, opt.value)}
                            className="h-4 w-4 rounded border-neutral-300 text-rose-500 focus:ring-rose-500 dark:border-neutral-700 dark:bg-black"
                          />
                          <span>{opt.label}</span>
                        </div>
                        {opt.count !== undefined && (
                          <span className="text-[10px] text-neutral-400">
                            ({opt.count})
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}

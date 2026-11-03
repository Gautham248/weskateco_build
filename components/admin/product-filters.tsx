"use client";

import clsx from "clsx";
import type {
  AdminFacets,
  AdminProductFilters,
  AvailabilityFilter,
  OverrideFilter,
} from "lib/admin/product-filters";

const FILTER_PANEL_ID = "admin-product-filters";

const AVAILABILITY_OPTIONS: { value: AvailabilityFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "in-stock", label: "In stock" },
  { value: "sold-out", label: "Sold out" },
];

const OVERRIDE_OPTIONS: { value: OverrideFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "overridden", label: "Overridden" },
  { value: "not-overridden", label: "Not overridden" },
];

const inputClasses =
  "w-full rounded-sm border border-neutral-300 bg-white px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-neutral-400 focus:border-black dark:border-neutral-700 dark:bg-neutral-900 dark:focus:border-white";

const legendClasses =
  "text-xs font-semibold tracking-wider text-neutral-600 uppercase dark:text-neutral-400";

function FacetGroup({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: { value: string; count: number }[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  if (options.length === 0) {
    return null;
  }

  return (
    <fieldset className="min-w-0">
      <legend className={legendClasses}>{label}</legend>

      <ul className="mt-2 max-h-56 space-y-1.5 overflow-y-auto pr-1">
        {options.map((option) => {
          const isChecked = selected.includes(option.value);

          return (
            <li key={option.value}>
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => onToggle(option.value)}
                  className="h-3.5 w-3.5 flex-none rounded border-neutral-400"
                />
                <span className="truncate">{option.value}</span>
                <span className="ml-auto flex-none text-xs text-neutral-400 dark:text-neutral-500">
                  {option.count}
                </span>
              </label>
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
}

function PillGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div>
      <span className={legendClasses}>{label}</span>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={value === option.value}
            onClick={() => onChange(option.value)}
            className={clsx(
              "cursor-pointer rounded-[8px] border px-2.5 py-1 text-xs font-medium transition-all",
              value === option.value
                ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                : "border-transparent bg-neutral-100 text-neutral-800 hover:bg-neutral-200 dark:bg-neutral-900/35 dark:text-neutral-200 dark:hover:bg-neutral-800",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function ProductFilters({
  facets,
  filters,
  activeCount,
  isOpen,
  onToggleOpen,
  onChange,
  onToggleFacet,
  onClear,
}: {
  facets: AdminFacets;
  filters: AdminProductFilters;
  activeCount: number;
  isOpen: boolean;
  onToggleOpen: () => void;
  onChange: (patch: Partial<AdminProductFilters>) => void;
  onToggleFacet: (
    key: "productTypes" | "vendors" | "tags",
    value: string,
  ) => void;
  onClear: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="min-w-56 flex-1" role="search">
          <input
            type="search"
            value={filters.query}
            onChange={(event) => onChange({ query: event.target.value })}
            placeholder="Search title, handle, vendor, tag…"
            autoComplete="off"
            aria-label="Search products"
            className={inputClasses}
          />
        </div>

        <button
          type="button"
          onClick={onToggleOpen}
          aria-expanded={isOpen}
          aria-controls={FILTER_PANEL_ID}
          className={clsx(
            "inline-flex cursor-pointer items-center gap-2 rounded-sm border px-3 py-2.5 text-xs font-bold tracking-wider uppercase transition-colors",
            isOpen || activeCount > 0
              ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
              : "border-neutral-300 hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-900",
          )}
        >
          Filters{activeCount > 0 ? ` (${activeCount})` : ""}
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            fill="currentColor"
            className={clsx(
              "h-3.5 w-3.5 transition-transform duration-200",
              isOpen && "rotate-180",
            )}
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {isOpen ? (
        <div
          id={FILTER_PANEL_ID}
          className="space-y-5 rounded-sm border border-neutral-200 p-4 dark:border-neutral-800"
        >
          <div className="grid gap-5 md:grid-cols-3">
            <FacetGroup
              label="Product type"
              options={facets.productTypes}
              selected={filters.productTypes}
              onToggle={(value) => onToggleFacet("productTypes", value)}
            />
            <FacetGroup
              label="Vendor"
              options={facets.vendors}
              selected={filters.vendors}
              onToggle={(value) => onToggleFacet("vendors", value)}
            />
            <FacetGroup
              label="Tags"
              options={facets.tags}
              selected={filters.tags}
              onToggle={(value) => onToggleFacet("tags", value)}
            />
          </div>

          <div className="grid gap-5 border-t border-neutral-200 pt-4 md:grid-cols-2 dark:border-neutral-800">
            <PillGroup
              label="Availability"
              options={AVAILABILITY_OPTIONS}
              value={filters.availability}
              onChange={(value) => onChange({ availability: value })}
            />
            <PillGroup
              label="Override status"
              options={OVERRIDE_OPTIONS}
              value={filters.override}
              onChange={(value) => onChange({ override: value })}
            />
          </div>

          <div className="flex justify-end border-t border-neutral-200 pt-4 dark:border-neutral-800">
            <button
              type="button"
              onClick={onClear}
              disabled={activeCount === 0}
              className="cursor-pointer rounded-sm border border-neutral-300 px-3 py-1.5 text-xs font-bold tracking-wider uppercase transition-colors hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-700 dark:hover:bg-neutral-900"
            >
              Clear all filters
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

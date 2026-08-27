"use client";

import { useTranslation } from "lib/i18n/TranslationProvider";
import type { ConfiguratorItem } from "lib/configurator/types";
import { ConfiguratorProductCard } from "../product-card";

interface ProductSelectionStepProps {
  title: string;
  items: ConfiguratorItem[];
  incompatibleItems?: ConfiguratorItem[];
  selectedItem: ConfiguratorItem | null;
  onSelect: (item: ConfiguratorItem) => void;
  emptyMessage?: string;
  isEmpty: boolean;
  /** When true, incompatible items are hidden. When false they show greyed out. */
  compatibilityFilterOn?: boolean;
  /** When true, out-of-stock items appear in the incompatible section */
  showOutOfStock?: boolean;
}

export function ProductSelectionStep({
  title,
  items,
  incompatibleItems = [],
  selectedItem,
  onSelect,
  emptyMessage,
  isEmpty,
  compatibilityFilterOn = true,
  showOutOfStock = false,
}: ProductSelectionStepProps) {
  const { t } = useTranslation();

  const hasAnyItems =
    items.length > 0 || (!compatibilityFilterOn && incompatibleItems.length > 0);

  if (!hasAnyItems) {
    return (
      <div>
        <h2
          className="mb-6 text-xl font-bold uppercase tracking-wide text-black dark:text-white font-clash"
        >
          {title}
        </h2>
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-300 py-16 text-center dark:border-neutral-700">
          <p className="text-base text-neutral-500 dark:text-neutral-400">
            {emptyMessage || "No products available."}
          </p>
          <p className="mt-2 text-xs text-neutral-400 dark:text-neutral-500">
            Go back to try a different option, or turn off the Compatibility
            Filter to see all items.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-baseline justify-between">
        <h2
          className="text-xl font-bold uppercase tracking-wide text-black dark:text-white font-clash"
        >
          {title}
        </h2>
        <span className="text-xs text-neutral-500 dark:text-neutral-400">
          {items.length} compatible option{items.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Compatible items grid */}
      {items.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <ConfiguratorProductCard
              key={item.variantId}
              item={item}
              isSelected={selectedItem?.variantId === item.variantId}
              onSelect={() => onSelect(item)}
              isCompatible={true}
              isSelectable={true}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border-2 border-dashed border-neutral-200 py-10 text-center text-sm text-neutral-400 dark:border-neutral-800">
          {emptyMessage || "No compatible items found for your current build."}
        </div>
      )}

      {/* Incompatible items (shown when compatibility filter is OFF) */}
      {!compatibilityFilterOn && incompatibleItems.length > 0 && (
        <div className="mt-10 border-t border-neutral-200 pt-6 dark:border-neutral-800">
          <div className="mb-4 flex items-center gap-3">
            <h3
              className="text-sm font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 font-clash"
            >
              Not Compatible With Current Build ({incompatibleItems.length})
            </h3>
          </div>

          {/* Info banner */}
          <div className="mb-5 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800 dark:border-amber-800/40 dark:bg-amber-950/20 dark:text-amber-300">
            <svg
              className="mt-0.5 h-4 w-4 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>
              These items are not compatible with your current build selections.
              Hover over any item to see why. Selecting an incompatible item may
              require changing other parts of your build.
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {incompatibleItems.map((item) => (
              <ConfiguratorProductCard
                key={item.variantId}
                item={item}
                isSelected={selectedItem?.variantId === item.variantId}
                onSelect={() => onSelect(item)}
                isCompatible={false}
                isSelectable={false}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

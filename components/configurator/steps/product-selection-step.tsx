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
}

export function ProductSelectionStep({
  title,
  items,
  incompatibleItems = [],
  selectedItem,
  onSelect,
  emptyMessage,
  isEmpty,
}: ProductSelectionStepProps) {
  const { t } = useTranslation();

  if (isEmpty) {
    return (
      <div>
        <h2 className="mb-6 text-xl font-semibold text-neutral-800 dark:text-neutral-200">
          {title}
        </h2>
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-300 py-16 text-center dark:border-neutral-700">
          <p className="text-lg text-neutral-500 dark:text-neutral-400">
            {emptyMessage || "No products available."}
          </p>
          <p className="mt-2 text-sm text-neutral-400 dark:text-neutral-500">
            {t("configurator.back")} to try a different option.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-2 text-xl font-semibold text-neutral-800 dark:text-neutral-200">
        {title}
      </h2>
      <p className="mb-6 text-sm text-neutral-500 dark:text-neutral-400">
        {items.length} {t("configurator.compatible") || "compatible"} option
        {items.length !== 1 ? "s" : ""}
      </p>

      {/* Compatible items */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => (
          <ConfiguratorProductCard
            key={item.variantId}
            item={item}
            isSelected={selectedItem?.variantId === item.variantId}
            onSelect={() => onSelect(item)}
            isCompatible={true}
          />
        ))}
      </div>

      {/* Incompatible items (shown greyed out) */}
      {incompatibleItems.length > 0 && (
        <div className="mt-8">
          <h3 className="mb-4 text-sm font-medium uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
            {t("configurator.incompatible") || "Not compatible"} (
            {incompatibleItems.length})
          </h3>
          <div className="grid grid-cols-1 gap-4 opacity-40 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {incompatibleItems.slice(0, 8).map((item) => (
              <ConfiguratorProductCard
                key={item.variantId}
                item={item}
                isSelected={false}
                onSelect={() => {}}
                isCompatible={false}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

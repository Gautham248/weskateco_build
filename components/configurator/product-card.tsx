"use client";

import Image from "next/image";
import type { ConfiguratorItem, DeckMeta, TruckMeta, WheelMeta } from "lib/configurator/types";

interface ConfiguratorProductCardProps {
  item: ConfiguratorItem;
  isSelected: boolean;
  onSelect: () => void;
  isCompatible: boolean;
}

function getSubtitle(item: ConfiguratorItem): string {
  const meta = item.meta;
  switch (meta.category) {
    case "deck":
      return `${(meta as DeckMeta).deck_width}" — ${item.variantTitle}`;
    case "truck": {
      const truckMeta = meta as TruckMeta;
      if (truckMeta.truck_hanger_size) {
        return `${truckMeta.truck_hanger_size}" hanger — ${truckMeta.truck_sold_as}`;
      }
      return `${truckMeta.truck_sold_as} — ${truckMeta.truck_type}`;
    }
    case "wheel":
      return `${(meta as WheelMeta).wheel_diameter}mm — ${(meta as WheelMeta).wheel_hardness}`;
    case "bearing":
      return item.variantTitle !== "Default Title" ? item.variantTitle : meta.bearing_type;
    case "griptape":
      return item.variantTitle !== "Default Title" ? item.variantTitle : `${meta.griptape_width}"`;
    default:
      return item.variantTitle;
  }
}

export function ConfiguratorProductCard({
  item,
  isSelected,
  onSelect,
  isCompatible,
}: ConfiguratorProductCardProps) {
  return (
    <button
      onClick={isCompatible ? onSelect : undefined}
      disabled={!isCompatible || !item.availableForSale}
      className={`
        group relative flex flex-col overflow-hidden rounded-xl border-2 text-left transition-all
        ${
          isSelected
            ? "border-blue-600 shadow-lg ring-2 ring-blue-200 dark:border-blue-400 dark:ring-blue-900"
            : isCompatible && item.availableForSale
              ? "border-neutral-200 hover:border-blue-300 hover:shadow-md dark:border-neutral-700 dark:hover:border-blue-600"
              : "cursor-not-allowed border-neutral-200 dark:border-neutral-800"
        }
      `}
    >
      {/* Image */}
      <div className="relative aspect-square w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
        {item.productImage ? (
          <Image
            src={item.productImage}
            alt={item.productTitle}
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl text-neutral-300">
            🛹
          </div>
        )}

        {/* Selected badge */}
        {isSelected && (
          <div className="absolute right-2 top-2 rounded-full bg-blue-600 px-2 py-1 text-xs font-bold text-white">
            ✓
          </div>
        )}

        {/* Out of stock badge */}
        {!item.availableForSale && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="rounded-full bg-white px-3 py-1 text-sm font-medium text-neutral-900">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Brand */}
        {item.brand && (
          <span className="mb-1 text-xs font-medium uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            {item.brand}
          </span>
        )}

        {/* Title */}
        <h3 className="mb-1 text-sm font-semibold text-neutral-900 dark:text-white">
          {item.productTitle}
        </h3>

        {/* Subtitle (variant info) */}
        <p className="mb-2 text-xs text-neutral-500 dark:text-neutral-400">
          {getSubtitle(item)}
        </p>

        {/* Price */}
        <div className="mt-auto">
          <span className="text-base font-bold text-neutral-900 dark:text-white">
            {item.price.currencyCode === "INR" ? "₹" : "$"}
            {parseFloat(item.price.amount).toLocaleString()}
          </span>
        </div>
      </div>
    </button>
  );
}

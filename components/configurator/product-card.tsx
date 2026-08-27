"use client";

import Image from "next/image";
import clsx from "clsx";
import type {
  ConfiguratorItem,
  DeckMeta,
  TruckMeta,
  WheelMeta,
} from "lib/configurator/types";

interface ConfiguratorProductCardProps {
  item: ConfiguratorItem;
  isSelected: boolean;
  onSelect: () => void;
  isCompatible: boolean;
  /** If false, the card is non-clickable (incompatible guard) */
  isSelectable?: boolean;
}

function getSubtitle(item: ConfiguratorItem): string {
  const meta = item.meta;
  switch (meta.category) {
    case "deck":
      return `${(meta as DeckMeta).deck_width}" width — ${item.variantTitle}`;
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
      return item.variantTitle !== "Default Title"
        ? item.variantTitle
        : meta.bearing_type;
    case "griptape":
      return item.variantTitle !== "Default Title"
        ? item.variantTitle
        : `${meta.griptape_width}" width`;
    default:
      return item.variantTitle;
  }
}

export function ConfiguratorProductCard({
  item,
  isSelected,
  onSelect,
  isCompatible,
  isSelectable = true,
}: ConfiguratorProductCardProps) {
  const formattedPrice =
    item.price.currencyCode === "INR"
      ? `₹${parseFloat(item.price.amount).toLocaleString("en-IN")}`
      : `$${parseFloat(item.price.amount).toFixed(2)}`;

  const canInteract = isSelectable && item.availableForSale;

  return (
    <div
      role={canInteract ? "button" : undefined}
      tabIndex={canInteract ? 0 : undefined}
      onClick={canInteract ? onSelect : undefined}
      onKeyDown={
        canInteract
          ? (e) => e.key === "Enter" && onSelect()
          : undefined
      }
      title={
        !isCompatible && item.incompatibilityReason
          ? item.incompatibilityReason
          : undefined
      }
      className={clsx(
        "group relative flex flex-col overflow-hidden rounded-xl border bg-white text-left transition-all duration-200 dark:bg-neutral-950",
        // Selected state
        isSelected &&
          "border-black ring-2 ring-black dark:border-white dark:ring-white",
        // Selectable + compatible idle
        !isSelected &&
          isSelectable &&
          isCompatible &&
          "border-neutral-200 hover:border-neutral-400 hover:shadow-md dark:border-neutral-800 dark:hover:border-neutral-600 cursor-pointer",
        // Incompatible / non-selectable — greyed out, no pointer
        !isSelectable &&
          "border-neutral-200 opacity-50 cursor-not-allowed dark:border-neutral-800",
        // Out of stock when selectable still
        isSelectable &&
          !item.availableForSale &&
          "opacity-60 cursor-not-allowed",
      )}
    >
      {/* Selection circle */}
      <div className="absolute left-3 top-3 z-10">
        {isSelected ? (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-black text-white dark:bg-white dark:text-black">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="3"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        ) : isSelectable ? (
          <div className="h-6 w-6 rounded-full border border-neutral-300 bg-white/80 transition-colors group-hover:border-neutral-500 dark:border-neutral-700 dark:bg-neutral-900/80" />
        ) : (
          /* Lock icon for non-selectable */
          <div className="flex h-6 w-6 items-center justify-center rounded-full border border-rose-300 bg-rose-50 dark:border-rose-700 dark:bg-rose-950">
            <svg
              className="h-3.5 w-3.5 text-rose-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Product Image */}
      <div className="relative mb-0 aspect-square w-full overflow-hidden bg-neutral-50 dark:bg-neutral-900">
        {item.productImage ? (
          <Image
            src={item.productImage}
            alt={item.productTitle}
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className={clsx(
              "object-contain p-2 transition-transform duration-300",
              canInteract && "group-hover:scale-105",
            )}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl text-neutral-300">
            🛹
          </div>
        )}

        {/* Out of Stock Overlay */}
        {!item.availableForSale && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-[2px]">
            <span className="rounded-md bg-white px-3 py-1 text-xs font-bold uppercase text-black">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col p-3">
        {/* Brand */}
        {item.brand && (
          <span
            className="mb-0.5 text-[10px] font-bold uppercase tracking-wider text-black dark:text-white font-clash"
          >
            {item.brand}
          </span>
        )}

        {/* Title */}
        <h3 className="mb-0.5 line-clamp-2 text-xs font-medium text-neutral-800 dark:text-neutral-200">
          {item.productTitle}
        </h3>

        {/* Specs subtitle */}
        <p className="mb-2 text-[10px] text-neutral-500 dark:text-neutral-400">
          {getSubtitle(item)}
        </p>

        {/* Incompatibility badge */}
        {!isCompatible && item.incompatibilityReason && (
          <div className="mb-2 rounded-md bg-rose-50 px-2 py-1.5 text-[10px] font-medium leading-snug text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
            ⚠️ {item.incompatibilityReason}
          </div>
        )}

        {/* Price */}
        <div className="mt-auto">
          <span className="text-sm font-bold text-black dark:text-white">
            {formattedPrice}
          </span>
        </div>
      </div>
    </div>
  );
}

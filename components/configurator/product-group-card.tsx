"use client";

import { SHOPIFY_IMAGE_WIDTH, shopifyImageUrl } from "lib/shopify/image-url";
import Image from "next/image";
import clsx from "clsx";
import type {
  ConfiguratorItem,
  DeckMeta,
  TruckMeta,
  WheelMeta,
} from "lib/configurator/types";

/** Human-readable spec line shown under a product title on a card. */
export function getConfiguratorSubtitle(item: ConfiguratorItem): string {
  const meta = item.meta;
  switch (meta.category) {
    case "deck": {
      const deckWidth = (meta as DeckMeta).deck_width;
      return deckWidth !== undefined
        ? `${deckWidth}" width — ${item.variantTitle}`
        : item.variantTitle;
    }
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

interface ConfiguratorProductGroupCardProps {
  /** All variants of a single Shopify product, in display order. */
  items: ConfiguratorItem[];
  /** The currently selected variant (may belong to another product). */
  selectedItem: ConfiguratorItem | null;
  onSelect: (item: ConfiguratorItem) => void;
  isCompatible: boolean;
  /** If false, the card is non-clickable (incompatible guard) */
  isSelectable?: boolean;
}

/**
 * One card per Shopify product. When a product has more than one variant
 * (e.g. a wheel sold in 51mm and 52mm), the variants are offered as an in-card
 * size picker instead of one nearly-identical card each. Selecting a size
 * reports the concrete variant, so downstream state always holds a single
 * variant.
 */
export function ConfiguratorProductGroupCard({
  items,
  selectedItem,
  onSelect,
  isCompatible,
  isSelectable = true,
}: ConfiguratorProductGroupCardProps) {
  if (items.length === 0) return null;

  const product = items[0]!;
  const hasVariants = items.length > 1;
  const selectedVariant = items.find(
    (i) => i.variantId === selectedItem?.variantId,
  );
  const isSelected = selectedVariant !== undefined;

  // The card-level affordances follow the variant the user would act on: the
  // selected one if any, otherwise the first available variant.
  const activeVariant =
    selectedVariant ?? items.find((i) => i.availableForSale) ?? product;
  const canInteract = isSelectable && activeVariant.availableForSale;

  const formattedPrice =
    activeVariant.price.currencyCode === "INR"
      ? `₹${parseFloat(activeVariant.price.amount).toLocaleString("en-IN")}`
      : `$${parseFloat(activeVariant.price.amount).toFixed(2)}`;

  const reason = !isCompatible ? product.incompatibilityReason : undefined;

  const selectVariant = (variant: ConfiguratorItem) => {
    if (!isSelectable || !variant.availableForSale) return;
    onSelect(variant);
  };

  return (
    <div
      role={canInteract && !hasVariants ? "button" : undefined}
      tabIndex={canInteract && !hasVariants ? 0 : undefined}
      onClick={
        canInteract && !hasVariants
          ? () => selectVariant(activeVariant)
          : undefined
      }
      onKeyDown={
        canInteract && !hasVariants
          ? (e) => e.key === "Enter" && selectVariant(activeVariant)
          : undefined
      }
      title={reason}
      className={clsx(
        "group relative flex flex-col overflow-hidden rounded-xl border bg-white text-left transition-all duration-200 dark:bg-neutral-950",
        // Selected state
        isSelected &&
          "border-black ring-2 ring-black dark:border-white dark:ring-white",
        // Selectable + compatible idle — card-level hover only when the whole
        // card is the target (single variant); multi-variant cards act via the
        // size selector instead.
        !isSelected &&
          isSelectable &&
          isCompatible &&
          "border-neutral-200 dark:border-neutral-800",
        !isSelected &&
          isSelectable &&
          isCompatible &&
          !hasVariants &&
          "hover:border-neutral-400 hover:shadow-md dark:hover:border-neutral-600",
        // Incompatible / non-selectable — greyed out, no pointer
        !isSelectable &&
          "border-neutral-200 opacity-50 cursor-not-allowed dark:border-neutral-800",
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
          <div
            className={clsx(
              "h-6 w-6 rounded-full border border-neutral-300 bg-white/80 transition-colors dark:border-neutral-700 dark:bg-neutral-900/80",
              !hasVariants && "group-hover:border-neutral-500",
            )}
          />
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
        {product.productImage ? (
          <Image
            src={shopifyImageUrl(
              product.productImage,
              SHOPIFY_IMAGE_WIDTH.card,
            )}
            alt={product.productTitle}
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className={clsx(
              "object-contain p-2 transition-transform duration-300",
              canInteract && !hasVariants && "group-hover:scale-105",
            )}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl text-neutral-300">
            🛹
          </div>
        )}

        {/* Out-of-stock overlay — only when the whole product is unavailable */}
        {!activeVariant.availableForSale && (
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
        {product.brand && (
          <span className="mb-0.5 text-[10px] font-bold uppercase tracking-wider text-black dark:text-white font-clash">
            {product.brand}
          </span>
        )}

        {/* Title */}
        <h3 className="mb-0.5 line-clamp-2 text-xs font-medium text-neutral-800 dark:text-neutral-200">
          {product.productTitle}
        </h3>

        {/* Specs subtitle — hidden for multi-variant products since the size
            chips below carry the distinguishing detail */}
        {!hasVariants && (
          <p className="mb-2 text-[10px] text-neutral-500 dark:text-neutral-400">
            {getConfiguratorSubtitle(activeVariant)}
          </p>
        )}

        {/* Variant (size) selector */}
        {hasVariants && (
          <div className="mb-3">
            <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
              Size
            </span>
            <div
              role="radiogroup"
              aria-label="Size"
              className="flex flex-wrap gap-1.5"
            >
              {items.map((variant) => {
                const variantSelected =
                  variant.variantId === selectedItem?.variantId;
                const variantDisabled =
                  !isSelectable || !variant.availableForSale;
                return (
                  <button
                    key={variant.variantId}
                    type="button"
                    role="radio"
                    aria-checked={variantSelected}
                    disabled={variantDisabled}
                    onClick={(e) => {
                      e.stopPropagation();
                      selectVariant(variant);
                    }}
                    title={
                      !variant.availableForSale ? "Out of stock" : undefined
                    }
                    className={clsx(
                      "min-w-[3.25rem] rounded-lg border-2 px-3 py-1.5 text-xs font-bold uppercase tracking-wide transition-all duration-150",
                      variantSelected
                        ? "border-black bg-black text-white shadow-sm dark:border-white dark:bg-white dark:text-black"
                        : "border-neutral-300 bg-white text-neutral-700 hover:border-black hover:text-black dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-white dark:hover:text-white",
                      variantDisabled &&
                        "cursor-not-allowed border-neutral-200 text-neutral-300 line-through hover:border-neutral-200 hover:text-neutral-300 dark:border-neutral-800 dark:text-neutral-700 dark:hover:border-neutral-800 dark:hover:text-neutral-700",
                    )}
                  >
                    {variant.variantTitle}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Incompatibility badge */}
        {reason && (
          <div className="mb-2 rounded-md bg-rose-50 px-2 py-1.5 text-[10px] font-medium leading-snug text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
            ⚠️ {reason}
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

"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslation } from "lib/i18n/TranslationProvider";
import { addConfiguratorBundle } from "components/cart/actions";
import type {
  ConfiguratorItem,
  ConfiguratorState,
} from "lib/configurator/types";

interface ReviewStepProps {
  state: ConfiguratorState;
  buildTotal: { amount: number; currencyCode: string };
}

function ReviewLineItem({
  item,
  label,
}: {
  item: ConfiguratorItem | null;
  label: string;
}) {
  if (!item) return null;

  return (
    <div className="flex items-center gap-4 rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-900">
      {/* Image */}
      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800">
        {item.productImage ? (
          <Image
            src={item.productImage}
            alt={item.productTitle}
            fill
            sizes="64px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-2xl">
            BOARD
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex-1">
        <span className="text-xs font-medium uppercase tracking-wider text-neutral-400">
          {label}
        </span>
        <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
          {item.productTitle}
        </h4>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          {item.variantTitle !== "Default Title" ? item.variantTitle : ""}
        </p>
      </div>

      {/* Price */}
      <div className="text-right">
        <span className="font-bold text-neutral-900 dark:text-white">
          {item.price.currencyCode === "INR" ? "₹" : "$"}
          {parseFloat(item.price.amount).toLocaleString()}
        </span>
      </div>
    </div>
  );
}

export function ReviewStep({ state, buildTotal }: ReviewStepProps) {
  const { t } = useTranslation();
  const [isAdding, setIsAdding] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    setMessage(null);

    // Collect all selected items
    const items: ConfiguratorItem[] = [
      state.deck,
      state.trucks,
      state.wheels,
      state.bearings,
      state.griptape,
      state.risers,
      state.hardware,
    ].filter(Boolean) as ConfiguratorItem[];

    if (items.length === 0) {
      setMessage("No items selected.");
      setIsAdding(false);
      return;
    }

    // Build the cart line items
    const cartLines = items.map((item) => ({
      merchandiseId: item.variantId,
      quantity: 1,
    }));

    try {
      // Note: addConfiguratorBundle takes (prevState, lines) but we can call it directly
      const result = await addConfiguratorBundle(null, cartLines);
      if (result && typeof result === "string") {
        setMessage(result);
      } else {
        setAdded(true);
        setMessage(null);
      }
    } catch (error) {
      setMessage("Failed to add to cart. Please try again.");
    } finally {
      setIsAdding(false);
    }
  };

  const lineItems: { item: ConfiguratorItem | null; label: string }[] = [
    { item: state.deck, label: t("configurator.step2") },
    { item: state.trucks, label: t("configurator.step3") },
    { item: state.wheels, label: t("configurator.step4") },
    { item: state.bearings, label: t("configurator.step5") },
    { item: state.griptape, label: t("configurator.step6") },
    { item: state.risers, label: t("configurator.step7") },
    { item: state.hardware, label: t("configurator.step8") },
  ];

  return (
    <div>
      <h2 className="mb-6 text-xl font-semibold text-neutral-800 dark:text-neutral-200">
        {t("configurator.step9")}
      </h2>

      {/* Board type badge */}
      {state.boardType && (
        <div className="mb-4">
          <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            {state.boardType} Build
          </span>
        </div>
      )}

      {/* Line items */}
      <div className="mb-6 space-y-3">
        {lineItems.map(
          ({ item, label }) =>
            item && <ReviewLineItem key={label} item={item} label={label} />,
        )}
      </div>

      {/* Total */}
      <div className="mb-6 flex items-center justify-between rounded-xl bg-neutral-100 p-6 dark:bg-neutral-800">
        <span className="text-lg font-semibold text-neutral-700 dark:text-neutral-300">
          {t("configurator.total")}
        </span>
        <span className="text-2xl font-bold text-neutral-900 dark:text-white">
          {buildTotal.currencyCode === "INR" ? "₹" : "$"}
          {buildTotal.amount.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      </div>

      {/* Add to cart button */}
      {added ? (
        <div className="rounded-xl bg-green-50 p-6 text-center dark:bg-green-950">
          <p className="text-lg font-semibold text-green-700 dark:text-green-300">
            ✓ Setup added to cart!
          </p>
          <a
            href="/cart"
            className="mt-2 inline-block text-sm text-green-600 underline dark:text-green-400"
          >
            View Cart
          </a>
        </div>
      ) : (
        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className={`
            w-full rounded-xl bg-blue-600 py-4 text-lg font-bold text-white transition-all
            ${isAdding ? "cursor-wait opacity-70" : "hover:bg-blue-700"}
          `}
        >
          {isAdding ? t("common.loading") : t("configurator.add_to_cart")}
        </button>
      )}

      {/* Error message */}
      {message && (
        <p className="mt-4 text-center text-sm text-red-600 dark:text-red-400">
          {message}
        </p>
      )}
    </div>
  );
}

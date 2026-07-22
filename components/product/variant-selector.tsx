"use client";

import clsx from "clsx";
import { ProductOption, ProductVariant } from "lib/shopify/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

type Combination = {
  id: string;
  availableForSale: boolean;
  [key: string]: string | boolean;
};

export function VariantSelector({
  options,
  variants,
  selectedOptions,
  onSelectOption,
  isQuickBuy: isQuickBuyProp,
}: {
  options: ProductOption[];
  variants: ProductVariant[];
  selectedOptions?: Record<string, string>;
  onSelectOption?: (name: string, value: string) => void;
  isQuickBuy?: boolean;
}) {
  const isQuickBuy = isQuickBuyProp ?? Boolean(onSelectOption);
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasNoOptionsOrJustOneOption =
    !options.length ||
    (options.length === 1 && options[0]?.values.length === 1);

  // Find the first variant available for sale, or fall back to the first variant
  const defaultVariant =
    variants.find((v) => v.availableForSale) || variants[0];

  const defaultSelectedOptions = defaultVariant
    ? defaultVariant.selectedOptions.reduce<Record<string, string>>(
      (acc, opt) => {
        acc[opt.name.toLowerCase()] = opt.value;
        return acc;
      },
      {},
    )
    : {};

  // Build the active selection (merging defaults with props or URL query state)
  const activeOptions: Record<string, string> = { ...defaultSelectedOptions };
  if (selectedOptions) {
    Object.assign(activeOptions, selectedOptions);
  } else {
    searchParams.forEach((v, k) => {
      activeOptions[k] = v;
    });
  }

  useEffect(() => {
    // If selectedOptions and onSelectOption are passed, sync defaults to parent state
    if (selectedOptions && onSelectOption) {
      if (defaultVariant) {
        defaultVariant.selectedOptions.forEach((option) => {
          const key = option.name.toLowerCase();
          if (!selectedOptions[key]) {
            onSelectOption(key, option.value);
          }
        });
      }
    }
    // If searchParams is used, sync defaults to the URL parameters
    else if (!selectedOptions && !onSelectOption) {
      let hasChanges = false;
      const params = new URLSearchParams(searchParams.toString());
      if (defaultVariant) {
        defaultVariant.selectedOptions.forEach((option) => {
          const key = option.name.toLowerCase();
          if (!params.has(key)) {
            params.set(key, option.value);
            hasChanges = true;
          }
        });
      }
      if (hasChanges) {
        router.replace(`?${params.toString()}`, { scroll: false });
      }
    }
  }, [
    selectedOptions,
    onSelectOption,
    options,
    variants,
    searchParams,
    router,
    defaultVariant,
  ]);

  if (hasNoOptionsOrJustOneOption) {
    return null;
  }

  const combinations: Combination[] = variants.map((variant) => ({
    id: variant.id,
    availableForSale: variant.availableForSale,
    ...variant.selectedOptions.reduce(
      (accumulator, option) => ({
        ...accumulator,
        [option.name.toLowerCase()]: option.value,
      }),
      {},
    ),
  }));

  const updateOption = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(name, value);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return options.map((option) => (
    <form key={option.id}>
      <dl className={isQuickBuy ? "mb-2" : "mb-6"}>
        <div className={clsx("flex justify-between items-center", isQuickBuy ? "mb-4" : "mb-3")}>
          <dt
            className={clsx(
              isQuickBuy
                ? "text-xl font-semibold text-black dark:text-white tracking-[-1%]"
                : "text-sm font-semibold uppercase tracking-wider text-neutral-900 dark:text-neutral-100",
            )}
            style={{ fontFamily: "'Clash Display', sans-serif" }}
          >
            {option.name}
          </dt>
          {option.name.toLowerCase() === "size" && (
            <a
              href="#buying-guide"
              className={clsx(
                isQuickBuy
                  ? "text-xs font-semibold uppercase tracking-wider text-black hover:text-neutral-500 dark:text-white dark:hover:text-neutral-400 transition-colors underline"
                  : "text-[clamp(0.563rem,1.5vw,0.688rem)] font-semibold uppercase tracking-wider text-black hover:text-neutral-400 dark:hover:text-white transition-colors underline",
              )}
              style={{ fontFamily: "Archivo, sans-serif" }}
            >
              Buying Guide
            </a>
          )}
        </div>
        <dd
          className={clsx("gap-2", {
            "grid grid-cols-4":
              option.name.toLowerCase() === "size" || option.values.length > 3,
            "flex flex-wrap":
              option.name.toLowerCase() !== "size" && option.values.length <= 3,
          })}
        >
          {option.values.map((value) => {
            const optionNameLowerCase = option.name.toLowerCase();

            // Base option params on activeOptions (selected + pre-selected defaults)
            const optionParams = {
              ...activeOptions,
              [optionNameLowerCase]: value,
            };

            // Filter out invalid options and check if the option combination is available for sale.
            const filtered = Object.entries(optionParams).filter(
              ([key, value]) =>
                options.find(
                  (option) =>
                    option.name.toLowerCase() === key &&
                    option.values.includes(value),
                ),
            );
            const isAvailableForSale = combinations.find((combination) =>
              filtered.every(
                ([key, value]) =>
                  combination[key] === value && combination.availableForSale,
              ),
            );

            // The option is active if it's in the selected/defaulted options.
            const isActive = activeOptions[optionNameLowerCase] === value;

            const handleSelect = () => {
              if (onSelectOption) {
                onSelectOption(optionNameLowerCase, value);
              } else {
                updateOption(optionNameLowerCase, value);
              }
            };

            return (
              <button
                formAction={handleSelect}
                key={value}
                aria-disabled={!isAvailableForSale}
                disabled={!isAvailableForSale}
                title={`${option.name} ${value}${!isAvailableForSale ? " (Out of Stock)" : ""}`}
                className={clsx(
                  "flex h-12 items-center justify-center transition-all duration-200 border-none",
                  isQuickBuy
                    ? "rounded-sm text-sm font-medium"
                    : "rounded-xs text-[clamp(0.688rem,1.5vw,0.813rem)] font-medium",
                  {
                    "bg-black text-white dark:bg-white dark:text-black cursor-pointer":
                      !isQuickBuy && isActive,
                    "bg-black text-white dark:bg-white dark:text-black cursor-pointer font-bold":
                      isQuickBuy && isActive,
                    "bg-[#f2f2f2] text-black hover:bg-neutral-200 dark:bg-neutral-800/80 dark:text-white dark:hover:bg-neutral-700 cursor-pointer":
                      !isQuickBuy && !isActive && isAvailableForSale,
                    "bg-[#f2f2f2] text-black hover:bg-neutral-200 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700 cursor-pointer":
                      isQuickBuy && !isActive && isAvailableForSale,
                    "opacity-30 cursor-not-allowed bg-neutral-100 text-neutral-400 dark:bg-neutral-900 dark:text-neutral-600":
                      !isAvailableForSale,
                  },
                  {
                    "w-full":
                      option.name.toLowerCase() === "size" ||
                      option.values.length > 3,
                    "flex-1 min-w-[120px] max-w-[160px]":
                      !isQuickBuy &&
                      option.name.toLowerCase() !== "size" &&
                      option.values.length <= 3,
                    "flex-1 min-w-[100px] max-w-[140px]":
                      isQuickBuy &&
                      option.name.toLowerCase() !== "size" &&
                      option.values.length <= 3,
                  },
                )}
                style={{ fontFamily: "Archivo, sans-serif" }}
              >
                {value}
              </button>
            );
          })}
        </dd>
      </dl>
      {isQuickBuy && (
        <div className="my-5 border-b border-[#00000033] dark:border-neutral-800" />
      )}
    </form>
  ));
}

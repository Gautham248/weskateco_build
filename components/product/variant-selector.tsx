"use client";

import clsx from "clsx";
import { ProductOption, ProductVariant } from "lib/shopify/types";
import { useRouter, useSearchParams } from "next/navigation";

type Combination = {
  id: string;
  availableForSale: boolean;
  [key: string]: string | boolean;
};

export function VariantSelector({
  options,
  variants,
}: {
  options: ProductOption[];
  variants: ProductVariant[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasNoOptionsOrJustOneOption =
    !options.length ||
    (options.length === 1 && options[0]?.values.length === 1);

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
      <dl className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <dt className="text-xs font-semibold uppercase tracking-wider text-neutral-900 dark:text-neutral-100" style={{ fontFamily: "Archivo" }}>
            {option.name}
          </dt>
          {option.name.toLowerCase() === "size" && (
            <a
              href="#buying-guide"
              className="text-[11px] font-semibold uppercase tracking-wider text-black hover:text-neutral-400 dark:hover:text-white transition-colors underline"
              style={{ fontFamily: "Archivo" }}
            >
              Buying Guide
            </a>
          )}
        </div>
        <dd
          className={clsx("gap-2", {
            "grid grid-cols-4": option.name.toLowerCase() === "size" || option.values.length > 3,
            "flex flex-wrap": option.name.toLowerCase() !== "size" && option.values.length <= 3,
          })}
        >
          {option.values.map((value) => {
            const optionNameLowerCase = option.name.toLowerCase();

            // Base option params on current searchParams so we can preserve any other param state.
            const optionParams: Record<string, string> = {};
            searchParams.forEach((v, k) => (optionParams[k] = v));
            optionParams[optionNameLowerCase] = value;

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

            // The option is active if it's in the selected options.
            const isActive = searchParams.get(optionNameLowerCase) === value;

            return (
              <button
                formAction={() => updateOption(optionNameLowerCase, value)}
                key={value}
                aria-disabled={!isAvailableForSale}
                disabled={!isAvailableForSale}
                title={`${option.name} ${value}${!isAvailableForSale ? " (Out of Stock)" : ""}`}
                className={clsx(
                  "flex h-12 items-center justify-center rounded-xs text-[13px] font-medium transition-all duration-200 border-none",
                  {
                    "bg-black text-white dark:bg-white dark:text-black cursor-pointer": isActive,
                    "bg-[#f2f2f2] text-black hover:bg-neutral-200 dark:bg-neutral-800/80 dark:text-white dark:hover:bg-neutral-700 cursor-pointer":
                      !isActive && isAvailableForSale,
                    "opacity-30 cursor-not-allowed bg-neutral-100 text-neutral-400 dark:bg-neutral-900 dark:text-neutral-600 ":
                      !isAvailableForSale,
                  },
                  {
                    "w-full": option.name.toLowerCase() === "size" || option.values.length > 3,
                    "flex-1 min-w-[120px] max-w-[160px]": option.name.toLowerCase() !== "size" && option.values.length <= 3,
                  }
                )}
                style={{ fontFamily: "Archivo" }}
              >
                {value}
              </button>
            );
          })}
        </dd>
      </dl>
    </form>
  ));
}

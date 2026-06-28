import { AddToCart } from "components/cart/add-to-cart";
import Price from "components/price";
import { Product } from "lib/shopify/types";
import { VariantSelector } from "./variant-selector";
import { createTranslator } from "lib/i18n";

export function ProductDescription({ product, locale }: { product: Product; locale: string }) {
  const t = createTranslator(locale);

  return (
    <>
      <div className="mb-6 flex flex-col border-b pb-6 dark:border-neutral-700">
        <h1 className="mb-2 text-5xl font-medium">{product.title}</h1>
        <div className="mr-auto w-auto rounded-full bg-blue-600 p-2 text-sm text-white">
          <Price
            amount={product.priceRange.maxVariantPrice.amount}
            currencyCode={product.priceRange.maxVariantPrice.currencyCode}
          />
        </div>
      </div>
      <VariantSelector options={product.options} variants={product.variants} />
      <AddToCart product={product} />

      <div className="mt-8 border-t border-neutral-200 pt-6 space-y-4 dark:border-neutral-800">
        <div className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-400">
          <span className="text-xl">🚚</span>
          <span>{t("product.free_shipping")}</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-400">
          <span className="text-xl">🔒</span>
          <span>{t("product.secure_payment")}</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-400">
          <span className="text-xl">↩️</span>
          <span>{t("product.easy_returns")}</span>
        </div>
      </div>
    </>
  );
}

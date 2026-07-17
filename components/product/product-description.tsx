"use client";
import wallet from "components/icons/wallet.svg";
import Price from "components/price";
import Prose from "components/prose";
import { createTranslator } from "lib/i18n";
import { Product } from "lib/shopify/types";
import { useState } from "react";
import { ProductActions } from "./product-actions";
import { VariantSelector } from "./variant-selector";

export function ProductDescription({
  product,
  locale,
}: {
  product: Product;
  locale: string;
}) {
  const t = createTranslator(locale);
  const [isDescOpen, setIsDescOpen] = useState(false);

  return (
    <>
      {/* Header Info Layout */}
      <div className="flex justify-between items-start gap-4 mb-6 border-b pb-6 dark:border-neutral-800 w-full">
        <div className="flex-1">
          {product.vendor && (
            <p
              className="text-[clamp(0.75rem,1.5vw,0.875rem)] font-normal tracking-wider text-neutral-400 dark:text-neutral-500 uppercase mb-1"
              style={{ fontFamily: "Archivo" }}
            >
              {product.vendor}
            </p>
          )}
          <h1
            className="text-[clamp(1.125rem,3vw,1.75rem)] font-semibold text-black dark:text-white uppercase leading-tight"
            style={{ fontFamily: "'Clash Display', sans-serif" }}
          >
            {(() => {
              const words = product.title.split(" ");
              if (words.length >= 4) {
                return (
                  <>
                    <span className="block">{words.slice(0, 2).join(" ")}</span>
                    <span className="block">{words.slice(2).join(" ")}</span>
                  </>
                );
              }
              return product.title;
            })()}
          </h1>
        </div>
        <div
          className="text-right flex-shrink-0"
          style={{ fontFamily: "Archivo" }}
        >
          <div className="flex items-baseline justify-end gap-1">
            <Price
              amount={product.priceRange.maxVariantPrice.amount}
              currencyCode={product.priceRange.maxVariantPrice.currencyCode}
              currencyCodeClassName="hidden"
              className="text-[clamp(1.25rem,3vw,1.75rem)] font-bold text-neutral-900 dark:text-neutral-50"
            />
            <span className="text-[clamp(0.563rem,1.5vw,0.688rem)] font-semibold text-neutral-600 dark:text-neutral-400">
              MRP
            </span>
          </div>
          <p
            className="text-[clamp(0.625rem,1.5vw,0.75rem)] text-black leading-tight"
            style={{ fontFamily: "Archivo" }}
          >
            {product.variants[0]?.compareAtPrice && (
              <span className="line-through mr-1 text-neutral-400">
                ₹{" "}
                {Math.round(
                  parseFloat(product.variants[0].compareAtPrice.amount),
                )}
              </span>
            )}
            inclusive of taxes
          </p>
        </div>
      </div>

      {/* Options Selectors */}
      <VariantSelector options={product.options} variants={product.variants} />

      {/* Explore EMI Options Banner */}
      <div className="mb-6 flex items-center justify-between rounded-sm border border-sky-100 bg-sky-50/50 p-4 dark:border-sky-950/20 dark:bg-sky-950/10 cursor-pointer hover:bg-sky-100/50 dark:hover:bg-sky-950/20 transition-colors">
        <div className="flex items-center gap-4">
          <div className="flex p-3 items-center justify-center rounded-sm bg-sky-200 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400">
            <img src={wallet.src || wallet} className="w-8 h-8" alt="wallet" />
          </div>
          <div>
            <h4
              className="text-sm font-semibold text-[#193F48]"
              style={{ fontFamily: "Archivo" }}
            >
              Explore EMI Options
            </h4>
            <p
              className="mt-2 text-[clamp(0.563rem,1.5vw,0.688rem)] text-[#193F48]"
              style={{ fontFamily: "Archivo" }}
            >
              Explore EMI Options: Compare EMI plans <br /> to find one that
              fits your budget.
            </p>
          </div>
        </div>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#193F48"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-sky-600 dark:text-sky-400"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </div>

      {/* Product Buttons Actions */}
      <ProductActions product={product} />

      {/* Separator Line */}
      <div className="my-8 border-t border-neutral-200 dark:border-neutral-800" />

      {/* Accordion PRODUCT DESCRIPTION */}
      <div className="w-full">
        <button
          onClick={() => setIsDescOpen(!isDescOpen)}
          className="cursor-pointer flex w-full items-center justify-between py-2 text-left font-bold text-black dark:text-white uppercase tracking-wider text-[clamp(1rem,2.5vw,1.25rem)]"
          style={{ fontFamily: "'Clash Display', sans-serif" }}
        >
          <span>Product Description</span>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-transform duration-200 ${isDescOpen ? "" : "rotate-180"}`}
          >
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </button>

        {isDescOpen && (
          <div className="pt-4 pb-6 animate-fadeIn">
            {product.descriptionHtml ? (
              <Prose
                className="text-[clamp(0.75rem,1.5vw,0.875rem)] leading-relaxed text-black dark:text-neutral-300"
                html={product.descriptionHtml}
              />
            ) : (
              <p className="text-[14px] leading-relaxed text-black dark:text-neutral-300">
                {product.description}
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
}

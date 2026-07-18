"use client";
import wallet from "components/icons/wallet.svg";
import Price from "components/price";
import Prose from "components/prose";
import { createTranslator } from "lib/i18n";
import { Product } from "lib/shopify/types";
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

  // Extract artist name if exists
  const getArtistName = (html: string, text: string) => {
    const htmlMatch = html.match(/Deck\s+Artwork\s+by[\s\u00a0&nbsp;]*(?:<[^>]+>)*([^<]+?)(?:<[^>]+>)*\s*(?:<\/p>|$)/i);
    if (htmlMatch && htmlMatch[1]) {
      return htmlMatch[1].trim();
    }
    const textMatch = text.match(/Deck\s+Artwork\s+by\s+(.+)/i);
    if (textMatch && textMatch[1]) {
      return textMatch[1].trim();
    }
    return null;
  };

  const artistName = getArtistName(product.descriptionHtml || "", product.description || "");

  // Helper function to format "Deck Artwork by..." paragraph in-place
  const formatArtworkBadgeHtml = (html: string) => {
    return html.replace(
      /<p[^>]*>[\s\u00a0&nbsp;]*Deck\s+Artwork\s+by[\s\u00a0&nbsp;]*(?:<[^>]+>)*([^<]+?)(?:<[^>]+>)*[\s\u00a0&nbsp;]*<\/p>/gi,
      (match, artistName) => {
        const trimmedArtist = artistName.trim();
        const initial = trimmedArtist.charAt(0).toUpperCase();
        return `
          <div class="my-4 flex items-center gap-2 rounded-md bg-[#F4FFCD] dark:bg-lime-950/20 p-2 w-fit">
            <div class="flex h-7 w-7 items-center justify-center rounded-full bg-[#E8FF8D] dark:bg-lime-900 text-sm font-bold text-[#55631F] dark:text-lime-300">
              ${initial}
            </div>
            <span class="text-[14px] font-medium text-[#55631F] dark:text-lime-400">
              Deck Artwork by ${trimmedArtist}
            </span>
          </div>
        `;
      }
    );
  };

  const formattedHtml = product.descriptionHtml ? formatArtworkBadgeHtml(product.descriptionHtml) : "";

  return (
    <>
      {/* Header Info Layout */}
      <div className="flex justify-between items-start gap-4 mb-6 border-b pb-6 dark:border-neutral-800 w-full">
        <div className="flex-1">
          {product.vendor && (
            <p
              className="text-[clamp(0.75rem,1.5vw,0.875rem)] font-normal tracking-wider text-neutral-400 dark:text-neutral-500 uppercase mb-1"
              style={{ fontFamily: "Archivo, sans-serif" }}
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
          style={{ fontFamily: "Archivo, sans-serif" }}
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
            style={{ fontFamily: "Archivo, sans-serif" }}
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
              style={{ fontFamily: "Archivo, sans-serif" }}
            >
              Explore EMI Options
            </h4>
            <p
              className="mt-2 text-[clamp(0.563rem,1.5vw,0.688rem)] text-[#193F48]"
              style={{ fontFamily: "Archivo, sans-serif" }}
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
          className="cursor-pointer flex w-full items-center justify-between py-2 text-left font-bold text-black dark:text-white uppercase tracking-wider text-[clamp(1rem,2.5vw,1.25rem)]"
          style={{ fontFamily: "'Clash Display', sans-serif" }}
        >
          <span>Product Description</span>
        </button>

        <div className="pt-4 pb-6 animate-fadeIn">
          {formattedHtml ? (
            <Prose
              className="text-[clamp(0.75rem,1.5vw,0.875rem)] leading-relaxed text-black dark:text-neutral-300"
              html={formattedHtml}
            />
          ) : (
            <p className="text-[14px] leading-relaxed text-black dark:text-neutral-300">
              {product.description}
            </p>
          )}
        </div>
      </div>
    </>
  );
}

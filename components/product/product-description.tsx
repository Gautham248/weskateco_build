"use client";
import { createSingleItemCartAction } from "components/cart/actions";
import { useCart } from "components/cart/cart-context";
import { SnapmintEmiCartBanner } from "components/cart/snapmint-emi-cart-banner";
import Price from "components/price";
import Prose from "components/prose";
import { useGoKwikCheckout } from "lib/gokwik";
import { createTranslator } from "lib/i18n";
import { Product } from "lib/shopify/types";
import { useSearchParams } from "next/navigation";
import { useTransition } from "react";
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
  const { cart, addCartItem } = useCart();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const { triggerCheckout } = useGoKwikCheckout({ cartId: cart?.id });

  const handleEmiCheckout = () => {
    const variant =
      product.variants.find((v) =>
        v.selectedOptions.every(
          (option) =>
            option.value === searchParams.get(option.name.toLowerCase()),
        ),
      ) || product.variants[0];

    if (!variant) return;

    startTransition(async () => {
      const singleCartId = await createSingleItemCartAction(variant.id);
      if (singleCartId) {
        if (window.merchantInfo) {
          window.merchantInfo.cart = { id: singleCartId };
        }
        if (typeof window.triggerGokwikCustomCheckout === "function") {
          window.triggerGokwikCustomCheckout();
        }
      }
    });
  };

  // Extract artist name if exists
  const getArtistName = (html: string, text: string) => {
    const htmlMatch = html.match(/Deck\s+Artwork\s+by[\s\u00a0&nbsp;]*((?:<[^>]+>|[^<>\n\r])+?)(?:<br\s*\/?>|<\/p>|\n|$)/i);
    if (htmlMatch && htmlMatch[1]) {
      const extracted = htmlMatch[1].replace(/<[^>]+>/g, "").replace(/&nbsp;|\u00a0/g, " ").trim();
      if (extracted) return extracted;
    }
    const textMatch = text.match(/Deck\s+Artwork\s+by\s+(.+)/i);
    if (textMatch && textMatch[1]) {
      return textMatch[1].trim();
    }
    return null;
  };

  const artistName = getArtistName(product.descriptionHtml || "", product.description || "");

  // Helper function to format "Deck Artwork by..." in-place
  const formatArtworkBadgeHtml = (html: string) => {
    if (!html) return "";
    return html.replace(
      /Deck\s+Artwork\s+by[\s\u00a0&nbsp;]*((?:<[^>]+>|[^<>\n\r])+?)(?:<br\s*\/?>|<\/p>|\n|(?=<span[^>]*><br)|$)/gi,
      (match, rawArtist) => {
        const trimmedArtist = rawArtist
          .replace(/<[^>]+>/g, "")
          .replace(/&nbsp;|\u00a0/g, " ")
          .trim();
        if (!trimmedArtist) return match;
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
              className="text-[clamp(1.25rem,3vw,1.75rem)] font-semibold text-neutral-900 dark:text-neutral-50"
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

      {/* Snapmint EMI Banner */}
      <SnapmintEmiCartBanner
        totalAmount={product.priceRange.maxVariantPrice.amount}
        onBuyOnEmi={handleEmiCheckout}
      />

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

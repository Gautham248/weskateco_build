"use client";

import clsx from "clsx";
import { addItem, createSingleItemCartAction } from "components/cart/actions";
import { useCart } from "components/cart/cart-context";
import { trackBuyNow } from "lib/analytics";
import { createTranslator } from "lib/i18n";
import { Product, ProductVariant } from "lib/shopify/types";
import { useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export function ProductActions({
  product,
  locale,
  selectedVariantId: customSelectedVariantId,
  onAddedToCart,
}: {
  product: Product;
  locale: string;
  selectedVariantId?: string;
  onAddedToCart?: () => void;
}) {
  const t = createTranslator(locale);
  const { variants, availableForSale } = product;
  const { addCartItem } = useCart();
  const searchParams = useSearchParams();
  const [isBuyNowPending, startBuyNowTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [isAdded, setIsAdded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const variant = customSelectedVariantId
    ? variants.find((v) => v.id === customSelectedVariantId)
    : variants.find((variant: ProductVariant) =>
        variant.selectedOptions.every(
          (option) =>
            option.value === searchParams.get(option.name.toLowerCase()),
        ),
      );

  const defaultVariantId = variants.length === 1 ? variants[0]?.id : undefined;
  const selectedVariantId =
    customSelectedVariantId || variant?.id || defaultVariantId;
  const finalVariant = variants.find((v) => v.id === selectedVariantId);

  // A product is available for sale when at least one variant is in stock, so
  // the product-level check below is not enough: the variant actually selected
  // here (from the URL params, the quick-buy panel, or a single-variant
  // product) can still be sold out while the product itself is not.
  const isSelectedVariantSoldOut =
    finalVariant !== undefined && !finalVariant.availableForSale;

  const handleBuyNow = () => {
    if (!selectedVariantId || !finalVariant || !finalVariant.availableForSale)
      return;
    startBuyNowTransition(async () => {
      const singleCartId = await createSingleItemCartAction(selectedVariantId);
      if (singleCartId) {
        trackBuyNow(product, finalVariant);
        if (window.merchantInfo) {
          window.merchantInfo.cart = { id: singleCartId };
        }
        if (typeof window.triggerGokwikCustomCheckout === "function") {
          window.triggerGokwikCustomCheckout();
        }
        if (onAddedToCart) {
          onAddedToCart();
        }
      }
    });
  };

  const buttonBaseClasses =
    "flex w-full items-center justify-center rounded-sm h-12 uppercase text-xs font-bold tracking-wider transition-colors duration-200 border border-neutral-300 cursor-pointer";

  if (!availableForSale) {
    return (
      <div className="space-y-3">
        <button
          disabled
          className={clsx(
            buttonBaseClasses,
            "bg-neutral-200 text-neutral-400 border-transparent cursor-not-allowed",
          )}
        >
          {t("product.out_of_stock")}
        </button>
      </div>
    );
  }

  async function handleAddToCart() {
    if (!selectedVariantId || isAdding || isSelectedVariantSoldOut) return;

    setIsAdding(true);
    setMessage(null);

    // Optimistic UI: the badge and toast update immediately. The server action
    // below still performs the real add, and only surfaces an error on failure.
    if (finalVariant) {
      addCartItem(finalVariant, product);
    }

    toast.success(`${product.title} added to cart!`, {
      position: "top-right",
      style: {
        backgroundColor: "#ffffff",
        color: "#10b981",
        borderColor: "#10b981",
        position: "relative",
        top: "60px",
      },
    });

    try {
      const error = await addItem(null, selectedVariantId);

      if (error) {
        setMessage(error);
        toast.error(error);
        return;
      }

      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);

      // Close only now that the add actually succeeded. Closing optimistically
      // would hide the error above behind a panel the user can no longer see.
      onAddedToCart?.();
    } catch (e) {
      console.error(e);
      setMessage("Could not add to cart. Please try again.");
      toast.error("Could not add to cart. Please try again.");
    } finally {
      setIsAdding(false);
    }
  }

  return (
    <div className="space-y-3">
      {/* Add To Cart Form */}
      <form action={handleAddToCart}>
        <button
          type="submit"
          disabled={
            !selectedVariantId ||
            isSelectedVariantSoldOut ||
            isAdding ||
            isAdded
          }
          className={clsx(
            buttonBaseClasses,
            !selectedVariantId || isSelectedVariantSoldOut
              ? "bg-neutral-100 text-neutral-400 border-neutral-200 cursor-not-allowed"
              : isAdding || isAdded
                ? "bg-neutral-200 text-black border-neutral-300 dark:bg-neutral-800 dark:text-white dark:border-neutral-700 cursor-not-allowed"
                : "bg-black text-white hover:bg-neutral-800 border-black dark:bg-white dark:text-black dark:hover:bg-neutral-100 dark:border-white",
          )}
          style={{ fontFamily: "Archivo, sans-serif" }}
        >
          {!selectedVariantId
            ? "Select Option"
            : isSelectedVariantSoldOut
              ? t("product.out_of_stock")
              : isAdding
                ? "Adding to Cart..."
                : isAdded
                  ? "Added to Cart ✓"
                  : "Add To Cart"}
        </button>
        {message ? (
          <p
            role="alert"
            className="mt-2 rounded-sm border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
          >
            {message}
          </p>
        ) : null}
      </form>{" "}
      {/* Buy Now Button */}
      <button
        type="button"
        disabled={
          !selectedVariantId || isSelectedVariantSoldOut || isBuyNowPending
        }
        onClick={handleBuyNow}
        className={clsx(
          buttonBaseClasses,
          selectedVariantId && !isSelectedVariantSoldOut
            ? "bg-white text-black hover:bg-neutral-50 border-black dark:bg-black dark:text-white dark:hover:bg-neutral-900 dark:border-white"
            : "bg-neutral-100 text-neutral-400 border-neutral-200 cursor-not-allowed",
        )}
        style={{ fontFamily: "Archivo, sans-serif" }}
      >
        {isBuyNowPending ? "Processing..." : "Buy Now"}
      </button>
      <div className="text-left">
        <span
          className="text-[clamp(0.625rem,1.5vw,0.75rem)] text-black font-normal"
          style={{ fontFamily: "Archivo, sans-serif" }}
        >
          Free Shipping Within India
        </span>
      </div>
    </div>
  );
}

"use client";

import clsx from "clsx";
import { addItem, buyNowAction } from "components/cart/actions";
import { useCart } from "components/cart/cart-context";
import { Product, ProductVariant } from "lib/shopify/types";
import { useSearchParams } from "next/navigation";
import { useActionState, useState, useTransition } from "react";
import { toast } from "sonner";

export function ProductActions({
  product,
  selectedVariantId: customSelectedVariantId,
  onAddedToCart,
}: {
  product: Product;
  selectedVariantId?: string;
  onAddedToCart?: () => void;
}) {
  const { variants, availableForSale } = product;
  const { addCartItem } = useCart();
  const searchParams = useSearchParams();
  const [isBuyNowPending, startBuyNowTransition] = useTransition();
  const [message, formAction] = useActionState(addItem, null);
  const [isAdded, setIsAdded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const variant = customSelectedVariantId
    ? variants.find((v) => v.id === customSelectedVariantId)
    : variants.find((variant: ProductVariant) =>
        variant.selectedOptions.every(
          (option) => option.value === searchParams.get(option.name.toLowerCase()),
        ),
      );

  const defaultVariantId = variants.length === 1 ? variants[0]?.id : undefined;
  const selectedVariantId = customSelectedVariantId || variant?.id || defaultVariantId;
  const finalVariant = variants.find((v) => v.id === selectedVariantId);

  const handleBuyNow = () => {
    if (!selectedVariantId || !finalVariant) return;
    startBuyNowTransition(async () => {
      addCartItem(finalVariant, product);
      await buyNowAction(selectedVariantId);
    });
  };

  const buttonBaseClasses =
    "flex w-full items-center justify-center rounded-xs h-14 uppercase text-[clamp(0.75rem,1.8vw,0.875rem)] font-semibold tracking-wider transition-colors duration-200 border cursor-pointer";

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
          Out Of Stock
        </button>
      </div>
    );
  }

  const addItemAction = formAction.bind(null, selectedVariantId);

  return (
    <div className="space-y-3">
      {/* Add To Cart Form */}
      <form
        action={async () => {
          if (!selectedVariantId) return;
          setIsAdding(true);
          try {
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
            setIsAdded(true);
            setTimeout(() => setIsAdded(false), 2000);
            if (onAddedToCart) {
              onAddedToCart();
            }
            await addItemAction();
          } catch (e) {
            console.error(e);
          } finally {
            setIsAdding(false);
          }
        }}
      >
        <button
          type="submit"
          disabled={!selectedVariantId || isAdding || isAdded}
          className={clsx(
            buttonBaseClasses,
            !selectedVariantId
              ? "bg-neutral-100 text-neutral-400 border-neutral-200 cursor-not-allowed"
              : isAdding || isAdded
                ? "bg-neutral-200 text-black border-neutral-300 dark:bg-neutral-800 dark:text-white dark:border-neutral-700 cursor-not-allowed"
                : "bg-black text-white hover:bg-neutral-800 border-black dark:bg-white dark:text-black dark:hover:bg-neutral-100 dark:border-white",
          )}
          style={{ fontFamily: "Archivo, sans-serif" }}
        >
          {!selectedVariantId
            ? "Select Option"
            : isAdding
              ? "Adding to Cart..."
              : isAdded
                ? "Added to Cart ✓"
                : "Add To Cart"}
        </button>
        <p aria-live="polite" className="sr-only" role="status">
          {message}
        </p>
      </form>{" "}
      {/* Buy Now Button */}
      <button
        type="button"
        disabled={!selectedVariantId || isBuyNowPending}
        onClick={handleBuyNow}
        className={clsx(
          buttonBaseClasses,
          selectedVariantId
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

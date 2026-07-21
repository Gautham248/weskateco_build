"use client";

import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { editCartItemVariantAction } from "components/cart/actions";
import { useCart } from "components/cart/cart-context";
import Price from "components/price";
import { Product } from "lib/shopify/types";
import Image from "next/image";
import { Fragment, useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { ProductActions } from "./product-actions";
import { VariantSelector } from "./variant-selector";

interface QuickBuySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  locale: string;
  isEdit?: boolean;
  lineId?: string;
  initialOptions?: Record<string, string>;
  quantity?: number;
}

// Helper to extract variants safely whether they are reshaped or raw Connection edges
function getProductVariants(product: any): any[] {
  if (!product.variants) return [];
  if (Array.isArray(product.variants)) {
    return product.variants;
  }
  if (product.variants.edges) {
    return product.variants.edges.map((edge: any) => edge.node);
  }
  return [];
}

export function QuickBuySidebar({
  isOpen,
  onClose,
  product,
  locale,
  isEdit = false,
  lineId,
  initialOptions,
  quantity,
}: QuickBuySidebarProps) {
  const { updateLineVariant } = useCart();
  const [isUpdating, startUpdateTransition] = useTransition();

  // Initialize options. In edit mode, pre-fill with current line item options.
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  // Reset/sync options state when sidebar opens/changes
  useEffect(() => {
    if (isOpen) {
      if (isEdit && initialOptions) {
        setSelectedOptions(initialOptions);
      } else {
        setSelectedOptions({});
      }
    }
  }, [isOpen, isEdit, initialOptions]);

  const variants = getProductVariants(product);

  const activeVariant = variants.find((variant) =>
    variant.selectedOptions.every(
      (option: any) => selectedOptions[option.name.toLowerCase()] === option.value,
    ),
  );
  const selectedVariantId = activeVariant?.id;

  const handleSelectOption = (name: string, value: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateLineItem = () => {
    if (!lineId || !selectedVariantId || !activeVariant) return;

    startUpdateTransition(async () => {
      try {
        // Optimistic UI update
        updateLineVariant(lineId, activeVariant);

        // Server Action update
        const result = await editCartItemVariantAction({
          lineId,
          newMerchandiseId: selectedVariantId,
          quantity: quantity || 1,
        });

        if (result) {
          toast.error(result);
        } else {
          toast.success("Item updated successfully!", {
            position: "top-right",
            style: {
              backgroundColor: "#ffffff",
              color: "#10b981",
              borderColor: "#10b981",
              position: "relative",
              top: "60px",
            },
          });
          onClose();
        }
      } catch (e) {
        console.error(e);
        toast.error("Failed to update item");
      }
    });
  };

  const hasNoOptionsOrJustOneOption =
    !product.options ||
    !product.options.length ||
    (product.options.length === 1 && product.options[0]?.values.length === 1);

  const buttonBaseClasses =
    "flex w-full items-center justify-center rounded-xs h-14 uppercase text-[clamp(0.75rem,1.8vw,0.875rem)] font-semibold tracking-wider transition-colors duration-200 border cursor-pointer";

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        <Transition.Child
          as={Fragment}
          enter="transition-all ease-in-out duration-300"
          enterFrom="opacity-0 backdrop-blur-none"
          enterTo="opacity-100 backdrop-blur-[.5px]"
          leave="transition-all ease-in-out duration-200"
          leaveFrom="opacity-100 backdrop-blur-[.5px]"
          leaveTo="opacity-0 backdrop-blur-none"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        </Transition.Child>

        <Transition.Child
          as={Fragment}
          enter="transition-all ease-in-out duration-300"
          enterFrom="translate-x-full"
          enterTo="translate-x-0"
          leave="transition-all ease-in-out duration-200"
          leaveFrom="translate-x-0"
          leaveTo="translate-x-full"
        >
          <Dialog.Panel
            className="fixed bottom-0 right-0 top-0 flex h-full w-full flex-col bg-white text-black shadow-2xl md:w-[410px] dark:bg-black dark:text-white"
            style={{ fontFamily: "Archivo, sans-serif" }}
          >
            {/* Padded Top Section: Header & Product Summary */}
            <div className="px-6 pt-6 pb-2">
              {/* Header: Title and Close button */}
              <div className="flex items-center justify-between">
                <p
                  className="text-[32px] font-semibold uppercase tracking-[-1%] text-black dark:text-white"
                  style={{ fontFamily: "'Clash Display', sans-serif" }}
                >
                  {isEdit ? "EDIT OPTIONS" : "SELECT"}
                </p>
                <button
                  aria-label="Close panel"
                  onClick={onClose}
                  className="w-10 h-10 rounded-md bg-[#f2f2f2] dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 flex items-center justify-center transition-colors"
                >
                  <XMarkIcon className="h-5 w-5 text-black dark:text-white" />
                </button>
              </div>

              {/* Product Summary */}
              <div className="flex gap-4 py-6 items-start">
                {product.featuredImage ? (
                  <div className="relative aspect-square w-24 overflow-hidden rounded-sm bg-[#f4f4f4] dark:bg-neutral-900 flex-shrink-0 flex items-center justify-center">
                    <Image
                      src={product.featuredImage.url}
                      alt={product.featuredImage.altText || product.title}
                      fill
                      sizes="96px"
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <div className="relative aspect-square w-24 overflow-hidden rounded-lg bg-[#f4f4f4] dark:bg-neutral-900 flex-shrink-0 flex items-center justify-center text-neutral-400 text-xs">
                    No Image
                  </div>
                )}

                <div className="flex flex-col justify-center pt-0.5">
                  <h3
                    className="text-md font-semibold text-black dark:text-white uppercase line-clamp-2 leading-snug"
                    style={{ fontFamily: "'Clash Display', sans-serif" }}
                  >
                    {product.title}
                  </h3>
                  {product.vendor && (
                    <p className="text-sm font-normal tracking-wide text-neutral-500 dark:text-neutral-400 uppercase mt-1">
                      {product.vendor}
                    </p>
                  )}
                  <div className="mt-2 flex items-baseline gap-1">
                    <Price
                      amount={product.priceRange.minVariantPrice.amount}
                      currencyCode={product.priceRange.minVariantPrice.currencyCode}
                      currencyCodeClassName="hidden"
                      className="text-xl font-bold text-black dark:text-white"
                      style={{ fontFamily: "'Clash Display', sans-serif" }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Scrollable Variant Selectors */}
            <div className="flex-1 overflow-y-auto px-6 py-2">
              {!hasNoOptionsOrJustOneOption && (
                <VariantSelector
                  options={product.options}
                  variants={variants}
                  selectedOptions={selectedOptions}
                  onSelectOption={handleSelectOption}
                />
              )}
            </div>

            {/* Full-width Footer Section with edge-to-edge top border */}
            <div
              className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black p-6 mt-auto"
              style={{ boxShadow: "0px -3px 44px 0px #00000026" }}
            >
              {isEdit ? (
                <button
                  type="button"
                  onClick={handleUpdateLineItem}
                  disabled={!selectedVariantId || isUpdating}
                  className={clsx(
                    buttonBaseClasses,
                    !selectedVariantId
                      ? "bg-neutral-100 text-neutral-400 border-neutral-200 cursor-not-allowed"
                      : isUpdating
                        ? "bg-neutral-200 text-black border-neutral-300 dark:bg-neutral-800 dark:text-white dark:border-neutral-700 cursor-not-allowed"
                        : "bg-black text-white hover:bg-neutral-800 border-black dark:bg-white dark:text-black dark:hover:bg-neutral-100 dark:border-white",
                  )}
                  style={{ fontFamily: "Archivo, sans-serif" }}
                >
                  {isUpdating ? "Updating..." : "Update Item"}
                </button>
              ) : (
                <ProductActions
                  product={product}
                  selectedVariantId={selectedVariantId}
                  onAddedToCart={onClose}
                />
              )}
            </div>
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}

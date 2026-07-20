"use client";

import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Price from "components/price";
import { Product } from "lib/shopify/types";
import Image from "next/image";
import { Fragment, useState, useEffect, useTransition } from "react";
import { ProductActions } from "./product-actions";
import { VariantSelector } from "./variant-selector";
import { editCartItemVariantAction } from "components/cart/actions";
import { useCart } from "components/cart/cart-context";
import { toast } from "sonner";
import clsx from "clsx";

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
            className="fixed bottom-0 right-0 top-0 flex h-full w-full flex-col border-l border-neutral-200 bg-white/80 p-6 text-black backdrop-blur-xl md:w-[390px] dark:border-neutral-700 dark:bg-black/80 dark:text-white"
            style={{ fontFamily: "Archivo, sans-serif" }}
          >
            {/* Header: Title and Close button */}
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-900">
              <p
                className="text-xl font-bold uppercase tracking-wider text-black dark:text-white"
                style={{ fontFamily: "'Clash Display', sans-serif" }}
              >
                {isEdit ? "Edit Options" : "Quick Add"}
              </p>
              <button
                aria-label="Close panel"
                onClick={onClose}
                className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 flex items-center justify-center transition-colors"
              >
                <XMarkIcon className="h-5 w-5 text-black dark:text-white" />
              </button>
            </div>

            {/* Product Summary */}
            <div className="flex gap-4 pt-6">
              {product.featuredImage ? (
                <div className="relative aspect-[2/3] w-20 overflow-hidden rounded-lg bg-[#e6e6e6] dark:bg-neutral-900 flex-shrink-0">
                  <Image
                    src={product.featuredImage.url}
                    alt={product.featuredImage.altText || product.title}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="relative aspect-[2/3] w-20 overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-900 flex-shrink-0 flex items-center justify-center text-neutral-400 text-xs">
                  No Image
                </div>
              )}

              <div className="flex flex-col justify-start">
                {product.vendor && (
                  <p className="text-[clamp(0.625rem,1.5vw,0.75rem)] font-normal tracking-tight text-neutral-400 dark:text-neutral-500 uppercase mb-0.5">
                    {product.vendor}
                  </p>
                )}
                <h3
                  className="text-[clamp(0.875rem,2vw,1.125rem)] font-semibold text-neutral-900 dark:text-neutral-100 uppercase line-clamp-2 leading-snug"
                  style={{ fontFamily: "'Clash Display', sans-serif" }}
                >
                  {product.title}
                </h3>
                <div className="mt-1 flex items-baseline gap-1">
                  <Price
                    amount={product.priceRange.minVariantPrice.amount}
                    currencyCode={product.priceRange.minVariantPrice.currencyCode}
                    currencyCodeClassName="hidden"
                    className="text-[clamp(0.875rem,1.8vw,1rem)] font-bold text-neutral-900 dark:text-neutral-50"
                  />
                </div>
              </div>
            </div>

            <div className="my-6 border-t border-neutral-100 dark:border-neutral-900" />

            {/* Variant Selectors & Actions Container */}
            <div className="flex flex-1 flex-col justify-between overflow-hidden">
              <div className="flex-1 overflow-y-auto pr-1">
                {!hasNoOptionsOrJustOneOption && (
                  <div className="rounded-xl border border-neutral-200 bg-neutral-50/20 p-4 dark:border-neutral-800 dark:bg-neutral-900/20 mb-6">
                    <VariantSelector
                      options={product.options}
                      variants={variants}
                      selectedOptions={selectedOptions}
                      onSelectOption={handleSelectOption}
                    />
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-neutral-100 dark:border-neutral-900 mt-auto">
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
            </div>
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}

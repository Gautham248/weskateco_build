"use client";

import { Dialog, Transition } from "@headlessui/react";
import { ShoppingCartIcon, XMarkIcon } from "@heroicons/react/24/outline";
import LoadingDots from "components/loading-dots";
import Price from "components/price";
import { DEFAULT_OPTION } from "lib/constants";
import { useGoKwikCheckout } from "lib/gokwik";
import { useModalHistory } from "lib/hooks/use-modal-history";
import { getLocalizedPath } from "lib/i18n";
import { useTranslation } from "lib/i18n/TranslationProvider";
import type { CartItem } from "lib/shopify/types";
import { createUrl } from "lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, useCallback, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { QuickBuySidebar } from "../product/quick-buy-sidebar";
import { createCartAndSetCookie, redirectToCheckout } from "./actions";
import { useCart } from "./cart-context";
import { DeleteItemButton } from "./delete-item-button";
import { EditItemQuantityButton } from "./edit-item-quantity-button";
import OpenCart from "./open-cart";
import { SnapmintEmiCartBanner } from "./snapmint-emi-cart-banner";

type MerchandiseSearchParams = {
  [key: string]: string;
};

export default function CartModal() {
  const { t, locale } = useTranslation();
  const pathname = usePathname();
  const { cart, updateCartItem } = useCart();
  const {
    isReady: gokwikReady,
    isError: gokwikError,
    isCheckingOut,
    triggerCheckout,
    useFallback,
  } = useGoKwikCheckout({
    cartId: cart?.id,
  });
  const [isOpen, setIsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CartItem | null>(null);
  const rawClose = useCallback(() => setIsOpen(false), []);
  const closeCart = useModalHistory(isOpen, rawClose, "cart-modal");
  const openCart = () => {
    if (pathname.endsWith("/cart")) return;
    setIsOpen(true);
  };

  useEffect(() => {
    if (!cart) {
      createCartAndSetCookie();
    }
  }, [cart]);

  return (
    <>
      <button aria-label="Open cart" onClick={openCart}>
        <OpenCart quantity={cart?.totalQuantity} />
      </button>
      <Transition show={isOpen}>
        <Dialog onClose={closeCart} className="relative z-50">
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
              {/* Header: Title and Close button matching Quick Buy */}
              <div className="px-6 pt-6 pb-2">
                <div className="flex items-center justify-between">
                  <p
                    className="text-[32px] font-semibold uppercase tracking-[-1%] text-black dark:text-white flex items-baseline gap-1"
                    style={{ fontFamily: "'Clash Display', sans-serif" }}
                  >
                    <span>YOUR CART</span>
                  </p>
                  <button
                    aria-label="Close cart"
                    onClick={closeCart}
                    className="w-10 h-10 rounded-md bg-[#f2f2f2] dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <XMarkIcon className="h-5 w-5 text-black dark:text-white" />
                  </button>
                </div>
              </div>

              {!cart || cart.lines.length === 0 ? (
                <div className="mt-20 flex w-full flex-col items-center justify-center overflow-hidden px-6">
                  <ShoppingCartIcon className="h-16 text-black dark:text-white" />
                  <p
                    className="mt-6 text-center text-xl font-bold uppercase tracking-wider text-black dark:text-white"
                    style={{ fontFamily: "'Clash Display', sans-serif" }}
                  >
                    {t("cart.empty")}
                  </p>
                </div>
              ) : (
                <div className="flex flex-1 min-h-0 flex-col justify-between px-6 pb-6">
                  <ul className="grow overflow-auto py-2">
                    {(() => {
                      // Separate bundle items from regular items
                      const bundleItems: Record<string, typeof cart.lines> = {};
                      const regularItems: typeof cart.lines = [];

                      for (const item of cart.lines) {
                        const bundleAttr = item.attributes?.find(
                          (attr) =>
                            attr.key === "_configurator_bundle" &&
                            attr.value === "true",
                        );
                        const bundleIdAttr = item.attributes?.find(
                          (attr) => attr.key === "_bundle_id",
                        );

                        if (bundleAttr && bundleIdAttr) {
                          const bundleId = bundleIdAttr.value;
                          if (!bundleItems[bundleId]) {
                            bundleItems[bundleId] = [];
                          }
                          bundleItems[bundleId]!.push(item);
                        } else {
                          regularItems.push(item);
                        }
                      }

                      const bundles = Object.entries(bundleItems);

                      return (
                        <>
                          {/* Configurator Bundles */}
                          {bundles.length > 0 && (
                            <div className="mb-6">
                              <h4
                                className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-3 px-1"
                                style={{ fontFamily: "'Clash Display', sans-serif" }}
                              >
                                Custom Setups ({bundles.length})
                              </h4>
                              <ul className="space-y-4">
                                {bundles.map(([bundleId, items]) => {
                                  const bundleTotal = items.reduce(
                                    (sum, item) =>
                                      sum + Number(item.cost.totalAmount.amount),
                                    0,
                                  );
                                  const currencyCode =
                                    items[0]?.cost.totalAmount.currencyCode || "INR";

                                  return (
                                    <li
                                      key={bundleId}
                                      className="rounded-lg border-2 border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/30"
                                    >
                                      {/* Bundle header */}
                                      <div className="flex items-center justify-between border-b border-blue-200 px-3 py-2 dark:border-blue-800">
                                        <div className="flex items-center gap-2">
                                          <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                                            🛹 Custom Setup
                                          </span>
                                          <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                                            {items.length} items
                                          </span>
                                        </div>
                                        <span className="text-sm font-bold text-blue-700 dark:text-blue-300">
                                          {currencyCode === "INR" ? "₹" : "$"}
                                          {bundleTotal.toLocaleString(undefined, {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                          })}
                                        </span>
                                      </div>

                                      {/* Bundle items */}
                                      <ul className="divide-y divide-blue-100 dark:divide-blue-900">
                                        {items.map((item, i) => {
                                          const merchandiseSearchParams =
                                            {} as MerchandiseSearchParams;

                                          item.merchandise.selectedOptions.forEach(
                                            ({ name, value }) => {
                                              if (value !== DEFAULT_OPTION) {
                                                merchandiseSearchParams[
                                                  name.toLowerCase()
                                                ] = value;
                                              }
                                            },
                                          );

                                          const merchandiseUrl = createUrl(
                                            `/product/${item.merchandise.product.handle}`,
                                            new URLSearchParams(
                                              merchandiseSearchParams,
                                            ),
                                          );

                                          return (
                                            <li
                                              key={i}
                                              className="relative flex w-full flex-row justify-between px-3 py-3"
                                            >
                                              <div className="absolute z-40 -ml-1 -mt-1">
                                                <DeleteItemButton
                                                  item={item}
                                                  optimisticUpdate={updateCartItem}
                                                />
                                              </div>
                                              <div className="flex flex-row">
                                                <div className="relative h-12 w-12 overflow-hidden rounded-md border border-neutral-200 dark:border-neutral-800 bg-[#e6e6e6] dark:bg-neutral-900 flex-shrink-0">
                                                  <Image
                                                    className="h-full w-full object-cover"
                                                    width={48}
                                                    height={48}
                                                    alt={
                                                      item.merchandise.product
                                                        .featuredImage?.altText ||
                                                      item.merchandise.product.title
                                                    }
                                                    src={
                                                      item.merchandise.product
                                                        .featuredImage?.url || ""
                                                    }
                                                  />
                                                </div>
                                                <div className="ml-2 flex flex-col justify-center">
                                                  <Link
                                                    href={merchandiseUrl}
                                                    onClick={rawClose}
                                                    className="z-30 flex flex-row"
                                                  >
                                                    <div className="flex flex-1 flex-col text-sm">
                                                      <span className="leading-tight">
                                                        {item.merchandise.product.title}
                                                      </span>
                                                      {item.merchandise.title !==
                                                        DEFAULT_OPTION ? (
                                                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                                                          {item.merchandise.title}
                                                        </p>
                                                      ) : null}
                                                    </div>
                                                  </Link>
                                                  <button
                                                    type="button"
                                                    onClick={() => setEditingItem(item)}
                                                    className="text-[11px] font-semibold uppercase underline hover:text-neutral-500 transition-colors cursor-pointer mt-1 w-fit text-left text-neutral-500 dark:text-neutral-400"
                                                    style={{ fontFamily: "Archivo, sans-serif" }}
                                                  >
                                                    Edit
                                                  </button>
                                                </div>
                                              </div>
                                              <div className="flex flex-col justify-between items-end flex-shrink-0 min-h-[48px] ml-4">
                                                <Price
                                                  className="flex justify-end text-right text-xs"
                                                  amount={
                                                    item.cost.totalAmount.amount
                                                  }
                                                  currencyCode={
                                                    item.cost.totalAmount.currencyCode
                                                  }
                                                />
                                                <div className="flex h-8 flex-row items-center gap-1">
                                                  <EditItemQuantityButton
                                                    item={item}
                                                    type="minus"
                                                    optimisticUpdate={updateCartItem}
                                                  />
                                                  <p className="w-5 text-center">
                                                    <span className="w-full text-xs">
                                                      {item.quantity}
                                                    </span>
                                                  </p>
                                                  <EditItemQuantityButton
                                                    item={item}
                                                    type="plus"
                                                    optimisticUpdate={updateCartItem}
                                                  />
                                                </div>
                                              </div>
                                            </li>
                                          );
                                        })}
                                      </ul>
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          )}

                          {/* Regular (non-bundle) items */}
                          {regularItems.length > 0 && (
                            <div className="mb-4">
                              <ul className="divide-y divide-[#00000033] dark:divide-neutral-800">
                                {regularItems
                                  .sort((a, b) =>
                                    a.merchandise.product.title.localeCompare(
                                      b.merchandise.product.title,
                                    ),
                                  )
                                  .map((item, i) => {
                                    const merchandiseSearchParams =
                                      {} as MerchandiseSearchParams;

                                    item.merchandise.selectedOptions.forEach(
                                      ({ name, value }) => {
                                        if (value !== DEFAULT_OPTION) {
                                          merchandiseSearchParams[
                                            name.toLowerCase()
                                          ] = value;
                                        }
                                      },
                                    );

                                    const merchandiseUrl = createUrl(
                                      `/product/${item.merchandise.product.handle}`,
                                      new URLSearchParams(merchandiseSearchParams),
                                    );

                                    return (
                                      <li key={i} className="py-5">
                                        <div className="flex gap-4 items-start justify-between">
                                          {/* Product Image */}
                                          <div className="relative aspect-square w-20 overflow-hidden rounded-md bg-[#f4f4f4] dark:bg-neutral-900 flex-shrink-0 flex items-center justify-center">
                                            {item.merchandise.product.featuredImage ? (
                                              <Image
                                                src={item.merchandise.product.featuredImage.url}
                                                alt={
                                                  item.merchandise.product.featuredImage.altText ||
                                                  item.merchandise.product.title
                                                }
                                                fill
                                                sizes="80px"
                                                className="object-contain p-1"
                                              />
                                            ) : (
                                              <div className="text-neutral-400 text-xs">No Image</div>
                                            )}
                                          </div>

                                          {/* Product Info */}
                                          <div className="flex flex-1 flex-col justify-between self-stretch pr-1">
                                            <div>
                                              <Link
                                                href={merchandiseUrl}
                                                onClick={rawClose}
                                                className="text-sm font-semibold text-black dark:text-white uppercase line-clamp-1 hover:underline leading-snug"
                                              >
                                                {item.merchandise.product.title}
                                              </Link>
                                              <p className="text-xs font-normal tracking-wide text-neutral-400 dark:text-neutral-500 uppercase mt-0.5" style={{ fontFamily: "Archivo, sans-serif" }}>
                                                {item.merchandise.product.vendor ||
                                                  (item.merchandise.title !== DEFAULT_OPTION
                                                    ? item.merchandise.title
                                                    : "")}
                                              </p>
                                            </div>

                                            <div className="flex items-center gap-2 mt-3">
                                              <EditItemQuantityButton
                                                item={item}
                                                type="minus"
                                                optimisticUpdate={updateCartItem}
                                              />
                                              <span className="w-5 text-center text-xs font-semibold text-black dark:text-white" style={{ fontFamily: "Archivo, sans-serif" }}>
                                                {item.quantity < 10 ? `0${item.quantity}` : item.quantity}
                                              </span>
                                              <EditItemQuantityButton
                                                item={item}
                                                type="plus"
                                                optimisticUpdate={updateCartItem}
                                              />
                                              <button
                                                type="button"
                                                onClick={() => setEditingItem(item)}
                                                className="text-xs font-medium uppercase underline hover:text-neutral-500 transition-colors cursor-pointer text-neutral-400 dark:text-neutral-500 ml-2"
                                                style={{ fontFamily: "Archivo, sans-serif" }}
                                              >
                                                Edit
                                              </button>
                                            </div>
                                          </div>

                                          {/* Price & Delete */}
                                          <div className="flex flex-col items-end justify-between self-stretch flex-shrink-0">
                                            <Price
                                              amount={item.cost.totalAmount.amount}
                                              currencyCode={item.cost.totalAmount.currencyCode}
                                              currencyCodeClassName="hidden"
                                              className="text-base font-semibold text-black dark:text-white"
                                              style={{ fontFamily: "'Clash Display', sans-serif" }}
                                            />
                                            <DeleteItemButton
                                              item={item}
                                              optimisticUpdate={updateCartItem}
                                            />
                                          </div>
                                        </div>
                                      </li>
                                    );
                                  })}
                              </ul>
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </ul>
                  <div className="py-4 border-t border-neutral-200 dark:border-neutral-800" style={{ fontFamily: "Archivo, sans-serif" }}>
                    <div className="mb-4 flex items-baseline justify-between">
                      <span
                        className="text-lg font-bold uppercase text-neutral-900 dark:text-white tracking-wider"
                      >
                        {t("cart.estimated_total")}
                      </span>
                      <Price
                        className="text-right text-lg font-bold text-neutral-900 dark:text-white"
                        amount={cart.cost.totalAmount.amount}
                        currencyCode={cart.cost.totalAmount.currencyCode}
                        currencyCodeClassName="hidden"
                      />
                    </div>

                    {/* Snapmint EMI Banner */}
                    <SnapmintEmiCartBanner
                      totalAmount={cart.cost.totalAmount.amount}
                      onBuyOnEmi={triggerCheckout}
                    />

                    {/* Highlighted info box */}
                    <div className="bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-3 mb-4 rounded-none text-center">
                      <p className="text-[12px] text-neutral-600 dark:text-neutral-400 font-medium">
                        {t("cart.checkout_notice")}
                      </p>
                    </div>
                  </div>
                  <div className="-mx-6 px-6 space-y-3 pt-6 border-t border-neutral-200" style={{ boxShadow: "0px -3px 44px 0px rgba(0, 0, 0, 0.15)" }}>
                    {useFallback ? (
                      <form action={redirectToCheckout} className="w-full">
                        <CheckoutButton />
                      </form>
                    ) : (
                      <button
                        onClick={triggerCheckout}
                        disabled={!gokwikReady || isCheckingOut || !cart?.id}
                        className={`w-full h-14 bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 uppercase text-[13px] font-semibold tracking-wider rounded-sm cursor-pointer transition-colors flex items-center justify-center ${!gokwikReady || isCheckingOut || !cart?.id ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        style={{ fontFamily: "Archivo, sans-serif" }}
                      >
                        {isCheckingOut
                          ? t("cart.processing")
                          : !gokwikReady
                            ? t("cart.loading_checkout")
                            : t("cart.proceed_to_checkout")}
                      </button>
                    )}

                    <Link
                      href={getLocalizedPath("/cart", locale)}
                      onClick={rawClose}
                      className="w-full h-14 bg-white text-black hover:bg-neutral-50 border border-neutral-300 dark:bg-black dark:text-white dark:hover:bg-neutral-900 dark:border-white uppercase text-[13px] font-semibold tracking-wider rounded-sm cursor-pointer transition-colors flex items-center justify-center"
                      style={{ fontFamily: "Archivo, sans-serif" }}
                    >
                      {t("cart.view_cart")}
                    </Link>
                  </div>
                </div>
              )}
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
      {editingItem && (
        <QuickBuySidebar
          isOpen={!!editingItem}
          onClose={() => setEditingItem(null)}
          product={editingItem.merchandise.product as any}
          locale={locale}
          isEdit={true}
          lineId={editingItem.id}
          initialOptions={editingItem.merchandise.selectedOptions.reduce((acc: Record<string, string>, option: { name: string; value: string }) => {
            acc[option.name.toLowerCase()] = option.value;
            return acc;
          }, {})}
          quantity={editingItem.quantity}
        />
      )}
    </>
  );
}

function CheckoutButton() {
  const { pending } = useFormStatus();
  const { t } = useTranslation();

  return (
    <button
      className="w-full h-14 bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 uppercase text-[13px] font-semibold tracking-wider rounded-none cursor-pointer transition-colors flex items-center justify-center"
      type="submit"
      disabled={pending}
      style={{ fontFamily: "Archivo, sans-serif" }}
    >
      {pending ? <LoadingDots className="bg-white" /> : t("cart.proceed_to_checkout")}
    </button>
  );
}

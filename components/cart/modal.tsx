"use client";

import clsx from "clsx";
import { Dialog, Transition } from "@headlessui/react";
import { ShoppingCartIcon, XMarkIcon } from "@heroicons/react/24/outline";
import LoadingDots from "components/loading-dots";
import Price from "components/price";
import { DEFAULT_OPTION } from "lib/constants";
import { createUrl } from "lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { createCartAndSetCookie, redirectToCheckout } from "./actions";
import { useCart } from "./cart-context";
import { useGoKwikCheckout } from "lib/gokwik";
import { useTranslation } from "lib/i18n/TranslationProvider";
import { getLocalizedPath } from "lib/i18n";
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
  const openCart = () => {
    if (pathname.endsWith("/cart")) return;
    setIsOpen(true);
  };
  const closeCart = () => setIsOpen(false);

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
              className="fixed bottom-0 right-0 top-0 flex h-full w-full flex-col border-l border-neutral-200 bg-white/80 p-6 text-black backdrop-blur-xl md:w-[390px] dark:border-neutral-700 dark:bg-black/80 dark:text-white"
              style={{ fontFamily: "Archivo, sans-serif" }}
            >
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-900">
                <p
                  className="text-xl font-bold uppercase tracking-wider text-black dark:text-white"
                  style={{ fontFamily: "'Clash Display', sans-serif" }}
                >
                  {t("cart.title")}
                </p>
                <button
                  aria-label="Close cart"
                  onClick={closeCart}
                  className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 flex items-center justify-center transition-colors"
                >
                  <XMarkIcon className="h-5 w-5 text-black dark:text-white" />
                </button>
              </div>

              {!cart || cart.lines.length === 0 ? (
                <div className="mt-20 flex w-full flex-col items-center justify-center overflow-hidden">
                  <ShoppingCartIcon className="h-16 text-black dark:text-white" />
                  <p
                    className="mt-6 text-center text-xl font-bold uppercase tracking-wider text-black dark:text-white"
                    style={{ fontFamily: "'Clash Display', sans-serif" }}
                  >
                    {t("cart.empty")}
                  </p>
                </div>
              ) : (
                <div className="flex h-full flex-col justify-between overflow-hidden p-1">
                  <ul className="grow overflow-auto py-4">
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
                                className="mb-4 rounded-lg border-2 border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/30"
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
                                          <div className="relative h-12 w-12 overflow-hidden rounded-md border border-neutral-300 bg-neutral-300 dark:border-neutral-700 dark:bg-neutral-900">
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
                                          <Link
                                            href={merchandiseUrl}
                                            onClick={closeCart}
                                            className="z-30 ml-2 flex flex-row space-x-4"
                                          >
                                            <div className="flex flex-1 flex-col text-sm">
                                              <span className="leading-tight">
                                                {item.merchandise.product.title}
                                              </span>
                                              {item.merchandise.title !==
                                              DEFAULT_OPTION ? (
                                                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                                  {item.merchandise.title}
                                                </p>
                                              ) : null}
                                            </div>
                                          </Link>
                                        </div>
                                        <div className="flex h-12 flex-col justify-between">
                                          <Price
                                            className="flex justify-end text-right text-xs"
                                            amount={
                                              item.cost.totalAmount.amount
                                            }
                                            currencyCode={
                                              item.cost.totalAmount.currencyCode
                                            }
                                          />
                                          <div className="ml-auto flex h-8 flex-row items-center rounded-full border border-neutral-200 dark:border-neutral-700">
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

                          {/* Regular (non-bundle) items */}
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
                                <li
                                  key={i}
                                  className="flex w-full flex-col border-b border-neutral-300 dark:border-neutral-700"
                                >
                                  <div className="relative flex w-full flex-row justify-between px-1 py-4">
                                    <div className="absolute z-40 -ml-1 -mt-2">
                                      <DeleteItemButton
                                        item={item}
                                        optimisticUpdate={updateCartItem}
                                      />
                                    </div>
                                    <div className="flex flex-row">
                                      <div className="relative h-16 w-16 overflow-hidden rounded-md border border-neutral-300 bg-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800">
                                        <Image
                                          className="h-full w-full object-cover"
                                          width={64}
                                          height={64}
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
                                      <Link
                                        href={merchandiseUrl}
                                        onClick={closeCart}
                                        className="z-30 ml-2 flex flex-row space-x-4"
                                      >
                                        <div className="flex flex-1 flex-col text-base">
                                          <span className="leading-tight">
                                            {item.merchandise.product.title}
                                          </span>
                                          {item.merchandise.title !==
                                          DEFAULT_OPTION ? (
                                            <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                              {item.merchandise.title}
                                            </p>
                                          ) : null}
                                        </div>
                                      </Link>
                                    </div>
                                    <div className="flex h-16 flex-col justify-between">
                                      <Price
                                        className="flex justify-end space-y-2 text-right text-sm"
                                        amount={item.cost.totalAmount.amount}
                                        currencyCode={
                                          item.cost.totalAmount.currencyCode
                                        }
                                      />
                                      <div className="ml-auto flex h-9 flex-row items-center rounded-full border border-neutral-200 dark:border-neutral-700">
                                        <EditItemQuantityButton
                                          item={item}
                                          type="minus"
                                          optimisticUpdate={updateCartItem}
                                        />
                                        <p className="w-6 text-center">
                                          <span className="w-full text-sm">
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
                                  </div>
                                </li>
                              );
                            })}
                        </>
                      );
                    })()}
                  </ul>
                  <div className="py-4 border-t border-neutral-200 dark:border-neutral-800" style={{ fontFamily: "Archivo, sans-serif" }}>
                    <div className="mb-4 flex items-baseline justify-between">
                      <span
                        className="text-[14px] font-bold uppercase text-neutral-900 dark:text-white tracking-wider"
                        style={{ fontFamily: "'Clash Display', sans-serif" }}
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
                  <div className="space-y-3">
                    {useFallback ? (
                      <form action={redirectToCheckout} className="w-full">
                        <CheckoutButton />
                      </form>
                    ) : (
                      <button
                        onClick={triggerCheckout}
                        disabled={!gokwikReady || isCheckingOut || !cart?.id}
                        className={`w-full h-14 bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 uppercase text-[13px] font-semibold tracking-wider rounded-none cursor-pointer transition-colors flex items-center justify-center ${
                          !gokwikReady || isCheckingOut || !cart?.id ? "opacity-50 cursor-not-allowed" : ""
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
                      onClick={closeCart}
                      className="w-full h-14 bg-white text-black hover:bg-neutral-50 border border-black dark:bg-black dark:text-white dark:hover:bg-neutral-900 dark:border-white uppercase text-[13px] font-semibold tracking-wider rounded-none cursor-pointer transition-colors flex items-center justify-center"
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

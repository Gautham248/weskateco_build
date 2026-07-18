"use client";

import { removeItem, updateItemQuantity } from "components/cart/actions";
import { useCart } from "components/cart/cart-context";
import secure from "components/icons/secure.svg";
import Footer from "components/layout/footer";
import Price from "components/price";
import { useGoKwikCheckout } from "lib/gokwik";
import { getLocalizedPath } from "lib/i18n";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Suspense, useTransition } from "react";

function CartSkeleton() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-black dark:bg-neutral-950 dark:text-white">
      <main className="flex-1 mx-auto max-w-(--breakpoint-2xl) w-full px-6 py-12 animate-pulse">
        <div className="h-10 w-48 bg-neutral-200 dark:bg-neutral-800 rounded-md mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-32 bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
            <div className="h-32 bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
          </div>
          <div className="h-96 bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
        </div>
      </main>
    </div>
  );
}

export default function CartPage() {
  return (
    <Suspense fallback={<CartSkeleton />}>
      <CartPageContent />
    </Suspense>
  );
}

function CartPageContent() {
  const { cart, updateCartItem } = useCart();
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const [isPending, startTransition] = useTransition();

  const {
    isReady: gokwikReady,
    isError: gokwikError,
    triggerCheckout,
  } = useGoKwikCheckout({
    cartId: cart?.id,
  });

  const handleCheckout = () => {
    if (gokwikReady && !gokwikError) {
      triggerCheckout();
    } else if (cart?.checkoutUrl) {
      window.location.href = cart.checkoutUrl;
    }
  };

  const subtotal = cart ? parseFloat(cart.cost.subtotalAmount.amount) : 0;
  const currencyCode = cart ? cart.cost.subtotalAmount.currencyCode : "INR";

  return (
    <div className="flex flex-col min-h-screen bg-white text-black dark:bg-neutral-950 dark:text-white">
      {/* Main Cart Body */}
      <main className="flex-1 mx-auto max-w-(--breakpoint-2xl) w-full px-4 py-12">
        {!cart ||
          (cart.lines.length === 0 && (
            <h1
              className="text-[32px] font-semibold font-black tracking-tighter uppercase mb-8 flex items-baseline gap-2"
              style={{ fontFamily: "'Clash Display', sans-serif" }}
            >
              My Cart
            </h1>
          ))}

        {!cart || cart.lines.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-2 py-20 text-center border border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl">
            <svg
              className="h-16 w-16 text-neutral-400 mb-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
              />
            </svg>
            <h2 className="text-xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-neutral-500 mb-6 max-w-sm text-sm">
              Looks like you haven't added anything to your cart yet. Let's find
              some setups!
            </p>
            <Link
              href={getLocalizedPath("/store/skateboards", locale)}
              className="rounded-xs bg-black text-white px-6 py-3 uppercase text-xs font-semibold tracking-wider hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 transition-colors"
              style={{ fontFamily: "Archivo, sans-serif" }}
            >
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            {/* Left side: Cart items list */}
            <div className="lg:col-span-2 space-y-6">
              <h1
                className="text-[32px] font-semibold font-black tracking-tighter uppercase mb-8 flex items-baseline gap-2"
                style={{ fontFamily: "'Clash Display', sans-serif" }}
              >
                My Cart
              </h1>
              {/* Alert Sign In */}
              <div
                className="flex items-center gap-3 bg-neutral-900 text-white rounded-lg p-4 text-sm font-normal"
                style={{ fontFamily: "Archivo, sans-serif" }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="flex-shrink-0"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>
                  You're signed out right now. To save these items or see your
                  previously saved items,{" "}
                  <Link
                    href="#"
                    className="underline font-bold hover:text-neutral-300"
                  >
                    Sign in
                  </Link>
                  .
                </span>
              </div>

              {/* Items Card List */}
              <div className="space-y-4">
                {cart.lines.map((item) => {
                  const hasImage =
                    !!item.merchandise.product.featuredImage?.url;
                  return (
                    <div key={item.id}>
                      {/* Mobile View */}
                      <div className="flex md:hidden gap-6 p-4 bg-white dark:bg-black rounded-sm relative border-b border-neutral-100 dark:border-neutral-900">
                        {/* Left Column: Image & Quantity Selector */}
                        <div className="flex flex-col items-center gap-4 flex-shrink-0">
                          <div className="relative aspect-square w-24 h-24 overflow-hidden rounded-md bg-neutral-50 dark:bg-neutral-900 flex-shrink-0 border border-neutral-100 dark:border-neutral-800">
                            {hasImage ? (
                              <Image
                                src={item.merchandise.product.featuredImage.url}
                                alt={
                                  item.merchandise.product.featuredImage
                                    .altText || item.merchandise.product.title
                                }
                                fill
                                className="object-cover object-top"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-xs text-neutral-400">
                                No image
                              </div>
                            )}
                          </div>

                          {/* Quantity Selector */}
                          <CartPageQuantitySelector
                            item={item}
                            updateCartItem={updateCartItem}
                            isMobile={true}
                          />
                        </div>

                        {/* Right Column: Title, Details, Delivery, Remove */}
                        <div
                          className="flex-1 flex flex-col min-w-0"
                          style={{ fontFamily: "Archivo, sans-serif" }}
                        >
                          <h3
                            className="text-[17px] font-bold text-neutral-900 dark:text-neutral-50 leading-tight tracking-[-1%] uppercase"
                            style={{
                              fontFamily: "'Clash Display', sans-serif",
                            }}
                          >
                            {item.merchandise.product.title}
                          </h3>

                          {/* Price */}
                          <div className="mt-2">
                            <Price
                              amount={item.cost.totalAmount.amount}
                              currencyCode={item.cost.totalAmount.currencyCode}
                              currencyCodeClassName="hidden"
                              className="text-[20px] font-extrabold text-neutral-900 dark:text-neutral-50"
                            />
                          </div>

                          {/* Selected Options / Attributes */}
                          <div className="mt-4 flex flex-col gap-1.5 text-sm uppercase">
                            {item.merchandise.selectedOptions.map((opt) => (
                              <div
                                key={opt.name}
                                className="flex gap-1.5 items-baseline"
                              >
                                <span className="font-normal text-neutral-600 dark:text-neutral-400">
                                  {opt.name}:
                                </span>
                                <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                                  {opt.value}
                                </span>
                              </div>
                            ))}
                          </div>

                          {/* Delivery by Today */}
                          <div className="mt-4 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                            Delivery by{" "}
                            <span className="text-[#3f6212] dark:text-[#84cc16] font-bold">
                              Today
                            </span>
                          </div>

                          {/* Remove Action */}
                          <div className="mt-5">
                            <CartPageRemoveButton
                              item={item}
                              updateCartItem={updateCartItem}
                              isMobile={true}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Desktop View */}
                      <div className="hidden md:flex gap-4 p-4 md:p-6 bg-neutral-50 dark:bg-neutral-900/40 rounded-sm relative border border-neutral-100 dark:border-neutral-900">
                        {/* Product image */}
                        <div className="relative aspect-square w-24 h-24 sm:w-28 sm:h-28 overflow-hidden rounded-md bg-neutral-100 dark:bg-neutral-800 flex-shrink-0 border border-neutral-200/50 dark:border-neutral-800">
                          {hasImage ? (
                            <Image
                              src={item.merchandise.product.featuredImage.url}
                              alt={
                                item.merchandise.product.featuredImage
                                  .altText || item.merchandise.product.title
                              }
                              fill
                              className="object-cover object-top"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs text-neutral-400">
                              No image
                            </div>
                          )}
                        </div>

                        {/* Product details info & Actions */}
                        <div
                          className="flex-1 flex flex-col min-h-[110px]"
                          style={{ fontFamily: "Archivo, sans-serif" }}
                        >
                          {/* Top row: Title/Vendor on left, Quantity on right */}
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <h3
                                className="text-[16px] font-bold uppercase text-black dark:text-white leading-tight tracking-[-1%]"
                                style={{
                                  fontFamily: "'Clash Display', sans-serif",
                                }}
                              >
                                {item.merchandise.product.title}
                              </h3>
                              <p
                                className="text-[14px] font-normal text-black dark:text-neutral-500 uppercase mt-0.5 tracking-[-1%]"
                                style={{
                                  fontFamily: "'Clash Display', sans-serif",
                                }}
                              >
                                {item.merchandise.product.vendor || ""}
                              </p>
                            </div>

                            {/* Quantity Selector */}
                            <CartPageQuantitySelector
                              item={item}
                              updateCartItem={updateCartItem}
                              isMobile={false}
                            />
                          </div>

                          {/* Middle row: Attributes */}
                          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-[12px] text-black uppercase">
                            {item.merchandise.selectedOptions.map((opt) => (
                              <span key={opt.name}>
                                <span className="font-normal text-black mr-1">
                                  {opt.name}:
                                </span>
                                <span className="font-bold text-black dark:text-white">
                                  {opt.value}
                                </span>
                              </span>
                            ))}
                          </div>

                          {/* Bottom row: Remove on left, Price on right */}
                          <div className="mt-auto pt-6 flex justify-between items-end">
                            <CartPageRemoveButton
                              item={item}
                              updateCartItem={updateCartItem}
                              isMobile={false}
                            />

                            <Price
                              amount={item.cost.totalAmount.amount}
                              currencyCode={item.cost.totalAmount.currencyCode}
                              currencyCodeClassName="hidden"
                              className="text-[20px] font-extrabold text-black dark:text-white"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Card Actions */}
              <div className="pt-6 border-t border-neutral-100 dark:border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div></div>
                <div
                  className="flex justify-between items-center w-full text-[14px] text-neutral-500 dark:text-neutral-400 md:justify-end md:gap-4"
                  style={{ fontFamily: "Archivo, sans-serif" }}
                >
                  <span>Subtotal ({cart.totalQuantity} items):</span>
                  <Price
                    amount={cart.cost.subtotalAmount.amount}
                    currencyCode={cart.cost.subtotalAmount.currencyCode}
                    currencyCodeClassName="hidden"
                    className="text-base font-bold text-neutral-900 dark:text-neutral-50"
                  />
                </div>
              </div>
            </div>

            {/* Right side: Summary panel */}
            <div className="space-y-6">
              {/* Order Summary Box */}
              <div className="border border-neutral-100 dark:border-neutral-900 rounded-md p-6 bg-neutral-50/50 dark:bg-neutral-900/20">
                <h2
                  className="text-[20px] font-semibold font-black uppercase tracking-tight mb-6"
                  style={{ fontFamily: "'Clash Display', sans-serif" }}
                >
                  Order Summary
                </h2>

                {/* Price Details breakdown */}
                <div className="space-y-4" style={{ fontFamily: "Archivo, sans-serif" }}>

                  <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4 mt-2 flex justify-between items-baseline">
                    <span
                      className="text-[14px] font-bold uppercase text-neutral-900 dark:text-white"
                      style={{ fontFamily: "'Clash Display', sans-serif" }}
                    >
                      Subtotal
                    </span>
                    <Price
                      amount={cart.cost.totalAmount.amount}
                      currencyCode={cart.cost.totalAmount.currencyCode}
                      currencyCodeClassName="hidden"
                      className="text-lg font-bold text-neutral-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Terms agreement checkbox */}
                <div
                  className="mt-6 flex items-end gap-2 "
                  style={{ fontFamily: "Archivo, sans-serif" }}
                >
                  <label
                    htmlFor="terms"
                    className="text-[12px] text-black leading-tight"
                    style={{ fontFamily: "Archivo, sans-serif" }}
                  >
                    Taxes included. Discounts and shipping calculated at checkout.
                  </label>
                </div>

                {/* Checkout button action */}
                <button
                  type="button"
                  onClick={handleCheckout}
                  className="w-full mt-6 h-14 bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 uppercase text-[13px] font-semibold tracking-wider rounded-none cursor-pointer transition-colors"
                  style={{ fontFamily: "Archivo, sans-serif" }}
                >
                  Proceed to Checkout
                </button>

                {/* Secure payments indicator badge */}
                <div
                  className="mt-4 p-3 flex items-center gap-2.5 text-[12px] text-black font-medium"
                  style={{ fontFamily: "Archivo, sans-serif" }}
                >
                  <img
                    src={secure.src || secure}
                    className="bg-green-50 dark:bg-green-950/10 p-2 w-9 h-9 rounded-md flex-shrink-0"
                    alt="secure"
                  />
                  <span>
                    Secure Encrypted Payments | Genuine Weskateco Products
                  </span>
                </div>
              </div>

            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

function CartPageQuantitySelector({
  item,
  updateCartItem,
  isMobile,
}: {
  item: any;
  updateCartItem: any;
  isMobile: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  const handleDecrease = () => {
    startTransition(async () => {
      if (item.quantity > 1) {
        updateCartItem(item.merchandise.id, "minus");
        await updateItemQuantity(null, {
          merchandiseId: item.merchandise.id,
          quantity: item.quantity - 1,
        });
      } else {
        updateCartItem(item.merchandise.id, "delete");
        await updateItemQuantity(null, {
          merchandiseId: item.merchandise.id,
          quantity: 0,
        });
      }
    });
  };

  const handleIncrease = () => {
    startTransition(async () => {
      updateCartItem(item.merchandise.id, "plus");
      await updateItemQuantity(null, {
        merchandiseId: item.merchandise.id,
        quantity: item.quantity + 1,
      });
    });
  };

  const btnClass = isMobile
    ? "flex h-8 w-8 items-center justify-center rounded-full bg-black text-white dark:bg-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors cursor-pointer text-base font-bold"
    : "flex h-7 w-7 items-center justify-center rounded-full bg-black text-white hover:bg-neutral-800 transition-colors cursor-pointer text-sm font-bold";

  const containerClass = isMobile
    ? "flex items-center gap-3.5 flex-shrink-0"
    : "flex items-center gap-3 flex-shrink-0";

  const textClass = isMobile
    ? "text-sm font-semibold w-5 text-center text-neutral-900 dark:text-neutral-100"
    : "text-xs font-semibold w-5 text-center text-neutral-700 dark:text-neutral-300";

  return (
    <div className={containerClass}>
      <button
        type="button"
        onClick={handleDecrease}
        disabled={isPending}
        className={btnClass}
      >
        -
      </button>
      <span className={textClass}>
        {String(item.quantity).padStart(2, "0")}
      </span>
      <button
        type="button"
        onClick={handleIncrease}
        disabled={isPending}
        className={btnClass}
      >
        +
      </button>
    </div>
  );
}

function CartPageRemoveButton({
  item,
  updateCartItem,
  isMobile,
}: {
  item: any;
  updateCartItem: any;
  isMobile: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  const handleRemove = () => {
    startTransition(async () => {
      updateCartItem(item.merchandise.id, "delete");
      await removeItem(null, item.merchandise.id);
    });
  };

  const btnClass = isMobile
    ? "text-[12px] font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200 underline cursor-pointer hover:text-neutral-600 disabled:opacity-50"
    : "text-[12px] font-normal uppercase tracking-wider text-black dark:text-white underline cursor-pointer hover:text-neutral-600 disabled:opacity-50";

  return (
    <button
      type="button"
      onClick={handleRemove}
      disabled={isPending}
      className={btnClass}
    >
      REMOVE
    </button>
  );
}

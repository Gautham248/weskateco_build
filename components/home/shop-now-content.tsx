"use client";

import { addItem, createSingleItemCartAction } from "components/cart/actions";
import { useCart } from "components/cart/cart-context";
import Price from "components/price";
import { QuickBuySidebar } from "components/product/quick-buy-sidebar";
import { SnapmintEmiBadge } from "components/product/snapmint-emi-badge";
import type { ShopNowSlide } from "lib/catalog/shop-now";
import { createTranslator, getLocalizedPath } from "lib/i18n";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";

const TRACK_PADDING = "var(--track-padding)";

export default function ShopNowContent({
  slides,
  locale,
}: {
  slides: ShopNowSlide[];
  locale: string;
}) {
  return (
    <div
      className="flex gap-2 overflow-x-auto scrollbar-none snap-x snap-mandatory"
      style={{
        paddingLeft: TRACK_PADDING,
        paddingRight: TRACK_PADDING,
        msOverflowStyle: "none",
        scrollbarWidth: "none",
      }}
    >
      {slides.map((slide, index) => (
        <ShopNowCard
          key={slide.handle}
          slide={slide}
          locale={locale}
          isFirst={index === 0}
        />
      ))}
    </div>
  );
}

function ShopNowCard({
  slide,
  locale,
  isFirst,
}: {
  slide: ShopNowSlide;
  locale: string;
  isFirst: boolean;
}) {
  const t = createTranslator(locale);
  const { addCartItem } = useCart();
  const [isPending, startTransition] = useTransition();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const imgRef = useRef<HTMLDivElement>(null);
  const [showIndex, setShowIndex] = useState(0);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  const lastIndex = slide.images.length - 1;
  const isSoldOut = !slide.availableForSale;

  /**
   * Hover walks across whichever photos this product actually has: a quarter of
   * the way in shows the first, three quarters in shows the last.
   */
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imgRef.current || slide.images.length < 2) return;
    clearTimeout(leaveTimer.current);
    const rect = imgRef.current.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    const next = Math.floor(pct * slide.images.length);
    setShowIndex(Math.min(Math.max(next, 0), lastIndex));
  };

  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const isSwiping = useRef(false);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches[0]) {
      touchStart.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
      isSwiping.current = false;
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!touchStart.current) return;
    const touch = e.touches[0];
    if (!touch) return;

    const diffX = touch.clientX - touchStart.current.x;
    const diffY = touch.clientY - touchStart.current.y;

    if (Math.abs(diffX) > 10 && Math.abs(diffX) > Math.abs(diffY)) {
      isSwiping.current = true;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!touchStart.current) return;
    const touch = e.changedTouches[0];
    if (touch) {
      const diffX = touch.clientX - touchStart.current.x;
      const diffY = touch.clientY - touchStart.current.y;

      const threshold = 40; // minimum distance for swipe in px

      if (Math.abs(diffX) > Math.abs(diffY)) {
        if (Math.abs(diffX) > threshold) {
          if (diffX < 0) {
            // Swiped left
            setShowIndex((prev) => Math.min(prev + 1, lastIndex));
          } else {
            // Swiped right
            setShowIndex((prev) => Math.max(prev - 1, 0));
          }
        }
      }
    }
    touchStart.current = null;
  };

  /**
   * A horizontal drag must not navigate to the product page on release.
   */
  const handleClick = (e: React.MouseEvent) => {
    if (isSwiping.current) {
      e.preventDefault();
      e.stopPropagation();
      isSwiping.current = false;
    }
  };

  /**
   * Single-variant products add straight away; anything with real options opens
   * the quick-buy sidebar. Called through the server action rather than the cart
   * context, so this section can never throw "useCart must be used within a
   * CartProvider" while rendering the homepage.
   */
  const handleAddToCart = () => {
    if (isSoldOut) return;

    if (slide.hasVariants) {
      setIsSidebarOpen(true);
      return;
    }

    const variant = slide.product.variants[0];

    if (!variant) return;

    // Optimistic UI: badge and toast update instantly. addItem below performs
    // the real server-side add.
    addCartItem(variant, slide.product);
    toast.success(`${slide.title} added to cart.`);

    startTransition(async () => {
      const error = await addItem(null, variant.id);

      if (error) {
        toast.error(error);
      }
    });
  };

  const handleEmiCheckout = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const variant = slide.product.variants[0];
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

  return (
    <Link
      href={getLocalizedPath(`/product/${slide.handle}`, locale)}
      onClick={handleClick}
      className="group/card flex flex-col bg-transparent w-[calc(50vw-1.25rem)] sm:w-[340px] lg:w-[384px] flex-shrink-0 snap-start"
      style={{
        scrollMarginLeft: TRACK_PADDING,
      }}
    >
      {/* Image Block */}
      <div
        ref={imgRef}
        className="relative aspect-[3/4.5] w-full overflow-hidden rounded-md touch-pan-x"
        onMouseEnter={() => {
          clearTimeout(leaveTimer.current);
          if (slide.images.length > 1) setShowIndex(Math.min(1, lastIndex));
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          clearTimeout(leaveTimer.current);
          leaveTimer.current = setTimeout(() => {
            setShowIndex(0);
          }, 800);
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Pill Badges Stack */}
        {slide.discountPercent ? (
          <div className="absolute right-3 top-3 z-20 flex items-center gap-1.5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
            <span className="rounded bg-neutral-900/60 backdrop-blur-md px-2 py-1 text-[clamp(0.5rem,1.5vw,0.625rem)] font-medium text-white">
              {slide.discountPercent}% off
            </span>
          </div>
        ) : null}

        {/* Sliding Image Track */}
        {slide.images.length > 0 ? (
          <div
            className="absolute inset-0 flex transition-transform duration-700 ease-in-out touch-pan-x"
            style={{
              transform: `translateX(-${showIndex * 100}%)`,
              touchAction: "pan-x",
            }}
          >
            {slide.images.map((image, index) => (
              <div
                key={`${image.url}-${index}`}
                className="relative h-full w-full flex-shrink-0 touch-pan-x"
              >
                <Image
                  src={image.url}
                  alt={image.altText}
                  fill
                  className="object-contain touch-pan-x"
                  sizes="(max-width: 640px) 280px, (max-width: 768px) 340px, 440px"
                  priority={isFirst && index === 0}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-neutral-400">
            No Image
          </div>
        )}

        {/* Carousel Indicators */}
        {slide.images.length > 1 ? (
          <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-1 rounded-full bg-black/20 backdrop-blur-[2px] px-1.5 py-1">
            {slide.images.map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 transition-all duration-300 rounded-full bg-white ${
                  idx === showIndex ? "w-4 opacity-100" : "w-1.5 opacity-50"
                }`}
              />
            ))}
          </div>
        ) : null}

        {isSoldOut ? (
          <div className="absolute top-3 left-3 z-10 rounded-full bg-neutral-900/90 px-3 py-1 text-xs font-semibold tracking-wider text-white backdrop-blur-xs dark:bg-neutral-100 dark:text-neutral-900">
            {t("product.sold_out")}
          </div>
        ) : null}

        {/* Add to Cart Hover Button (single element) */}
        <button
          type="button"
          disabled={isSoldOut || isPending}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleAddToCart();
          }}
          className="cursor-pointer group/btn absolute bottom-3 right-3 z-20 flex h-8 w-8 md:h-10 md:w-10 md:hover:w-[120px] items-center rounded-full bg-[#00000050] backdrop-blur-md text-white transition-all duration-300 active:scale-95 overflow-hidden disabled:cursor-not-allowed disabled:opacity-50"
        >
          <div className="flex items-center justify-start gap-2 px-2 md:px-3 w-full h-full">
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
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span className="text-sm font-medium whitespace-nowrap text-white/90 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-200 delay-75">
              Add to Cart
            </span>
          </div>
        </button>
      </div>

      {/* Product Metadata Track */}
      <div className="py-4">
        <p
          className="text-[clamp(0.75rem,2vw,1rem)] font-normal tracking-tight text-neutral-400 dark:text-neutral-500 uppercase mb-2"
          style={{ fontFamily: "Archivo, sans-serif" }}
        >
          {slide.vendor}
        </p>
        <h3 className="line-clamp-2 text-[clamp(0.875rem,2.5vw,1.25rem)] font-semibold leading-snug tracking-[-1%] text-neutral-900 dark:text-neutral-100 uppercase mb-2">
          {slide.title}
        </h3>
        <div className="flex items-baseline gap-2">
          <Price
            amount={slide.price.amount}
            currencyCode={slide.price.currencyCode}
            currencyCodeClassName="hidden"
            className="text-[clamp(0.875rem,2vw,1.125rem)] font-[300] text-neutral-900 dark:text-neutral-100"
            style={{ fontFamily: "Archivo, sans-serif" }}
          />
          {slide.compareAtPrice ? (
            <Price
              amount={slide.compareAtPrice.amount}
              currencyCode={slide.compareAtPrice.currencyCode}
              currencyCodeClassName="hidden"
              className="text-[clamp(0.75rem,2vw,1rem)] font-[300] text-red-500 dark:text-red-400 line-through decoration-red-500 decoration-1"
              style={{ fontFamily: "Archivo, sans-serif" }}
            />
          ) : null}
        </div>
        <SnapmintEmiBadge
          priceAmount={slide.price.amount}
          onClick={handleEmiCheckout}
        />
      </div>

      <QuickBuySidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        product={slide.product}
        locale={locale}
      />
    </Link>
  );
}

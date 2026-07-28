"use client";

import shopNow1 from "components/icons/shop_now_1.png";
import shopNow2 from "components/icons/shop_now_2.png";
import shopNow3 from "components/icons/shop_now_3.png";
import { getLocalizedPath } from "lib/i18n";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import catalog from "scripts/product-catalog-dump.json";

interface ProductCard {
  id: string;
  brand: string;
  name: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  monthlyPayment?: string;
}

const products: ProductCard[] = catalog.shopNow.map((p) => ({
  id: p.id,
  brand: p.brand,
  name: p.name,
  price: p.price,
  originalPrice: p.originalPrice,
  discount: p.discount,
  monthlyPayment: p.monthlyPayment,
}));

export default function ShopNow({ locale }: { locale: string }) {
  // Calculates dynamic alignment padding relative to a 1536px max-width container
  const trackPadding = "var(--track-padding)";

  return (
    <section className="shop-now-section w-full overflow-hidden py-15 md:py-30">
      {/* Header aligned dynamically using trackPadding */}
      <div
        className="mb-6 md:mb-10 flex justify-between w-full items-center"
        style={{ paddingLeft: trackPadding, paddingRight: trackPadding }}
      >
        <h2
          className="text-[clamp(1.5rem,5vw,3.75rem)] leading-[clamp(1.5rem,5vw,3.75rem)] font-black tracking-tight text-black dark:text-white uppercase"
          style={{
            fontFamily: "'Clash Display', sans-serif",
            letterSpacing: "-0.01em",
          }}
        >
          SHOP NOW
        </h2>
        <Link
          href={getLocalizedPath("/store", locale)}
          className="text-[14px] md:text-[18px] lg:text-[24px] font-bold tracking-[-0.01em] text-black hover:opacity-70 dark:text-white uppercase underline decoration-solid underline-offset-1 skip-ink-auto"
          style={{ fontFamily: "'Clash Display', sans-serif" }}
        >
          VIEW MORE
        </Link>
      </div>

      {/* Edge-to-edge scroll track with precise internal alignment */}
      <div
        className="flex gap-2 overflow-x-auto scrollbar-none snap-x snap-mandatory"
        style={{
          paddingLeft: trackPadding,
          paddingRight: trackPadding,
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        <style
          dangerouslySetInnerHTML={{
            __html: `
          .shop-now-section {
            --track-padding: 1rem;
          }
          @media (min-width: 1024px) {
            .shop-now-section {
              --track-padding: max(3.75rem, calc((100vw - 1536px) / 2 + 3.75rem));
            }
          }
          div::-webkit-scrollbar {
            display: none !important;
          }
        `,
          }}
        />

        {products.map((product) => (
          <ProductCardGrid
            key={product.id}
            product={product}
            trackPadding={trackPadding}
          />
        ))}
      </div>
    </section>
  );
}

function ProductCardGrid({
  product,
  trackPadding,
}: {
  product: ProductCard;
  trackPadding: string;
}) {
  const imgRef = useRef<HTMLDivElement>(null);
  const [showIndex, setShowIndex] = useState(0);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imgRef.current) return;
    clearTimeout(leaveTimer.current);
    const rect = imgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = x / rect.width;
    setShowIndex(pct < 0.25 ? 0 : pct > 0.75 ? 2 : 1);
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
            setShowIndex((prev) => Math.min(prev + 1, 2));
          } else {
            // Swiped right
            setShowIndex((prev) => Math.max(prev - 1, 0));
          }
        }
      }
    }
    touchStart.current = null;
  };

  return (
    <div
      className="group/card flex flex-col bg-transparent w-[calc(50vw-1.25rem)] sm:w-[340px] lg:w-[384px] flex-shrink-0 snap-start"
      style={{
        scrollMarginLeft: trackPadding,
      }}
    >
      {/* Image Block */}
      <div
        ref={imgRef}
        className="relative aspect-[3/4.5] w-full overflow-hidden rounded-md bg-[#e6e6e6] dark:bg-neutral-900 touch-pan-x"
        onMouseEnter={() => {
          clearTimeout(leaveTimer.current);
          setShowIndex(1);
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
        {(product.discount || product.monthlyPayment) && (
          <div className="absolute right-3 top-3 z-20 flex items-center gap-1.5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
            {product.discount && (
              <span className="rounded bg-neutral-900/60 backdrop-blur-md px-2 py-1 text-[clamp(0.5rem,1.5vw,0.625rem)] font-medium text-white">
                {product.discount}
              </span>
            )}
            {product.monthlyPayment && (
              <span className="rounded bg-neutral-900/60 backdrop-blur-md px-2 py-1 text-[clamp(0.5rem,1.5vw,0.625rem)] font-medium text-white">
                {product.monthlyPayment}
              </span>
            )}
          </div>
        )}

        {/* Sliding Image Track */}
        <div
          className="absolute inset-0 flex transition-transform duration-700 ease-in-out touch-pan-x"
          style={{ transform: `translateX(-${showIndex * 100}%)`, touchAction: "pan-x" }}
        >
          {[shopNow1, shopNow2, shopNow3].map((img, index) => (
            <div key={index} className="relative h-full w-full flex-shrink-0 touch-pan-x">
              <Image
                src={img}
                alt={product.name}
                fill
                className="object-cover touch-pan-x"
                sizes="(max-width: 640px) 280px, (max-width: 768px) 340px, 440px"
                priority={product.id === "1"}
              />
            </div>
          ))}
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-1 rounded-full bg-black/20 backdrop-blur-[2px] px-1.5 py-1">
          {[0, 1, 2].map((idx) => (
            <span
              key={idx}
              className={`h-1.5 transition-all duration-300 rounded-full bg-white ${idx === showIndex ? "w-4 opacity-100" : "w-1.5 opacity-50"
                }`}
            />
          ))}
        </div>

        {/* Add to Cart Hover Button (single element) */}
        <button className="cursor-pointer group/btn absolute bottom-3 right-3 z-20 flex h-8 w-8 md:h-10 md:w-10 md:hover:w-[120px] items-center rounded-full bg-[#00000050] backdrop-blur-md text-white transition-all duration-300 active:scale-95 overflow-hidden">
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
          {product.brand}
        </p>
        <h3
          className="line-clamp-2 text-[clamp(0.875rem,2.5vw,1.25rem)] font-semibold leading-snug tracking-[-1%] text-neutral-900 dark:text-neutral-100 uppercase mb-2"
        >
          {product.name}
        </h3>
        <div className="flex items-baseline gap-2">
          <span
            className="text-[clamp(0.875rem,2vw,1.125rem)] font-[300] text-neutral-900 dark:text-neutral-100"
            style={{ fontFamily: "Archivo, sans-serif" }}
          >
            {product.price}
          </span>
          {product.originalPrice && (
            <span
              className="text-[clamp(0.75rem,2vw,1rem)] font-[300] text-red-500 dark:text-red-400 line-through decoration-red-500 decoration-1"
              style={{ fontFamily: "Archivo, sans-serif" }}
            >
              {product.originalPrice}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

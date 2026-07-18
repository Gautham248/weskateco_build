"use client";
import Price from "components/price";
import { createTranslator, getLocalizedPath } from "lib/i18n";
import { Product } from "lib/shopify/types";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";

interface ProductCardProps {
  product: Product;
  locale: string;
}

export default function ProductCard({ product, locale }: ProductCardProps) {
  const t = createTranslator(locale);
  const { title, handle, availableForSale, priceRange, featuredImage, images } =
    product;
  const isSoldOut = !availableForSale;

  const productPath = getLocalizedPath(`/product/${handle}`, locale);

  const imgRef = useRef<HTMLDivElement>(null);
  const [showIndex, setShowIndex] = useState(0);
  const moveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  const displayImages =
    images && images.length > 0
      ? images.slice(0, 2)
      : featuredImage
        ? [featuredImage]
        : [];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imgRef.current || displayImages.length < 2) return;
    clearTimeout(moveTimer.current);
    moveTimer.current = setTimeout(() => {
      if (!imgRef.current) return;
      const rect = imgRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const pct = x / rect.width;
      setShowIndex(pct < 0.5 ? 0 : 1);
    }, 80);
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
            if (displayImages.length > 1) {
              setShowIndex((prev) => Math.min(prev + 1, displayImages.length - 1));
            }
          } else {
            // Swiped right
            setShowIndex((prev) => Math.max(prev - 1, 0));
          }
        }
      }
    }
    touchStart.current = null;
  };

  const handleClick = (e: React.MouseEvent) => {
    if (isSwiping.current) {
      e.preventDefault();
      e.stopPropagation();
      isSwiping.current = false;
    }
  };

  return (
    <Link
      href={productPath}
      className="group flex flex-col bg-transparent"
      onClick={handleClick}
    >
      <div
        ref={imgRef}
        className="relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-[#e6e6e6] dark:bg-neutral-900 touch-pan-y"
        onMouseEnter={() => {
          if (displayImages.length > 1) setShowIndex(1);
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          clearTimeout(moveTimer.current);
          setShowIndex(0);
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {displayImages.length > 0 ? (
          <div
            className="absolute inset-0 flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${showIndex * 100}%)` }}
          >
            {displayImages.map((img, index) => (
              <div
                key={img.url || index}
                className="relative h-full w-full flex-shrink-0"
              >
                <Image
                  src={img.url}
                  alt={img.altText || title}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                  className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                  priority={false}
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
        {displayImages.length > 1 && (
          <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-1 rounded-full bg-black/20 backdrop-blur-[2px] px-1.5 py-1">
            {displayImages.map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 transition-all duration-300 rounded-full bg-white ${idx === showIndex ? "w-4 opacity-100" : "w-1.5 opacity-50"
                  }`}
              />
            ))}
          </div>
        )}

        {/* Plus circle (visible when not hovered) */}
        <div className="absolute bottom-3 right-3 z-20 flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full bg-black/30 dark:bg-white/20 backdrop-blur-md text-white opacity-100 group-hover:opacity-0 transition-opacity duration-300">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </div>

        {/* Hover Action Button */}
        <div className="cursor-pointer group/btn absolute bottom-3 right-3 z-20 flex h-10 w-10 hover:w-[110px] items-center rounded-lg bg-black/30 dark:bg-white/20 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-all duration-300 active:scale-95 overflow-hidden">
          <div className="flex items-center gap-2 px-2 w-full">
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
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <span className="text-sm font-medium whitespace-nowrap text-white/90 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-200 delay-75">
              Add to Cart
            </span>
          </div>
        </div>

        {isSoldOut && (
          <div className="absolute top-3 left-3 z-10 rounded-full bg-neutral-900/90 px-3 py-1 text-xs font-semibold tracking-wider text-white backdrop-blur-xs dark:bg-neutral-100 dark:text-neutral-900">
            {t("product.sold_out")}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col pt-4 px-1">
        {product.vendor && (
          <p
            className="text-[clamp(0.625rem,1.5vw,0.75rem)] font-normal tracking-tight text-neutral-400 dark:text-neutral-500 uppercase mb-1"
            style={{ fontFamily: "Archivo" }}
          >
            {product.vendor}
          </p>
        )}
        <h3
          className="mb-2 text-[clamp(0.8125rem,2vw,1rem)] font-semibold text-neutral-900 dark:text-neutral-100 uppercase line-clamp-2"
          style={{ fontFamily: "'Clash Display', sans-serif" }}
        >
          {title}
        </h3>
        <div className="flex items-center gap-3">
          <Price
            amount={priceRange.minVariantPrice.amount}
            currencyCode={priceRange.minVariantPrice.currencyCode}
            currencyCodeClassName="hidden"
            className="text-[clamp(0.75rem,1.8vw,0.875rem)] font-normal text-neutral-900 dark:text-neutral-100"
          />
          {product.variants[0]?.compareAtPrice && (
            <Price
              amount={product.variants[0].compareAtPrice.amount}
              currencyCode={product.variants[0].compareAtPrice.currencyCode}
              currencyCodeClassName="hidden"
              className="text-[14px] font-normal text-red-500 line-through decoration-red-500 decoration-1"
            />
          )}
        </div>
      </div>
    </Link>
  );
}

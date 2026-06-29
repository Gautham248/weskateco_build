"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image, { StaticImageData } from "next/image";
import { getLocalizedPath } from "lib/i18n";
import shopNow1 from "components/icons/shop_now_1.png";
import shopNow2 from "components/icons/shop_now_2.png";
import catalog from "scripts/product-catalog-dump.json";

const imageMap: Record<string, StaticImageData> = {
  "shop_now_1.png": shopNow1,
  "shop_now_2.png": shopNow2,
};

interface ProductCard {
  id: string;
  brand: string;
  name: string;
  price: string;
  originalPrice?: string;
  images: StaticImageData[];
  discount?: string;
  monthlyPayment?: string;
}

const products: ProductCard[] = catalog.shopNow.map((p) => ({
  ...p,
  images: p.images.map((name) => imageMap[name]).filter((img): img is StaticImageData => img !== undefined),
}));

export default function ShopNow({ locale }: { locale: string }) {
  // Calculates dynamic alignment padding relative to a 1536px max-width container
  const trackPadding = "max(1.5rem, calc((100vw - 1536px) / 2 + 1.5rem))";

  return (
    <section className="w-full overflow-hidden py-12 md:py-16">
      {/* Header aligned dynamically using trackPadding */}
      <div 
        className="mb-10 flex items-end justify-between w-full items-center"
        style={{ paddingLeft: trackPadding, paddingRight: trackPadding }}
      >
        <h2 className="text-4xl font-black tracking-tighter text-black dark:text-white sm:text-5xl lg:text-[60px]">
          SHOP NOW
        </h2>
        <Link
          href={getLocalizedPath("/search", locale)}
          className="text-2xl font-bold tracking-[-0.01em] text-black hover:opacity-70 dark:text-white uppercase underline decoration-solid underline-offset-1 skip-ink-auto"
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
        <style dangerouslySetInnerHTML={{
          __html: `
          div::-webkit-scrollbar {
            display: none !important;
          }
        `}} />

        {products.map((product) => (
          <ProductCardGrid key={product.id} product={product} trackPadding={trackPadding} />
        ))}
      </div>
    </section>
  );
}

function ProductCardGrid({ product, trackPadding }: { product: ProductCard; trackPadding: string }) {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  useEffect(() => {
    if (product.images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImgIndex((prev) => (prev === 0 ? 1 : 0));
    }, 3500);
    return () => clearInterval(interval);
  }, [product.images.length]);

  return (
    <div
      className="group/card flex flex-col bg-transparent w-[calc(100vw-3rem)] sm:w-[340px] md:w-[400px] lg:w-[440px] flex-shrink-0 snap-start"
      style={{
        scrollMarginLeft: trackPadding
      }}
    >
      {/* Image Block */}
      <div className="relative aspect-[3/4.5] w-full overflow-hidden rounded-xl bg-[#e6e6e6] dark:bg-neutral-900">
        
        {/* Pill Badges Stack */}
        {(product.discount || product.monthlyPayment) && (
          <div className="absolute right-3 top-3 z-20 flex items-center gap-1.5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
            {product.discount && (
              <span className="rounded bg-neutral-900/60 backdrop-blur-md px-2 py-1 text-[10px] font-medium text-white">
                {product.discount}
              </span>
            )}
            {product.monthlyPayment && (
              <span className="rounded bg-neutral-900/60 backdrop-blur-md px-2 py-1 text-[10px] font-medium text-white">
                {product.monthlyPayment}
              </span>
            )}
          </div>
        )}

        {/* Sliding Image Loop Track */}
        <div 
          className="absolute inset-0 flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentImgIndex * 100}%)` }}
        >
          {product.images.map((img, index) => (
            <div
              key={index}
              className="relative h-full w-full flex-shrink-0"
            >
              <Image
                src={img}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 280px, (max-width: 768px) 340px, 440px"
                priority={product.id === "1"}
              />
            </div>
          ))}
        </div>

        {/* Carousel Indicators */}
        {product.images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-1 rounded-full bg-black/20 backdrop-blur-[2px] px-1.5 py-1">
            {product.images.map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 transition-all duration-300 rounded-full bg-white ${
                  idx === currentImgIndex ? "w-1.5 opacity-100" : "w-1.5 opacity-50"
                }`}
              />
            ))}
          </div>
        )}

        {/* Hover Action Button */}
        <button className="group/btn absolute bottom-3 right-3 z-20 flex h-10 w-10 hover:w-[130px] items-center rounded-lg bg-neutral-900/60 backdrop-blur-md text-white opacity-0 group-hover/card:opacity-100 transition-all duration-300 active:scale-95 overflow-hidden">
          <div className="flex items-center gap-2 px-3 w-full">
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
        </button>
      </div>

      {/* Product Metadata Track */}
      <div className="py-4">
        <p className="text-[16px] font-normal tracking-tight text-neutral-400 dark:text-neutral-500 uppercase mb-2" style={{ fontFamily: "Archivo", }}>
          {product.brand}
        </p>
        <h3 className="line-clamp-2 text-[20px] font-normal leading-snug tracking-tight text-neutral-900 dark:text-neutral-100 uppercase mb-2 h-8" style={{ fontFamily: "Archivo", }}>
          {product.name}
        </h3>
        <div className="flex items-baseline gap-2">
          <span className="text-[18px] font-[300] text-neutral-900 dark:text-neutral-100" style={{ fontFamily: "Archivo", }}>
            {product.price}
          </span>
          {product.originalPrice && (
            <span className="text-[18px] font-[300] text-red-500 dark:text-red-400 line-through decoration-red-500 decoration-1" style={{ fontFamily: "Archivo", }}>
              {product.originalPrice}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
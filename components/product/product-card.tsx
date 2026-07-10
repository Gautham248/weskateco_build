'use client'
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
  const { title, handle, availableForSale, priceRange, featuredImage, images } = product;
  const isSoldOut = !availableForSale;

  const productPath = getLocalizedPath(`/product/${handle}`, locale);

  const imgRef = useRef<HTMLDivElement>(null);
  const [showIndex, setShowIndex] = useState(0);
  const moveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const displayImages = images && images.length > 0
    ? images.slice(0, 2)
    : featuredImage ? [featuredImage] : [];

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

  return (
    <Link
      href={productPath}
      className="group flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900/50"
    >
      <div
        ref={imgRef}
        className="relative aspect-[2/3] w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800"
        onMouseEnter={() => { if (displayImages.length > 1) setShowIndex(1); }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => { clearTimeout(moveTimer.current); setShowIndex(0); }}
      >
        {displayImages.length > 0 ? (
          <div
            className="absolute inset-0 flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${showIndex * 100}%)` }}
          >
            {displayImages.map((img, index) => (
              <div key={img.url || index} className="relative h-full w-full flex-shrink-0">
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
                className={`h-1.5 transition-all duration-300 rounded-full bg-white ${
                  idx === showIndex ? "w-1.5 opacity-100" : "w-1.5 opacity-50"
                }`}
              />
            ))}
          </div>
        )}

        {/* Plus circle (visible when not hovered) */}
        <div className="absolute bottom-3 right-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-[#00000050] backdrop-blur-md text-white opacity-100 group-hover:opacity-0 transition-opacity duration-300">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </div>

        {/* Hover Action Button */}
        <div className="cursor-pointer group/btn absolute bottom-3 right-3 z-20 flex h-10 w-10 hover:w-[130px] items-center rounded-lg bg-[#00000050] backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-all duration-300 active:scale-95 overflow-hidden">
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
        </div>

        {isSoldOut && (
          <div className="absolute top-3 left-3 z-10 rounded-full bg-neutral-900/90 px-3 py-1 text-xs font-semibold tracking-wider text-white backdrop-blur-xs dark:bg-neutral-100 dark:text-neutral-900">
            {t("product.sold_out")}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="mb-2 text-sm font-medium text-neutral-900 line-clamp-2 dark:text-neutral-100 group-hover:text-neutral-700 dark:group-hover:text-neutral-300">
          {title}
        </h3>
        <div className="mt-auto flex items-center justify-between">
          <Price
            amount={priceRange.minVariantPrice.amount}
            currencyCode={priceRange.minVariantPrice.currencyCode}
            className="text-base font-semibold text-neutral-900 dark:text-neutral-50"
          />
        </div>
      </div>
    </Link>
  );
}

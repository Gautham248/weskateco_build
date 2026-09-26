"use client";

import { addItem } from "components/cart/actions";
import { useCart } from "components/cart/cart-context";
import Price from "components/price";
import { QuickBuySidebar } from "components/product/quick-buy-sidebar";
import { NewlyReleaseErrorBoundary } from "./newly-release-error-boundary";
import clsx from "clsx";
import type { NewlyReleasedSlide } from "lib/catalog/newly-released";
import { getLocalizedPath } from "lib/i18n";
import { SHOPIFY_IMAGE_WIDTH, shopifyImageUrl } from "lib/shopify/image-url";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import { toast } from "sonner";

const addToCartButtonClasses =
  "cursor-pointer group/btn flex h-8 w-8 items-center rounded-full bg-[#00000050] backdrop-blur-md text-white transition-all duration-300 active:scale-95 overflow-hidden";

const addToCartInnerClasses =
  "flex items-center justify-start gap-1.5 px-2 w-full h-full";

function AddToCartIcon() {
  return (
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
  );
}

export default function NewlyReleaseContent({
  slides,
  locale,
}: {
  slides: NewlyReleasedSlide[];
  locale: string;
}) {
  const { addCartItem } = useCart();
  const [, startTransition] = useTransition();
  const [pickerProduct, setPickerProduct] = useState<
    NewlyReleasedSlide["product"] | null
  >(null);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const slideIndexRef = useRef(slideIndex);
  const isTransitioning = useRef(false);
  const maxSlide = slides.length - 1;

  useEffect(() => {
    slideIndexRef.current = slideIndex;
  }, [slideIndex]);

  const handleNext = () => {
    if (isTransitioning.current) return;
    isTransitioning.current = true;
    setSlideIndex((prev) => Math.min(prev + 1, maxSlide));
    setTimeout(() => {
      isTransitioning.current = false;
    }, 800);
  };

  const handlePrev = () => {
    if (isTransitioning.current) return;
    isTransitioning.current = true;
    setSlideIndex((prev) => Math.max(prev - 1, 0));
    setTimeout(() => {
      isTransitioning.current = false;
    }, 800);
  };

  /**
   * Single-variant products add straight away; anything with real options opens
   * the quick-buy sidebar so a size is never guessed on the customer's behalf.
   */
  const handleAddToCart = (slide: NewlyReleasedSlide) => {
    if (!slide.availableForSale) return;

    if (slide.hasVariants) {
      setPickerProduct(slide.product);
      setIsPickerOpen(true);
      return;
    }

    const variant = slide.product.variants[0];
    if (!variant) return;

    // Same shape as the Shop Now row: the optimistic dispatch and the awaited
    // server action must live in one transition, or React holds no optimistic
    // value to revert and logs that the update happened outside a transition.
    startTransition(async () => {
      addCartItem(variant, slide.product);
      toast.success(`${slide.title} added to cart!`, {
        position: "top-right",
        style: {
          backgroundColor: "#ffffff",
          color: "#10b981",
          borderColor: "#10b981",
          position: "relative",
          top: "60px",
        },
      });

      const error = await addItem(null, variant.id);

      if (error) {
        toast.error(error);
      }
    });
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let momentumTimer: NodeJS.Timeout | null = null;

    const handleWheel = (e: WheelEvent) => {
      const isScrollDown = e.deltaY > 0;
      const isScrollUp = e.deltaY < 0;
      const current = slideIndexRef.current;

      const canScrollNext = isScrollDown && current < maxSlide;
      const canScrollPrev = isScrollUp && current > 0;

      if (!canScrollNext && !canScrollPrev) {
        if (isTransitioning.current) {
          e.preventDefault();
          if (momentumTimer) clearTimeout(momentumTimer);
          momentumTimer = setTimeout(() => {
            isTransitioning.current = false;
          }, 150);
        }
        return;
      }

      e.preventDefault();

      if (isTransitioning.current) {
        if (momentumTimer) clearTimeout(momentumTimer);
        momentumTimer = setTimeout(() => {
          isTransitioning.current = false;
        }, 150);
        return;
      }

      if (Math.abs(e.deltaY) < 25) return;

      isTransitioning.current = true;

      if (canScrollNext) {
        setSlideIndex((prev) => Math.min(prev + 1, maxSlide));
      } else if (canScrollPrev) {
        setSlideIndex((prev) => Math.max(prev - 1, 0));
      }

      setTimeout(() => {
        isTransitioning.current = false;
      }, 800);
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      if (momentumTimer) clearTimeout(momentumTimer);
      container.removeEventListener("wheel", handleWheel);
    };
  }, [maxSlide]);

  const heroAspectRatio = slides[slideIndex]?.heroAspectRatio ?? null;

  return (
    <>
      <div
        ref={containerRef}
        className="relative w-full h-full flex items-center justify-center select-none"
      >
        {/* ================= DESKTOP VIEW ================= */}
        <div
          className="hidden md:flex w-full h-full items-center justify-center gap-8 px-12"
          onClick={handleNext}
        >
          {/* Left: 3D Flipping Product Card & Details */}
          <div className="flex-1 h-full flex items-center justify-center [perspective:1200px] z-1">
            <div
              className="relative w-full aspect-[414/699] [transform-style:preserve-3d]"
              style={{
                maxWidth: "min(414px, calc((100% - 80px) * (414 / 699)))",
                maxHeight: "calc(100% - 80px)",
              }}
            >
              {slides.map((slide, idx) => {
                const isActive = idx === slideIndex;
                return (
                  <div
                    key={slide.handle}
                    className="absolute inset-0 flex flex-col gap-4 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
                    style={{
                      backfaceVisibility: "hidden",
                      transform: isActive
                        ? "rotateY(0deg) scale(1) translateX(0px)"
                        : idx < slideIndex
                          ? "rotateY(-180deg) scale(0.85) translateX(-100px)"
                          : "rotateY(180deg) scale(0.85) translateX(100px)",
                      opacity: isActive ? 1 : 0,
                      pointerEvents: isActive ? "auto" : "none",
                    }}
                  >
                    <Link
                      href={getLocalizedPath(
                        `/product/${slide.handle}`,
                        locale,
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="flex flex-col gap-4 w-full h-full cursor-pointer"
                    >
                      <div className="relative w-full aspect-[414/552]">
                        {slide.cardImage ? (
                          <Image
                            src={shopifyImageUrl(
                              slide.cardImage.url,
                              SHOPIFY_IMAGE_WIDTH.card,
                            )}
                            alt={slide.cardImage.altText}
                            fill
                            className="object-contain"
                            sizes="414px"
                          />
                        ) : null}
                      </div>

                      <div className="relative w-full text-black pt-4 flex flex-col justify-center bg-white rounded-[16px] p-4">
                        <h3
                          className="text-xs md:text-sm font-medium tracking-tight text-black uppercase leading-tight"
                          style={{ fontFamily: "Archivo, sans-serif" }}
                        >
                          {slide.title}
                        </h3>
                        <h2
                          className="text-xs md:text-sm font-medium tracking-tight text-black uppercase mt-0.5 leading-tight"
                          style={{ fontFamily: "Archivo, sans-serif" }}
                        >
                          {slide.subtitle}
                        </h2>
                        <div className="flex items-center gap-2 mt-3 text-xs md:text-sm font-normal">
                          <Price
                            amount={slide.price.amount}
                            currencyCode={slide.price.currencyCode}
                            currencyCodeClassName="hidden"
                            className="text-black"
                          />
                          {slide.compareAtPrice ? (
                            <Price
                              amount={slide.compareAtPrice.amount}
                              currencyCode={slide.compareAtPrice.currencyCode}
                              currencyCodeClassName="hidden"
                              className="line-through text-red-500 scale-95 origin-left"
                            />
                          ) : null}
                        </div>
                        {/* Add to Cart Hover Button */}
                        <button
                          type="button"
                          disabled={!slide.availableForSale}
                          aria-label={
                            slide.availableForSale
                              ? `Add ${slide.title} to cart`
                              : `${slide.title} is sold out`
                          }
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleAddToCart(slide);
                          }}
                          className={clsx(
                            addToCartButtonClasses,
                            "absolute bottom-3 right-3 z-20 hover:w-[100px]",
                            !slide.availableForSale &&
                              "cursor-not-allowed opacity-60",
                          )}
                        >
                          <div className={addToCartInnerClasses}>
                            <AddToCartIcon />
                            <span className="text-xs font-medium whitespace-nowrap text-white/90 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-200 delay-75">
                              {slide.availableForSale
                                ? "Add to Cart"
                                : "Sold Out"}
                            </span>
                          </div>
                        </button>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Enlarged Full Skateboard */}
          <div className="flex-1 flex items-center justify-center overflow-hidden h-full relative z-1">
            <div
              className={clsx(
                "relative w-[600px] top-40 origin-top transition-[height] duration-500",
                heroAspectRatio === null && "h-[160%]",
              )}
              style={
                heroAspectRatio !== null
                  ? { aspectRatio: heroAspectRatio }
                  : undefined
              }
            >
              {slides.map((slide, idx) => {
                const isActive = idx === slideIndex;
                const isPast = idx < slideIndex;

                let translateY = "120%";
                if (isActive) translateY = "12.5%";
                else if (isPast) translateY = "-120%";

                return (
                  <div
                    key={slide.handle}
                    className="absolute inset-0 transition-all duration-800 ease-[cubic-bezier(0.25,1,0.5,1)]"
                    style={{ transform: `translateY(${translateY})` }}
                  >
                    {slide.heroImage ? (
                      <Image
                        src={shopifyImageUrl(
                          slide.heroImage.url,
                          SHOPIFY_IMAGE_WIDTH.hero,
                        )}
                        alt={slide.heroImage.altText}
                        fill
                        className="object-contain object-top"
                        sizes="600px"
                      />
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ================= MOBILE VIEW (Transparent over your existing BG) ================= */}
        <div className="flex md:hidden relative w-full h-full max-w-[360px] aspect-[10/16] px-6 py-0">
          <div className="relative w-full h-full flex items-center justify-between z-10">
            {/* Left Side: Skateboard Presentation */}
            <div className="w-[80%] h-full relative flex items-center justify-center overflow-hidden">
              {slides.map((slide, idx) => {
                const isActive = idx === slideIndex;
                const isPast = idx < slideIndex;

                let translateY = "120%";
                if (isActive) translateY = "0%";
                else if (isPast) translateY = "-120%";

                return (
                  <div
                    key={slide.handle}
                    className="absolute inset-0 transition-all duration-800 ease-[cubic-bezier(0.25,1,0.5,1)] flex items-center justify-center"
                    style={{
                      transform: `translateY(${translateY})`,
                      pointerEvents: isActive ? "auto" : "none",
                    }}
                  >
                    <div className="relative w-full h-[95%]">
                      {slide.heroImage ? (
                        <Image
                          src={shopifyImageUrl(
                            slide.heroImage.url,
                            SHOPIFY_IMAGE_WIDTH.card,
                          )}
                          alt={slide.heroImage.altText}
                          fill
                          className="object-contain"
                          sizes="288px"
                          priority={idx === 0}
                        />
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Side: Typography Info */}
            <div className="w-[50%] flex flex-col justify-center text-white gap-4 select-text">
              {slides.map((slide, idx) => {
                const isActive = idx === slideIndex;
                return (
                  <div
                    key={slide.handle}
                    className={`flex flex-col gap-32 transition-all duration-500 absolute right-0 left-[50%] pl-2 ${isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}
                  >
                    <h3 className="text-[clamp(0.563rem,1.5vw,0.625rem)] font-medium tracking-wide uppercase leading-snug font-sans text-neutral-200">
                      {slide.title} <br /> {slide.subtitle}
                    </h3>

                    <div className="flex items-center gap-2 text-[clamp(0.563rem,1.5vw,0.625rem)] font-medium mt-2">
                      <Price
                        amount={slide.price.amount}
                        currencyCode={slide.price.currencyCode}
                        currencyCodeClassName="hidden"
                        className="text-white"
                      />
                      {slide.compareAtPrice ? (
                        <Price
                          amount={slide.compareAtPrice.amount}
                          currencyCode={slide.compareAtPrice.currencyCode}
                          currencyCodeClassName="hidden"
                          className="line-through text-neutral-500 text-[clamp(0.563rem,1.5vw,0.625rem)] font-medium"
                        />
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Carousel UI Actions */}
          <button
            type="button"
            aria-label="Previous product"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="absolute left-1 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 border border-neutral-700/30 flex items-center justify-center text-white backdrop-blur-sm active:scale-90 transition-transform z-20"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-3.5 h-3.5"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Next product"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 border border-neutral-700/30 flex items-center justify-center text-white backdrop-blur-sm active:scale-90 transition-transform z-20"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-3.5 h-3.5"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>

          {/* Add to Cart Hover Button (Mobile) */}
          <button
            type="button"
            disabled={!slides[slideIndex]?.availableForSale}
            aria-label={
              slides[slideIndex]?.availableForSale ? "Add to cart" : "Sold out"
            }
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const slide = slides[slideIndex];
              if (slide) handleAddToCart(slide);
            }}
            className={clsx(
              addToCartButtonClasses,
              "absolute bottom-6 right-6 z-20 hover:w-[100px]",
              !slides[slideIndex]?.availableForSale &&
                "cursor-not-allowed opacity-60",
            )}
          >
            <div className={addToCartInnerClasses}>
              <AddToCartIcon />
              <span className="text-xs font-medium whitespace-nowrap text-white/90 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-200 delay-75">
                {slides[slideIndex]?.availableForSale
                  ? "Add to Cart"
                  : "Sold Out"}
              </span>
            </div>
          </button>
        </div>

        {/* Vertical Slide Indicators */}
        {slides.length > 1 && (
          <div className="hidden md:flex absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 flex-col gap-1 rounded-full bg-black/20 backdrop-blur-[2px] px-1 py-1.5">
            {slides.map((slide, idx) => (
              <button
                key={slide.handle}
                type="button"
                aria-label={`Show ${slide.title}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setSlideIndex(idx);
                }}
                className={`w-1.5 transition-all duration-300 rounded-full bg-white cursor-pointer ${
                  idx === slideIndex ? "h-4 opacity-100" : "h-1.5 opacity-50"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/*
        Stay mounted and toggle isOpen (the pattern ProductCard uses).
        useModalHistory tracks isOpen transitions and only clears its close guard
        when isOpen goes false — conditionally unmounting instead left the panel
        unable to close.
      */}
      {pickerProduct ? (
        <NewlyReleaseErrorBoundary>
          <QuickBuySidebar
            isOpen={isPickerOpen}
            onClose={() => setIsPickerOpen(false)}
            product={pickerProduct}
            locale={locale}
          />
        </NewlyReleaseErrorBoundary>
      ) : null}
    </>
  );
}

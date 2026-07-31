"use client";

import accessoriesImg from "components/icons/accessories.png";
import skateboardsImg from "components/icons/skateboards.png";
import surfboardsImg from "components/icons/surfboards.png";
import { createTranslator, getLocalizedPath } from "lib/i18n";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

function CategoryTitle({
  name,
  isExpanded,
  id,
}: {
  name: string;
  isExpanded: boolean;
  id: string;
}) {
  const upperName = name.toUpperCase();
  const lastOIndex = upperName.lastIndexOf("O");

  const containerRef = useRef<HTMLDivElement>(null);
  const oTargetRef = useRef<HTMLSpanElement>(null);
  const [oOffset, setOOffset] = useState<number>(0);

  useEffect(() => {
    if (
      oTargetRef.current &&
      containerRef.current &&
      containerRef.current.offsetParent !== null
    ) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const oRect = oTargetRef.current.getBoundingClientRect();

      const offset = oRect.left + oRect.width / 2 - containerRect.left;
      setOOffset(offset);
    }
  }, [name, isExpanded]);

  if (lastOIndex === -1) {
    return (
      <div className="flex items-center justify-between w-full">
        <h3 className="text-white text-[clamp(1rem,2.5vw,1.375rem)] font-bold uppercase tracking-wide">
          {name}
        </h3>
        <span className="bg-[#CCFF02] text-black rounded-full w-6 h-6 flex items-center justify-center text-[10px]">
          ➔
        </span>
      </div>
    );
  }

  const firstPart = name.slice(0, lastOIndex);
  const secondPart = name.slice(lastOIndex + 1);

  return (
    <div
      ref={containerRef}
      className="relative w-full flex items-center justify-between h-8"
    >
      <h3 className="text-white text-[clamp(1rem,2.5vw,1.375rem)] font-medium uppercase tracking-wide flex items-center whitespace-nowrap select-none z-0">
        <span>{firstPart}</span>
        <span ref={oTargetRef} className="relative">
          {name[lastOIndex]}
        </span>
        <span>{secondPart}</span>
      </h3>

      <span
        className={`absolute bg-[#C5FF1A] text-black rounded-full flex items-center justify-center transition-all duration-[1600ms] top-1/2 -translate-y-1/2 z-10 ${!isExpanded
          ? "w-5 h-5 -translate-x-1/2"
          : "w-10 h-10 left-full -translate-x-full"
          }`}
        style={{
          transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
          left: !isExpanded ? `${oOffset}px` : undefined,
        }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-[40%] h-[40%]"
        >
          <path
            d="M5 12H19M12 19L19 12L12 5"
            stroke="#1D6A2B"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </div>
  );
}

export default function CategoryGrid({ locale }: { locale: string }) {
  const t = createTranslator(locale);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(0);

  // Mobile active index tracking
  const [activeMobileIndex, setActiveMobileIndex] = useState<number>(0);
  const touchStart = useRef<number | null>(null);

  const categories = [
    {
      name: "Surfboards",
      image: surfboardsImg,
      href: "/store/surfskates",
    },
    {
      name: "Skateboards",
      image: skateboardsImg,
      href: "/store/skateboards",
    },
    {
      name: "Accessories",
      image: accessoriesImg,
      href: "/store/apparel-1",
      imageClassName: "scale-170 -translate-x-15",
      imageExpandedClassName: "scale-180 -translate-x-15",
    },
  ];

  // Mobile Touch Mechanics
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.targetTouches[0]) {
      touchStart.current = e.targetTouches[0].clientX;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current === null) return;
    if (e.changedTouches[0]) {
      const touchEnd = e.changedTouches[0].clientX;
      const diff = touchStart.current - touchEnd;

      if (Math.abs(diff) > 50) {
        // Swipe detection threshold
        if (diff > 0) {
          setActiveMobileIndex((prev) => (prev + 1) % categories.length);
        } else {
          setActiveMobileIndex(
            (prev) => (prev - 1 + categories.length) % categories.length,
          );
        }
      }
    }
    touchStart.current = null;
  };

  return (
    <section className="h-[fit-content] w-full bg-white pt-15 md:pt-30 pb-0 md:pb-5">
      <div className="mx-auto max-w-(--breakpoint-2xl) px-4 lg:px-15 mb-0 md:mb-10">
        <h2
          className="text-[clamp(1.5rem,5vw,2.8125rem)] leading-[clamp(1.5rem,5vw,2.8125rem)] font-black tracking-tight text-black dark:text-white uppercase"
          style={{
            fontFamily: "'Clash Display', sans-serif",
            letterSpacing: "-0.01em",
          }}
        >
          CATEGORIES
        </h2>
      </div>

      {/* --- MOBILE 3D COVERFLOW VIEW --- */}
      <div
        className="block md:hidden w-full overflow-hidden select-none touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative h-[115vw] max-h-[500px] w-full flex items-center justify-center">
          {categories.map((category, index) => {
            // Virtual infinite math offset positioning
            let offset = index - activeMobileIndex;
            if (offset < -1) offset += categories.length;
            if (offset > 1) offset -= categories.length;

            const isActive = offset === 0;
            const isLeft = offset === -1;
            const isRight = offset === 1;

            let transformStyle = "";
            let zIndex = 0;
            let opacity = 1;

            if (isActive) {
              transformStyle = "translateX(0%) scale(1)";
              zIndex = 30; // Tops the stack layout
            } else if (isLeft) {
              transformStyle = "translateX(calc(-90% - 14px)) scale(0.85)";
              zIndex = 10;
            } else if (isRight) {
              transformStyle = "translateX(calc(90% + 14px)) scale(0.85)";
              zIndex = 10;
            } else {
              transformStyle = "translateX(0%) scale(0.5)";
              zIndex = 0;
              opacity = 0;
            }

            // Click intercept handler for side cards
            const handleCardClick = (e: React.MouseEvent) => {
              if (!isActive) {
                e.preventDefault(); // Stop Link navigation
                setActiveMobileIndex(index); // Move side card to center
              }
            };

            return (
              <Link
                key={`mobile-${index}`}
                href={getLocalizedPath(category.href, locale)}
                onClick={handleCardClick}
                className={`absolute w-[68vw] aspect-[2/3] rounded-md overflow-hidden bg-neutral-100 shadow-xl transition-all ${isActive
                  ? "cursor-pointer"
                  : "cursor-pointer pointer-events-auto"
                  }`}
                style={{
                  transform: transformStyle,
                  zIndex: zIndex,
                  opacity: opacity,
                  transitionDuration: "600ms",
                  transitionTimingFunction: "cubic-bezier(0.25, 1, 0.5, 1)",
                }}
              >
                <img
                  src={category.image.src}
                  alt={category.name}
                  className="w-full h-full object-cover pointer-events-none"
                />

                <div className="absolute inset-0 bg-gradient-to-b from-blue-400/20 via-transparent to-black/80 flex flex-col justify-between p-6">
                  <div className="text-center pt-4">
                    <h3 className="text-white text-lg font-normal uppercase tracking-wider">
                      {category.name}
                    </h3>
                  </div>

                  <div className="w-full bg-black text-white text-center py-2.5 rounded-md font-normal tracking-wide uppercase border border-neutral-800 text-sm">
                    View More
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* --- DOTS NAVIGATION INDICATOR --- */}
        <div className="flex justify-center items-center gap-1 mt-4 pb-4">
          {categories.map((_, index) => (
            <span
              key={`dot-${index}`}
              onClick={() => setActiveMobileIndex(index)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${activeMobileIndex === index
                ? "w-4 bg-black"
                : "w-1.5 bg-neutral-300"
                }`}
            />
          ))}
        </div>
      </div>

      {/* --- DESKTOP ACCORDION GRID VIEW --- */}
      <div className="hidden md:flex w-full h-[560px] gap-2.5 items-stretch overflow-hidden mx-auto max-w-(--breakpoint-2xl) px-4 lg:px-15 mb-6 md:mb-10">
        {categories.map((category, index) => {
          const isExpanded = hoveredIndex === index;
          const flexClass = isExpanded ? "flex-[3.5]" : "flex-[1.5]";

          return (
            <Link
              key={category.name}
              href={getLocalizedPath(category.href, locale)}
              onMouseEnter={() => setHoveredIndex(index)}
              className={`group relative h-full rounded-md overflow-hidden transition-all dynamic-accordion-card ${flexClass}`}
              style={{
                transitionDuration: "1600ms",
                transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              <div className="relative w-full h-full bg-neutral-100">
                <img
                  src={category.image.src}
                  alt={category.name}
                  className={`w-full h-full object-cover transition-transform ${isExpanded
                    ? category.imageExpandedClassName || "scale-100"
                    : category.imageClassName || "scale-100"
                    }`}
                  style={{
                    transitionDuration: "1600ms",
                    transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                />

                <div
                  className={`absolute inset-0 transition-colors ${isExpanded ? "bg-black/5" : "bg-black/15"}`}
                  style={{
                    transitionDuration: "1600ms",
                    transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                />

                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/60 via-black/20 to-transparent">
                  <CategoryTitle
                    name={category.name}
                    isExpanded={isExpanded}
                    id={`desktop-${index}`}
                  />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

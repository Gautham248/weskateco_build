"use client";

import accessoriesImg from "components/icons/accessories.png";
import skateboardsImg from "components/icons/skateboards.png";
import surfboardsImg from "components/icons/surfboards.png";
import { createTranslator, getLocalizedPath } from "lib/i18n";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

function CategoryTitle({ name, isExpanded, id }: { name: string; isExpanded: boolean; id: string }) {
  const upperName = name.toUpperCase();
  const lastOIndex = upperName.lastIndexOf("O");

  const containerRef = useRef<HTMLDivElement>(null);
  const oTargetRef = useRef<HTMLSpanElement>(null);
  const [oOffset, setOOffset] = useState<number>(0);

  useEffect(() => {
    // Only calculate if the container is visible in the viewport (prevents hidden layout breaking refs)
    if (oTargetRef.current && containerRef.current && containerRef.current.offsetParent !== null) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const oRect = oTargetRef.current.getBoundingClientRect();

      const offset = (oRect.left + oRect.width / 2) - containerRect.left;
      setOOffset(offset);
    }
  }, [name, isExpanded]); // Recalculate on expansion shift to ensure precision

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
    <div ref={containerRef} className="relative w-full flex items-center justify-between h-8">
      <h3 className="text-white text-[clamp(1rem,2.5vw,1.375rem)] font-medium uppercase tracking-wide flex items-center whitespace-nowrap select-none z-0">
        <span>{firstPart}</span>
        <span ref={oTargetRef} className="relative">
          {name[lastOIndex]}
        </span>
        <span>{secondPart}</span>
      </h3>

      <span
        className={`absolute bg-[#C5FF1A] text-black rounded-full flex items-center justify-center font-bold transition-all duration-[1600ms] top-1/2 -translate-y-1/2 z-10 ${!isExpanded
          ? "text-[9px] w-5 h-5 -translate-x-1/2"
          : "text-[10px] w-6 h-6 left-full -translate-x-full"
          }`}
        style={{
          transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
          left: !isExpanded ? `${oOffset}px` : undefined
        }}
      >
        ➔
      </span>
    </div>
  );
}

export default function CategoryGrid({ locale }: { locale: string }) {
  const t = createTranslator(locale);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(0);

  const [activeMobileIndex, setActiveMobileIndex] = useState<number>(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isJumping = useRef(false);

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

  const loopedCategories = [...categories, ...categories, ...categories];
  const midSetStart = categories.length;

  useEffect(() => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const cardWidth = container.clientWidth * 0.76;
    const gap = 16;
    const itemWidth = cardWidth + gap;
    container.scrollLeft = itemWidth * midSetStart;
  }, [midSetStart]);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    if (isJumping.current) return;
    const container = scrollContainerRef.current;
    const { scrollLeft, clientWidth } = container;
    if (clientWidth === 0) return;
    const cardWidth = clientWidth * 0.76;
    const gap = 16;
    const itemWidth = cardWidth + gap;
    const rawIndex = scrollLeft / itemWidth;
    const boundedIndex = Math.max(0, Math.min(loopedCategories.length - 1, Math.round(rawIndex)));
    const displayIndex = boundedIndex % categories.length;
    setActiveMobileIndex(displayIndex);

    const threshold = categories.length * 0.5;
    const setIndex = boundedIndex / categories.length;
    if (setIndex < 0.5 + threshold / categories.length && setIndex > 0.5 - threshold / categories.length) return;

    if (boundedIndex < categories.length) {
      isJumping.current = true;
      container.scrollLeft = itemWidth * (midSetStart + boundedIndex);
      requestAnimationFrame(() => { isJumping.current = false; });
    } else if (boundedIndex >= categories.length * 2) {
      isJumping.current = true;
      const offset = boundedIndex - categories.length * 2;
      container.scrollLeft = itemWidth * (midSetStart + offset);
      requestAnimationFrame(() => { isJumping.current = false; });
    }
  };

  return (
    <section className="h-[fit-content] w-full bg-white pt-10 md:pt-30 pb-15 md:pb-5">
      <div className="mx-auto max-w-(--breakpoint-2xl) px-6 mb-6 md:mb-10">
        <h2 className="text-[clamp(1.5rem,5vw,3.75rem)] font-black tracking-tight text-black dark:text-white uppercase" style={{ fontFamily: "'Clash Display', sans-serif", letterSpacing: "-0.01em" }}>
          CATEGORIES
        </h2>
      </div>

      {/* --- MOBILE CAROUSEL VIEW --- */}
      <div className="block md:hidden w-full">
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex w-full overflow-x-auto gap-0 snap-x snap-mandatory scrollbar-none pb-6"
          style={{ scrollbarWidth: "none" }}
        >
          <div className="shrink-0 w-[8vw]" />

          {loopedCategories.map((category, index) => {
            const isActive = index % categories.length === activeMobileIndex;
            return (
              <Link
                key={`mobile-${index}`}
                href={getLocalizedPath(category.href, locale)}
                className={`group relative h-auto aspect-[2/3] w-[76vw] shrink-0 rounded-2xl overflow-hidden snap-center bg-neutral-100 shadow-md transition-all duration-500 ease-out ${isActive ? "scale-100" : "scale-[0.82]"
                  }`}
              >
                <img
                  src={category.image.src}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-b from-blue-400/20 via-transparent to-black/80 flex flex-col justify-between p-6">
                  <div className="text-center pt-4">
                    <h3 className="text-white text-2xl font-normal uppercase tracking-wider">
                      {category.name}
                    </h3>
                  </div>

                  <div className="w-full bg-black text-white text-center py-4 rounded-xl font-normal tracking-wide uppercase border border-neutral-800 transition-colors group-active:bg-neutral-900 text-sm">
                    View More
                  </div>
                </div>
              </Link>
            );
          })}

          <div className="shrink-0 w-[8vw]" />
        </div>

        <div className="flex justify-center items-center gap-2 mt-2">
          {categories.map((_, index) => (
            <span
              key={`dot-${index}`}
              className={`h-2.5 rounded-full transition-all duration-300 ${activeMobileIndex === index ? "w-2.5 bg-black" : "w-2.5 bg-neutral-300"
                }`}
            />
          ))}
        </div>
      </div>

      {/* --- DESKTOP ACCORDION GRID VIEW --- */}
      <div
        className="hidden md:flex w-full h-[560px] gap-4 items-stretch overflow-hidden mx-auto max-w-(--breakpoint-2xl) px-6 mb-6 md:mb-10"
        onMouseLeave={() => setHoveredIndex(0)}
      >
        {categories.map((category, index) => {
          const isExpanded = hoveredIndex === index;
          const flexClass = isExpanded ? "flex-[3.5]" : "flex-[1.5]";

          return (
            <Link
              key={category.name}
              href={getLocalizedPath(category.href, locale)}
              onMouseEnter={() => setHoveredIndex(index)}
              className={`group relative h-full rounded-2xl overflow-hidden transition-all dynamic-accordion-card ${flexClass}`}
              style={{
                transitionDuration: "1600ms",
                transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)"
              }}
            >
              <div className="relative w-full h-full bg-neutral-100">
                <img
                  src={category.image.src}
                  alt={category.name}
                  className={`w-full h-full object-cover transition-transform ${isExpanded ? (category.imageExpandedClassName || "scale-100") : (category.imageClassName || "scale-100")
                    }`}
                  style={{
                    transitionDuration: "1600ms",
                    transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)"
                  }}
                />

                <div
                  className={`absolute inset-0 transition-colors ${isExpanded ? "bg-black/5" : "bg-black/15"}`}
                  style={{
                    transitionDuration: "1600ms",
                    transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)"
                  }}
                />

                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/60 via-black/20 to-transparent">
                  {/* Added a unique layout id to isolate calculation bounds */}
                  <CategoryTitle name={category.name} isExpanded={isExpanded} id={`desktop-${index}`} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
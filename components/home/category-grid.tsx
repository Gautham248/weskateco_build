"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { createTranslator } from "lib/i18n";
import { getLocalizedPath } from "lib/i18n";
import skateboardsImg from "components/icons/skateboards.png";
import surfboardsImg from "components/icons/surfboards.png";
import accessoriesImg from "components/icons/accessories.png";

function CategoryTitle({ name, isExpanded }: { name: string; isExpanded: boolean }) {
  const upperName = name.toUpperCase();
  const lastOIndex = upperName.lastIndexOf("O");

  const containerRef = useRef<HTMLDivElement>(null);
  const oTargetRef = useRef<HTMLSpanElement>(null);
  const [oOffset, setOOffset] = useState<number>(0);

  useEffect(() => {
    if (oTargetRef.current && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const oRect = oTargetRef.current.getBoundingClientRect();

      const offset = (oRect.left + oRect.width / 2) - containerRect.left;
      setOOffset(offset);
    }
  }, [name]);

  if (lastOIndex === -1) {
    return (
      <div className="flex items-center justify-between w-full">
        <h3 className="text-white text-[22px] font-bold uppercase tracking-wide">
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
      <h3 className="text-white text-[22px] font-bold uppercase tracking-wide flex items-center whitespace-nowrap select-none z-0">
        <span>{firstPart}</span>
        <span ref={oTargetRef} className="relative">
          {name[lastOIndex]}
        </span>
        <span>{secondPart}</span>
      </h3>

      <span
        className={`absolute bg-[#C5FF1A] text-black rounded-full flex items-center justify-center font-bold transition-all duration-[1600ms] top-1/2 -translate-y-1/2 z-10 ${
          // INVERTED: If collapsed (!isExpanded), it goes to the 'O'. If expanded, it goes to the right.
          !isExpanded
            ? "text-[9px] w-5 h-5 -translate-x-1/2"
            : "text-[10px] w-6 h-6 left-full -translate-x-full"
        }`}
        style={{
          transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
          // INVERTED: Apply the 'O' offset positioning only when collapsed (!isExpanded)
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

  const categories = [
    {
      name: "Surfboards",
      image: surfboardsImg,
      href: "/search/surfskates",
    },
    {
      name: "Skateboards",
      image: skateboardsImg,
      href: "/search/skateboards",
    },
    {
      name: "Accessories",
      image: accessoriesImg,
      href: "/search/apparel-1",
      imageClassName: "scale-170 -translate-x-15",
      imageExpandedClassName: "scale-180 -translate-x-15",
    },
  ];

  return (
    <section className="h-[fit-content] w-full bg-white pt-10 md:pt-30 pb-15 mb:pb-5">
      <div className="mx-auto max-w-(--breakpoint-2xl) px-6 h-full flex flex-col justify-center">
        <h2 className="mb-6 md:mb-12 text-[24px] font-bold tracking-tight text-neutral-900 md:text-[60px]">
          CATEGORIES
        </h2>

        <div
          className="flex w-full h-[520px] gap-4 items-stretch overflow-hidden"
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
                    <CategoryTitle name={category.name} isExpanded={isExpanded} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
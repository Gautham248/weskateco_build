"use client";

import b1 from "components/icons/school/beyond_1.png";
import b2 from "components/icons/school/beyond_2.png";
import b3 from "components/icons/school/beyond_3.png";
import b4 from "components/icons/school/beyond_4.png";
import Image from "next/image";
import { useRef, useState } from "react";

const PROGRAMS = [
  {
    title: "Summer Camps",
    image: b1,
  },
  {
    title: "After School Programs",
    image: b2,
  },
  {
    title: "Workshops",
    image: b3,
  },
  {
    title: "Performance Coaching",
    image: b4,
  },
];

export default function BeyondClassesSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);

  const scrollToCard = (index: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const targetChild = container.children[index] as HTMLElement;
    if (targetChild) {
      isScrollingRef.current = true;
      setActiveIndex(index);
      container.scrollTo({
        left: targetChild.offsetLeft - container.offsetLeft,
        behavior: "smooth",
      });
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 400);
    }
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      scrollToCard(activeIndex - 1);
    }
  };

  const handleNext = () => {
    if (activeIndex < PROGRAMS.length - 1) {
      scrollToCard(activeIndex + 1);
    }
  };

  const handleScroll = () => {
    if (isScrollingRef.current) return;
    const container = scrollContainerRef.current;
    if (!container) return;
    const children = Array.from(container.children) as HTMLElement[];
    const containerLeft = container.scrollLeft;

    let closestIndex = 0;
    let minDistance = Infinity;

    children.forEach((child, index) => {
      const distance = Math.abs(child.offsetLeft - containerLeft);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });

    if (closestIndex !== activeIndex) {
      setActiveIndex(closestIndex);
    }
  };

  return (
    <section className="w-full bg-[#F4F4F6] py-12 md:py-[120px]">
      <div className="mx-auto w-full max-w-(--breakpoint-2xl) px-4 lg:px-15 flex flex-col gap-8 md:gap-12">
        {/* Section Heading */}
        <h2
          className="text-[clamp(28px,4.5vw,60px)] font-bold tracking-tight uppercase text-black select-none text-left"
          style={{ fontFamily: "'Clash Display', sans-serif" }}
        >
          BEYOND WEEKLY CLASSES
        </h2>

        {/* 4 Cards Container: Horizontal Scroll on Mobile, 4 Grid on Desktop */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex md:grid overflow-x-auto md:overflow-visible gap-4 md:gap-5 snap-x snap-mandatory scrollbar-none md:grid-cols-4 items-stretch pb-2 md:pb-0"
          style={{
            msOverflowStyle: "none",
            scrollbarWidth: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {PROGRAMS.map((item, idx) => (
            <div
              key={idx}
              className="relative w-[290px] min-w-[290px] h-[348.72px] aspect-[290/348.72] md:w-full md:h-auto md:aspect-[405/487] rounded-[8px] md:rounded-[4px] overflow-hidden bg-neutral-200 shadow-xs shrink-0 md:shrink snap-start select-none"
            >
              {/* Image */}
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover rounded-[8px] md:rounded-[4px]"
                sizes="(max-width: 640px) 290px, (max-width: 1024px) 50vw, 25vw"
              />

              {/* Bottom Black Info Overlay Box: height 78px, pl-30px, pr-10px, py-10px, gap-10px */}
              <div className="absolute bottom-0 inset-x-0 max-h-[64px] bg-black text-white flex items-center px-[30px] py-[24px] gap-[10px]">
                <h3
                  className="text-base md:text-base font-medium text-white tracking-[-1%] leading-none uppercase"
                  style={{ fontFamily: "'Clash Display', sans-serif" }}
                >
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows for Mobile */}
        <div className="flex gap-3 md:hidden">
          <button
            onClick={handlePrev}
            disabled={activeIndex === 0}
            aria-label="Previous program"
            className="w-9 h-9 flex items-center justify-center border border-neutral-200 rounded-full hover:bg-[#CCFF02] transition-colors cursor-pointer disabled:opacity-40 disabled:hover:bg-transparent"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18.0942 12H5.90576"
                stroke="#1D6A2B"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 5.90625L5.90576 12.0005L12 18.0947"
                stroke="#1D6A2B"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            onClick={handleNext}
            disabled={activeIndex === PROGRAMS.length - 1}
            aria-label="Next program"
            className="w-9 h-9 flex items-center justify-center border border-neutral-200 rounded-full hover:bg-[#CCFF02] transition-colors cursor-pointer disabled:opacity-40 disabled:hover:bg-transparent"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.90576 12H18.0942"
                stroke="#1D6A2B"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 5.90625L18.0942 12.0005L12 18.0947"
                stroke="#1D6A2B"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

"use client";

import sp1 from "components/icons/school/skatepark_1.png";
import sp2 from "components/icons/school/skatepark_2.png";
import sp3 from "components/icons/school/skatepark_3.png";
import sp4 from "components/icons/school/skatepark_4.png";
import Image from "next/image";
import { useCarousel } from "lib/hooks/use-carousel";

const PLACES = [
  {
    title: "Basketball Court",
    image: sp1,
  },
  {
    title: "School Playground",
    image: sp2,
  },
  {
    title: "Assembly Area",
    image: sp3,
  },
  {
    title: "Concrete Surface",
    image: sp4,
  },
];

export default function NoSkateparkSection() {
  const {
    activeIndex,
    scrollContainerRef,
    handlePrev,
    handleNext,
    handleScroll,
  } = useCarousel(PLACES.length);

  return (
    <section className="w-full bg-[#F4F4F6] py-12 md:py-[120px]">
      <div className="mx-auto w-full max-w-(--breakpoint-2xl) px-4 lg:px-15 flex flex-col gap-8 md:gap-12">
        {/* Section Heading */}
        <h2
          className="text-[clamp(28px,4.5vw,60px)] font-bold tracking-tight uppercase text-black select-none text-left"
          style={{ fontFamily: "'Clash Display', sans-serif" }}
        >
          NO SKATEPARK? NO PROBLEM.
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
          {PLACES.map((item, idx) => (
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

        {/* Bottom Centered Description Paragraph */}
        <div className="max-w-6xl md:mx-auto text-left md:text-center">
          <p
            className="text-sm md:text-xl text-black font-normal leading-[18px] md:leading-[130%] tracking-[0%]"
            style={{ fontFamily: "'Clash Display', sans-serif" }}
          >
            Our curriculum is designed to operate on any flat, hard surface.
            Schools can begin immediately without investing in permanent
            infrastructure. Portable ramps can be introduced as the program
            grows.
          </p>

          {/* Navigation Arrows for Mobile */}
          <div className="flex gap-3 pt-6 md:hidden">
            <button
              onClick={handlePrev}
              disabled={activeIndex === 0}
              aria-label="Previous card"
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
              disabled={activeIndex === PLACES.length - 1}
              aria-label="Next card"
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
      </div>
    </section>
  );
}

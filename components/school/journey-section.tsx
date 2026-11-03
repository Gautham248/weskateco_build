"use client";

import j1 from "components/icons/school/journey_1.svg";
import j2 from "components/icons/school/journey_2.svg";
import j3 from "components/icons/school/journey_3.svg";
import j4 from "components/icons/school/journey_4.svg";
import j5 from "components/icons/school/journey_5.svg";
import j6 from "components/icons/school/journey_6.svg";
import Image from "next/image";
import { useCarousel } from "lib/hooks/use-carousel";

const STAGES = [
  {
    stage: "Foundation",
    title: "Foundation",
    icon: j1,
  },
  {
    stage: "Stage 02",
    title: "Skill Development",
    icon: j2,
  },
  {
    stage: "Stage 03",
    title: "Competition",
    icon: j3,
  },
  {
    stage: "Stage 04",
    title: "High performance",
    icon: j4,
  },
  {
    stage: "Stage 05",
    title: "International Immersion",
    icon: j5,
  },
  {
    stage: "Stage 06",
    title: "Olympic Pathway",
    icon: j6,
  },
];

export default function JourneySection() {
  const {
    activeIndex,
    scrollContainerRef,
    handlePrev,
    handleNext,
    handleScroll,
  } = useCarousel(STAGES.length);

  return (
    <section className="w-full bg-white py-12 md:py-[120px]">
      <div className="mx-auto w-full max-w-(--breakpoint-2xl) px-4 lg:px-15">
        {/* Header */}
        <h2
          className="text-[clamp(28px,4.5vw,60px)] font-bold tracking-tight uppercase text-black text-left md:text-center mb-6 md:mb-14 select-none"
          style={{ fontFamily: "'Clash Display', sans-serif" }}
        >
          THE JOURNEY
        </h2>

        {/* Stage Cards Container: Horizontal Scroll on Mobile, 6 Grid on Desktop */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex md:grid overflow-x-auto md:overflow-visible gap-4 md:gap-3.5 snap-x snap-mandatory scrollbar-none md:grid-cols-3 lg:grid-cols-6 items-stretch pb-2 md:pb-0"
          style={{
            msOverflowStyle: "none",
            scrollbarWidth: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {STAGES.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#F4F4F6] rounded-[8px] p-6 flex flex-col justify-between w-[228px] min-w-[228px] h-[205px] aspect-[228/205] md:w-auto md:aspect-auto shrink-0 md:shrink snap-start select-none"
            >
              {/* Stage Top Tag */}
              <span
                className="text-xs md:text-sm text-black font-medium leading-[100%] tracking-[-1%]"
                style={{ fontFamily: "'Clash Display', sans-serif" }}
              >
                {item.stage}
              </span>

              {/* Icon */}
              <div className="my-auto flex items-center justify-start py-4">
                <Image
                  src={item.icon}
                  alt={item.title}
                  width={64}
                  height={64}
                  className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 object-contain"
                />
              </div>

              {/* Stage Title */}
              <h3
                className="text-sm md:text-lg font-medium text-black leading-[100%] tracking-[-1%]"
                style={{ fontFamily: "'Clash Display', sans-serif" }}
              >
                {item.title}
              </h3>
            </div>
          ))}
        </div>

        {/* Bottom Description */}
        <div className="mt-8 md:mt-14 max-w-3xl md:mx-auto text-left md:text-center">
          <p
            className="text-sm md:text-base text-black font-normal leading-[18px] md:leading-[120%] tracking-[0%]"
            style={{ fontFamily: "'Clash Display', sans-serif" }}
          >
            Every student begins with the fundamentals. Those who demonstrate
            passion and commitment can continue progressing through increasingly
            advanced stages, creating a genuine pathway from school programs to
            competitive skateboarding
          </p>

          {/* Navigation Arrows for Mobile */}
          <div className="flex gap-3 pt-6 md:hidden">
            <button
              onClick={handlePrev}
              disabled={activeIndex === 0}
              aria-label="Previous stage"
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
              disabled={activeIndex === STAGES.length - 1}
              aria-label="Next stage"
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

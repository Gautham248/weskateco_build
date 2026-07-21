"use client";

import arrowClosed from "components/icons/arrow-closed.svg";
import arrow from "components/icons/arrow.svg";
import tip1 from "components/icons/tip1.png";
import tip2 from "components/icons/tip2.png";
import tip3 from "components/icons/tip3.png";
import tip4 from "components/icons/tip4.png";
import tip5 from "components/icons/tip5.png";
import { useEffect, useRef, useState } from "react";

const tips = [
  { image: tip1 },
  { image: tip2 },
  { image: tip3 },
  { image: tip4 },
  { image: tip5 },
];

export default function TipsSection({
  variant = "default",
}: {
  variant?: "default" | "page";
}) {
  const [activeIndex, setActiveIndex] = useState(2);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const trackPadding = "var(--track-padding)";

  // Smoothly center the active card in the viewport
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const activeChild = container.children[activeIndex] as HTMLElement;
    if (activeChild) {
      const containerRect = container.getBoundingClientRect();
      const childRect = activeChild.getBoundingClientRect();

      // Calculate the exact distance needed to place the card center-stage
      const scrollOffset =
        childRect.left -
        containerRect.left -
        containerRect.width / 2 +
        childRect.width / 2;

      container.scrollBy({
        left: scrollOffset,
        behavior: "smooth",
      });
    }
  }, [activeIndex]);

  const handlePrev = () => {
    setActiveIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => Math.min(tips.length - 1, prev + 1));
  };

  return (
    <section className="tips-section min-h-full w-full bg-white py-15 md:py-[88px] overflow-hidden">
      <div>
        <style
          dangerouslySetInnerHTML={{
            __html: `
          .tips-section {
            --track-padding: 1rem;
          }
          @media (min-width: 1024px) {
            .tips-section {
              --track-padding: max(3.75rem, calc((100vw - 1536px) / 2 + 3.75rem));
            }
          }
          div::-webkit-scrollbar {
            display: none !important;
          }
        `,
          }}
        />

        {/* Header with Navigation Controls */}
        <div className="flex justify-between items-end mb-5 md:mb-10 mx-auto max-w-(--breakpoint-2xl) px-4 lg:px-15">
          {variant === "page" ? (
            <h2
              className="text-[clamp(1.5rem,5vw,3.75rem)] leading-[clamp(1.5rem,5vw,3.75rem)] font-black tracking-tight text-black dark:text-white uppercase"
              style={{
                fontFamily: "'Clash Display', sans-serif",
                letterSpacing: "-0.01em",
              }}
            >
              stay connected
              <br />
              anywhere!
            </h2>
          ) : (
            <h2
              className="text-[clamp(1.25rem,4vw,2.5rem)] font-black leading-[120%] tracking-tight text-black dark:text-white sm:text-[clamp(1.5rem,3vw,2.5rem)] lg:text-[clamp(1.75rem,2.5vw,2.5rem)] uppercase"
              style={{
                fontFamily: "'Clash Display', sans-serif",
                letterSpacing: "-0.01em",
              }}
            >
              Tips to stay connected
              <br />
              Anywhere!
            </h2>
          )}
          <div className="flex gap-3 pb-2 hidden md:flex">
            <button
              onClick={handlePrev}
              disabled={activeIndex === 0}
              className="w-[36px] md:w-full p-3 border border-neutral-200 rounded-full hover:bg-[#CCFF02] transition-colors cursor-pointer disabled:opacity-40 disabled:hover:bg-transparent"
            >
              <img
                src={arrowClosed.src || arrowClosed}
                className="w-3 h-3 text-neutral-700 rotate-180"
                alt="previous"
              />
            </button>
            <button
              onClick={handleNext}
              disabled={activeIndex === tips.length - 1}
              className="w-[36px] md:w-full p-3 border border-neutral-200 rounded-full hover:bg-[#CCFF02] transition-colors cursor-pointer disabled:opacity-40 disabled:hover:bg-transparent"
            >
              <img
                src={arrowClosed.src || arrowClosed}
                className="w-3 h-3 text-neutral-700"
                alt="next"
              />
            </button>
          </div>
        </div>

        {/* Horizontal Scroll Row */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scrollbar-none scroll-smooth select-none snap-x snap-mandatory"
          style={{
            paddingLeft: trackPadding,
            paddingRight: trackPadding,
            msOverflowStyle: "none",
            scrollbarWidth: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {tips.map((tip, index) => (
            <div
              key={index}
              className="group relative pt-14 cursor-pointer overflow-hidden flex-shrink-0 w-[80vw] sm:w-[55vw] md:w-[calc(40%-12px)] lg:w-[calc(25%-12px)] snap-center"
              onMouseEnter={() => setActiveIndex(index)}
              onTouchStart={() => setActiveIndex(index)}
            >
              {/* Entire Wrapper (Image Box + View Button Stack) - Moves Up Together */}
              <div
                className={`w-full flex flex-col transition-transform duration-300 ease-out -translate-y-14 ${activeIndex === index ? "" : "md:translate-y-0 md:group-hover:-translate-y-14"}`}
              >
                {/* Image Container Frame */}
                <div
                  className={`relative w-full aspect-[3/3.8] overflow-hidden shadow-sm flex-shrink-0 rounded-md`}
                >
                  <img
                    src={tip.image.src || (tip.image as unknown as string)}
                    alt={`Tip ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />

                  {/* Instagram Banner */}
                  <div className="absolute bottom-4 left-4 right-4 bg-black/30 backdrop-blur-md rounded-md p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect
                          x="2"
                          y="2"
                          width="20"
                          height="20"
                          rx="5"
                          ry="5"
                        />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                      </svg>
                    </div>
                    <span
                      className="text-white font-bold text-xs uppercase tracking-wider"
                      style={{ fontFamily: "'Clash Display', sans-serif" }}
                    >
                      Instagram
                    </span>
                  </div>
                </div>

                {/* View Post Button (Reveals right at the bottom edge boundary) */}
                <div
                  className={`w-full h-14 pt-3 flex-shrink-0 transition-opacity duration-300 opacity-100 ${activeIndex === index ? "md:opacity-100" : "md:opacity-0 md:group-hover:opacity-100"}`}
                >
                  <button
                    className={`w-full h-full bg-black text-white font-bold text-xs uppercase tracking-wide flex items-center justify-between px-4 hover:bg-neutral-900 transition-colors rounded-md`}
                  >
                    <span>View Post</span>
                    <div className="bg-white text-black rounded-full p-1">
                      <img
                        src={arrow.src || arrow}
                        className="w-3.5 h-3.5"
                        alt="arrow"
                      />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

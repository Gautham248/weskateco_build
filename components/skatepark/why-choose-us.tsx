"use client";

import chooseBg from "components/icons/skatepark/choose_bg.png";
import chooseMobileBg from "components/icons/skatepark/choose_mobile_bg.png";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const CARDS: Array<{ id: string; title: React.ReactNode; text: string }> = [
  {
    id: "designs",
    title: (
      <>
        ALL-LEVEL
        <br />
        FRIENDLY DESIGNS
      </>
    ),
    text: "We build parks for everyone—from first-timers learning to drop in to pros pushing limits. Our layouts strike the right balance of flow, safety, and challenge to make every session fun and fulfilling.",
  },
  {
    id: "support",
    title: (
      <>
        24/7 PROJECT
        <br />
        SUPPORT
      </>
    ),
    text: "From the first sketch to the final pour, we stay connected. Our team is available anytime for updates, consultations, or questions. Clear, reliable communication is how we build trust.",
  },
  {
    id: "coordination",
    title: (
      <>
        MULTILINGUAL
        <br />
        COORDINATION
      </>
    ),
    text: "We work with diverse communities across India and beyond. Our team speaks multiple languages to ensure nothing gets lost in translation—whether with clients, local authorities, or site workers.",
  },
  {
    id: "tech",
    title: (
      <>
        ADVANCED TECH
        <br />
        INTEGRATION
      </>
    ),
    text: "We use cutting-edge tools—3D modeling, digital site analysis, and precision-grade equipment—to design parks that are both epic and engineered to last.",
  },
  {
    id: "built-to-last",
    title: (
      <>
        BUILT TO
        <br />
        LAST
      </>
    ),
    text: "We don't cut corners. From reinforced concrete to pro-grade coping and buttery-smooth transitions, we use only premium materials built to handle heavy riding and harsh weather.",
  },
  {
    id: "licensed-pros",
    title: (
      <>
        LICENSED PROS,
        <br />
        REAL SKATERS
      </>
    ),
    text: "Our team blends certified engineers, seasoned builders, and skaters who know what works. Every project meets safety codes and building standards—while still feeling raw, real, and skateable.",
  },
];

function SkateIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.50519 18.9347C7.15437 18.7165 7.74452 18.3516 8.22978 17.8684L17.8668 8.23135C18.2891 7.80437 18.6205 7.29615 18.8407 6.73744C19.061 6.17872 19.1656 5.58113 19.1482 4.98082C19.1309 4.38052 18.9919 3.78997 18.7398 3.24491C18.4876 2.69985 18.1275 2.21162 17.6812 1.80975C17.4989 1.63083 17.2743 1.50102 17.0283 1.43245C16.7823 1.36387 16.5229 1.35877 16.2744 1.41761C16.0259 1.47645 15.7963 1.59732 15.6072 1.76893C15.418 1.94055 15.2755 2.1573 15.1928 2.39894C15.0173 3.1553 14.6483 3.85309 14.122 4.42397L4.42275 14.1232C3.85182 14.6497 3.15389 15.0188 2.39738 15.1943C2.13524 15.2867 1.90319 15.4487 1.7261 15.6629C1.549 15.8772 1.43355 16.1355 1.39212 16.4104C1.35068 16.6852 1.38482 16.9661 1.49088 17.223C1.59694 17.48 1.77091 17.7032 1.99416 17.8687C2.5715 18.4499 3.30009 18.8579 4.09736 19.0463C4.89464 19.2347 5.72875 19.196 6.50519 18.9347Z"
        fill="#EE2A7B"
      />
      <path
        d="M20.1222 10.576C19.934 10.3891 19.7044 10.249 19.4521 10.1672C19.1997 10.0854 18.9316 10.0641 18.6695 10.1051L19.2047 9.56984C19.9389 8.83088 20.389 7.85673 20.4759 6.81871C20.5628 5.78069 20.2809 4.74526 19.6798 3.89453C19.8855 4.73371 19.875 5.61136 19.6493 6.44538C19.4236 7.2794 18.9899 8.04253 18.389 8.66337L8.70662 18.3458C8.14781 18.9029 7.46784 19.3233 6.71975 19.5743C5.81479 19.8795 4.84166 19.9209 3.91406 19.6936C4.47685 20.0933 5.1262 20.3541 5.80906 20.4548C6.49192 20.5555 7.18892 20.4933 7.84313 20.2732C8.49231 20.055 9.08246 19.6901 9.56772 19.2069L10.0995 18.6751C10.0453 19.0288 10.1043 19.3907 10.2679 19.7089C10.4316 20.0272 10.6917 20.2856 11.0109 20.4472C11.3302 20.6089 11.6924 20.6655 12.0458 20.6091C12.3992 20.5527 12.7257 20.386 12.9788 20.133C13.2319 19.8799 13.3985 19.5534 13.4549 19.2C13.5114 18.8466 13.4547 18.4844 13.293 18.1651C13.1314 17.8459 12.873 17.5858 12.5547 17.4221C12.2365 17.2585 11.8747 17.1995 11.5209 17.2537L17.2481 11.5268C17.2052 11.8134 17.2364 12.1062 17.3387 12.3773C17.4411 12.6484 17.6112 12.8887 17.8328 13.0754C18.0544 13.2621 18.3202 13.3888 18.6047 13.4436C18.8893 13.4984 19.1831 13.4794 19.4582 13.3884C19.7333 13.2974 19.9805 13.1374 20.1762 12.9237C20.3719 12.71 20.5096 12.4497 20.5762 12.1677C20.6427 11.8857 20.6359 11.5913 20.5564 11.3127C20.4769 11.034 20.3276 10.7804 20.1222 10.576Z"
        fill="#EE2A7B"
      />
    </svg>
  );
}

export default function WhyChooseUsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [leftClip, setLeftClip] = useState<string>("0px");

  useEffect(() => {
    const updateClip = () => {
      const w = window.innerWidth;
      if (w < 1024) {
        setLeftClip("0px");
      } else if (w >= 1536) {
        const offset = (w - 1536) / 2 + 555;
        setLeftClip(`${offset}px`);
      } else {
        const offset = (w - 120) * 0.35 + 60;
        setLeftClip(`${offset}px`);
      }
    };
    updateClip();
    window.addEventListener("resize", updateClip);
    return () => window.removeEventListener("resize", updateClip);
  }, []);

  const handlePrev = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -367, behavior: "smooth" });
    }
  };

  const handleNext = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 367, behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-full text-white min-h-screen flex flex-col justify-center py-10 md:py-24 overflow-hidden bg-black">
      {/* Background Image (Mobile) */}
      <div className="absolute inset-x-0 top-0 h-[480px] z-0 md:hidden">
        <Image
          src={chooseMobileBg}
          alt="Why Choose Us background mobile"
          fill
          className="object-cover object-top"
          priority
        />
        {/* Subtle gradient fade at the bottom edge of the image */}
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-b from-transparent to-black" />
      </div>

      {/* Background Image (Desktop) */}
      <div className="hidden md:block absolute inset-0 z-0">
        <Image
          src={chooseBg}
          alt="Why Choose Us background"
          fill
          className="object-cover object-left md:object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-black/30 to-black/70" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full flex flex-col gap-8 md:gap-10 my-auto">
        {/* Top Header & Arrows Row */}
        <div className="w-full px-4 lg:pl-[calc((100vw-120px)*0.35+60px)] 2xl:pl-[calc((100vw-1536px)/2+555px)] pr-4 lg:pr-15 2xl:pr-[calc((100vw-1536px)/2+3.75rem)] pt-[360px] md:pt-0">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 w-full">
            {/* Left Text Block */}
            <div className="flex flex-col gap-4 max-w-xl">
              <h2
                className="text-[24px] md:text-[45px] font-bold tracking-[-1%] text-white uppercase leading-[100%]"
                style={{ fontFamily: "'Clash Display', sans-serif" }}
              >
                WHY CHOOSE US?
              </h2>
              <p
                className="text-sm md:text-lg leading-[130%] text-white/90 font-[400] max-w-[500px]"
                style={{ fontFamily: "'Clash Display', sans-serif" }}
              >
                Delivering innovative skateparks through expert design, precision
                construction, and a commitment to quality, safety, and lasting
                impact.
              </p>
            </div>

            {/* Right Navigation Arrow Buttons (Desktop) */}
            <div className="hidden lg:flex items-center gap-3">
              <button
                onClick={handlePrev}
                aria-label="Previous slide"
                className="w-12 h-12 border border-neutral-200 rounded-full flex items-center justify-center bg-white hover:bg-[#CCFF02] transition-colors cursor-pointer shrink-0"
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
                aria-label="Next slide"
                className="w-12 h-12 border border-neutral-200 rounded-full flex items-center justify-center bg-white hover:bg-[#CCFF02] transition-colors cursor-pointer shrink-0"
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

        {/* Carousel Cards Track - Full width scroll container so cards scroll through left/right padding */}
        <div
          ref={scrollRef}
          className="w-full overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden scroll-smooth"
          style={{
            clipPath: leftClip !== "0px" ? `inset(0px 0px 0px ${leftClip})` : "none",
          }}
        >
          <div className="flex gap-4 items-stretch min-w-max pb-0 px-4 lg:pl-[calc((100vw-120px)*0.35+60px)] 2xl:pl-[calc((100vw-1536px)/2+555px)] pr-4 lg:pr-15 2xl:pr-[calc((100vw-1536px)/2+3.75rem)]">
            {CARDS.map((card) => (
              <div
                key={card.id}
                className="w-[260px] sm:w-[280px] md:w-[301px] aspect-[301/368] bg-white rounded-[8px] p-[24px] text-black border border-neutral-100 border-b border-b-neutral-300 flex flex-col justify-between shrink-0 shadow-md"
              >
                <div className="flex flex-col gap-3">
                  {/* Pink Badge with Skate SVG Icon */}
                  <div className="w-10 h-10 mb-8 md:mb-14 rounded-full bg-[#EEEEEE] flex items-center justify-center">
                    <SkateIcon />
                  </div>

                  {/* Title */}
                  <h3
                    className="text-xl md:text-[24px] font-bold tracking-[-1%] uppercase leading-[110%] text-black"
                    style={{ fontFamily: "'Clash Display', sans-serif" }}
                  >
                    {card.title}
                  </h3>

                  {/* Description */}
                  <p
                    className="text-sm md:text-base text-black leading-[120%] font-[400]"
                    style={{ fontFamily: "'Clash Display', sans-serif" }}
                  >
                    {card.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrow Buttons (Mobile - placed below cards) */}
        <div className="flex lg:hidden items-center gap-3 px-4 pt-2">
          <button
            onClick={handlePrev}
            aria-label="Previous slide"
            className="w-10 h-10 border border-neutral-200 rounded-full flex items-center justify-center bg-white hover:bg-[#CCFF02] transition-colors cursor-pointer shrink-0"
          >
            <svg
              width="20"
              height="20"
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
            aria-label="Next slide"
            className="w-10 h-10 border border-neutral-200 rounded-full flex items-center justify-center bg-white hover:bg-[#CCFF02] transition-colors cursor-pointer shrink-0"
          >
            <svg
              width="20"
              height="20"
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

"use client";

import { getLocalizedPath } from "lib/i18n";
import { useTranslation } from "lib/i18n/TranslationProvider";
import Link from "next/link";
import { GreenArrowIcon } from "./icons";

const STYLES_DATA = [
  {
    id: "cruising",
    tag: "STYLE 1",
    title: "CRUISING & CHILLING",
    description:
      "Go wider, or old-school shaped — even a Surfskate — for smooth turns and easy flow through traffic.",
    buttonText: "SHOP NOW",
  },
  {
    id: "street",
    tag: "STYLE 2",
    title: "STREET & FLATGROUND TRICKS",
    description:
      '7.75"–8.0" is the sweet spot — light enough to flip, wide enough to land clean.',
    buttonText: "SHOP NOW",
  },
  {
    id: "transition",
    tag: "STYLE 3",
    title: "TRANSITION, BOWL & RAMPS",
    description:
      'Go wider — 8.0" and up — for more foot space and stability at speed.',
    buttonText: "SHOP NOW",
  },
];

export default function WhatsYourStyleSection() {
  const { locale } = useTranslation();

  return (
    <section className="w-full bg-[#F7F7F9] text-black py-10 md:py-24 overflow-hidden">
      <div className="mx-auto max-w-(--breakpoint-2xl) px-4 lg:px-15 flex flex-col gap-8 md:gap-12">
        {/* Top Header Block */}
        <div className="flex flex-col gap-4 max-w-2xl">
          <h2
            className="text-2xl md:text-[45px] font-bold tracking-[-1%] text-black uppercase leading-none md:leading-[80%]"
            style={{ fontFamily: "'Clash Display', sans-serif" }}
          >
            WHAT'S YOUR STYLE <br /> OR GOAL?
          </h2>
          <p className="text-sm md:text-lg text-black font-normal leading-[140%]">
            Choose your board based on what you want to do:
          </p>
        </div>

        {/* 3 Cards Grid / Horizontal Scroll on Mobile */}
        <div className="flex md:grid md:grid-cols-3 gap-4 md:gap-8 items-stretch overflow-x-auto snap-x snap-mandatory -mx-4 px-4 scroll-px-4 md:mx-0 md:px-0 md:scroll-px-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pb-2 md:pb-0">
          {STYLES_DATA.map((styleItem) => (
            <div
              key={styleItem.id}
              className="bg-white rounded-[20px] p-6 md:p-8 flex flex-col justify-between gap-6 border border-neutral-100/80 transition-shadow hover:shadow-md shrink-0 max-w-[77vw] md:w-auto md:max-w-none snap-start"
            >
              <div className="flex flex-col gap-5 md:gap-5">
                <span className="text-sm md:text-sm font-medium tracking-[-1%] text-[#00000080] uppercase">
                  {styleItem.tag}
                </span>
                <h3
                  className="text-lg md:text-[24px] font-semibold tracking-[-1%] text-black uppercase leading-[110%] md:leading-[100%]"
                  style={{ fontFamily: "'Clash Display', sans-serif" }}
                >
                  {styleItem.title}
                </h3>
                <p className="text-base md:text-base text-black leading-[140%] font-normal my-5">
                  {styleItem.description}
                </p>
              </div>

              {/* Action Button */}
              <Link
                href={getLocalizedPath("/store/skateboards", locale)}
                className="flex items-center gap-3 group cursor-pointer text-left w-fit"
              >
                <div className="w-7 h-7 rounded-full bg-[#CCFF02] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <GreenArrowIcon />
                </div>
                <span
                  className="text-xl md:text-[24px] font-bold uppercase text-black"
                  style={{ fontFamily: "'Clash Display', sans-serif" }}
                >
                  {styleItem.buttonText}
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { getLocalizedPath } from "lib/i18n";
import { useTranslation } from "lib/i18n/TranslationProvider";
import Link from "next/link";

const OPTIONS_DATA = [
  {
    id: "buy-complete",
    tag: "BUY COMPLETE IF",
    title: "YOU WANT IT SORTED",
    reasons: [
      "You're new to skateboarding or want the easiest setup",
      "You don't want to research every part",
      "You want the best value for money",
    ],
    buttonText: "SHOP COMPLETE SKATEBOARDS",
    href: "/store/skateboard-completes",
  },
  {
    id: "build-your-own",
    tag: "BUILD YOUR OWN IF",
    title: "YOU KNOW WHAT YOU WANT",
    reasons: [
      "You know your size, trucks, wheels, bearings",
      "You want a personalised or upgraded setup",
    ],
    buttonText: "SHOP SKATEBOARDS",
    href: "/store/skateboards",
  },
];

export default function BuildYourOwnOrBuyCompleteSection() {
  const { locale } = useTranslation();

  return (
    <section className="w-full bg-[#F7F7F9] text-black py-16 md:py-24 overflow-hidden">
      <div className="mx-auto max-w-(--breakpoint-2xl) px-4 lg:px-15 flex flex-col gap-8 md:gap-12">
        {/* Top Header Block */}
        <div className="flex flex-col gap-4 max-w-2xl">
          <h2
            className="text-2xl md:text-[45px] font-bold tracking-[-1%] text-black uppercase leading-[80%]"
            style={{ fontFamily: "'Clash Display', sans-serif" }}
          >
            BUILD YOUR OWN OR <br /> BUY COMPLETE?
          </h2>
          <p className="text-sm md:text-lg text-black font-normal leading-[140%]">
            Choose your board based on what you want to do:
          </p>
        </div>

        {/* 2 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-stretch">
          {OPTIONS_DATA.map((option) => (
            <div
              key={option.id}
              className="bg-white rounded-[16px] p-6 md:p-8 flex flex-col justify-between border border-neutral-100/80 transition-shadow hover:shadow-md"
            >
              <div className="flex flex-col gap-5">
                <span className="text-xs md:text-sm font-medium tracking-[-1%] text-[#00000080] uppercase">
                  {option.tag}
                </span>
                <h3
                  className="text-lg md:text-[24px] font-semibold tracking-[-1%] text-black uppercase leading-[100%] pb-2"
                  style={{ fontFamily: "'Clash Display', sans-serif" }}
                >
                  {option.title}
                </h3>

                {/* Reasons List with dividers */}
                <div className="flex flex-col text-sm md:text-base text-black font-normal leading-[140%] pt-2">
                  {option.reasons.map((reason, idx) => (
                    <div
                      key={idx}
                      className="py-4 border-b border-[#0000001A] first:pt-0"
                    >
                      {reason}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <Link
                href={getLocalizedPath(option.href, locale)}
                className="w-fit bg-black text-white px-6 py-3.5 rounded-[4px] text-xs md:text-sm font-semibold uppercase tracking-wider hover:bg-neutral-800 transition-colors shrink-0 mt-10 inline-flex items-center justify-center"
                style={{ fontFamily: "'Clash Display', sans-serif" }}
              >
                {option.buttonText}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

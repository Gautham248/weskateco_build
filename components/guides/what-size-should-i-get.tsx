"use client";

import deckImg from "components/icons/skateboard_guide/size.png";
import { getLocalizedPath } from "lib/i18n";
import { useTranslation } from "lib/i18n/TranslationProvider";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { GreenArrowIcon } from "./icons";

function ChevronDownIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 6L8 10L12 6"
        stroke="#1A1A1A"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const SIZE_OPTIONS = [
  {
    id: "under-4",
    labelUK: "Shoe Size Under UK 4",
    labelUS: "Shoe Size Under US 5",
    deckSize: '7.25" – 7.5"',
  },
  {
    id: "4-6",
    labelUK: "Shoe Size UK 4 – UK 6",
    labelUS: "Shoe Size US 5 – US 7",
    deckSize: '7.5" – 7.75"',
  },
  {
    id: "6-9",
    labelUK: "Shoe Size UK 6 – UK 9",
    labelUS: "Shoe Size US 7 – US 10",
    deckSize: '7.75" – 8.0"',
  },
  {
    id: "9-plus",
    labelUK: "Shoe Size UK 9+",
    labelUS: "Shoe Size US 10+",
    deckSize: '8.0" – 8.5"',
  },
];

export default function WhatSizeShouldIGetSection() {
  const { locale } = useTranslation();
  const [unit, setUnit] = useState<"UK" | "US">("UK");
  const [activeSizeId, setActiveSizeId] = useState("under-4");

  const activeSize =
    SIZE_OPTIONS.find((s) => s.id === activeSizeId) || SIZE_OPTIONS[0]!;

  return (
    <section className="w-full bg-white text-black py-10 md:py-24 overflow-hidden">
      <div className="mx-auto max-w-(--breakpoint-2xl) px-4 lg:px-15 flex flex-col gap-6 md:gap-10">
        {/* Top Header Block with Unit Toggle */}
        <div className="flex flex-row items-center justify-between gap-4 w-full">
          <h2
            className="text-2xl md:text-[45px] font-bold tracking-[-1%] text-black uppercase leading-none w-[200px] md:w-full"
            style={{ fontFamily: "'Clash Display', sans-serif" }}
          >
            WHAT SIZE SHOULD I GET?
          </h2>

          {/* UK / US Toggle Pill */}
          <div className="flex items-center bg-[#F1F2F4] p-1 rounded-full shrink-0">
            <button
              onClick={() => setUnit("UK")}
              className={`px-4 py-1.5 rounded-full text-xs md:text-xs font-semibold uppercase transition-all cursor-pointer ${unit === "UK"
                ? "bg-black text-white"
                : "text-neutral-600 hover:text-black"
                }`}
              style={{ fontFamily: "'Clash Display', sans-serif" }}
            >
              UK
            </button>
            <button
              onClick={() => setUnit("US")}
              className={`px-4 py-1.5 rounded-full text-xs md:text-xs font-semibold uppercase transition-all cursor-pointer ${unit === "US"
                ? "bg-black text-white"
                : "text-neutral-600 hover:text-black"
                }`}
              style={{ fontFamily: "'Clash Display', sans-serif" }}
            >
              US
            </button>
          </div>
        </div>

        {/* Main Content Grid: Left Diagram Display + Right Interactive List */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start lg:items-center">
          {/* Desktop Left Column: Skateboard Size Diagram Box */}
          <div className="hidden lg:flex lg:col-span-6 w-full bg-[#F6F7F9] rounded-t-[16px] rounded-b-none aspect-[828/611] flex-col items-center justify-between pt-8 md:pt-12 px-0 pb-0 relative overflow-hidden">
            {/* Top Deck Size Indicator */}
            <div className="flex flex-col items-center gap-1 z-10 px-6">
              <span className="text-sm md:text-base text-neutral-500 font-medium">
                Deck Size
              </span>
              <span
                className="text-lg md:text-[24px] font-medium text-black"
                style={{ fontFamily: "'Clash Display', sans-serif" }}
              >
                {activeSize.deckSize}
              </span>

              {/* Bracket width indicator SVG */}
              <div className="w-[200px] sm:w-[240px] md:w-[260px] mt-0 md:mt-3">
                <svg
                  className="w-full h-8"
                  viewBox="0 0 260 30"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M130 0V12" stroke="#111" strokeWidth="1.5" />
                  <path d="M10 12H250" stroke="#111" strokeWidth="1.5" />
                  <path d="M10 12V28" stroke="#111" strokeWidth="1.5" />
                  <path d="M250 12V28" stroke="#111" strokeWidth="1.5" />
                </svg>
              </div>
            </div>

            {/* Skateboard Graphic Illustration anchored at bottom-center */}
            <div className="relative w-full flex-1 flex items-end justify-center overflow-hidden">
              <div className="relative w-[260px] sm:w-[380px] md:w-[480px] aspect-[652/383]">
                <Image
                  src={deckImg}
                  alt={`Skateboard Deck Size ${activeSize.deckSize}`}
                  fill
                  className="object-contain object-bottom"
                  priority
                />
              </div>
            </div>

            {/* Bottom Progress Bar */}
            <div className="absolute bottom-0 inset-x-0 h-1 bg-neutral-200">
              <div
                className="h-full bg-neutral-800 transition-all duration-300"
                style={{
                  width: `${((SIZE_OPTIONS.findIndex((s) => s.id === activeSizeId) +
                    1) /
                    SIZE_OPTIONS.length) *
                    100
                    }%`,
                }}
              />
            </div>
          </div>

          {/* Right Column: Interactive Shoe Size List / Accordion on Mobile + Guidance Notes */}
          <div className="lg:col-span-6 flex flex-col gap-6 md:gap-10">
            {/* Options Accordion List */}
            <div className="flex flex-col divide-y divide-neutral-100 border-b border-neutral-100 lg:border-b-0 lg:divide-y-0 lg:gap-8">
              {SIZE_OPTIONS.map((size, index) => {
                const isActive = size.id === activeSizeId;
                const label = unit === "UK" ? size.labelUK : size.labelUS;
                return (
                  <div key={size.id} className="py-4 lg:py-0 flex flex-col">
                    <button
                      onClick={() => setActiveSizeId(size.id)}
                      className="flex items-center justify-between w-full text-left transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center">
                        {/* Arrow Circle Badge */}
                        <div
                          className={`transition-all duration-300 ease-out overflow-hidden flex items-center justify-center shrink-0 rounded-full bg-[#CCFF02] ${isActive
                            ? "w-7 h-7 opacity-100 scale-100 mr-3 md:mr-4"
                            : "w-0 h-7 opacity-0 scale-75 mr-0"
                            }`}
                        >
                          <GreenArrowIcon />
                        </div>

                        {/* Label */}
                        <span
                          className={`text-xl md:text-[28px] leading-[120%] tracking-[-2%] transition-colors font-medium ${isActive
                            ? "text-black"
                            : "text-[#636363] group-hover:text-neutral-700"
                            }`}
                          style={{ fontFamily: "'Clash Display', sans-serif" }}
                        >
                          {label}
                        </span>
                      </div>

                      {/* Right Chevron Down Icon (mobile only, visible when not active) */}
                      {!isActive && (
                        <div className="lg:hidden shrink-0 ml-2">
                          <ChevronDownIcon />
                        </div>
                      )}
                    </button>

                    {/* Mobile Active Diagram Box (rendered directly below active item header) */}
                    {isActive && (
                      <div className="lg:hidden mt-6 w-full bg-[#F6F7F9] rounded-t-[8px] aspect-[828/611] flex flex-col items-center justify-between pt-6 px-0 pb-0 relative overflow-hidden">
                        {/* Top Deck Size Indicator */}
                        <div className="flex flex-col items-center gap-1 z-10 px-4">
                          <span className="text-xs sm:text-sm text-neutral-500 font-medium">
                            Deck Size
                          </span>
                          <span
                            className="text-base sm:text-lg font-medium text-black"
                            style={{ fontFamily: "'Clash Display', sans-serif" }}
                          >
                            {size.deckSize}
                          </span>

                          {/* Bracket width indicator SVG */}
                          <div className="w-[180px] sm:w-[220px] mt-1">
                            <svg
                              className="w-full h-6 sm:h-8"
                              viewBox="0 0 260 30"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M130 0V12" stroke="#111" strokeWidth="1.5" />
                              <path d="M10 12H250" stroke="#111" strokeWidth="1.5" />
                              <path d="M10 12V28" stroke="#111" strokeWidth="1.5" />
                              <path d="M250 12V28" stroke="#111" strokeWidth="1.5" />
                            </svg>
                          </div>
                        </div>

                        {/* Skateboard Graphic Illustration */}
                        <div className="relative w-full flex-1 flex items-end justify-center overflow-hidden">
                          <div className="relative w-[220px] sm:w-[320px] aspect-[652/383]">
                            <Image
                              src={deckImg}
                              alt={`Skateboard Deck Size ${size.deckSize}`}
                              fill
                              className="object-contain object-bottom"
                              priority
                            />
                          </div>
                        </div>

                        {/* Bottom Indicator bar */}
                        <div className="absolute bottom-0 inset-x-0 h-0.5 md:h-1 bg-neutral-200">
                          <div
                            className="h-full bg-neutral-800 transition-all duration-300"
                            style={{
                              width: `${((index + 1) / SIZE_OPTIONS.length) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Guidance Notes Box */}
            <div className="flex flex-col gap-3 pt-6 text-sm md:text-base text-[#636363]">
              <div className="flex items-center gap-2 items-start">
                <span className="font-normal text-black whitespace-nowrap">Smaller boards</span>
                <span>=</span>
                <span className="text-[#00000099]">easier to flip</span>
              </div>
              <div className="h-[1px] bg-[#00000033] w-full" />
              <div className="flex items-center gap-2 items-start">
                <span className="font-normal text-black whitespace-nowrap">Wider boards</span>
                <span>=</span>
                <span className="text-[#00000099]">
                  more stable for cruising, ramps, or bowl skating
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Banner Card */}
        <div className="w-full bg-[#EAFBFF] border border-[#80E5FF] rounded-[8px] p-5 md:py-4 md:px-8 flex flex-col lg:flex-row items-center justify-between gap-5 md:gap-6">
          {/* Highlights */}
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start gap-3 md:gap-0 text-center lg:text-left text-base md:text-lg font-normal text-black">
            <span className="w-[300px] md:w-full ">
              If you're just cruising or learning tricks,{" "}
              <strong className="font-bold">7.75"–8.0"</strong> is a sweet spot
              for most riders.
            </span>
          </div>

          {/* Shop Button */}
          <Link
            href={getLocalizedPath("/store/decks", locale)}
            className="hidden md:flex w-full lg:w-auto bg-black text-white px-6 py-3.5 rounded-[4px] text-xs md:text-base font-semibold uppercase tracking-wider hover:bg-neutral-800 transition-colors shrink-0 justify-center"
            style={{ fontFamily: "'Clash Display', sans-serif" }}
          >
            SHOP SKATEBOARD DECK
          </Link>
        </div>

        <Link
          href={getLocalizedPath("/store/decks", locale)}
          className="flex md:hidden w-full lg:w-auto bg-black text-white px-6 py-3.5 rounded-[4px] text-base justify-center font-semibold uppercase tracking-wider hover:bg-neutral-800 transition-colors shrink-0"
          style={{ fontFamily: "'Clash Display', sans-serif" }}
        >
          SHOP SKATEBOARD DECK
        </Link>
      </div>
    </section>
  );
}

"use client";

import deckImg from "components/icons/skateboard_guide/size.png";
import Image from "next/image";
import { useState } from "react";

function GreenArrowIcon() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 6.92096H12.6378M6.81888 12.8419L12.6378 6.92096L6.81888 1"
        stroke="#1D6A2B"
        strokeWidth="2"
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
  const [unit, setUnit] = useState<"UK" | "US">("UK");
  const [activeSizeId, setActiveSizeId] = useState("under-4");

  const activeSize =
    SIZE_OPTIONS.find((s) => s.id === activeSizeId) || SIZE_OPTIONS[0]!;

  return (
    <section className="w-full bg-white text-black py-16 md:py-24 overflow-hidden">
      <div className="mx-auto max-w-(--breakpoint-2xl) px-4 lg:px-15 flex flex-col gap-6 md:gap-10">
        {/* Top Header Block with Unit Toggle */}
        <div className="flex flex-row items-center justify-between gap-4 w-full">
          <h2
            className="text-2xl md:text-[45px] font-bold tracking-[-1%] text-black uppercase leading-none"
            style={{ fontFamily: "'Clash Display', sans-serif" }}
          >
            WHAT SIZE SHOULD I GET?
          </h2>

          {/* UK / US Toggle Pill */}
          <div className="flex items-center bg-[#F1F2F4] p-1 rounded-full shrink-0">
            <button
              onClick={() => setUnit("UK")}
              className={`px-4 py-3 rounded-full text-xs md:text-xs font-semibold uppercase transition-all cursor-pointer ${unit === "UK"
                ? "bg-black text-white"
                : "text-neutral-600 hover:text-black"
                }`}
              style={{ fontFamily: "'Clash Display', sans-serif" }}
            >
              UK
            </button>
            <button
              onClick={() => setUnit("US")}
              className={`px-4 py-3 rounded-full text-xs md:text-xs font-semibold uppercase transition-all cursor-pointer ${unit === "US"
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Skateboard Size Diagram Box */}
          <div className="lg:col-span-6 w-full bg-[#F6F7F9] rounded-t-[16px] rounded-b-none aspect-[828/611] flex flex-col items-center justify-between pt-8 md:pt-12 px-0 pb-0 relative overflow-hidden">
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

          {/* Right Column: Interactive Shoe Size List + Guidance Notes */}
          <div className="lg:col-span-6 flex flex-col gap-6 md:gap-10">
            {/* Options List */}
            <div className="flex flex-col gap-5 md:gap-12">
              {SIZE_OPTIONS.map((size) => {
                const isActive = size.id === activeSizeId;
                const label = unit === "UK" ? size.labelUK : size.labelUS;
                return (
                  <button
                    key={size.id}
                    onClick={() => setActiveSizeId(size.id)}
                    className="flex items-center text-left transition-colors cursor-pointer group"
                  >
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
                      className={`text-lg md:text-[28px] leading-[120%] tracking-[-2%] transition-colors font-medium ${isActive
                        ? "text-black"
                        : "text-[#999999] group-hover:text-neutral-700"
                        }`}
                      style={{ fontFamily: "'Clash Display', sans-serif" }}
                    >
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Guidance Notes Box */}
            <div className="flex flex-col gap-3 pt-6 text-sm md:text-base text-[#636363]">
              <div className="flex items-center gap-2">
                <span className="font-normal text-black">Smaller boards</span>
                <span>=</span>
                <span className="text-[#00000099]">easier to flip</span>
              </div>
              <div className="h-[1px] bg-[#00000033] w-full" />
              <div className="flex items-center gap-2">
                <span className="font-normal text-black">Wider boards</span>
                <span>=</span>
                <span className="text-[#00000099]">
                  more stable for cruising, ramps, or bowl skating
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Banner Card */}
        <div className="w-full bg-[#EAFBFF] border border-[#80E5FF] rounded-[8px] px-4 py-4 md:py-4 md:px-8 flex flex-col lg:flex-row items-center justify-between gap-3 md:gap-6">
          {/* Highlights */}
          <div
            className="flex flex-wrap items-center gap-y-2 text-sm md:text-lg font-normal text-black"
          >
            <span>
              If you're just cruising or learning tricks,{" "}
              <strong className="font-bold">7.75"–8.0"</strong> is a sweet spot
              for most riders.
            </span>
          </div>

          {/* Shop Button */}
          <button
            className="w-full lg:w-auto bg-black text-white px-6 py-3.5 rounded-[4px] text-sm md:text-base font-semibold uppercase tracking-wider hover:bg-neutral-800 transition-colors shrink-0"
            style={{ fontFamily: "'Clash Display', sans-serif" }}
          >
            SHOP SKATEBOARD DECK
          </button>
        </div>
      </div>
    </section>
  );
}

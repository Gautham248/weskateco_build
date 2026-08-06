"use client";

import deckImg from "components/icons/skateboard_guide/deck.png";
import { getLocalizedPath } from "lib/i18n";
import { useTranslation } from "lib/i18n/TranslationProvider";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ChevronDownIcon, GreenArrowIcon } from "./icons";

const PARTS = [
  {
    id: "deck",
    label: "Deck (board)",
    image: deckImg,
    alt: "Skateboard Deck Diagram",
  },
  {
    id: "trucks",
    label: "Trucks (the metal parts that turn)",
    image: deckImg,
    alt: "Skateboard Trucks Diagram",
  },
  {
    id: "wheels",
    label: "Wheels",
    image: deckImg,
    alt: "Skateboard Wheels Diagram",
  },
  {
    id: "bearings",
    label: "Bearings",
    image: deckImg,
    alt: "Skateboard Bearings Diagram",
  },
  {
    id: "griptape",
    label: "Grip tape",
    image: deckImg,
    alt: "Skateboard Grip tape Diagram",
  },
];

export default function AreYouABeginnerSection() {
  const { locale } = useTranslation();
  const [activePartId, setActivePartId] = useState("deck");

  const activePart = PARTS.find((p) => p.id === activePartId) || PARTS[0]!;

  return (
    <section className="w-full bg-white text-black py-10 md:py-24 overflow-hidden">
      <div className="mx-auto max-w-(--breakpoint-2xl) px-4 lg:px-15 flex flex-col gap-6 md:gap-10">
        {/* Top Header Block */}
        <div className="flex flex-col gap-3 md:gap-4 max-w-2xl">
          <h2
            className="text-2xl md:text-[45px] font-bold tracking-[-1%] text-black uppercase leading-none"
            style={{ fontFamily: "'Clash Display', sans-serif" }}
          >
            ARE YOU A BEGINNER?
          </h2>
          <p className="text-sm md:text-xl text-black font-[400] leading-[140%] max-w-[32rem]">
            If this is your first board, start with a complete skateboard. It
            comes with everything you need:
          </p>
        </div>

        {/* Main Content Grid: Left List + Right Diagram Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start lg:items-center">
          {/* Left Column: Interactive Part Items List / Accordion on Mobile */}
          <div className="lg:col-span-6 flex flex-col divide-y divide-neutral-100 border-b border-neutral-100 lg:border-b-0 lg:divide-y-0 lg:gap-8">
            {PARTS.map((part, index) => {
              const isActive = part.id === activePartId;
              return (
                <div key={part.id} className="py-4 lg:py-0 flex flex-col">
                  <button
                    onClick={() => setActivePartId(part.id)}
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
                        {part.label}
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
                    <div className="lg:hidden mt-6 w-full bg-[#F6F7F9] rounded-t-[8px] aspect-[828/611] flex flex-col items-center justify-center p-6 relative overflow-hidden">
                      <div className="relative w-full h-full max-w-[540px] flex items-center justify-center">
                        <Image
                          src={part.image}
                          alt={part.alt}
                          fill
                          className="object-contain"
                          priority
                        />
                      </div>
                      {/* Bottom Indicator bar */}
                      <div className="absolute bottom-0 inset-x-0 h-0.5 md:h-1 bg-neutral-200">
                        <div
                          className="h-full bg-neutral-800 transition-all duration-300"
                          style={{
                            width: `${((index + 1) / PARTS.length) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Desktop Right Column: Skateboard Part Diagram Box */}
          <div className="hidden lg:flex lg:col-span-6 w-full bg-[#F6F7F9] rounded-t-[16px] rounded-b-none aspect-[828/611] flex-col items-center justify-center p-6 md:p-12 relative overflow-hidden">
            <div className="relative w-full h-full max-w-[540px] flex items-center justify-center">
              <Image
                src={activePart.image}
                alt={activePart.alt}
                fill
                className="object-contain"
                priority
              />
            </div>
            {/* Bottom Indicator bar - Flush at bottom edge */}
            <div className="absolute bottom-0 inset-x-0 h-1 bg-neutral-200">
              <div
                className="h-full bg-neutral-800 transition-all duration-300"
                style={{
                  width: `${((PARTS.findIndex((p) => p.id === activePartId) + 1) /
                    PARTS.length) *
                    100
                    }%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Bottom Banner Card */}
        <div className="w-full bg-[#EAFBFF] border border-[#80E5FF] rounded-[8px] p-5 md:py-4 md:px-8 flex flex-col lg:flex-row items-center justify-between gap-5 md:gap-6">
          {/* Highlights List */}
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start gap-3 md:gap-0 text-center lg:text-left text-base md:text-lg font-normal text-black">
            <span>Sized for comfort and control</span>
            <span className="hidden sm:inline text-black mx-3">|</span>
            <span>Built to handle Indian roads and parks</span>
            <span className="hidden sm:inline text-black mx-3">|</span>
            <span>Easy to maintain and upgrade later</span>
          </div>

          {/* Shop Button */}
          <Link
            href={getLocalizedPath("/store/skateboard-completes", locale)}
            className="hidden md:flex w-full lg:w-auto bg-black text-white px-6 py-3.5 rounded-[4px] text-xs md:text-base font-semibold uppercase tracking-wider hover:bg-neutral-800 transition-colors shrink-0"
            style={{ fontFamily: "'Clash Display', sans-serif" }}
          >
            SHOP COMPLETE SKATEBOARDS
          </Link>
        </div>
        <Link
          href={getLocalizedPath("/store/skateboard-completes", locale)}
          className="flex md:hidden w-full lg:w-auto bg-black text-white px-6 py-3.5 rounded-[4px] text-base justify-center md:text-base font-semibold uppercase tracking-wider hover:bg-neutral-800 transition-colors shrink-0"
          style={{ fontFamily: "'Clash Display', sans-serif" }}
        >
          SHOP COMPLETE SKATEBOARDS
        </Link>
      </div>
    </section>
  );
}

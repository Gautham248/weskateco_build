"use client";

import deckImg from "components/icons/skateboard_guide/deck.png";
import { getLocalizedPath } from "lib/i18n";
import { useTranslation } from "lib/i18n/TranslationProvider";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { GreenArrowIcon } from "./icons";

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
    <section className="w-full bg-white text-black py-16 md:py-24 overflow-hidden">
      <div className="mx-auto max-w-(--breakpoint-2xl) px-4 lg:px-15 flex flex-col gap-6 md:gap-10">
        {/* Top Header Block */}
        <div className="flex flex-col gap-4 max-w-2xl">
          <h2
            className="text-2xl md:text-[45px] font-bold tracking-[-1%] text-black uppercase leading-none"
            style={{ fontFamily: "'Clash Display', sans-serif" }}
          >
            ARE YOU A BEGINNER?
          </h2>
          <p
            className="text-sm md:text-xl text-black font-[400] leading-[140%] max-w-[32rem]"
          >
            If this is your first board, start with a complete skateboard. It
            comes with everything you need:
          </p>
        </div>

        {/* Main Content Grid: Left List + Right Diagram Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Interactive Part Items List */}
          <div className="lg:col-span-6 flex flex-col gap-5 md:gap-12">
            {PARTS.map((part) => {
              const isActive = part.id === activePartId;
              return (
                <button
                  key={part.id}
                  onClick={() => setActivePartId(part.id)}
                  aria-label={`Show ${part.label}`}
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
                      : "text-[#636363] group-hover:text-neutral-700"
                      }`}
                    style={{ fontFamily: "'Clash Display', sans-serif" }}
                  >
                    {part.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Column: Skateboard Part Diagram Box */}
          <div className="lg:col-span-6 w-full bg-[#F6F7F9] rounded-t-[16px] rounded-b-none aspect-[828/611] flex flex-col items-center justify-center p-6 md:p-12 relative overflow-hidden">
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
                  width: `${((PARTS.findIndex((p) => p.id === activePartId) + 1) / PARTS.length) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Bottom Banner Card */}
        <div className="w-full bg-[#EAFBFF] border border-[#80E5FF] rounded-[8px] px-4 py-4 md:py-4 md:px-8 flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Highlights List */}
          <div
            className="flex flex-wrap items-center gap-y-2 text-sm md:text-lg font-normal text-black"
          >
            <span>Sized for comfort and control</span>
            <span className="hidden sm:inline text-black mx-3">|</span>
            <span>Built to handle Indian roads and parks</span>
            <span className="hidden sm:inline text-black mx-3">|</span>
            <span>Easy to maintain and upgrade later</span>
          </div>

          {/* Shop Button */}
          <Link
            href={getLocalizedPath("/store/skateboard-completes", locale)}
            className="inline-flex w-full lg:w-auto bg-black text-white px-6 py-3.5 rounded-[4px] text-sm md:text-base font-semibold uppercase tracking-wider hover:bg-neutral-800 transition-colors shrink-0 items-center justify-center"
            style={{ fontFamily: "'Clash Display', sans-serif" }}
          >
            SHOP COMPLETE SKATEBOARDS
          </Link>
        </div>
      </div>
    </section>
  );
}

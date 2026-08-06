"use client";

import wheelSizeImg from "components/icons/skateboard_guide/wheel_size.png";
import { getLocalizedPath } from "lib/i18n";
import { useTranslation } from "lib/i18n/TranslationProvider";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ChevronDownIcon, GreenArrowIcon } from "./icons";

const WHEEL_SIZE_OPTIONS = [
  {
    id: "50-53mm",
    title: "50–53mm",
    description:
      "Small, slower wheels; stable for trick riding and smaller riders skating street, skate parks, and bowls.",
  },
  {
    id: "54-59mm",
    title: "54–59mm",
    description:
      "Average wheel size for beginners and bigger riders skating street, skate parks, bowls, and vert ramps.",
  },
  {
    id: "60mm-plus",
    title: "60mm+",
    description:
      "Specialty riders skating longboards, old-school boards, downhill, and dirt boards; made for speed and rougher surfaces.",
  },
];

export default function WhatsTheRightWheelSizeSection() {
  const { locale } = useTranslation();
  const [activeSizeId, setActiveSizeId] = useState("50-53mm");

  const activeOption =
    WHEEL_SIZE_OPTIONS.find((opt) => opt.id === activeSizeId) ||
    WHEEL_SIZE_OPTIONS[0]!;

  return (
    <section className="w-full bg-white text-black py-10 md:py-24 overflow-hidden">
      <div className="mx-auto max-w-(--breakpoint-2xl) px-4 lg:px-15 flex flex-col gap-6 md:gap-10">
        {/* Top Header Block */}
        <div className="flex flex-col gap-3 md:gap-4 max-w-[48rem]">
          <span className="text-sm md:text-base font-medium tracking-[-1%] text-[#00000080] uppercase">
            01 — DIAMETER
          </span>
          <h2
            className="text-2xl md:text-[45px] font-bold tracking-[-1%] text-black uppercase leading-none"
            style={{ fontFamily: "'Clash Display', sans-serif" }}
          >
            WHAT'S THE RIGHT WHEEL SIZE?
          </h2>
          <p className="text-sm md:text-lg text-black font-normal leading-[140%] max-w-[490px]">
            Skateboard wheel diameter is measured in millimeters (mm) - most
            wheels range from 50–75mm, and the lower the number, the smaller
            the wheel.
          </p>
        </div>

        {/* Main Content Grid: Left List + Right Diagram Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start lg:items-center">
          {/* Left Column: Interactive Size Items List / Accordion on Mobile */}
          <div className="lg:col-span-6 flex flex-col divide-y divide-neutral-100 border-b border-neutral-100 lg:border-b-0 lg:divide-y-0 lg:gap-8">
            {WHEEL_SIZE_OPTIONS.map((opt, index) => {
              const isActive = opt.id === activeSizeId;
              return (
                <div key={opt.id} className="py-4 lg:py-0 flex flex-col">
                  <button
                    id={`accordion-btn-${opt.id}`}
                    onClick={() => setActiveSizeId(opt.id)}
                    aria-expanded={isActive}
                    aria-controls={`accordion-panel-${opt.id}`}
                    className="flex items-start justify-between w-full text-left transition-colors cursor-pointer group"
                  >
                    {/* Text Details */}
                    <div className="flex flex-col gap-2 pr-2">
                      <span
                        className={`text-[24px] md:text-[30px] leading-[120%] tracking-[-2%] transition-colors font-medium ${isActive ? "text-black" : "text-[#636363]"
                          }`}
                        style={{ fontFamily: "'Clash Display', sans-serif" }}
                      >
                        {opt.title}
                      </span>
                      <p
                        className={`text-sm md:text-base leading-[140%] transition-colors font-normal ${isActive ? "text-black" : "text-[#636363]"
                          }`}
                      >
                        {opt.description}
                      </p>
                    </div>

                    {/* Right Chevron Down Icon (mobile only, visible when not active) */}
                    {!isActive && (
                      <div className="lg:hidden shrink-0 ml-2 mt-1">
                        <ChevronDownIcon />
                      </div>
                    )}
                  </button>

                  {/* Mobile Active Diagram Box (rendered directly below active item header) */}
                  {isActive && (
                    <div id={`accordion-panel-${opt.id}`} role="region" aria-labelledby={`accordion-btn-${opt.id}`} className="lg:hidden mt-6 w-full bg-[#F6F7F9] rounded-t-[8px] aspect-[828/611] flex flex-col items-center justify-center p-6 relative overflow-hidden">
                      <div className="relative w-full h-[200px] sm:h-[260px] flex flex-col items-center justify-center">
                        <div className="relative w-[150px] sm:w-[200px] h-[200px] sm:h-[260px]">
                          <Image
                            src={wheelSizeImg}
                            alt={`Wheel Size ${opt.title}`}
                            fill
                            className="object-contain"
                          />
                        </div>
                      </div>

                      {/* Bottom Progress Bar */}
                      <div className="absolute bottom-0 inset-x-0 h-0.5 md:h-1 bg-neutral-200">
                        <div
                          className="h-full bg-neutral-800 transition-all duration-300"
                          style={{
                            width: `${((index + 1) / WHEEL_SIZE_OPTIONS.length) * 100
                              }%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Desktop Right Column: Wheel Size Diagram Box */}
          <div className="hidden lg:flex lg:col-span-6 w-full bg-[#F6F7F9] rounded-t-[16px] rounded-b-none aspect-[828/611] flex-col items-center justify-center p-6 md:p-12 relative overflow-hidden">
            <div className="relative w-full h-[240px] sm:h-[300px] flex flex-col items-center justify-center">
              <div className="relative w-[180px] sm:w-[230px] h-[260px] sm:h-[320px]">
                <Image
                  src={wheelSizeImg}
                  alt={`Wheel Size ${activeOption.title}`}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            {/* Bottom Progress Bar */}
            <div className="absolute bottom-0 inset-x-0 h-1 bg-neutral-200">
              <div
                className="h-full bg-neutral-800 transition-all duration-300"
                style={{
                  width: `${((WHEEL_SIZE_OPTIONS.findIndex(
                    (o) => o.id === activeSizeId
                  ) +
                    1) /
                    WHEEL_SIZE_OPTIONS.length) *
                    100
                    }%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Bottom Banner Card */}
        <div className="w-full bg-[#EAFBFF] border border-[#80E5FF] rounded-[8px] p-5 md:py-6 md:px-8 flex flex-col lg:flex-row items-center justify-between gap-5 md:gap-6">
          <div className="flex flex-col gap-2 text-base md:text-lg font-normal text-black text-center md:text-start">
            <div>
              <span className="font-semibold text-black">Smaller wheels</span>
              <span> = </span>
              <span>slower, easier to control, best for technical/street</span>
            </div>
            <div className="h-[1px] bg-[#0000001A] w-full" />
            <div>
              <span className="font-semibold text-black">Larger wheels</span>
              <span> = </span>
              <span>faster, more balanced, best for cruising or vert.</span>
            </div>
          </div>

          <Link
            href={getLocalizedPath("/store/skateboard-completes", locale)}
            className="hidden md:flex w-full lg:w-auto bg-black text-white px-6 py-3.5 md:px-10 md:py-6 rounded-[4px] text-base font-semibold uppercase tracking-wider hover:bg-neutral-800 transition-colors shrink-0 justify-center"
            style={{ fontFamily: "'Clash Display', sans-serif" }}
          >
            SHOP COMPLETE SKATEBOARDS
          </Link>
        </div>

        <Link
          href={getLocalizedPath("/store/skateboard-completes", locale)}
          className="flex md:hidden w-full lg:w-auto bg-black text-white px-6 py-3.5 rounded-[4px] text-base justify-center font-semibold uppercase tracking-wider hover:bg-neutral-800 transition-colors shrink-0"
          style={{ fontFamily: "'Clash Display', sans-serif" }}
        >
          SHOP COMPLETE SKATEBOARDS
        </Link>
      </div>
    </section>
  );
}

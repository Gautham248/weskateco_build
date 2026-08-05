"use client";

import skateToolImg from "components/icons/skateboard_guide/skate_tool.png";
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

const MAINTENANCE_ITEMS = [
  {
    id: "skate-tool",
    label: "Allen tool / skate tool",
    image: skateToolImg,
    alt: "Allen tool / Skate tool Diagram",
  },
  {
    id: "bearing-lube",
    label: "Bearing lube every few weeks",
    image: skateToolImg,
    alt: "Bearing Lube Maintenance Diagram",
  },
  {
    id: "griptape-cleaner",
    label: "Grip tape cleaner (or a hard brush)",
    image: skateToolImg,
    alt: "Grip Tape Cleaner Maintenance Diagram",
  },
];

export default function WhatAboutMaintenanceSection() {
  const [activeItemId, setActiveItemId] = useState("skate-tool");

  const activeItem =
    MAINTENANCE_ITEMS.find((item) => item.id === activeItemId) ||
    MAINTENANCE_ITEMS[0]!;

  return (
    <section className="w-full bg-white text-black py-10 md:py-24 overflow-hidden">
      <div className="mx-auto max-w-(--breakpoint-2xl) px-4 lg:px-15 flex flex-col gap-6 md:gap-10">
        {/* Top Header Block */}
        <div className="flex flex-col gap-4 max-w-2xl">
          <h2
            className="text-2xl md:text-[45px] font-bold tracking-[-1%] text-black uppercase leading-[100%] md:leading-[80%]"
            style={{ fontFamily: "'Clash Display', sans-serif" }}
          >
            WHAT ABOUT <br /> MAINTENANCE?
          </h2>
          <p className="text-sm md:text-xl text-black font-[400] leading-[140%] max-w-[32rem]">
            It's easier than it looks. Here's what you'll need:
          </p>
        </div>

        {/* Main Content Grid: Left List + Right Diagram Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start lg:items-center">
          {/* Left Column: Interactive Maintenance Items List / Accordion on Mobile */}
          <div className="lg:col-span-6 flex flex-col divide-y divide-neutral-100 border-b border-neutral-100 lg:border-b-0 lg:divide-y-0 lg:gap-8">
            {MAINTENANCE_ITEMS.map((item, index) => {
              const isActive = item.id === activeItemId;
              return (
                <div key={item.id} className="py-4 lg:py-0 flex flex-col">
                  <button
                    onClick={() => setActiveItemId(item.id)}
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
                        {item.label}
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
                  {
                    isActive && (
                      <div className="lg:hidden mt-6 w-full bg-[#F6F7F9] rounded-t-[8px] aspect-[828/611] flex flex-col items-center justify-center p-6 relative overflow-hidden">
                        <div className="relative w-full h-full max-w-[200px] sm:max-w-[260px] flex items-center justify-center">
                          <Image
                            src={item.image}
                            alt={item.alt}
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
                              width: `${((index + 1) / MAINTENANCE_ITEMS.length) * 100
                                }%`,
                            }}
                          />
                        </div>
                      </div>
                    )
                  }
                </div>
              );
            })}
          </div>

          {/* Desktop Right Column: Maintenance Diagram Box */}
          <div className="hidden lg:flex lg:col-span-6 w-full bg-[#F6F7F9] rounded-t-[16px] rounded-b-none aspect-[828/611] flex-col items-center justify-center p-6 md:p-12 relative overflow-hidden">
            <div className="relative w-full h-full max-w-[260px] sm:max-w-[320px] flex items-center justify-center">
              <Image
                src={activeItem.image}
                alt={activeItem.alt}
                fill
                className="object-contain"
                priority
              />
            </div>
            {/* Bottom Indicator bar */}
            <div className="absolute bottom-0 inset-x-0 h-1 bg-neutral-200">
              <div
                className="h-full bg-neutral-800 transition-all duration-300"
                style={{
                  width: `${((MAINTENANCE_ITEMS.findIndex((i) => i.id === activeItemId) +
                    1) /
                    MAINTENANCE_ITEMS.length) *
                    100
                    }%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Bottom Banner Card */}
        <div className="w-full bg-[#EAFBFF] border border-[#80E5FF] rounded-[8px] p-5 md:py-6 md:px-8 flex flex-col lg:flex-row items-center justify-between gap-5 md:gap-6">
          {/* Highlights List */}
          <div className="flex flex-col gap-2 text-base md:text-lg font-normal text-black max-w-xl text-center md:text-start">
            <span>
              All our parts are standard size — easy to replace or upgrade
            </span>
            <div className="h-[1px] bg-[#00000033] w-full" />
            <span className="text-black">
              Message us on Whatsapp if you ever get stuck.
            </span>
          </div>

          {/* WhatsApp / Phone Button */}
          <Link
            href="tel:+917204593003"
            className="hidden md:flex w-full lg:w-auto bg-black text-white px-6 py-3.5 md:px-10 md:py-6 rounded-[4px] text-xs md:text-base font-semibold uppercase tracking-wider hover:bg-neutral-800 transition-colors shrink-0 justify-center"
            style={{ fontFamily: "'Clash Display', sans-serif" }}
          >
            (+91) 7204593003
          </Link>
        </div>

        <Link
          href="tel:+917204593003"
          className="flex md:hidden w-full lg:w-auto bg-black text-white px-6 py-3.5 rounded-[4px] text-base justify-center font-semibold uppercase tracking-wider hover:bg-neutral-800 transition-colors shrink-0"
          style={{ fontFamily: "'Clash Display', sans-serif" }}
        >
          (+91) 7204593003
        </Link>
      </div>
    </section >
  );
}

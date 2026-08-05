"use client";

import skateToolImg from "components/icons/skateboard_guide/skate_tool.png";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { GreenArrowIcon } from "./icons";

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
    <section className="w-full bg-white text-black py-16 md:py-24 overflow-hidden">
      <div className="mx-auto max-w-(--breakpoint-2xl) px-4 lg:px-15 flex flex-col gap-6 md:gap-10">
        {/* Top Header Block */}
        <div className="flex flex-col gap-4 max-w-2xl">
          <h2
            className="text-2xl md:text-[45px] font-bold tracking-[-1%] text-black uppercase leading-[80%]"
            style={{ fontFamily: "'Clash Display', sans-serif" }}
          >
            WHAT ABOUT <br /> MAINTENANCE?
          </h2>
          <p className="text-sm md:text-xl text-black font-[400] leading-[140%] max-w-[32rem]">
            It's easier than it looks. Here's what you'll need:
          </p>
        </div>

        {/* Main Content Grid: Left List + Right Diagram Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Interactive Maintenance Items List */}
          <div className="lg:col-span-6 flex flex-col gap-5 md:gap-12">
            {MAINTENANCE_ITEMS.map((item) => {
              const isActive = item.id === activeItemId;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveItemId(item.id)}
                  aria-label={`Show ${item.label}`}
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
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Column: Maintenance Diagram Box */}
          <div className="lg:col-span-6 w-full bg-[#F6F7F9] rounded-t-[16px] rounded-b-none aspect-[828/611] flex flex-col items-center justify-center p-6 md:p-12 relative overflow-hidden">
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
        <div className="w-full bg-[#EAFBFF] border border-[#80E5FF] rounded-[8px] px-4 py-4 md:py-6 md:px-8 flex flex-col lg:flex-row items-center justify-between gap-4 md:gap-6">
          {/* Highlights List */}
          <div className="flex flex-col gap-2 text-sm md:text-base font-normal text-black max-w-xl">
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
            className="inline-flex w-full lg:w-auto bg-black text-white px-6 py-3.5 md:px-10 md:py-6 rounded-[4px] text-xs md:text-sm font-semibold uppercase tracking-wider hover:bg-neutral-800 transition-colors shrink-0 items-center justify-center"
            style={{ fontFamily: "'Clash Display', sans-serif" }}
          >
            (+91) 7204593003
          </Link>
        </div>
      </div>
    </section>
  );
}

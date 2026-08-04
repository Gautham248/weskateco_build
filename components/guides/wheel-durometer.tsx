"use client";

import durometerImg from "components/icons/skateboard_guide/durometer.png";
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

const DUROMETER_OPTIONS = [
  {
    id: "78a-87a",
    titleA: "78a–87a",
    titleB: "98b–100b",
    description:
      "Soft wheel, good for rough surfaces, longboards, or street boards that need lots of grip to roll over cracks and pebbles.",
  },
  {
    id: "88a-95a",
    titleA: "88a–95a",
    titleB: "101b–103b",
    description:
      "Slightly harder and faster with a little less grip, but the grip's still good. Good for street and rough surfaces.",
  },
  {
    id: "96a-99a",
    titleA: "96a–99a",
    titleB: "104b–105b",
    description:
      "Nice speed and grip — an all-around good wheel. Great for beginners skating street, skate parks, ramps, and pools.",
  },
  {
    id: "101a-plus",
    titleA: "101a+",
    titleB: "106b+",
    description:
      "Hardest and fastest wheel with the least grip. Ineffective on slick and rough surfaces. These are pro wheels.",
  },
];

export default function WheelDurometerSection() {
  const [scale, setScale] = useState<"A" | "B">("A");
  const [activeItemId, setActiveItemId] = useState("78a-87a");

  return (
    <section className="w-full bg-white text-black py-16 md:py-24 overflow-hidden">
      <div className="mx-auto max-w-(--breakpoint-2xl) px-4 lg:px-15 flex flex-col gap-6 md:gap-10">
        {/* Top Header Block with Scale Toggle */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 w-full">
          <div className="flex flex-col gap-4">
            <span className="text-xs md:text-base font-medium tracking-[-1%] text-[#00000080] uppercase">
              01 — DIAMETER
            </span>
            <h2
              className="text-2xl md:text-[45px] font-bold tracking-[-1%] text-black uppercase leading-none"
              style={{ fontFamily: "'Clash Display', sans-serif" }}
            >
              WHEEL DUROMETER
            </h2>
            <p className="text-sm md:text-lg text-black font-normal leading-[140%] max-w-[50vw]">
              The hardness, or durometer, of a wheel determines how much grip
              it has and how much shock it absorbs. Softer wheels compress more,
              giving more grip and shock absorption; harder wheels compress
              less, giving less grip but more responsiveness — which is why
              most street and transition skaters prefer harder wheels.
            </p>
          </div>

          {/* A Scale / B Scale Toggle Pill */}
          <div className="flex items-center bg-[#F1F2F4] p-1 rounded-full shrink-0">
            <button
              onClick={() => setScale("A")}
              className={`px-4 py-3 rounded-full text-xs md:text-xs font-semibold uppercase transition-all cursor-pointer ${scale === "A"
                ? "bg-black text-white"
                : "text-neutral-600 hover:text-black"
                }`}
              style={{ fontFamily: "'Clash Display', sans-serif" }}
            >
              A SCALE
            </button>
            <button
              onClick={() => setScale("B")}
              className={`px-4 py-3 rounded-full text-xs md:text-xs font-semibold uppercase transition-all cursor-pointer ${scale === "B"
                ? "bg-black text-white"
                : "text-neutral-600 hover:text-black"
                }`}
              style={{ fontFamily: "'Clash Display', sans-serif" }}
            >
              B SCALE
            </button>
          </div>
        </div>

        {/* Main Content Grid: Left Diagram Display + Right Interactive List */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Durometer Meter Diagram Box */}
          <div className="lg:col-span-6 w-full bg-[#F6F7F9] rounded-t-[16px] rounded-b-none aspect-[828/611] flex flex-col items-center justify-center p-6 md:p-12 relative overflow-hidden">
            <div className="relative w-full h-[240px] sm:h-[320px] flex items-center justify-center">
              <div className="relative w-[320px] sm:w-[440px] aspect-[537/349]">
                <Image
                  src={durometerImg}
                  alt="Wheel Durometer Meter Diagram"
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
                  width: `${((DUROMETER_OPTIONS.findIndex(
                    (o) => o.id === activeItemId
                  ) +
                    1) /
                    DUROMETER_OPTIONS.length) *
                    100
                    }%`,
                }}
              />
            </div>
          </div>

          {/* Right Column: Interactive Size Items List */}
          <div className="lg:col-span-6 flex flex-col gap-6 md:gap-8">
            {DUROMETER_OPTIONS.map((opt) => {
              const isActive = opt.id === activeItemId;
              const title = scale === "A" ? opt.titleA : opt.titleB;
              return (
                <button
                  key={opt.id}
                  onClick={() => setActiveItemId(opt.id)}
                  className="flex items-start text-left transition-colors cursor-pointer group"
                >
                  {/* Arrow Circle Badge */}
                  {/* <div
                    className={`transition-all duration-300 ease-out overflow-hidden flex items-center justify-center shrink-0 rounded-full bg-[#CCFF02] mt-1 ${
                      isActive
                        ? "w-7 h-7 opacity-100 scale-100 mr-3 md:mr-4"
                        : "w-0 h-7 opacity-0 scale-75 mr-0"
                    }`}
                  >
                    <GreenArrowIcon />
                  </div> */}

                  {/* Text Details */}
                  <div className="flex flex-col gap-1">
                    <span
                      className={`text-xl md:text-[28px] leading-[120%] tracking-[-2%] transition-colors font-medium ${isActive ? "text-black" : "text-[#636363]"
                        }`}
                      style={{ fontFamily: "'Clash Display', sans-serif" }}
                    >
                      {title}
                    </span>
                    <p
                      className={`text-sm md:text-base leading-[140%] transition-colors font-normal ${isActive ? "text-black" : "text-[#636363]"
                        }`}
                    >
                      {opt.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Banner Card */}
        <div className="w-full bg-[#EAFBFF] border border-[#80E5FF] rounded-[8px] px-4 py-4 md:py-6 md:px-8 flex flex-col lg:flex-row items-center justify-between gap-4 md:gap-6">
          <div className="flex flex-col gap-2 text-sm md:text-base font-normal text-black max-w-2xl">
            <span>
              Soft wheels give a very smooth ride, but{" "}
              <strong className="font-bold">
                hard wheels are preferred by most street and transition skaters
              </strong>{" "}
              for their responsiveness.
            </span>
          </div>

          <button
            className="w-full lg:w-auto bg-black text-white px-6 py-3.5 md:px-10 md:py-6 rounded-[4px] text-xs md:text-sm font-semibold uppercase tracking-wider hover:bg-neutral-800 transition-colors shrink-0"
            style={{ fontFamily: "'Clash Display', sans-serif" }}
          >
            SHOP SKATEBOARD DECK
          </button>
        </div>
      </div>
    </section>
  );
}

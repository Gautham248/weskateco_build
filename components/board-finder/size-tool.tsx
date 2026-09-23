"use client";

import { BANDS, STOCK } from "lib/board-finder/data";
import type { Unit } from "./board-finder-page";

interface Props {
  unit: Unit;
  setUnit: (u: Unit) => void;
  bandIndex: number;
  setBandIndex: (i: number) => void;
}

// Concave explainer cards — static content.
const CONCAVE_CARDS = [
  {
    name: "Mellow concave",
    badge: null as string | null,
    subtitle: "The shallowest curve",
    text: "A shallower curve. More of your sole makes contact, so it's more comfortable to stand on for long stretches and more forgiving while you're still working out where your feet go.",
    bullets: [
      "Learning to ride, pushing, cruising.",
      "Long sessions where comfort beats leverage.",
      "On every beginner complete — and on pro decks and pro completes too, in every width.",
    ],
    muted: false,
  },
  {
    name: "Mellow–Medium concave",
    badge: "Coming soon",
    subtitle: "Between the two",
    text: "A shallower dish than Medium, a deeper one than Mellow. Enough edge to brace a flick against, without the pronounced curve that makes a board tiring to stand on for an hour.",
    bullets: [
      "Mellow feels too flat to flick off.",
      "Medium feels like too much underfoot.",
      "You don't yet know which camp you're in.",
      "Not out yet — Mellow and Medium are what ships today.",
    ],
    muted: false,
  },
  {
    name: "Medium concave",
    badge: null,
    subtitle: "The deeper curve",
    text: "A steeper curve at the rails. Your foot locks against the edge instead of resting on a flat, which is where flick comes from — the board turns with your ankle rather than waiting for it.",
    bullets: [
      "Flip tricks and technical street.",
      "Transition, where you want the board reacting fast.",
      "The one you can only get on a pro deck or pro complete.",
    ],
    muted: false,
  },
  {
    name: "Deep concave",
    badge: "Not stocked",
    subtitle: "The steep end",
    text: "Steeper walls again, so your feet are held almost in position rather than resting on the board. Riders who want maximum feedback from a flick swear by it; plenty of others find it tiring and hard to shuffle their feet on. Widely available from other brands — we just don't make one.",
    bullets: [
      "A strong preference rather than a progression — deeper isn't better.",
      "Worth trying on someone else's board before buying one.",
      "If Medium already feels like a lot, this will feel like more.",
    ],
    muted: true,
  },
];

// Ruler: 7″ to 9″ in 0.25″ steps.
const TICKS = Array.from({ length: 9 }, (_, i) => 7 + i * 0.25);

export default function SizeToolSection({
  unit,
  setUnit,
  bandIndex,
  setBandIndex,
}: Props) {
  const band = BANDS[bandIndex]!;

  return (
    <>
      <section className="w-full bg-white text-black py-10 md:py-24 overflow-hidden">
        <div className="mx-auto max-w-(--breakpoint-2xl) px-4 lg:px-15 flex flex-col gap-6 md:gap-10">
          {/* Header with unit toggle */}
          <div className="flex flex-row items-center justify-between gap-4 w-full">
            <div className="flex flex-col gap-3 md:gap-4 max-w-2xl">
              <h2
                className="text-2xl md:text-[45px] font-bold tracking-[-1%] text-black uppercase leading-none md:leading-[80%]"
                style={{ fontFamily: "'Clash Display', sans-serif" }}
              >
                What size deck should I get?
              </h2>
              <p className="text-sm md:text-xl text-black font-[400] leading-[140%]">
                Width follows the foot. Pick your shoe size band.
              </p>
            </div>

            <div
              className="inline-flex rounded-[4px] border border-neutral-200 p-1 gap-1 shrink-0"
              role="group"
              aria-label="Shoe size unit"
            >
              {(["UK", "US"] as const).map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => setUnit(u)}
                  aria-pressed={unit === u}
                  className={`px-4 py-2 text-xs md:text-sm font-semibold uppercase tracking-wider rounded-[4px] transition-colors cursor-pointer ${
                    unit === u
                      ? "bg-black text-white"
                      : "text-black hover:bg-neutral-100"
                  }`}
                  style={{ fontFamily: "'Clash Display', sans-serif" }}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">
            {/* Band list */}
            <div
              className="lg:col-span-5 flex flex-col divide-y divide-neutral-100 border-y border-neutral-100"
              role="listbox"
              aria-label="Shoe size bands"
            >
              {BANDS.map((b, i) => {
                const isActive = i === bandIndex;
                return (
                  <button
                    key={b.id}
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    onClick={() => setBandIndex(i)}
                    className={`flex items-center justify-between gap-4 w-full text-left py-4 px-4 transition-colors cursor-pointer ${
                      isActive ? "bg-[#CCFF02]" : "hover:bg-[#F7F7F9]"
                    }`}
                  >
                    <span
                      className="text-base md:text-lg font-semibold text-black uppercase tracking-[-1%]"
                      style={{ fontFamily: "'Clash Display', sans-serif" }}
                    >
                      {unit === "UK" ? b.uk : b.us}
                    </span>
                    <span className="text-sm text-black font-medium whitespace-nowrap">
                      {b.lo}″–{b.hi}″
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Ruler panel */}
            <div className="lg:col-span-7 bg-[#F7F7F9] rounded-[16px] border border-neutral-100/80 p-6 md:p-8 flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <span
                  className="text-2xl md:text-[45px] font-bold tracking-[-1%] text-black leading-none"
                  style={{ fontFamily: "'Clash Display', sans-serif" }}
                >
                  {band.lo}″ – {band.hi}″
                </span>
                <span className="text-sm md:text-base text-neutral-500">
                  {band.rider}
                </span>
              </div>

              {/* Number line 7″ → 9″ */}
              <div className="flex flex-col gap-2">
                <div className="relative h-10">
                  {/* Highlight range */}
                  <div
                    className="absolute top-4 h-2 bg-[#CCFF02] rounded-full"
                    style={{
                      left: `${((band.lo - 7) / 2) * 100}%`,
                      width: `${((band.hi - band.lo) / 2) * 100}%`,
                    }}
                  />
                  {/* Base line */}
                  <div className="absolute top-[18px] left-0 right-0 h-0.5 bg-neutral-300 rounded-full" />
                  {/* Ticks */}
                  {TICKS.map((tick) => (
                    <div
                      key={tick}
                      className="absolute top-3 w-0.5 h-4 bg-neutral-400 rounded-full"
                      style={{ left: `${((tick - 7) / 2) * 100}%` }}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-xs text-neutral-500">
                  <span>7″</span>
                  <span>8″</span>
                  <span>9″</span>
                </div>
              </div>

              {/* Stock chips */}
              <div className="flex flex-wrap gap-2">
                {STOCK.map((width) => {
                  const inRange = width >= band.lo && width <= band.hi;
                  return (
                    <span
                      key={width}
                      className={`rounded-full px-3 py-1 text-xs md:text-sm font-semibold border transition-colors ${
                        inRange
                          ? "bg-black text-white border-black"
                          : "bg-white text-neutral-400 border-neutral-200"
                      }`}
                      style={{ fontFamily: "'Clash Display', sans-serif" }}
                    >
                      {width}″
                    </span>
                  );
                })}
              </div>

              {/* Band note */}
              <p className="text-sm md:text-base text-black leading-[150%] font-[400]">
                {band.note}
              </p>
            </div>
          </div>

          {/* Footnotes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="bg-[#F7F7F9] rounded-[16px] border border-neutral-100/80 p-5 md:p-6">
              <h3
                className="text-base md:text-lg font-bold uppercase tracking-[-1%] text-black mb-2"
                style={{ fontFamily: "'Clash Display', sans-serif" }}
              >
                Narrower
              </h3>
              <p className="text-sm md:text-base text-black leading-[150%] font-[400]">
                Lighter underfoot and quicker to flip. Easier for small feet and
                tricks on flat ground.
              </p>
            </div>
            <div className="bg-[#F7F7F9] rounded-[16px] border border-neutral-100/80 p-5 md:p-6">
              <h3
                className="text-base md:text-lg font-bold uppercase tracking-[-1%] text-black mb-2"
                style={{ fontFamily: "'Clash Display', sans-serif" }}
              >
                Wider
              </h3>
              <p className="text-sm md:text-base text-black leading-[150%] font-[400]">
                More foot space and more stable at speed — better for cruising,
                ramps and bowls.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Concave explainer */}
      <section className="w-full bg-[#F7F7F9] text-black py-10 md:py-24 overflow-hidden">
        <div className="mx-auto max-w-(--breakpoint-2xl) px-4 lg:px-15 flex flex-col gap-6 md:gap-10">
          <div className="flex flex-col gap-3 md:gap-4 max-w-2xl">
            <h2
              className="text-2xl md:text-[45px] font-bold tracking-[-1%] text-black uppercase leading-none md:leading-[80%]"
              style={{ fontFamily: "'Clash Display', sans-serif" }}
            >
              What&apos;s concave?
            </h2>
            <p className="text-sm md:text-xl text-black font-[400] leading-[140%]">
              The dish across the board — how curved the deck is underfoot.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-stretch">
            {CONCAVE_CARDS.map((card) => (
              <div
                key={card.name}
                className={`bg-white rounded-[20px] p-6 md:p-8 flex flex-col gap-4 border transition-shadow hover:shadow-md ${
                  card.muted
                    ? "border-neutral-200 opacity-60"
                    : "border-neutral-100/80"
                }`}
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3
                      className="text-lg md:text-[24px] font-semibold tracking-[-1%] text-black uppercase leading-[110%]"
                      style={{ fontFamily: "'Clash Display', sans-serif" }}
                    >
                      {card.name}
                    </h3>
                    {card.badge && (
                      <span
                        className={`rounded-full px-3 py-1 text-[10px] md:text-xs font-bold uppercase tracking-wider ${
                          card.muted
                            ? "bg-neutral-100 text-neutral-500 border border-neutral-200"
                            : "bg-[#CCFF02] text-black"
                        }`}
                        style={{ fontFamily: "'Clash Display', sans-serif" }}
                      >
                        {card.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-neutral-500">
                    {card.subtitle}
                  </span>
                </div>

                <p className="text-sm md:text-base text-black leading-[150%] font-[400]">
                  {card.text}
                </p>

                <ul className="flex flex-col gap-2 mt-auto">
                  {card.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-3 items-start">
                      <span className="w-2 h-2 rounded-full bg-[#CCFF02] mt-2 shrink-0" />
                      <span className="text-sm text-black leading-[150%] font-[400]">
                        {bullet}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

"use client";

import { useState } from "react";
import { WEAR, WEAR_SECTION } from "lib/deck-guide/data";
import { PanelKicker, SectionHeader, SpecList } from "./ui";

const CLASH = { fontFamily: "'Clash Display', sans-serif" };

export default function WearSection() {
  const [active, setActive] = useState(0);
  const w = WEAR[active]!;

  return (
    <section
      id="wear"
      className="w-full bg-white text-black py-10 md:py-24 overflow-hidden scroll-mt-[136px]"
    >
      <div className="mx-auto max-w-(--breakpoint-2xl) px-4 lg:px-15 flex flex-col gap-6 md:gap-10">
        <SectionHeader
          kicker={WEAR_SECTION.kicker}
          title={WEAR_SECTION.title}
          intro={WEAR_SECTION.intro}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Symptom picker */}
          <div
            role="group"
            aria-label="Which symptom to inspect"
            className="lg:col-span-4 flex flex-col gap-2"
          >
            {WEAR.map((item, i) => {
              const isActive = i === active;
              return (
                <button
                  key={item.n}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActive(i)}
                  className={`text-left rounded-[12px] p-4 flex flex-col gap-1 border-2 transition-colors cursor-pointer ${
                    isActive
                      ? "border-black bg-[#CCFF02]/30"
                      : "border-neutral-200 bg-white hover:border-black"
                  }`}
                >
                  <span
                    className="text-sm md:text-base font-bold tracking-[-1%] uppercase leading-[110%] text-black"
                    style={CLASH}
                  >
                    {item.t}
                  </span>
                  <span className="text-xs md:text-sm text-neutral-600">
                    {item.n}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Detail panel */}
          <div className="lg:col-span-8 bg-[#F7F7F9] rounded-[16px] p-5 md:p-8 flex flex-col gap-3">
            <PanelKicker>
              Symptom {String(active + 1).padStart(2, "0")} of 0{WEAR.length}
            </PanelKicker>
            <h3
              className="text-xl md:text-[32px] font-bold tracking-[-1%] uppercase leading-none text-black"
              style={CLASH}
            >
              {w.n}
            </h3>
            <p className="text-sm md:text-lg text-black font-[400] leading-[150%]">
              {w.what}
            </p>
            <p className="text-sm md:text-lg text-black font-[400] leading-[150%]">
              {w.cause}
            </p>
            <span
              className={`inline-flex items-center self-start mt-1 px-4 py-2 rounded-[4px] text-sm font-semibold uppercase tracking-wider ${
                w.fatal ? "bg-black text-white" : "bg-[#CCFF02] text-black"
              }`}
              style={CLASH}
            >
              {w.verdict}
            </span>
            <SpecList spec={w.spec} />
          </div>
        </div>
      </div>
    </section>
  );
}

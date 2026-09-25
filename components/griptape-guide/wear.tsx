"use client";

import { WEAR, WEAR_NOTE, WEAR_SECTION } from "lib/griptape-guide/data";
import { useState } from "react";
import {
  Note,
  PanelKicker,
  SectionHeader,
  Container,
  Section,
  GRID_CLASS,
} from "components/guides/ui";

const CLASH = { fontFamily: "'Clash Display', sans-serif" };

export default function WearSection() {
  const [selected, setSelected] = useState(0);
  const mode = WEAR[selected]!;

  return (
    <Section id="wear">
      <Container>
        <SectionHeader
          kicker={WEAR_SECTION.kicker}
          title={WEAR_SECTION.title}
          intro={WEAR_SECTION.intro}
        />

        <div className={GRID_CLASS}>
          {/* Failure mode picker */}
          <div
            role="group"
            aria-label="Failure modes"
            className="lg:col-span-4 flex flex-col gap-3"
          >
            {WEAR.map((w, i) => {
              const isActive = i === selected;
              return (
                <button
                  key={w.name}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setSelected(i)}
                  className={`flex items-center gap-3 border-2 px-4 py-3 rounded-4 text-left cursor-pointer transition-colors ${
                    isActive
                      ? "border-black bg-neutral-100"
                      : "border-neutral-300 bg-white hover:border-black"
                  }`}
                >
                  <span
                    className={`text-xs font-bold ${isActive ? "text-black" : "text-neutral-500"}`}
                    style={CLASH}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex flex-col">
                    <span
                      className="text-sm font-semibold uppercase tracking-wider text-black"
                      style={CLASH}
                    >
                      {w.name}
                    </span>
                    <span className="text-xs text-neutral-500">{w.status}</span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Detail panel */}
          <div className="lg:col-span-8 flex flex-col gap-4 bg-[#F7F7F9] rounded-[16px] p-5 md:p-8">
            <PanelKicker>
              Failure {String(selected + 1).padStart(2, "0")} of 05
            </PanelKicker>
            <div className="flex flex-wrap items-center gap-3">
              <h3
                className="text-xl md:text-[32px] font-bold tracking-[-1%] uppercase leading-none"
                style={CLASH}
              >
                {mode.name}
              </h3>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                  mode.fatal
                    ? "bg-black text-white"
                    : "bg-white text-black border border-black"
                }`}
                style={CLASH}
              >
                {mode.status}
              </span>
            </div>
            <p className="text-sm md:text-lg text-black font-[400] leading-[150%]">
              {mode.text}
            </p>
          </div>
        </div>

        <Note text={WEAR_NOTE} />
      </Container>
    </Section>
  );
}

"use client";

import {
  Container,
  Note,
  PanelKicker,
  ProseCols,
  Section,
  SectionHeader,
} from "components/guides/ui";
import {
  SURF_MOVES,
  SURF_NOTE,
  SURF_PROSE,
  SURF_SECTION,
  SURF_STOCKED,
} from "lib/surfskate-guide/data";
import { useState } from "react";
import { Stocked } from "./bits";

const CLASH = { fontFamily: "'Clash Display', sans-serif" };

export default function SurfingSection() {
  const [active, setActive] = useState(0);
  const move = SURF_MOVES[active] ?? SURF_MOVES[0]!;

  return (
    <Section id="surf" bg="muted">
      <Container>
        <SectionHeader
          kicker={SURF_SECTION.kicker}
          title={SURF_SECTION.title}
          intro={SURF_SECTION.intro}
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[290px_1fr] lg:items-start">
          {/* Movement list */}
          <div
            role="group"
            aria-label="Choose a movement"
            className="flex flex-col gap-2"
          >
            {SURF_MOVES.map((m, index) => {
              const isActive = index === active;
              return (
                <button
                  key={m.name}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActive(index)}
                  className={`flex items-center gap-3 rounded-4 border px-4 py-3.5 text-left transition-colors cursor-pointer ${
                    isActive
                      ? "border-black bg-black text-white"
                      : "border-neutral-300 bg-white text-black hover:border-black"
                  }`}
                >
                  <span
                    aria-hidden
                    className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                      isActive ? "bg-white" : "bg-neutral-400"
                    }`}
                  />
                  <span
                    className="text-sm font-bold tracking-[-1%] md:text-base"
                    style={CLASH}
                  >
                    {m.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Detail panel */}
          <div className="overflow-hidden rounded-[16px] border border-neutral-200 bg-white">
            <div className="border-b border-neutral-100 bg-[#F7F7F9] px-5 py-5 md:px-8 md:py-6">
              <PanelKicker>
                Movement {String(active + 1).padStart(2, "0")}
              </PanelKicker>
              <h3
                className="mt-1.5 text-xl font-bold tracking-[-1%] uppercase leading-none text-black md:text-[32px]"
                style={CLASH}
              >
                {move.name}
              </h3>
            </div>
            <div className="flex flex-col gap-4 px-5 py-5 md:px-8 md:py-6">
              {move.body.split("\n\n").map((paragraph, i) => (
                <p
                  key={i}
                  className="text-sm md:text-base text-black font-[400] leading-[160%]"
                >
                  {paragraph}
                </p>
              ))}
              <span
                className={`mt-1 inline-flex w-fit items-center rounded-4 px-3 py-1.5 text-xs font-bold uppercase tracking-wider ${
                  move.verdict === "negative"
                    ? "bg-black text-white"
                    : "border border-black bg-white text-black"
                }`}
                style={CLASH}
              >
                {move.verdictLabel}
              </span>
            </div>
          </div>
        </div>

        <Note text={SURF_NOTE} />

        <ProseCols items={SURF_PROSE} tone="plain" />

        <Stocked text={SURF_STOCKED} />
      </Container>
    </Section>
  );
}

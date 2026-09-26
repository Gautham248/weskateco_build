"use client";

import {
  EXPLODED_CARD,
  PARTS_SECTION,
  TRUCK_PARTS,
} from "lib/truck-guide/data";
import { useState } from "react";
import {
  FigCaption,
  FigCard,
  FigHint,
  PanelKicker,
  PendingCard,
  PendingNote,
  SectionHeader,
  Seg,
  SpecList,
  Container,
  Section,
  GRID_CLASS,
} from "components/guides/ui";

// Hotspot button positions, as % centres over the front-view drawing
// (viewBox 0 0 560 340). Dashed hotspots mark the parts hidden inside
// an assembled truck: 2 pivot cup, 4 boardside bushing, 6 washers.
const HOTSPOTS: Record<
  number,
  { left: string; top: string; hidden?: boolean }
> = {
  1: { left: "27.9%", top: "15%" },
  2: { left: "38.2%", top: "25.3%", hidden: true },
  3: { left: "56.8%", top: "64.7%" },
  4: { left: "58.9%", top: "24.7%", hidden: true },
  5: { left: "50%", top: "56.8%" },
  6: { left: "40.4%", top: "54.7%", hidden: true },
  7: { left: "26.8%", top: "41.2%" },
  8: { left: "78.6%", top: "41.2%" },
  9: { left: "90%", top: "41.2%" },
};

/** Front view of an assembled truck, wheels removed — reference drawing
 * standing in for the assembled photograph. */
function TruckFrontView({ selected }: { selected: number }) {
  return (
    <svg
      viewBox="0 0 560 340"
      className="w-full h-auto"
      role="img"
      aria-label={PARTS_SECTION.assembledAlt}
    >
      {/* Hanger arms (behind the centre body) */}
      <rect
        x="96"
        y="126"
        width="368"
        height="28"
        rx="8"
        fill="#EDEEF0"
        stroke="#000000"
        strokeWidth="4"
      />
      {selected === 7 && (
        <rect
          x="96"
          y="126"
          width="368"
          height="28"
          rx="8"
          className="fill-black"
          opacity="0.45"
        />
      )}

      {/* Hanger centre body */}
      <rect
        x="236"
        y="96"
        width="88"
        height="82"
        rx="10"
        fill="#EDEEF0"
        stroke="#000000"
        strokeWidth="4"
      />
      {selected === 7 && (
        <rect
          x="236"
          y="96"
          width="88"
          height="82"
          rx="10"
          className="fill-black"
          opacity="0.45"
        />
      )}

      {/* Baseplate */}
      <rect
        x="130"
        y="44"
        width="300"
        height="18"
        rx="4"
        fill="#F7F7F9"
        stroke="#000000"
        strokeWidth="3"
      />
      {selected === 1 && (
        <rect
          x="130"
          y="44"
          width="300"
          height="18"
          rx="4"
          className="fill-black"
          opacity="0.75"
        />
      )}

      {/* Hanger pivot arm up into the baseplate */}
      <line
        x1="200"
        y1="64"
        x2="244"
        y2="104"
        stroke="#000000"
        strokeWidth="10"
        strokeLinecap="round"
      />

      {/* Axle through the hanger */}
      <line
        x1="44"
        y1="140"
        x2="516"
        y2="140"
        stroke="#000000"
        strokeWidth="6"
      />
      {selected === 8 && (
        <line
          x1="44"
          y1="140"
          x2="516"
          y2="140"
          className="stroke-black"
          strokeWidth="16"
          strokeLinecap="round"
          opacity="0.85"
        />
      )}

      {/* Axle nuts */}
      <rect
        x="44"
        y="126"
        width="26"
        height="28"
        rx="3"
        fill="#FFFFFF"
        stroke="#000000"
        strokeWidth="4"
      />
      <rect
        x="490"
        y="126"
        width="26"
        height="28"
        rx="3"
        fill="#FFFFFF"
        stroke="#000000"
        strokeWidth="4"
      />
      {selected === 9 && (
        <g className="fill-black" stroke="#000000" strokeWidth="4">
          <rect x="44" y="126" width="26" height="28" rx="3" />
          <rect x="490" y="126" width="26" height="28" rx="3" />
        </g>
      )}

      {/* Roadside bushing, under the hanger */}
      <rect
        x="254"
        y="180"
        width="52"
        height="26"
        rx="5"
        fill="#F7F7F9"
        stroke="#000000"
        strokeWidth="4"
      />
      {selected === 5 && (
        <rect
          x="254"
          y="180"
          width="52"
          height="26"
          rx="5"
          className="fill-black"
          opacity="0.85"
        />
      )}

      {/* Kingpin down through the stack */}
      <line
        x1="280"
        y1="52"
        x2="280"
        y2="224"
        stroke="#000000"
        strokeWidth="5"
      />
      {selected === 3 && (
        <line
          x1="280"
          y1="52"
          x2="280"
          y2="224"
          className="stroke-black"
          strokeWidth="14"
          strokeLinecap="round"
          opacity="0.9"
        />
      )}

      {/* Kingpin nut */}
      <rect
        x="264"
        y="210"
        width="32"
        height="20"
        rx="3"
        fill="#FFFFFF"
        stroke="#000000"
        strokeWidth="4"
      />
    </svg>
  );
}

const VIEWS = [
  { id: "assembled", label: "Assembled" },
  { id: "exploded", label: "Exploded" },
] as const;

export default function PartsSection() {
  const [view, setView] = useState<string>("assembled");
  const [selected, setSelected] = useState(1);
  const part = TRUCK_PARTS.find((p) => p.n === selected) ?? TRUCK_PARTS[0]!;

  return (
    <Section id="parts">
      <Container>
        {/* Header */}
        <SectionHeader
          kicker={PARTS_SECTION.kicker}
          title={PARTS_SECTION.title}
          intro={PARTS_SECTION.intro}
        />

        <div className={GRID_CLASS}>
          {/* Figure with the two views */}
          <div className="lg:col-span-5 w-full flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Seg
                label="Truck view"
                options={VIEWS}
                value={view}
                onChange={setView}
              />
              <FigHint>{PARTS_SECTION.hint}</FigHint>
            </div>

            <FigCard tone="muted">
              {view === "assembled" ? (
                <div className="flex flex-col gap-4">
                  <PendingNote text={PARTS_SECTION.pendingNote} />
                  <div className="relative w-full">
                    <TruckFrontView selected={selected} />
                    {TRUCK_PARTS.map((p) => {
                      const pos = HOTSPOTS[p.n]!;
                      const isActive = p.n === selected;
                      return (
                        <button
                          key={p.n}
                          type="button"
                          onClick={() => setSelected(p.n)}
                          aria-pressed={isActive}
                          aria-label={`Part ${p.n}: ${p.name}`}
                          className={`absolute w-8 h-8 md:w-9 md:h-9 -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center text-xs md:text-sm font-bold cursor-pointer transition-colors ${
                            pos.hidden ? "border-dashed " : ""
                          }${
                            isActive
                              ? "bg-black text-white border-2 border-black"
                              : "bg-white text-black border-2 border-black hover:bg-neutral-200"
                          }`}
                          style={{
                            left: pos.left,
                            top: pos.top,
                            fontFamily: "'Clash Display', sans-serif",
                          }}
                        >
                          {p.n}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <PendingCard
                  kicker={EXPLODED_CARD.kicker}
                  title={EXPLODED_CARD.title}
                  brief={EXPLODED_CARD.brief}
                  shots={EXPLODED_CARD.shots}
                />
              )}
            </FigCard>

            <FigCaption>{PARTS_SECTION.caption}</FigCaption>
          </div>

          {/* Detail panel */}
          <div className="lg:col-span-7 flex flex-col gap-5 md:gap-6">
            <div className="bg-[#F7F7F9] rounded-[16px] p-5 md:p-8 flex flex-col gap-4">
              <PanelKicker>
                Part {String(part.n).padStart(2, "0")} of 09
              </PanelKicker>
              <h3
                className="text-xl md:text-[32px] font-bold tracking-[-1%] uppercase leading-none"
                style={{ fontFamily: "'Clash Display', sans-serif" }}
              >
                {part.name}
              </h3>
              <p className="text-sm md:text-lg text-black font-[400] leading-[150%]">
                {part.text}
              </p>
              <SpecList spec={part.spec} />
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

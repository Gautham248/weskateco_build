"use client";

import { PARTS_SECTION, TRUCK_PARTS } from "lib/truck-guide/data";
import assembledImg from "components/icons/truck_guide/truck-assembled.jpeg";
import explodedImg from "components/icons/truck_guide/truck-exploded.jpeg";
import { useState } from "react";
import Image from "next/image";
import {
  FigCaption,
  FigCard,
  FigHint,
  PanelKicker,
  SectionHeader,
  Seg,
  SpecList,
  Container,
  Section,
  GRID_CLASS,
} from "components/guides/ui";

/**
 * Hotspot positions, as % of each photograph's box.
 *
 * Exploded and assembled need their own maps because the parts sit in
 * completely different places in each: the exploded photo is a flat lay, the
 * assembled one a single object. `hidden` marks the parts you cannot see on an
 * assembled truck — the pivot cup, boardside bushing and washers are inside it —
 * and those buttons render dashed, as the spec drawing did.
 */
const EXPLODED_HOTSPOTS: Record<number, { left: string; top: string }> = {
  1: { left: "13%", top: "52%" }, // baseplate
  2: { left: "33%", top: "46%" }, // pivot cup
  3: { left: "9%", top: "31%" }, // kingpin
  4: { left: "48%", top: "40%" }, // boardside bushing
  5: { left: "76%", top: "55%" }, // roadside bushing
  6: { left: "38%", top: "57%" }, // washers
  7: { left: "74%", top: "31%" }, // hanger
  8: { left: "59%", top: "78%" }, // axle
  9: { left: "59%", top: "91%" }, // axle nut
};

const ASSEMBLED_HOTSPOTS: Record<
  number,
  { left: string; top: string; hidden?: boolean }
> = {
  1: { left: "50%", top: "19%" }, // baseplate
  2: { left: "42%", top: "40%", hidden: true }, // pivot cup
  3: { left: "38%", top: "30%", hidden: true }, // kingpin
  4: { left: "52%", top: "58%", hidden: true }, // boardside bushing
  7: { left: "30%", top: "67%" }, // hanger
  9: { left: "98%", top: "65%" }, // axle nut
};

/**
 * The two photographs, with numbered hotspots overlaid.
 *
 * `hidden` is only meaningful on the assembled view, where three of the nine
 * parts sit inside the truck and cannot be pointed at.
 */
function TruckFigure({
  image,
  alt,
  hotspots,
  selected,
  onSelect,
}: {
  image: { src: string; width: number; height: number };
  alt: string;
  hotspots: Record<number, { left: string; top: string; hidden?: boolean }>;
  selected: number;
  onSelect: (n: number) => void;
}) {
  return (
    <div className="relative w-full">
      {/* Portrait-leaning photographs, so the box follows the image's own ratio.
          That is what keeps the hotspots — positioned as a % of this same box —
          on the right parts at every width. */}
      <Image
        src={image}
        alt={alt}
        sizes="(min-width: 1024px) 420px, (min-width: 768px) 45vw, 90vw"
        className="h-auto w-full rounded-[12px]"
      />
      {TRUCK_PARTS.map((p) => {
        const pos = hotspots[p.n];
        if (!pos) return null;

        const isActive = p.n === selected;
        return (
          <button
            key={p.n}
            type="button"
            onClick={() => onSelect(p.n)}
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
  );
}

// Exploded first: it is the view that shows all nine parts, so it is the one to
// land on. The assembled photograph only carries six of the nine.
const VIEWS = [
  { id: "exploded", label: "Exploded" },
  { id: "assembled", label: "Assembled" },
] as const;

export default function PartsSection() {
  const [view, setView] = useState<string>("exploded");
  const [selected, setSelected] = useState(1);
  const part = TRUCK_PARTS.find((p) => p.n === selected) ?? TRUCK_PARTS[0]!;

  const exploded = view === "exploded";

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
              <TruckFigure
                image={exploded ? explodedImg : assembledImg}
                alt={
                  exploded
                    ? "One skateboard truck taken fully apart and laid out in stack order on a flat white background"
                    : PARTS_SECTION.assembledAlt
                }
                hotspots={exploded ? EXPLODED_HOTSPOTS : ASSEMBLED_HOTSPOTS}
                selected={selected}
                onSelect={setSelected}
              />
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

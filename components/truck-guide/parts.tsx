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
  Seg,
  Container,
  Section,
} from "components/guides/ui";

type Hotspot = {
  btn: [number, number]; // [left%, top%]
  lead?: [number, number, number, number]; // [x1, y1, x2, y2] in 0-100 coordinate space
};

/**
 * Hotspot coordinates and leader lines from source TPARTS:
 * Exploded view carries all 9 parts.
 * Positions are percentages measured off the photograph crop.
 */
const EXPLODED_HOTSPOTS: Record<number, Hotspot> = {
  1: { btn: [13, 53.5] }, // baseplate
  2: { btn: [29, 33], lead: [29, 33, 29, 44] }, // pivot cup
  3: { btn: [8.2, 31], lead: [8.2, 31, 8.2, 43] }, // kingpin
  4: { btn: [46, 33], lead: [46, 33, 46, 42.5] }, // boardside bushing
  5: { btn: [74, 62], lead: [74, 62, 74, 53.5] }, // roadside bushing
  6: { btn: [36, 62], lead: [36, 62, 36, 52.5] }, // washers
  7: { btn: [73, 30], lead: [73, 30, 67, 34] }, // hanger
  8: { btn: [58, 78], lead: [58, 78, 65, 78] }, // axle
  9: { btn: [58, 93], lead: [58, 93, 65, 93] }, // axle nut
};

/**
 * Assembled view shows 3 parts directly (Baseplate, Hanger, Axle nut).
 */
const ASSEMBLED_HOTSPOTS: Record<number, Hotspot> = {
  1: { btn: [49, 54] }, // baseplate
  7: { btn: [38, 77] }, // hanger
  9: { btn: [95, 74], lead: [95, 74, 91, 84] }, // axle nut
};

const T_BADGES: Record<
  number,
  { bx: number; by: number; lx: number | null; ly: number | null }
> = {
  1: { bx: 404, by: 44, lx: 372, ly: 46 },
  2: { bx: 206, by: 44, lx: 292, ly: 50 },
  3: { bx: 404, by: 86, lx: 308, ly: 84 },
  4: { bx: 228, by: 68, lx: 274, ly: 72 },
  5: { bx: 228, by: 138, lx: 274, ly: 136 },
  6: { bx: 372, by: 140, lx: 330, ly: 151 },
  7: { bx: 196, by: 105, lx: null, ly: null },
  8: { bx: 440, by: 56, lx: 456, ly: 102 },
  9: { bx: 524, by: 140, lx: 506, ly: 112 },
};

function TruckAnatSvg({
  selected,
  onSelect,
}: {
  selected: number;
  onSelect: (n: number) => void;
}) {
  return (
    <svg
      id="tAnat"
      viewBox="74 -4 466 190"
      role="img"
      aria-label="Rear view of a skateboard truck showing the baseplate, pivot cup, kingpin, boardside and roadside bushings, washers, hanger, axle and axle nuts, with the wheels at each end"
      className="w-full h-auto text-black"
    >
      <rect
        x="80"
        y="20"
        width="440"
        height="16"
        rx="2"
        fill="currentColor"
        fillOpacity="0.10"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <text
        x="86"
        y="14"
        fontSize="10.5"
        fill="currentColor"
        opacity="0.55"
        letterSpacing="1.1"
      >
        DECK
      </text>

      <g
        id="tWheels"
        fill="currentColor"
        fillOpacity="0.07"
        stroke="currentColor"
        strokeWidth="1.4"
      >
        <rect x="99.4" y="75.0" width="37.2" height="60.0" rx="7" />
        <rect x="463.4" y="75.0" width="37.2" height="60.0" rx="7" />
      </g>
      <text
        x="118"
        y="170"
        fontSize="10.5"
        fill="currentColor"
        opacity="0.5"
        textAnchor="middle"
        letterSpacing="1"
      >
        WHEEL
      </text>
      <text
        x="482"
        y="170"
        fontSize="10.5"
        fill="currentColor"
        opacity="0.5"
        textAnchor="middle"
        letterSpacing="1"
      >
        WHEEL
      </text>

      {/* Part 8: Axle */}
      <g
        className="tpart cursor-pointer"
        tabIndex={0}
        role="button"
        aria-label="Part 8, axle"
        onClick={() => onSelect(8)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelect(8);
          }
        }}
        opacity={selected === 8 ? 1 : 0.55}
      >
        <rect
          x="96"
          y="102"
          width="408"
          height="6"
          rx="3"
          fill="currentColor"
          fillOpacity={selected === 8 ? 0.65 : 0.45}
          stroke="currentColor"
          strokeWidth={selected === 8 ? 2.4 : 1.2}
        />
      </g>

      {/* Part 1: Baseplate */}
      <g
        className="tpart cursor-pointer"
        tabIndex={0}
        role="button"
        aria-label="Part 1, baseplate"
        onClick={() => onSelect(1)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelect(1);
          }
        }}
        opacity={selected === 1 ? 1 : 0.55}
      >
        <rect
          x="228"
          y="36"
          width="144"
          height="20"
          rx="2"
          fill="currentColor"
          fillOpacity={selected === 1 ? 0.42 : 0.14}
          stroke="currentColor"
          strokeWidth={selected === 1 ? 2.6 : 1.6}
        />
        <circle cx="248" cy="46" r="3.2" fill="currentColor" opacity="0.6" />
        <circle cx="268" cy="46" r="3.2" fill="currentColor" opacity="0.6" />
        <circle cx="332" cy="46" r="3.2" fill="currentColor" opacity="0.6" />
        <circle cx="352" cy="46" r="3.2" fill="currentColor" opacity="0.6" />
      </g>

      {/* Part 2: Pivot cup */}
      <g
        className="tpart cursor-pointer"
        tabIndex={0}
        role="button"
        aria-label="Part 2, pivot cup"
        onClick={() => onSelect(2)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelect(2);
          }
        }}
        opacity={selected === 2 ? 1 : 0.55}
      >
        <circle
          cx="300"
          cy="50"
          r="9"
          fill="none"
          stroke="currentColor"
          strokeWidth={selected === 2 ? 2.4 : 1.4}
          strokeDasharray="3 3"
        />
      </g>

      {/* Part 3: Kingpin */}
      <g
        className="tpart cursor-pointer"
        tabIndex={0}
        role="button"
        aria-label="Part 3, kingpin"
        onClick={() => onSelect(3)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelect(3);
          }
        }}
        opacity={selected === 3 ? 1 : 0.55}
      >
        <rect
          x="295"
          y="42"
          width="10"
          height="120"
          rx="2"
          fill="currentColor"
          fillOpacity={selected === 3 ? 0.6 : 0.38}
          stroke="currentColor"
          strokeWidth={selected === 3 ? 2.2 : 1.3}
        />
        <polygon
          points="300,152 312,159 312,172 300,179 288,172 288,159"
          fill="currentColor"
          fillOpacity={selected === 3 ? 0.6 : 0.38}
          stroke="currentColor"
          strokeWidth={selected === 3 ? 2.2 : 1.3}
        />
      </g>

      {/* Part 4: Boardside bushing */}
      <g
        className="tpart cursor-pointer"
        tabIndex={0}
        role="button"
        aria-label="Part 4, boardside bushing"
        onClick={() => onSelect(4)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelect(4);
          }
        }}
        opacity={selected === 4 ? 1 : 0.55}
      >
        <rect
          x="277"
          y="61"
          width="46"
          height="26"
          rx="8"
          fill="currentColor"
          fillOpacity={selected === 4 ? 0.45 : 0.20}
          stroke="currentColor"
          strokeWidth={selected === 4 ? 2.6 : 1.5}
        />
      </g>

      {/* Part 5: Roadside bushing */}
      <g
        className="tpart cursor-pointer"
        tabIndex={0}
        role="button"
        aria-label="Part 5, roadside bushing"
        onClick={() => onSelect(5)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelect(5);
          }
        }}
        opacity={selected === 5 ? 1 : 0.55}
      >
        <rect
          x="277"
          y="123"
          width="46"
          height="26"
          rx="8"
          fill="currentColor"
          fillOpacity={selected === 5 ? 0.45 : 0.20}
          stroke="currentColor"
          strokeWidth={selected === 5 ? 2.6 : 1.5}
        />
      </g>

      {/* Part 6: Washers */}
      <g
        className="tpart cursor-pointer"
        tabIndex={0}
        role="button"
        aria-label="Part 6, washers"
        onClick={() => onSelect(6)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelect(6);
          }
        }}
        opacity={selected === 6 ? 1 : 0.55}
      >
        <rect
          x="272"
          y="56"
          width="56"
          height="5"
          rx="1.5"
          fill="currentColor"
          fillOpacity={selected === 6 ? 0.6 : 0.34}
          stroke="currentColor"
          strokeWidth={selected === 6 ? 2 : 1}
        />
        <rect
          x="272"
          y="87"
          width="56"
          height="5"
          rx="1.5"
          fill="currentColor"
          fillOpacity={selected === 6 ? 0.6 : 0.34}
          stroke="currentColor"
          strokeWidth={selected === 6 ? 2 : 1}
        />
        <rect
          x="272"
          y="118"
          width="56"
          height="5"
          rx="1.5"
          fill="currentColor"
          fillOpacity={selected === 6 ? 0.6 : 0.34}
          stroke="currentColor"
          strokeWidth={selected === 6 ? 2 : 1}
        />
        <rect
          x="272"
          y="149"
          width="56"
          height="5"
          rx="1.5"
          fill="currentColor"
          fillOpacity={selected === 6 ? 0.6 : 0.34}
          stroke="currentColor"
          strokeWidth={selected === 6 ? 2 : 1}
        />
      </g>

      {/* Part 7: Hanger */}
      <g
        className="tpart cursor-pointer"
        tabIndex={0}
        role="button"
        aria-label="Part 7, hanger"
        onClick={() => onSelect(7)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelect(7);
          }
        }}
        opacity={selected === 7 ? 1 : 0.55}
      >
        <polygon
          points="150,99 264,92 336,92 450,99 450,111 336,118 264,118 150,111"
          fill="currentColor"
          fillOpacity={selected === 7 ? 0.42 : 0.16}
          stroke="currentColor"
          strokeWidth={selected === 7 ? 2.6 : 1.6}
        />
      </g>

      {/* Part 9: Axle nut */}
      <g
        className="tpart cursor-pointer"
        tabIndex={0}
        role="button"
        aria-label="Part 9, axle nut"
        onClick={() => onSelect(9)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelect(9);
          }
        }}
        opacity={selected === 9 ? 1 : 0.55}
      >
        <polygon
          points="96,97 104,101 104,109 96,113 88,109 88,101"
          fill="currentColor"
          fillOpacity={selected === 9 ? 0.65 : 0.40}
          stroke="currentColor"
          strokeWidth={selected === 9 ? 2.2 : 1.2}
        />
        <polygon
          points="504,97 512,101 512,109 504,113 496,109 496,101"
          fill="currentColor"
          fillOpacity={selected === 9 ? 0.65 : 0.40}
          stroke="currentColor"
          strokeWidth={selected === 9 ? 2.2 : 1.2}
        />
      </g>

      {/* Badges 1-9 */}
      <g id="tBadges">
        {TRUCK_PARTS.map((p) => {
          const b = T_BADGES[p.n]!;
          const isActive = p.n === selected;
          return (
            <g key={p.n}>
              {b.lx !== null && b.ly !== null && (
                <line
                  x1={b.bx}
                  y1={b.by}
                  x2={b.lx}
                  y2={b.ly}
                  stroke="currentColor"
                  strokeWidth="1"
                  opacity={isActive ? 0.7 : 0.3}
                />
              )}
              <g
                className={`badge ${isActive ? "on" : ""}`}
                tabIndex={0}
                role="button"
                aria-label={`Part ${p.n}, ${p.name}`}
                onClick={() => onSelect(p.n)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelect(p.n);
                  }
                }}
              >
                <circle cx={b.bx} cy={b.by} r="10" />
                <text x={b.bx} y={b.by} textAnchor="middle">
                  {p.n}
                </text>
              </g>
            </g>
          );
        })}
      </g>
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

  const assembled = view === "assembled";

  return (
    <Section id="parts" className="truck-figs">
      <Container>
        {/* Header: Two-column split matching source layout */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-8 mb-2">
          <div className="flex flex-col gap-2 max-w-xl">
            <span
              className="text-xs md:text-sm font-bold uppercase tracking-widest text-[#8fb300]"
              style={{ fontFamily: "'Clash Display', sans-serif" }}
            >
              {PARTS_SECTION.kicker}
            </span>
            <h2
              className="text-3xl sm:text-4xl md:text-[46px] font-bold tracking-[-1%] text-black uppercase leading-none md:leading-[85%]"
              style={{ fontFamily: "'Clash Display', sans-serif" }}
            >
              {PARTS_SECTION.title}
            </h2>
          </div>
          <p className="text-sm md:text-[15px] text-neutral-600 font-[400] leading-relaxed max-w-[44ch]">
            {PARTS_SECTION.intro}
          </p>
        </div>

        {/* Toolbar: Segmented toggle and hint side by side */}
        <div className="flex flex-wrap items-center gap-3 md:gap-4 -mt-2 mb-2">
          <Seg
            label="Which view of the truck to show"
            options={VIEWS}
            value={view}
            onChange={setView}
          />
          <FigHint>{PARTS_SECTION.hint}</FigHint>
        </div>

        {/* Figure Stage */}
        {assembled ? (
          /* Assembled view: End-on Photo and SVG Drawing side by side */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-start">
            <FigCard tone="muted" className="flex flex-col gap-3 border border-neutral-200/80">
              <div className="relative block w-full">
                <Image
                  src={assembledImg}
                  alt={PARTS_SECTION.assembledAlt}
                  sizes="(min-width: 768px) 45vw, 90vw"
                  className="block w-full h-auto rounded-[3px] border border-neutral-200"
                  priority
                />
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  {TRUCK_PARTS.map((p) => {
                    const h = ASSEMBLED_HOTSPOTS[p.n];
                    if (!h?.lead) return null;
                    return (
                      <line
                        key={p.n}
                        x1={h.lead[0]}
                        y1={h.lead[1]}
                        x2={h.lead[2]}
                        y2={h.lead[3]}
                        stroke="currentColor"
                        strokeWidth="1.1"
                        className="text-black"
                        opacity="0.5"
                        vectorEffect="non-scaling-stroke"
                      />
                    );
                  })}
                </svg>
                {TRUCK_PARTS.map((p) => {
                  const h = ASSEMBLED_HOTSPOTS[p.n];
                  if (!h) return null;
                  const isActive = p.n === selected;
                  return (
                    <button
                      key={p.n}
                      type="button"
                      onClick={() => setSelected(p.n)}
                      aria-pressed={isActive}
                      aria-label={`Part ${p.n}: ${p.name}`}
                      className={`absolute w-[22px] h-[22px] text-[10px] md:w-[26px] md:h-[26px] md:text-[11px] -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center font-bold cursor-pointer transition-transform hover:scale-115 shadow-xs ${
                        isActive
                          ? "bg-[var(--lime)] text-[var(--on-lime)] border-[1.6px] border-[var(--lime-deep)] z-10"
                          : "bg-white text-black border-[1.6px] border-black hover:bg-neutral-100"
                      }`}
                      style={{
                        left: `${h.btn[0]}%`,
                        top: `${h.btn[1]}%`,
                        fontFamily: "'Clash Display', sans-serif",
                      }}
                    >
                      {p.n}
                    </button>
                  );
                })}
              </div>
              <FigCaption>
                A complete board, end-on at axle height. Only three parts show
                from here — the rest are behind the hanger or inside it, the
                axle included: what you can see is the hanger&rsquo;s arm. The
                gap between each wheel and the deck is your wheelbite clearance.
              </FigCaption>
            </FigCard>

            <FigCard tone="muted" className="flex flex-col gap-3 border border-neutral-200/80">
              <div className="w-full overflow-hidden rounded-[3px] bg-white flex items-center justify-center p-4 border border-neutral-200">
                <TruckAnatSvg selected={selected} onSelect={setSelected} />
              </div>
              <FigCaption>
                <strong>The drawing, for the six you cannot see.</strong> Above
                the hanger and below it is a stack of rubber and steel threaded
                onto one bolt. You lean, one bushing squashes and the other
                rebounds, and the hanger tilts.
              </FigCaption>
            </FigCard>
          </div>
        ) : (
          /* Exploded view: Flat lay of all 9 parts in two-column card */
          <FigCard tone="muted" className="border border-neutral-200/80">
            <div className="grid grid-cols-1 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] gap-6 lg:gap-10 items-center">
              <div className="relative block w-full">
                <Image
                  src={explodedImg}
                  alt="A skateboard truck taken fully apart and laid flat, shot from directly above. Left to right in assembly order: the baseplate with its hollow kingpin and its empty pivot socket, the black pivot cup lifted out beside it, a cupped washer, a cream bushing, the hanger, the second bushing, the second washer and the kingpin nut. The axle crosses the row vertically through the hanger, with a speed washer and an axle nut laid out at each end."
                  sizes="(min-width: 1024px) 560px, 90vw"
                  className="block w-full h-auto rounded-[3px] border border-neutral-200"
                  priority
                />
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  {TRUCK_PARTS.map((p) => {
                    const h = EXPLODED_HOTSPOTS[p.n];
                    if (!h?.lead) return null;
                    return (
                      <line
                        key={p.n}
                        x1={h.lead[0]}
                        y1={h.lead[1]}
                        x2={h.lead[2]}
                        y2={h.lead[3]}
                        stroke="currentColor"
                        strokeWidth="1.1"
                        className="text-black"
                        opacity="0.5"
                        vectorEffect="non-scaling-stroke"
                      />
                    );
                  })}
                </svg>
                {TRUCK_PARTS.map((p) => {
                  const h = EXPLODED_HOTSPOTS[p.n];
                  if (!h) return null;
                  const isActive = p.n === selected;
                  return (
                    <button
                      key={p.n}
                      type="button"
                      onClick={() => setSelected(p.n)}
                      aria-pressed={isActive}
                      aria-label={`Part ${p.n}: ${p.name}`}
                      className={`absolute w-[22px] h-[22px] text-[10px] md:w-[24px] md:h-[24px] md:text-[11px] -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center font-bold cursor-pointer transition-transform hover:scale-115 shadow-xs ${
                        isActive
                          ? "bg-[var(--lime)] text-[var(--on-lime)] border-[1.6px] border-[var(--lime-deep)] z-10"
                          : "bg-white text-black border-[1.6px] border-black hover:bg-neutral-100"
                      }`}
                      style={{
                        left: `${h.btn[0]}%`,
                        top: `${h.btn[1]}%`,
                        fontFamily: "'Clash Display', sans-serif",
                      }}
                    >
                      {p.n}
                    </button>
                  );
                })}
              </div>
              <figcaption className="text-base md:text-[17px] lg:text-[18px] text-neutral-600 font-[400] leading-[165%] w-full">
                The same truck apart, in the order it goes together. Left to right:
                the baseplate, with its hollow kingpin at one end and the pivot cup
                lifted out of its socket at the other, then a washer and the
                boardside bushing, the hanger, the roadside bushing, the second
                washer, and the kingpin nut at the far right. Crossing it: the
                axle, with a speed washer and an axle nut laid out at each end.{" "}
                <strong className="text-black font-semibold">
                  This is the only figure that shows all nine.
                </strong>
              </figcaption>
            </div>
          </FigCard>
        )}

        {/* Detail panel: Two-column split matching source layout */}
        <div className="bg-[#F7F7F9] rounded-[16px] p-5 md:p-8 border border-neutral-200/80 mt-4 md:mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)] gap-6 lg:gap-12 items-start">
            <div className="flex flex-col gap-2">
              <span
                className="text-xs font-bold uppercase tracking-widest text-[#8fb300]"
                style={{ fontFamily: "'Clash Display', sans-serif" }}
              >
                Part {String(part.n).padStart(2, "0")} of 09
              </span>
              <h3
                className="text-2xl md:text-[32px] font-bold tracking-[-1%] uppercase leading-none text-black"
                style={{ fontFamily: "'Clash Display', sans-serif" }}
              >
                {part.name}
              </h3>
              <p className="mt-1 text-sm md:text-base text-neutral-700 font-[400] leading-[160%] max-w-[62ch]">
                {part.text}
              </p>
            </div>
            <div className="w-full">
              <dl className="flex flex-col">
                {part.spec.map(([label, value], i) => (
                  <div
                    key={label}
                    className={`flex items-baseline justify-between gap-6 py-2.5 ${
                      i < part.spec.length - 1 ? "border-b border-neutral-200" : ""
                    }`}
                  >
                    <dt className="text-xs md:text-sm font-semibold uppercase tracking-wider text-neutral-500">
                      {label}
                    </dt>
                    <dd className="text-sm md:text-base text-black font-semibold text-right">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

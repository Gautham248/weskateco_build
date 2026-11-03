"use client";

import anatomyImg from "components/icons/wheel_guide/wheel-anatomy.jpeg";
import { ANATOMY_SECTION, WHEEL_PARTS } from "lib/wheel-guide/data";
import {
  SectionHeader,
  Container,
  Section,
  FigHint,
  FigCard,
  FigCaption,
} from "components/guides/ui";
import Image from "next/image";
import { useState } from "react";

/**
 * Hotspot positions (% of photo box) from source WPARTS:
 * 1: [46, 8]  - riding surface
 * 2: [46, 93] - contact patch
 * 3: [12, 86] - lips
 * 4: [81, 58] - sidewall
 * 5: [44, 25] - core
 * 6: [55, 47] - bearing seats
 * 7: [66, 76] - urethane
 */
const PHOTO_HOTSPOTS: Record<number, { left: string; top: string }> = {
  1: { left: "46%", top: "8%" },
  2: { left: "46%", top: "93%" },
  3: { left: "12%", top: "86%" },
  4: { left: "81%", top: "58%" },
  5: { left: "44%", top: "25%" },
  6: { left: "55%", top: "47%" },
  7: { left: "66%", top: "76%" },
};

const W_BADGES: Record<
  number,
  { bx: number; by: number; lx: number; ly: number }
> = {
  1: { bx: 452, by: 232, lx: 396, ly: 232 },
  2: { bx: 372, by: 288, lx: 344, ly: 268 },
  3: { bx: 120, by: 220, lx: 166, ly: 222 },
  4: { bx: 120, by: 100, lx: 166, ly: 110 },
  5: { bx: 280, by: 76, lx: 280, ly: 94 },
  6: { bx: 206, by: 64, lx: 244, ly: 98 },
  7: { bx: 452, by: 120, lx: 394, ly: 130 },
};

type WheelPartSpec = (typeof WHEEL_PARTS)[number]["spec"];

function SpecRows({ spec }: { spec: WheelPartSpec }) {
  return (
    <dl className="flex flex-col">
      {spec.map(([label, value], i) => (
        <div
          key={label}
          className={`flex items-baseline justify-between gap-3 md:gap-6 py-2 ${
            i < spec.length - 1 ? "border-b border-neutral-200" : ""
          }`}
        >
          <dt className="text-xs md:text-sm font-semibold uppercase tracking-wider text-neutral-500">
            {label}
          </dt>
          <dd className="text-sm md:text-base text-black text-right font-[400]">
            {value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function WheelAnatSvg({
  selected,
  onSelect,
}: {
  selected: number;
  onSelect: (n: number) => void;
}) {
  return (
    <svg
      id="wAnat"
      viewBox="34 11 492 305"
      role="img"
      aria-label="Cross-section of a skateboard wheel showing the riding surface, contact patch, lips, sidewall, core, bearing seats and the urethane body, with the road surface below"
      className="w-full h-auto text-black"
    >
      <defs>
        <marker
          id="wa"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M 0 1 L 10 5 L 0 9 z" fill="currentColor" />
        </marker>
      </defs>

      <line
        x1="40"
        y1="238"
        x2="520"
        y2="238"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.5"
      />
      <text
        x="40"
        y="258"
        fontSize="10.5"
        fill="currentColor"
        opacity="0.5"
        letterSpacing="1.1"
      >
        ROAD
      </text>

      {/* Part 7: The urethane body */}
      <g
        className="wpart cursor-pointer"
        tabIndex={0}
        role="button"
        aria-label="Part 7, the urethane"
        onClick={() => onSelect(7)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelect(7);
          }
        }}
        opacity={selected === 7 ? 1 : 0.55}
      >
        <path
          d="M 170 70 L 390 70 L 390 214 Q 390 236 368 236 L 192 236 Q 170 236 170 214 Z"
          fill="currentColor"
          fillOpacity={selected === 7 ? 0.28 : 0.12}
          stroke="currentColor"
          strokeWidth={selected === 7 ? 2.6 : 1.8}
        />
      </g>

      {/* Part 1: Riding surface */}
      <g
        className="wpart cursor-pointer"
        tabIndex={0}
        role="button"
        aria-label="Part 1, riding surface"
        onClick={() => onSelect(1)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelect(1);
          }
        }}
        opacity={selected === 1 ? 1 : 0.55}
      >
        <path
          d="M 170 214 Q 170 236 192 236 L 368 236 Q 390 236 390 214"
          fill="none"
          stroke="currentColor"
          strokeWidth={selected === 1 ? 5.5 : 4}
        />
      </g>

      {/* Part 2: Contact patch */}
      <g
        className="wpart cursor-pointer"
        tabIndex={0}
        role="button"
        aria-label="Part 2, contact patch"
        onClick={() => onSelect(2)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelect(2);
          }
        }}
        opacity={selected === 2 ? 1 : 0.55}
      >
        <line
          x1="218"
          y1="236"
          x2="342"
          y2="236"
          stroke="currentColor"
          strokeWidth={selected === 2 ? 8.5 : 7}
          opacity="0.8"
        />
        <line
          x1="218"
          y1="266"
          x2="342"
          y2="266"
          stroke="currentColor"
          strokeWidth="1.4"
          markerStart="url(#wa)"
          markerEnd="url(#wa)"
        />
        <text
          x="280"
          y="284"
          fontSize="11.5"
          fill="currentColor"
          textAnchor="middle"
        >
          contact patch
        </text>
      </g>

      {/* Part 3: Lips */}
      <g
        className="wpart cursor-pointer"
        tabIndex={0}
        role="button"
        aria-label="Part 3, lips"
        onClick={() => onSelect(3)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelect(3);
          }
        }}
        opacity={selected === 3 ? 1 : 0.55}
      >
        <path
          d="M 170 200 Q 170 236 200 236"
          fill="none"
          stroke="currentColor"
          strokeWidth={selected === 3 ? 5.5 : 4}
        />
        <path
          d="M 390 200 Q 390 236 360 236"
          fill="none"
          stroke="currentColor"
          strokeWidth={selected === 3 ? 5.5 : 4}
        />
      </g>

      {/* Part 4: Sidewall */}
      <g
        className="wpart cursor-pointer"
        tabIndex={0}
        role="button"
        aria-label="Part 4, sidewall"
        onClick={() => onSelect(4)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelect(4);
          }
        }}
        opacity={selected === 4 ? 1 : 0.55}
      >
        <line
          x1="170"
          y1="70"
          x2="170"
          y2="206"
          stroke="currentColor"
          strokeWidth={selected === 4 ? 5.5 : 4}
        />
        <line
          x1="390"
          y1="70"
          x2="390"
          y2="206"
          stroke="currentColor"
          strokeWidth={selected === 4 ? 5.5 : 4}
        />
      </g>

      {/* Part 5: Core */}
      <g
        className="wpart cursor-pointer"
        tabIndex={0}
        role="button"
        aria-label="Part 5, core"
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
          x="238"
          y="96"
          width="84"
          height="56"
          rx="4"
          fill="currentColor"
          fillOpacity={selected === 5 ? 0.45 : 0.26}
          stroke="currentColor"
          strokeWidth={selected === 5 ? 2.4 : 1.6}
        />
      </g>

      {/* Part 6: Bearing seats */}
      <g
        className="wpart cursor-pointer"
        tabIndex={0}
        role="button"
        aria-label="Part 6, bearing seats"
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
          x="238"
          y="96"
          width="24"
          height="56"
          rx="3"
          fill="currentColor"
          fillOpacity={selected === 6 ? 0.65 : 0.45}
          stroke="currentColor"
          strokeWidth={selected === 6 ? 2.2 : 1.4}
        />
        <rect
          x="298"
          y="96"
          width="24"
          height="56"
          rx="3"
          fill="currentColor"
          fillOpacity={selected === 6 ? 0.65 : 0.45}
          stroke="currentColor"
          strokeWidth={selected === 6 ? 2.2 : 1.4}
        />
      </g>

      {/* Overall width measurement */}
      <line
        x1="170"
        y1="36"
        x2="390"
        y2="36"
        stroke="currentColor"
        strokeWidth="1.4"
        markerStart="url(#wa)"
        markerEnd="url(#wa)"
      />
      <text
        x="280"
        y="28"
        fontSize="11.5"
        fill="currentColor"
        textAnchor="middle"
      >
        overall width
      </text>

      {/* Badges 1-7 with leader lines */}
      <g id="wBadges">
        {WHEEL_PARTS.map((p) => {
          const b = W_BADGES[p.n]!;
          const isActive = p.n === selected;
          return (
            <g key={p.n}>
              <line
                x1={b.bx}
                y1={b.by}
                x2={b.lx}
                y2={b.ly}
                stroke="currentColor"
                strokeWidth="1"
                opacity={isActive ? 0.7 : 0.3}
              />
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

export default function PartsSection() {
  const [selected, setSelected] = useState(1);
  const part = WHEEL_PARTS[selected - 1]!;

  return (
    <Section id="parts" className="wheel-figs">
      <Container>
        {/* Header */}
        <SectionHeader
          kicker={ANATOMY_SECTION.kicker}
          title={ANATOMY_SECTION.title}
          intro={ANATOMY_SECTION.intro}
        />

        <div className="flex items-center justify-between gap-3 -mt-4 mb-2">
          <FigHint>
            Tap a numbered part on either one. The photograph and the drawing
            show the same seven.
          </FigHint>
        </div>

        {/* Figures pair: Photo and SVG Drawing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-start">
          {/* Photograph */}
          <FigCard tone="muted" className="flex flex-col gap-3">
            <div className="relative w-full overflow-hidden rounded-[12px] bg-white flex items-center justify-center p-2">
              <Image
                src={anatomyImg}
                alt="A 66 by 50 millimetre surfskate wheel sawn through the axle. The white urethane body surrounds a blue plastic core; three blue bands across the middle of the core are the two bearing seats with the axle passage between them. The riding surface runs along the top and bottom edges, a sidewall carrying the printed leaf graphic is on the right, and the other sidewall is on the left."
                sizes="(min-width: 768px) 45vw, 90vw"
                className="h-auto w-full object-contain max-h-[460px]"
              />
              {WHEEL_PARTS.map((p) => {
                const pos = PHOTO_HOTSPOTS[p.n]!;
                const isActive = p.n === selected;
                return (
                  <button
                    key={p.n}
                    type="button"
                    onClick={() => setSelected(p.n)}
                    aria-pressed={isActive}
                    aria-label={`Part ${p.n}: ${p.name}`}
                    className={`absolute w-7 h-7 text-xs md:w-8 md:h-8 md:text-sm -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center font-bold cursor-pointer transition-colors shadow-sm ${
                      isActive
                        ? "bg-[#ccff02] text-[#1d3b0f] border-2 border-[#8fb300]"
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
            <FigCaption>
              A 66&thinsp;&times;&thinsp;50&#8239;mm surfskate wheel sawn through
              the axle. White is urethane, blue is the core, and the three blue
              bands are the two bearing seats with the axle passage between
              them.
            </FigCaption>
          </FigCard>

          {/* SVG Drawing */}
          <FigCard tone="muted" className="flex flex-col gap-3">
            <div className="w-full overflow-hidden rounded-[12px] bg-white flex items-center justify-center p-4">
              <WheelAnatSvg selected={selected} onSelect={setSelected} />
            </div>
            <FigCaption>
              <strong>The drawing, for the two measurements.</strong>{" "}
              <strong>Overall width</strong> is the whole wheel, edge to edge —
              the second number printed on the side. The{" "}
              <strong>contact patch</strong> is only the strip actually touching
              the road, and it is always narrower. Everything a wheel does to
              grip, slide and wear happens in that strip.
            </FigCaption>
          </FigCard>
        </div>

        {/* Detail panel below */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 mt-6 items-start">
          <div className="lg:col-span-7 bg-[#F7F7F9] rounded-[16px] p-5 md:p-8 flex flex-col gap-4">
            <span
              className="text-xs font-semibold uppercase tracking-wider text-neutral-500"
              style={{ fontFamily: "'Clash Display', sans-serif" }}
            >
              Part {String(part.n).padStart(2, "0")} of 07
            </span>
            <h3
              className="text-xl md:text-[32px] font-bold tracking-[-1%] uppercase leading-none"
              style={{ fontFamily: "'Clash Display', sans-serif" }}
            >
              {part.name}
            </h3>
            <p className="text-sm md:text-lg text-black font-[400] leading-[150%]">
              {part.text}
            </p>
            <div className="mt-2 pt-2 border-t border-neutral-200">
              <SpecRows spec={part.spec} />
            </div>
          </div>

          {/* Overall width vs contact patch explainer */}
          <div className="lg:col-span-5 border border-neutral-200 rounded-[16px] p-5 md:p-8 flex flex-col gap-3 bg-white">
            <h3
              className="text-base md:text-xl font-bold tracking-[-1%] uppercase leading-none"
              style={{ fontFamily: "'Clash Display', sans-serif" }}
            >
              Overall width ≠ contact patch
            </h3>
            <p className="text-sm md:text-base text-black font-[400] leading-[150%]">
              Overall width is the whole wheel, edge to edge — the 33mm in
              53&nbsp;×&nbsp;33mm. The contact patch is only the strip of
              urethane actually on the road at any one moment, and it is
              always narrower: about 18–21mm of that 33. Grip, slide and wear
              all happen inside the contact patch, which is why the second
              number printed on the box is the one that decides nothing.
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}

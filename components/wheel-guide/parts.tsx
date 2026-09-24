"use client";

import { PARTS_INTRO, WHEEL_PARTS } from "lib/wheel-guide/data";
import { SectionHeader, Container, Section } from "components/guides/ui";
import { useState } from "react";

// Hotspot button positions, as % centres over the diagram.
const HOTSPOTS: Record<number, { left: string; top: string }> = {
  1: { left: "30%", top: "6%" },
  2: { left: "52%", top: "4%" },
  3: { left: "80%", top: "10%" },
  4: { left: "87%", top: "47%" },
  5: { left: "50%", top: "58%" },
  6: { left: "23%", top: "50%" },
  7: { left: "72%", top: "78%" },
};

function WheelCrossSection({ selected }: { selected: number }) {
  return (
    <svg
      viewBox="0 0 330 530"
      className="w-full h-auto"
      role="img"
      aria-label="Cross-section of a skateboard wheel cut through the axle, with seven labelled parts"
    >
      {/* Body */}
      <rect
        x="15"
        y="15"
        width="300"
        height="500"
        rx="70"
        fill="#FFFFFF"
        stroke="#000000"
        strokeWidth="5"
      />

      {/* 7 — urethane body fill */}
      {selected === 7 && (
        <rect
          x="30"
          y="30"
          width="270"
          height="470"
          rx="58"
          className="fill-brand"
          opacity="0.3"
        />
      )}

      {/* Core block */}
      <rect
        x="110"
        y="200"
        width="110"
        height="130"
        rx="16"
        fill="#EDEEF0"
        stroke="#000000"
        strokeWidth="4"
      />
      {/* Bearing seats */}
      <rect
        x="45"
        y="245"
        width="65"
        height="40"
        fill="#F7F7F9"
        stroke="#000000"
        strokeWidth="4"
      />
      <rect
        x="220"
        y="245"
        width="65"
        height="40"
        fill="#F7F7F9"
        stroke="#000000"
        strokeWidth="4"
      />
      {/* Spacer / axle passage */}
      <rect
        x="110"
        y="250"
        width="110"
        height="30"
        fill="#FFFFFF"
        stroke="#000000"
        strokeWidth="4"
      />
      {/* Axle line through the middle */}
      <line
        x1="0"
        y1="265"
        x2="330"
        y2="265"
        stroke="#000000"
        strokeWidth="3"
        strokeDasharray="8 6"
      />

      {/* Selection highlights */}
      {selected === 1 && (
        <g opacity="0.85">
          <path
            d="M 35 95 Q 35 35 95 35 L 235 35 Q 295 35 295 95"
            fill="none"
            className="stroke-brand"
            strokeWidth="26"
          />
          <path
            d="M 35 435 Q 35 495 95 495 L 235 495 Q 295 495 295 435"
            fill="none"
            className="stroke-brand"
            strokeWidth="26"
          />
        </g>
      )}
      {selected === 2 && (
        <line
          x1="140"
          y1="33"
          x2="190"
          y2="33"
          className="stroke-brand"
          strokeWidth="30"
          strokeLinecap="round"
          opacity="0.9"
        />
      )}
      {selected === 3 && (
        <g opacity="0.85" fill="none" className="stroke-brand" strokeWidth="26">
          <path d="M 35 95 Q 35 35 95 35" />
          <path d="M 295 95 Q 295 35 235 35" />
        </g>
      )}
      {selected === 4 && (
        <g
          opacity="0.85"
          className="stroke-brand"
          strokeWidth="26"
          strokeLinecap="round"
        >
          <line x1="22" y1="120" x2="22" y2="410" />
          <line x1="308" y1="120" x2="308" y2="410" />
        </g>
      )}
      {selected === 5 && (
        <rect
          x="110"
          y="200"
          width="110"
          height="130"
          rx="16"
          className="fill-brand"
          opacity="0.75"
        />
      )}
      {selected === 6 && (
        <g opacity="0.8">
          <rect x="45" y="245" width="65" height="40" className="fill-brand" />
          <rect x="220" y="245" width="65" height="40" className="fill-brand" />
        </g>
      )}
    </svg>
  );
}

type WheelPartSpec = (typeof WHEEL_PARTS)[number]["spec"];

// Spec rows (What it is / Wears by / …) — rendered twice: inside the grey
// detail card at lg, and as its own full-width box below lg.
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

export default function PartsSection() {
  const [selected, setSelected] = useState(1);
  const part = WHEEL_PARTS[selected - 1]!;

  return (
    <Section id="parts">
      <Container>
        {/* Header */}
        <SectionHeader
          kicker="01 — Parts"
          title="Anatomy of a wheel"
          intro={PARTS_INTRO}
        />

        {/* Local grid variant: 45/55 two-column split below lg so the diagram
            sits left and the detail right on phones (GRID_CLASS stacks them). */}
        <div className="grid grid-cols-[9fr_11fr] gap-3 md:gap-6 lg:grid-cols-12 lg:gap-12 items-start">
          {/* Diagram with hotspots */}
          <div className="lg:col-span-5 w-full bg-[#F7F7F9] rounded-[16px] p-4 md:p-8 flex flex-col items-center">
            <div className="relative w-full max-w-[360px]">
              <WheelCrossSection selected={selected} />
              {WHEEL_PARTS.map((p) => {
                const pos = HOTSPOTS[p.n]!;
                const isActive = p.n === selected;
                return (
                  <button
                    key={p.n}
                    type="button"
                    onClick={() => setSelected(p.n)}
                    aria-pressed={isActive}
                    aria-label={`Part ${p.n}: ${p.name}`}
                    className={`absolute w-6 h-6 text-[10px] md:w-9 md:h-9 md:text-sm -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center font-bold cursor-pointer transition-colors ${
                      isActive
                        ? "bg-brand text-black border-2 border-black"
                        : "bg-white text-black border-2 border-black hover:bg-brand"
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
            <p className="mt-4 text-xs md:text-sm text-neutral-500 leading-[150%] text-center">
              Tap a number to inspect that part. Cut through the axle.
            </p>
          </div>

          {/* Detail panel. Below lg this wrapper is display:contents so its
              cards become direct grid items — detail sits beside the diagram
              while the explainer spans the full grid width (its old stacked
              width). At lg it restores to the original flex column. */}
          <div className="contents lg:col-span-7 lg:flex lg:flex-col gap-5 md:gap-6">
            <div className="bg-[#F7F7F9] rounded-[16px] p-4 md:p-8 flex flex-col gap-4">
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
              <div className="hidden lg:block mt-1">
                <SpecRows spec={part.spec} />
              </div>
            </div>

            {/* Spec rows — own full-width box below lg (hidden at lg, where
                they render inside the grey detail card above). */}
            <div className="col-span-2 border border-neutral-200 rounded-[16px] p-4 md:p-8 lg:hidden">
              <SpecRows spec={part.spec} />
            </div>

            {/* Overall width vs contact patch explainer — full grid width
                below lg (col-span-2); ignored at lg where it lives in the
                restored flex column. */}
            <div className="col-span-2 border border-neutral-200 rounded-[16px] p-4 md:p-8 flex flex-col gap-3">
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
        </div>
      </Container>
    </Section>
  );
}

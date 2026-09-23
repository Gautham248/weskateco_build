"use client";

import {
  DEFAULT_GRIT,
  GRITS,
  GRIT_ATTRIBUTION,
  GRIT_DEFS,
  GRIT_NOTE,
  GRIT_SECTION,
} from "lib/griptape-guide/data";
import { useState } from "react";
import { DefList, FigHint, Note, PanelKicker, SectionHeader } from "./ui";

const CLASH = { fontFamily: "'Clash Display', sans-serif" };

// Coarse → fine scale bands: fewer, larger grains on the left; many small
// grains on the right. Selected band renders black, the rest grey.
const BANDS = [
  { id: "24", count: 5, h: 46, w: 17 },
  { id: "36", count: 7, h: 38, w: 14 },
  { id: "50", count: 9, h: 31, w: 11 },
  { id: "60", count: 11, h: 25, w: 9 },
  { id: "80", count: 15, h: 18, w: 7 },
];

const BAND_W = 116;
const BASELINE = 110;

function GritScale({ selected }: { selected: string }) {
  return (
    <svg
      viewBox="0 0 640 170"
      className="w-full h-auto"
      role="img"
      aria-label={`Grain size scale from coarse 24 grit to fine 80 grit, ${selected} grit selected`}
    >
      <text
        x="8"
        y="26"
        fontSize="15"
        letterSpacing="3"
        fill="#A1A1AA"
        style={CLASH}
      >
        COARSER
      </text>
      <text
        x="632"
        y="26"
        fontSize="15"
        letterSpacing="3"
        fill="#A1A1AA"
        textAnchor="end"
        style={CLASH}
      >
        FINER
      </text>

      {BANDS.map((band, bi) => {
        const x0 = 14 + bi * BAND_W;
        const isActive = band.id === selected;
        const fill = isActive ? "#000000" : "#D4D4D8";
        const gap = 4;
        const clusterW = band.count * band.w + (band.count - 1) * gap;
        const start = x0 + (BAND_W - 14 - clusterW) / 2;
        return (
          <g key={band.id}>
            {Array.from({ length: band.count }).map((_, i) => {
              const x = start + i * (band.w + gap);
              return (
                <polygon
                  key={i}
                  points={`${x},${BASELINE} ${x + band.w / 2},${BASELINE - band.h} ${x + band.w},${BASELINE}`}
                  fill={fill}
                />
              );
            })}
            <text
              x={x0 + (BAND_W - 14) / 2}
              y={BASELINE + 30}
              fontSize="20"
              textAnchor="middle"
              fill={isActive ? "#000000" : "#A1A1AA"}
              fontWeight={isActive ? 700 : 500}
              style={CLASH}
            >
              {band.id}
            </text>
            {isActive && (
              <rect
                x={x0}
                y={BASELINE + 42}
                width={BAND_W - 14}
                height="5"
                rx="2.5"
                fill="#CCFF02"
              />
            )}
          </g>
        );
      })}

      <line
        x1="6"
        y1={BASELINE}
        x2="634"
        y2={BASELINE}
        stroke="#000000"
        strokeWidth="2"
      />
    </svg>
  );
}

export default function GritSection() {
  const [selected, setSelected] = useState(DEFAULT_GRIT);
  const grit = GRITS.find((g) => g.label === selected) ?? GRITS[4]!;

  return (
    <section
      id="grit"
      className="w-full bg-[#F7F7F9] text-black py-10 md:py-24 overflow-hidden scroll-mt-[136px]"
    >
      <div className="mx-auto max-w-(--breakpoint-2xl) px-4 lg:px-15 flex flex-col gap-6 md:gap-10">
        <SectionHeader
          kicker={GRIT_SECTION.kicker}
          title={GRIT_SECTION.title}
          intro={GRIT_SECTION.intro}
        />

        {/* Grit chips */}
        <div
          role="group"
          aria-label="Grit level"
          className="flex flex-wrap gap-2"
        >
          {GRITS.map((g) => {
            const isActive = g.label === selected;
            return (
              <button
                key={g.label}
                type="button"
                aria-pressed={isActive}
                onClick={() => setSelected(g.label)}
                className={`rounded-full px-4 py-2 text-xs md:text-sm font-semibold border transition-colors cursor-pointer ${
                  isActive
                    ? "bg-black text-white border-black"
                    : "bg-white text-black border-neutral-300 hover:border-black"
                }`}
                style={CLASH}
              >
                {g.label} grit
              </button>
            );
          })}
        </div>

        {/* Scale + output panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">
          <div className="lg:col-span-7 bg-white border border-neutral-200 rounded-[16px] p-5 md:p-8">
            <GritScale selected={selected} />
            <FigHint className="mt-3">
              Grain size at relative scale — low numbers are coarse, high
              numbers are fine.
            </FigHint>
          </div>

          <div className="lg:col-span-5 bg-white border border-neutral-200 rounded-[16px] p-5 md:p-8 flex flex-col gap-3">
            <span className="flex items-center gap-2">
              {grit.warn && (
                <span
                  aria-hidden
                  className="w-1.5 h-1.5 rounded-full bg-amber-400"
                />
              )}
              <PanelKicker>{grit.tag}</PanelKicker>
            </span>
            <h3
              className={`text-xl md:text-[32px] font-bold tracking-[-1%] uppercase leading-none ${grit.warn ? "text-amber-800" : "text-black"}`}
              style={CLASH}
            >
              {grit.name}
            </h3>
            <p className="text-sm md:text-lg text-black font-[400] leading-[150%]">
              {grit.body}
            </p>
          </div>
        </div>

        <Note text={GRIT_NOTE} />

        <DefList items={GRIT_DEFS} />

        <p className="text-xs md:text-sm text-neutral-500 leading-[160%] max-w-4xl">
          {GRIT_ATTRIBUTION.before}
          <a
            href={GRIT_ATTRIBUTION.href}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-black transition-colors"
          >
            {GRIT_ATTRIBUTION.linkText}
          </a>
          {GRIT_ATTRIBUTION.after}
        </p>
      </div>
    </section>
  );
}

"use client";

import { Fragment } from "react";
import { PLIES, PLIES_PROSE, PLIES_SECTION } from "lib/deck-guide/data";
import { useState } from "react";
import { FigCaption, FigCard, FigHint, PanelKicker, ProseCols, SectionHeader, SpecList, Container, Section, GRID_CLASS } from "components/guides/ui";

// Ply stack geometry — the source's drawing math, unchanged.
const PLY_TOP = 24;
const PLY_H = 28;
const PLY_GAP = 5;
const PLY_X = 90;
const PLY_W = 380;

const CLASH = { fontFamily: "'Clash Display', sans-serif" };

export default function PliesSection() {
  const [active, setActive] = useState(0);
  const ply = PLIES[active]!;

  return (
    <Section id="plies">
      <Container>
        <SectionHeader
          kicker={PLIES_SECTION.kicker}
          title={PLIES_SECTION.title}
          intro={PLIES_SECTION.intro}
        />

        <div className={GRID_CLASS}>
          {/* Cross-section diagram */}
          <FigCard tone="muted" className="lg:col-span-7 w-full flex flex-col">
            <FigHint>{PLIES_SECTION.hint}</FigHint>
            <figure className="mt-4">
              <svg
                viewBox="0 0 560 300"
                className="w-full h-auto"
                role="img"
                aria-label="Cross-section of a seven-ply maple deck, showing which layers run along the board and which run across it"
              >
                <defs>
                  <pattern
                    id="dgGrainLong"
                    width="12"
                    height="8"
                    patternUnits="userSpaceOnUse"
                  >
                    <line
                      x1="0"
                      y1="4"
                      x2="12"
                      y2="4"
                      stroke="#000000"
                      strokeWidth="1"
                      opacity=".38"
                    />
                  </pattern>
                  <pattern
                    id="dgGrainCross"
                    width="9"
                    height="9"
                    patternUnits="userSpaceOnUse"
                  >
                    <circle
                      cx="4.5"
                      cy="4.5"
                      r="1.4"
                      fill="#000000"
                      opacity=".45"
                    />
                  </pattern>
                </defs>

                {/* Interactive ply layers */}
                {PLIES.map((p, i) => {
                  const y = PLY_TOP + i * (PLY_H + PLY_GAP);
                  const isActive = i === active;
                  return (
                    <g
                      key={p.n}
                      role="button"
                      tabIndex={0}
                      aria-label={`Ply ${p.n}, ${p.name}`}
                      aria-pressed={isActive}
                      className="cursor-pointer outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-black"
                      onClick={() => setActive(i)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setActive(i);
                        }
                      }}
                    >
                      <rect
                        x={PLY_X}
                        y={y}
                        width={PLY_W}
                        height={PLY_H}
                        rx="2"
                        className={isActive ? "fill-brand" : "fill-black"}
                        fillOpacity={isActive ? ".55" : ".07"}
                        stroke="#000000"
                        strokeWidth={isActive ? "2.4" : "1.2"}
                      />
                      <rect
                        x={PLY_X}
                        y={y}
                        width={PLY_W}
                        height={PLY_H}
                        rx="2"
                        fill={
                          p.dir === "long"
                            ? "url(#dgGrainLong)"
                            : "url(#dgGrainCross)"
                        }
                        pointerEvents="none"
                      />
                    </g>
                  );
                })}

                {/* Labels */}
                {PLIES.map((p, i) => {
                  const y = PLY_TOP + i * (PLY_H + PLY_GAP);
                  const isActive = i === active;
                  return (
                    <Fragment key={p.n}>
                      <text
                        x={PLY_X - 16}
                        y={y + PLY_H / 2 + 4.5}
                        textAnchor="end"
                        fontSize="13"
                        fontWeight="700"
                        fontFamily="'Clash Display', sans-serif"
                        fill="#000000"
                        opacity={isActive ? "1" : ".55"}
                      >
                        {p.n}
                      </text>
                      <text
                        x={PLY_X + PLY_W + 14}
                        y={y + PLY_H / 2 + 4}
                        fontSize="11.5"
                        fill="#000000"
                        opacity={isActive ? ".95" : ".5"}
                      >
                        {p.dir === "long" ? "along" : "across"}
                      </text>
                    </Fragment>
                  );
                })}

                <text
                  x={PLY_X + PLY_W / 2}
                  y="14"
                  textAnchor="middle"
                  fontSize="11.5"
                  fill="#000000"
                  opacity=".6"
                  letterSpacing="1.2"
                >
                  GRIPTAPE SIDE
                </text>
                <text
                  x={PLY_X + PLY_W / 2}
                  y="292"
                  textAnchor="middle"
                  fontSize="11.5"
                  fill="#000000"
                  opacity=".6"
                  letterSpacing="1.2"
                >
                  GRAPHIC SIDE
                </text>
              </svg>
              <FigCaption>{PLIES_SECTION.caption}</FigCaption>
            </figure>
          </FigCard>

          {/* Detail panel */}
          <FigCard
            tone="muted"
            className="lg:col-span-5 w-full flex flex-col gap-4"
          >
            <PanelKicker>
              Ply {String(ply.n).padStart(2, "0")} of 07
            </PanelKicker>
            <h3
              className="text-xl md:text-[32px] font-bold tracking-[-1%] uppercase leading-none text-black"
              style={CLASH}
            >
              {ply.name}
            </h3>
            <p className="text-sm md:text-lg text-black font-[400] leading-[150%]">
              {ply.text}
            </p>
            <SpecList spec={ply.spec} />
          </FigCard>
        </div>

        <ProseCols items={PLIES_PROSE} tone="muted" />
      </Container>
    </Section>
  );
}

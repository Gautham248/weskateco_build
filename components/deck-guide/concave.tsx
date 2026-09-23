"use client";

import { useState } from "react";
import {
  CONCAVE_NOTE,
  CONCAVE_PROSE,
  CONCAVE_SECTION,
  CONCAVE_TOGGLES,
} from "lib/deck-guide/data";
import { FigCaption, FigCard, FigHint, Note, ProseCols, SectionHeader, Seg, Container, Section } from "components/guides/ui";

// Profile cell geometry — the source's drawing math, unchanged.
interface Cell {
  k: string;
  line: [number, number];
  path: string;
  rails: [number, number];
  depth: [number, number];
  labelX: number;
  main: string;
  subs: string[];
}

const CELLS: Cell[] = [
  {
    k: "Mel",
    line: [16, 144],
    path: "M 24 40 Q 80 92 136 40",
    rails: [24, 136],
    depth: [80, 66],
    labelX: 80,
    main: "Mellow",
    subs: ["Beginner completes,", "pro decks, pro completes"],
  },
  {
    k: "MM",
    line: [171, 299],
    path: "M 179 40 Q 235 116 291 40",
    rails: [179, 291],
    depth: [235, 78],
    labelX: 235,
    main: "Mellow–Medium",
    subs: ["Coming soon"],
  },
  {
    k: "Med",
    line: [326, 454],
    path: "M 334 40 Q 390 140 446 40",
    rails: [334, 446],
    depth: [390, 90],
    labelX: 390,
    main: "Medium",
    subs: ["Pro decks and", "pro completes only"],
  },
  {
    k: "Deep",
    line: [481, 609],
    path: "M 489 40 Q 545 184 601 40",
    rails: [489, 601],
    depth: [545, 112],
    labelX: 545,
    main: "Deep",
    subs: ["We don’t stock it"],
  },
];

const CLASH = { fontFamily: "'Clash Display', sans-serif" };

export default function ConcaveSection() {
  const [active, setActive] = useState<string>("all");

  return (
    <Section id="concave">
      <Container>
        <SectionHeader
          kicker={CONCAVE_SECTION.kicker}
          title={CONCAVE_SECTION.title}
          intro={CONCAVE_SECTION.intro}
        />

        <FigCard tone="muted">
          <div className="flex flex-col md:flex-row md:flex-wrap items-start md:items-center gap-3 md:gap-4">
            <Seg
              label="Which concave profile to highlight"
              options={CONCAVE_TOGGLES}
              value={active}
              onChange={setActive}
            />
            <FigHint className="w-full md:w-auto">
              {CONCAVE_SECTION.hint}
            </FigHint>
          </div>

          <div className="mt-4 overflow-x-auto -mx-4 px-4 lg:mx-0 lg:px-0">
            <figure>
              <svg
                viewBox="0 0 620 196"
                className="w-full h-auto min-w-[560px]"
                role="img"
                aria-label={CONCAVE_SECTION.svgLabel}
              >
                <text
                  x="10"
                  y="18"
                  fontSize="11"
                  fill="#000000"
                  opacity=".55"
                  letterSpacing="1.1"
                >
                  {CONCAVE_SECTION.svgCaption}
                </text>
                {CELLS.map((cell) => {
                  const dimmed = active !== "all" && active !== cell.k;
                  const highlighted = active === cell.k;
                  return (
                    <g key={cell.k} opacity={dimmed ? "0.18" : "1"}>
                      <line
                        x1={cell.line[0]}
                        y1="40"
                        x2={cell.line[1]}
                        y2="40"
                        stroke="#000000"
                        strokeWidth="1"
                        strokeDasharray="4 5"
                        opacity=".45"
                      />
                      <path
                        d={`${cell.path} Z`}
                        className={highlighted ? "fill-brand" : "fill-black"}
                        fillOpacity={highlighted ? ".65" : ".10"}
                      />
                      <path
                        d={cell.path}
                        fill="none"
                        stroke="#000000"
                        strokeWidth="2.6"
                      />
                      <circle cx={cell.rails[0]} cy="40" r="4" fill="#000000" />
                      <circle cx={cell.rails[1]} cy="40" r="4" fill="#000000" />
                      <line
                        x1={cell.depth[0]}
                        y1="40"
                        x2={cell.depth[0]}
                        y2={cell.depth[1]}
                        stroke="#000000"
                        strokeWidth="1"
                        strokeDasharray="2 3"
                        opacity=".55"
                      />
                      <text
                        x={cell.labelX}
                        y="145"
                        fontSize="13"
                        fill="#000000"
                        textAnchor="middle"
                        fontWeight="700"
                        fontFamily="'Clash Display', sans-serif"
                      >
                        {cell.main}
                      </text>
                      {cell.subs.map((sub, j) => (
                        <text
                          key={sub}
                          x={cell.labelX}
                          y={j === 0 ? 163 : 178}
                          fontSize="11"
                          fill="#000000"
                          opacity=".62"
                          textAnchor="middle"
                        >
                          {sub}
                        </text>
                      ))}
                    </g>
                  );
                })}
              </svg>
              <FigCaption>{CONCAVE_SECTION.figCaption}</FigCaption>
            </figure>
          </div>
        </FigCard>

        <ProseCols items={CONCAVE_PROSE} tone="muted" />

        <Note text={CONCAVE_NOTE} />
      </Container>
    </Section>
  );
}

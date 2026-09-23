"use client";

import { Fragment, useState } from "react";
import {
  DIM_TOGGLES,
  SHAPE_CARDS,
  SHAPE_CROSSLINK,
  SHAPE_DEFS,
  SHAPE_SECTION,
  SHAPE_SUB,
  SHAPE_TOGGLES,
} from "lib/deck-guide/data";
import DeckCrosslink from "./callout";
import {
  DefList,
  FigCaption,
  FigCard,
  FigHint,
  ProseCols,
  SectionHeader,
  Seg,
  SubHead,
} from "./ui";

// Dimension drawing math — the source's numbers, unchanged:
// drawn at 600 units for 31.875 inches.
const U = 600 / 31.875;
const X0 = 20;
const X1 = 620;
const BOLT = 2.125;

interface ShapeDef {
  tail: number;
  nose: number;
  wb: string;
  endL: string;
  endR: string;
  labL: string;
  labR: string;
}

const SHAPES: Record<string, ShapeDef> = {
  std: {
    tail: 6.59,
    nose: 6.8346,
    wb: "14.25",
    endL: "TAIL",
    endR: "NOSE",
    labL: "Tail · 6.59″",
    labR: "Nose · 6.835″",
  },
  sym: {
    tail: 6.663,
    nose: 6.663,
    wb: "14.25",
    endL: "EITHER END",
    endR: "EITHER END",
    labL: "Tail · 6.663″",
    labR: "Nose · 6.663″",
  },
};

// Which dimension group each toggle isolates (null = show all).
const DIM_GROUPS: Record<string, string | null> = {
  all: null,
  len: "gLen",
  wb: "gWb",
  nt: "gNt",
  w: "gW",
};

const r = (n: number) => Number(n.toFixed(1));

export default function ShapeSection() {
  const [dim, setDim] = useState<string>("all");
  const [shapeKey, setShapeKey] = useState<string>("std");

  const sh = SHAPES[shapeKey]!;
  const tailOuter = X0 + sh.tail * U;
  const tailInner = tailOuter + BOLT * U;
  const noseOuter = X1 - sh.nose * U;
  const noseInner = noseOuter - BOLT * U;

  const holeXs = [tailOuter, tailInner, noseInner, noseOuter].map((x) => r(x));
  const only = DIM_GROUPS[dim] ?? null;
  const groupOpacity = (id: string) =>
    only === null || only === id ? "1" : "0.12";

  return (
    <section
      id="shape"
      className="w-full bg-[#F7F7F9] text-black py-10 md:py-24 overflow-hidden scroll-mt-[136px]"
    >
      <div className="mx-auto max-w-(--breakpoint-2xl) px-4 lg:px-15 flex flex-col gap-6 md:gap-10">
        <SectionHeader
          kicker={SHAPE_SECTION.kicker}
          title={SHAPE_SECTION.title}
          intro={SHAPE_SECTION.intro}
        />

        <FigCard tone="plain">
          <div className="flex flex-col md:flex-row md:flex-wrap items-start md:items-center gap-3 md:gap-4">
            <Seg
              label="Which measurement to show"
              options={DIM_TOGGLES}
              value={dim}
              onChange={setDim}
            />
            <Seg
              label="Which shape to show"
              options={SHAPE_TOGGLES}
              value={shapeKey}
              onChange={setShapeKey}
            />
            <FigHint className="w-full md:w-auto">
              {SHAPE_SECTION.figHint}
            </FigHint>
          </div>

          <div className="mt-4 overflow-x-auto -mx-4 px-4 lg:mx-0 lg:px-0">
            <figure>
              <svg
                viewBox="0 0 660 292"
                className="w-full h-auto min-w-[560px]"
                role="img"
                aria-label="Top view of a popsicle skateboard deck with its length, wheelbase, nose, tail and width dimensions marked, and the eight mounting holes shown; switches between the standard shape and the Twin Tail"
              >
                <defs>
                  <marker
                    id="dgAh"
                    viewBox="0 0 10 10"
                    refX="9"
                    refY="5"
                    markerWidth="7"
                    markerHeight="7"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1 L 10 5 L 0 9 z" fill="#000000" />
                  </marker>
                </defs>

                <path
                  d="M 95 40 L 545 40 A 75 75 0 0 1 545 190 L 95 190 A 75 75 0 0 1 95 40 Z"
                  fill="#000000"
                  fillOpacity=".07"
                  stroke="#000000"
                  strokeWidth="2"
                />

                {/* Mounting holes */}
                <g fill="#000000" opacity=".72">
                  {holeXs.map((x) => (
                    <Fragment key={x}>
                      <circle cx={x} cy={100} r="5" />
                      <circle cx={x} cy={130} r="5" />
                    </Fragment>
                  ))}
                </g>

                <text
                  x="20"
                  y="30"
                  fontSize="11.5"
                  fill="#000000"
                  opacity=".6"
                  letterSpacing="1.2"
                >
                  {sh.endL}
                </text>
                <text
                  x="620"
                  y="30"
                  fontSize="11.5"
                  fill="#000000"
                  opacity=".6"
                  letterSpacing="1.2"
                  textAnchor="end"
                >
                  {sh.endR}
                </text>

                {/* Wheelbase */}
                <g opacity={groupOpacity("gWb")}>
                  <line
                    x1={r(tailInner)}
                    y1="212"
                    x2={r(noseInner)}
                    y2="212"
                    stroke="#000000"
                    strokeWidth="1.5"
                    markerStart="url(#dgAh)"
                    markerEnd="url(#dgAh)"
                  />
                  {[tailInner, noseInner].map((x) => (
                    <line
                      key={x}
                      x1={r(x)}
                      y1="136"
                      x2={r(x)}
                      y2="212"
                      stroke="#000000"
                      strokeWidth="1"
                      strokeDasharray="3 4"
                      opacity=".5"
                    />
                  ))}
                  <text
                    x={r((tailInner + noseInner) / 2)}
                    y="206"
                    fontSize="12.5"
                    fill="#000000"
                    textAnchor="middle"
                  >
                    Wheelbase · {sh.wb}″
                  </text>
                </g>

                {/* Nose and tail */}
                <g opacity={groupOpacity("gNt")}>
                  <line
                    x1={X0}
                    y1="243"
                    x2={r(tailOuter)}
                    y2="243"
                    stroke="#000000"
                    strokeWidth="1.5"
                    markerStart="url(#dgAh)"
                    markerEnd="url(#dgAh)"
                  />
                  <text
                    x={r((X0 + tailOuter) / 2)}
                    y="237"
                    fontSize="12.5"
                    fill="#000000"
                    textAnchor="middle"
                  >
                    {sh.labL}
                  </text>
                  <line
                    x1={r(noseOuter)}
                    y1="243"
                    x2={X1}
                    y2="243"
                    stroke="#000000"
                    strokeWidth="1.5"
                    markerStart="url(#dgAh)"
                    markerEnd="url(#dgAh)"
                  />
                  <text
                    x={r((noseOuter + X1) / 2)}
                    y="237"
                    fontSize="12.5"
                    fill="#000000"
                    textAnchor="middle"
                  >
                    {sh.labR}
                  </text>
                  {[tailOuter, noseOuter].map((x) => (
                    <line
                      key={x}
                      x1={r(x)}
                      y1="136"
                      x2={r(x)}
                      y2="243"
                      stroke="#000000"
                      strokeWidth="1"
                      strokeDasharray="3 4"
                      opacity=".5"
                    />
                  ))}
                </g>

                {/* Overall length */}
                <g opacity={groupOpacity("gLen")}>
                  <line
                    x1="20"
                    y1="274"
                    x2="620"
                    y2="274"
                    stroke="#000000"
                    strokeWidth="1.5"
                    markerStart="url(#dgAh)"
                    markerEnd="url(#dgAh)"
                  />
                  <text
                    x="320"
                    y="268"
                    fontSize="12.5"
                    fill="#000000"
                    textAnchor="middle"
                  >
                    Overall length · 31.875″
                  </text>
                  <line
                    x1="20"
                    y1="115"
                    x2="20"
                    y2="274"
                    stroke="#000000"
                    strokeWidth="1"
                    strokeDasharray="3 4"
                    opacity=".5"
                  />
                  <line
                    x1="620"
                    y1="115"
                    x2="620"
                    y2="274"
                    stroke="#000000"
                    strokeWidth="1"
                    strokeDasharray="3 4"
                    opacity=".5"
                  />
                </g>

                {/* Width */}
                <g opacity={groupOpacity("gW")}>
                  <line
                    x1="320"
                    y1="40"
                    x2="320"
                    y2="190"
                    stroke="#000000"
                    strokeWidth="1.5"
                    markerStart="url(#dgAh)"
                    markerEnd="url(#dgAh)"
                  />
                  <rect
                    x="276"
                    y="104"
                    width="88"
                    height="22"
                    rx="2"
                    fill="#000000"
                    fillOpacity=".92"
                  />
                  <text
                    x="320"
                    y="119"
                    fontSize="12.5"
                    fill="#FFFFFF"
                    textAnchor="middle"
                  >
                    Width · 8.000″
                  </text>
                </g>
              </svg>
              <FigCaption>{SHAPE_SECTION.figCaption}</FigCaption>
            </figure>
          </div>
        </FigCard>

        <DefList items={SHAPE_DEFS} />

        <SubHead
          kicker={SHAPE_SUB.kicker}
          title={SHAPE_SUB.title}
          intro={SHAPE_SUB.intro}
        />

        <ProseCols items={SHAPE_CARDS} columns={3} tone="plain" />

        <DeckCrosslink
          text={SHAPE_CROSSLINK.text}
          cta={SHAPE_CROSSLINK.cta}
          href={SHAPE_CROSSLINK.href}
        />
      </div>
    </section>
  );
}

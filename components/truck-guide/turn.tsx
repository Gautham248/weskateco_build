"use client";

import { TURN_ALTS, TURN_PROSE, TURN_SECTION } from "lib/truck-guide/data";
import leanAboveImg from "components/icons/truck_guide/turn-lean-above.jpeg";
import leanBehindImg from "components/icons/truck_guide/turn-lean-behind.jpeg";
import levelAboveImg from "components/icons/truck_guide/turn-level-above.jpeg";
import levelBehindImg from "components/icons/truck_guide/turn-level-behind.jpeg";
import Image from "next/image";
import { useState } from "react";
import {
  FigCaption,
  FigCard,
  FigHint,
  ProseCols,
  Seg,
  SectionHeader,
  Container,
  Section,
} from "components/guides/ui";

const SHOTS = {
  "level-behind": { image: levelBehindImg, alt: TURN_ALTS.levelBehind },
  "lean-behind": { image: leanBehindImg, alt: TURN_ALTS.leanBehind },
  "level-above": { image: levelAboveImg, alt: TURN_ALTS.levelAbove },
  "lean-above": { image: leanAboveImg, alt: TURN_ALTS.leanAbove },
} as const;

const STATES = [
  { id: "level", label: "Level" },
  { id: "leaning", label: "Leaning" },
] as const;

function HaloText({
  x,
  y,
  size,
  txt,
  op = 1,
}: {
  x: number;
  y: number;
  size: number;
  txt: string;
  op?: number;
}) {
  return (
    <text
      x={x}
      y={y}
      fontSize={size}
      fill="currentColor"
      textAnchor="middle"
      opacity={op}
      stroke="white"
      strokeWidth="4"
      strokeLinejoin="round"
      style={{ paintOrder: "stroke" }}
    >
      {txt}
    </text>
  );
}

function LeanBehindSvg({ leaning }: { leaning: boolean }) {
  const cx = 300;
  const deckY = 38;
  const tilt = leaning ? 11 : 0;

  function rot(x: number, y: number): [number, number] {
    const r = (tilt * Math.PI) / 180;
    const dx = x - cx;
    const dy = y - 116;
    return [
      cx + dx * Math.cos(r) - dy * Math.sin(r),
      116 + dx * Math.sin(r) + dy * Math.cos(r),
    ];
  }

  function polyPoints(pts: [number, number][]) {
    return pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  }

  const kpTop = rot(300, 56);
  const sqW = leaning ? 52 : 44;
  const sqH = leaning ? 15 : 23;
  const opW = leaning ? 38 : 44;
  const opH = leaning ? 30 : 23;

  return (
    <svg
      id="lnA"
      viewBox="67 -6 466 212"
      role="img"
      aria-label="Rear view of the truck leaning: one bushing is squashed under the load, the other released."
      className="w-full h-auto text-black"
    >
      {/* Deck */}
      <polygon
        points={polyPoints([
          rot(96, deckY),
          rot(504, deckY),
          rot(504, deckY + 14),
          rot(96, deckY + 14),
        ])}
        fill="currentColor"
        fillOpacity="0.10"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      {/* Baseplate top */}
      <polygon
        points={polyPoints([
          rot(240, 52),
          rot(360, 52),
          rot(360, 70),
          rot(240, 70),
        ])}
        fill="currentColor"
        fillOpacity="0.14"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      {/* Hanger */}
      <polygon
        points="164,110 436,110 436,124 164,124"
        fill="currentColor"
        fillOpacity="0.16"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      {/* Axle */}
      <rect
        x="126"
        y="114"
        width="348"
        height="5"
        rx="2.5"
        fill="currentColor"
        fillOpacity="0.45"
      />
      {/* Wheels */}
      {[138, 462].map((wx) => (
        <rect
          key={wx}
          x={wx - 15.5}
          y={117 - 25}
          width="31"
          height="50"
          rx="6"
          fill="currentColor"
          fillOpacity="0.07"
          stroke="currentColor"
          strokeWidth="1.4"
        />
      ))}
      {/* Kingpin line */}
      <line
        x1={kpTop[0].toFixed(1)}
        y1={kpTop[1].toFixed(1)}
        x2="300"
        y2="158"
        stroke="currentColor"
        strokeWidth="3"
        opacity="0.55"
      />
      {/* Boardside bushing */}
      <rect
        x={300 - sqW / 2}
        y={110 - sqH - 3}
        width={sqW}
        height={sqH}
        rx="7"
        fill="currentColor"
        fillOpacity={leaning ? 0.36 : 0.2}
        stroke="currentColor"
        strokeWidth="1.5"
      />
      {/* Roadside bushing */}
      <rect
        x={300 - opW / 2}
        y="128"
        width={opW}
        height={opH}
        rx="7"
        fill="currentColor"
        fillOpacity="0.20"
        stroke="currentColor"
        strokeWidth="1.5"
      />

      {/* Captions */}
      {leaning ? (
        <>
          <HaloText x={300} y={80} size={11.5} txt="squashed" />
          <HaloText x={300} y={174} size={11.5} txt="released" />
          <HaloText
            x={300}
            y={196}
            size={12.5}
            txt="Lean the deck and one bushing takes the load, the other lets go."
          />
        </>
      ) : (
        <HaloText
          x={300}
          y={196}
          size={12.5}
          txt="Level — both bushings at rest, nothing is being asked of them."
        />
      )}
    </svg>
  );
}

function LeanAboveSvg({ leaning }: { leaning: boolean }) {
  const ty = 236;
  const ay = ty + 52;
  const half = 46;
  const yaw = leaning ? 14 : 0;
  const r2 = (yaw * Math.PI) / 180;
  const ax1: [number, number] = [
    300 - half * Math.cos(r2),
    ay - half * Math.sin(r2),
  ];
  const ax2: [number, number] = [
    300 + half * Math.cos(r2),
    ay + half * Math.sin(r2),
  ];

  return (
    <svg
      id="lnB"
      viewBox="67 209 466 180"
      role="img"
      aria-label="The same truck seen from above. Leaning swings the axle out of square with the board, which is the steering."
      className="w-full h-auto text-black"
    >
      {/* Deck rounded tip */}
      <path
        d={`M250 ${ty + 110} L250 ${ty + 28} A50 50 0 0 1 350 ${ty + 28} L350 ${ty + 110} Z`}
        fill="currentColor"
        fillOpacity="0.07"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      {/* Center line */}
      <line
        x1="300"
        y1={ty - 6}
        x2="300"
        y2={ty + 102}
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="3 4"
        opacity="0.4"
      />

      {/* Axle line */}
      <line
        x1={ax1[0].toFixed(1)}
        y1={ax1[1].toFixed(1)}
        x2={ax2[0].toFixed(1)}
        y2={ax2[1].toFixed(1)}
        stroke="currentColor"
        strokeWidth="4"
        opacity="0.75"
      />

      {/* Wheels */}
      {[ax1, ax2].map((a, idx) => (
        <rect
          key={idx}
          x={(a[0] - 8).toFixed(1)}
          y={(a[1] - 13).toFixed(1)}
          width="16"
          height="26"
          rx="5"
          transform={`rotate(${yaw} ${a[0].toFixed(1)} ${a[1].toFixed(1)})`}
          fill="currentColor"
          fillOpacity="0.10"
          stroke="currentColor"
          strokeWidth="1.4"
        />
      ))}

      {/* Captions */}
      {leaning ? (
        <>
          <line
            x1={300 - half}
            y1={ay}
            x2={300 + half}
            y2={ay}
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="4 5"
            opacity="0.35"
          />
          <HaloText
            x={300}
            y={ty + 126}
            size={12.5}
            txt="Axle swung out of square — the board follows an arc."
          />
          <HaloText
            x={300}
            y={ty + 146}
            size={12}
            txt="Hold the lean and it keeps turning."
            op={0.65}
          />
        </>
      ) : (
        <>
          <HaloText
            x={300}
            y={ty + 126}
            size={12.5}
            txt="Axle square to the board — it rolls straight."
          />
          <HaloText
            x={300}
            y={ty + 146}
            size={12}
            txt="The kingpin nut is doing nothing yet."
            op={0.65}
          />
        </>
      )}
    </svg>
  );
}

export default function TurnSection() {
  const [state, setState] = useState<string>("level");
  const leaning = state === "leaning";

  return (
    <Section id="turn" bg="muted" className="truck-figs">
      <Container>
        <SectionHeader
          kicker={TURN_SECTION.kicker}
          title={TURN_SECTION.title}
          intro={TURN_SECTION.intro}
        />

        <div className="flex flex-wrap items-center justify-between gap-3 -mt-4 mb-2">
          <Seg
            label="Which state to show"
            options={STATES}
            value={state}
            onChange={setState}
          />
          <FigHint>
            Two views of the same truck — from behind, and from above.
          </FigHint>
        </div>

        {/* Mechanism Stages: Behind pair and Above pair */}
        <FigCard tone="plain" className="flex flex-col gap-6 p-4 md:p-6 bg-white">
          {/* Row 1: From behind */}
          <div>
            <span className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
              From behind
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-center">
              <div className="overflow-hidden rounded-[12px] bg-white flex items-center justify-center p-2 border border-neutral-100">
                <Image
                  src={
                    leaning
                      ? SHOTS["lean-behind"].image
                      : SHOTS["level-behind"].image
                  }
                  alt={
                    leaning
                      ? SHOTS["lean-behind"].alt
                      : SHOTS["level-behind"].alt
                  }
                  sizes="(min-width: 768px) 45vw, 90vw"
                  className="h-auto max-h-[360px] w-auto max-w-full object-contain"
                />
              </div>
              <div className="overflow-hidden rounded-[12px] bg-white flex items-center justify-center p-3 border border-neutral-100">
                <LeanBehindSvg leaning={leaning} />
              </div>
            </div>
          </div>

          {/* Row 2: From above */}
          <div>
            <span className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
              From above
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-center">
              <div className="overflow-hidden rounded-[12px] bg-white flex items-center justify-center p-2 border border-neutral-100">
                <Image
                  src={
                    leaning
                      ? SHOTS["lean-above"].image
                      : SHOTS["level-above"].image
                  }
                  alt={
                    leaning
                      ? SHOTS["lean-above"].alt
                      : SHOTS["level-above"].alt
                  }
                  sizes="(min-width: 768px) 45vw, 90vw"
                  className="h-auto max-h-[360px] w-auto max-w-full object-contain"
                />
              </div>
              <div className="overflow-hidden rounded-[12px] bg-white flex items-center justify-center p-3 border border-neutral-100">
                <LeanAboveSvg leaning={leaning} />
              </div>
            </div>
          </div>

          <div className="border-t border-neutral-200 pt-4">
            <FigCaption>
              Two views because neither shows it alone. From behind, the load going
              into the bushings. From above, what that produces — the kingpin is
              angled along the board, so the hanger does not just tilt, it swings,
              and the axle stops being square to the way you are going. That is the
              steering.
            </FigCaption>
          </div>
        </FigCard>

        {/* Prose Columns */}
        <ProseCols items={TURN_PROSE} tone="plain" />
      </Container>
    </Section>
  );
}

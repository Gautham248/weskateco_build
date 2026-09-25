"use client";

import {
  TURN_ALTS,
  TURN_CARD,
  TURN_PROSE,
  TURN_SECTION,
} from "lib/truck-guide/data";
import { useState } from "react";
import {
  FigCaption,
  FigCard,
  FigHint,
  PendingCard,
  PendingNote,
  ProseCols,
  Seg,
  SectionHeader,
  Container,
  Section,
} from "components/guides/ui";

/** Reference drawing: the truck seen from behind, deck level — both
 * bushings at rest. */
function FromBehind({ leaning }: { leaning: boolean }) {
  return (
    <svg
      viewBox="0 0 340 260"
      className="w-full h-auto"
      role="img"
      aria-label={leaning ? TURN_ALTS.leanBehind : TURN_ALTS.levelBehind}
    >
      <g
        transform={leaning ? "rotate(7 170 115)" : undefined}
        style={{ transition: "transform 200ms" }}
      >
        {/* Baseplate / deck line */}
        <rect
          x="60"
          y={leaning ? 36 : 30}
          width="220"
          height="16"
          rx="4"
          fill="#F7F7F9"
          stroke="#000000"
          strokeWidth="3"
        />
        {/* Kingpin */}
        <line
          x1="170"
          y1={leaning ? 42 : 36}
          x2="170"
          y2={leaning ? 214 : 196}
          stroke="#000000"
          strokeWidth="5"
        />
        {/* Boardside bushing — squashed when leaning */}
        <rect
          x="148"
          y={leaning ? 64 : 48}
          width="44"
          height={leaning ? 26 : 42}
          rx="6"
          className={leaning ? "fill-black" : "fill-[#EDEEF0]"}
          fillOpacity={leaning ? 0.85 : 1}
          stroke="#000000"
          strokeWidth="4"
        />
        {/* Kingpin nut */}
        <rect
          x="154"
          y={leaning ? 200 : 184}
          width="32"
          height="18"
          rx="3"
          fill="#FFFFFF"
          stroke="#000000"
          strokeWidth="4"
        />
      </g>

      {/* Hanger + axle — stay level, the wheels are on the ground */}
      <rect
        x="96"
        y="92"
        width="148"
        height="46"
        rx="8"
        fill="#EDEEF0"
        stroke="#000000"
        strokeWidth="4"
      />
      <line
        x1="30"
        y1="115"
        x2="310"
        y2="115"
        stroke="#000000"
        strokeWidth="5"
      />
      <rect
        x="30"
        y="103"
        width="22"
        height="24"
        rx="3"
        fill="#FFFFFF"
        stroke="#000000"
        strokeWidth="4"
      />
      <rect
        x="288"
        y="103"
        width="22"
        height="24"
        rx="3"
        fill="#FFFFFF"
        stroke="#000000"
        strokeWidth="4"
      />

      {/* Roadside bushing — released (taller) when leaning */}
      <rect
        x="148"
        y="140"
        width="44"
        height={leaning ? 58 : 42}
        rx="6"
        className={leaning ? "fill-[#EDEEF0]" : "fill-black"}
        fillOpacity={leaning ? 1 : 0.6}
        stroke="#000000"
        strokeWidth="4"
      />
      {leaning && (
        <rect
          x="154"
          y="200"
          width="32"
          height="18"
          rx="3"
          fill="#FFFFFF"
          stroke="#000000"
          strokeWidth="4"
        />
      )}
    </svg>
  );
}

/** Reference drawing: the truck seen from directly above — shows the axle
 * swinging out of square when the deck leans. */
function FromAbove({ leaning }: { leaning: boolean }) {
  return (
    <svg
      viewBox="0 0 340 260"
      className="w-full h-auto"
      role="img"
      aria-label={leaning ? TURN_ALTS.leanAbove : TURN_ALTS.levelAbove}
    >
      {/* Deck, seen from above */}
      <rect
        x="130"
        y="16"
        width="80"
        height="150"
        rx="6"
        fill="#F7F7F9"
        stroke="#000000"
        strokeWidth="3"
      />
      {/* Deck centreline */}
      <line
        x1="170"
        y1="10"
        x2="170"
        y2="176"
        stroke="#000000"
        strokeWidth="2"
        strokeDasharray="7 6"
      />
      {/* Baseplate */}
      <rect
        x="138"
        y="118"
        width="64"
        height="44"
        rx="4"
        fill="#EDEEF0"
        stroke="#000000"
        strokeWidth="3"
      />
      {/* Kingpin, pointing along the length of the board */}
      <line
        x1="170"
        y1="162"
        x2="170"
        y2="186"
        stroke="#000000"
        strokeWidth="5"
      />

      {/* Square reference across the deck */}
      <line
        x1="30"
        y1="216"
        x2="310"
        y2="216"
        stroke="#000000"
        strokeWidth="2"
        strokeDasharray="7 6"
        opacity="0.35"
      />

      {/* Hanger + axle — square at level, swung off-square when leaning */}
      <g
        transform={leaning ? "rotate(14 170 216)" : undefined}
        style={{ transition: "transform 200ms" }}
      >
        <rect
          x="70"
          y="203"
          width="200"
          height="26"
          rx="6"
          fill="#EDEEF0"
          stroke="#000000"
          strokeWidth="4"
        />
        <line
          x1="40"
          y1="216"
          x2="300"
          y2="216"
          className={leaning ? "stroke-black" : "stroke-neutral-400"}
          strokeOpacity={leaning ? 1 : 1}
          strokeWidth={leaning ? 8 : 5}
          strokeLinecap="round"
        />
        <rect
          x="40"
          y="204"
          width="20"
          height="24"
          rx="3"
          fill="#FFFFFF"
          stroke="#000000"
          strokeWidth="4"
        />
        <rect
          x="280"
          y="204"
          width="20"
          height="24"
          rx="3"
          fill="#FFFFFF"
          stroke="#000000"
          strokeWidth="4"
        />
      </g>
    </svg>
  );
}

const STATES = [
  { id: "level", label: "Level" },
  { id: "leaning", label: "Leaning" },
] as const;

export default function TurnSection() {
  const [state, setState] = useState<string>("level");
  const leaning = state === "leaning";

  return (
    <Section id="turn" bg="muted">
      <Container>
        <SectionHeader
          kicker={TURN_SECTION.kicker}
          title={TURN_SECTION.title}
          intro={TURN_SECTION.intro}
        />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <Seg
            label="Truck position"
            options={STATES}
            value={state}
            onChange={setState}
          />
          <FigHint>{TURN_SECTION.hint}</FigHint>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-start">
          <FigCard tone="plain" className="flex flex-col gap-3">
            <FromBehind leaning={leaning} />
            <FigHint className="text-center">From behind</FigHint>
          </FigCard>
          <FigCard tone="plain" className="flex flex-col gap-3">
            <FromAbove leaning={leaning} />
            <FigHint className="text-center">From above</FigHint>
          </FigCard>
        </div>

        <PendingNote text={TURN_SECTION.pendingNote} />
        <FigCaption>{TURN_SECTION.caption}</FigCaption>

        <PendingCard
          kicker={TURN_CARD.kicker}
          title={TURN_CARD.title}
          brief={TURN_CARD.brief}
          shots={TURN_CARD.shots}
        />

        <ProseCols items={TURN_PROSE} tone="plain" />
      </Container>
    </Section>
  );
}

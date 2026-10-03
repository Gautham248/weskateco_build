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

/**
 * The four photographs, keyed by the segment above.
 *
 * Alt text comes from the data file rather than being written here, so the
 * description of what each shot shows stays next to the rest of the section's
 * copy.
 */
const SHOTS = {
  "level-behind": { image: levelBehindImg, alt: TURN_ALTS.levelBehind },
  "lean-behind": { image: leanBehindImg, alt: TURN_ALTS.leanBehind },
  "level-above": { image: levelAboveImg, alt: TURN_ALTS.levelAbove },
  "lean-above": { image: leanAboveImg, alt: TURN_ALTS.leanAbove },
} as const;

/** One photograph, in the same frame whichever state is showing. */
function TurnFigure({
  shot,
  label,
}: {
  shot: (typeof SHOTS)[keyof typeof SHOTS];
  label: string;
}) {
  return (
    <FigCard tone="plain" className="flex flex-col gap-3">
      {/* The four photographs are different shapes — the behind pair is
          landscape, the above pair portrait — so each sits in a plain wrapper
          that centres it and caps its rendered size (max-h-[520px], max-w-full)
          rather than stretching it to fill. The two cards can still end up
          different heights; the cap is what keeps either from overwhelming the
          grid. */}
      <div className="flex w-full items-center justify-center overflow-hidden rounded-[12px] bg-white">
        <Image
          src={shot.image}
          alt={shot.alt}
          sizes="(min-width: 768px) 45vw, 90vw"
          className="h-auto max-h-[520px] w-auto max-w-full object-contain"
        />
      </div>
      <FigHint className="text-center">{label}</FigHint>
    </FigCard>
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
          <TurnFigure
            shot={leaning ? SHOTS["lean-behind"] : SHOTS["level-behind"]}
            label="From behind"
          />
          <TurnFigure
            shot={leaning ? SHOTS["lean-above"] : SHOTS["level-above"]}
            label="From above"
          />
        </div>

        <FigCaption>{TURN_SECTION.caption}</FigCaption>

        <ProseCols items={TURN_PROSE} tone="plain" />
      </Container>
    </Section>
  );
}

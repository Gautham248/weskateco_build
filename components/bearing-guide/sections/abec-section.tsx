import type {
  ColumnsBlock,
  CrosslinkBlock,
  FigureBlock,
  NoteBlock,
  SectionHead,
  StockedBlock,
} from "content/guides/bearings";
import {
  Container,
  FigCaption,
  FigCard,
  ProseCols,
  Section,
  SectionHeader,
} from "components/guides/ui";
import { renderRich } from "components/guides/rich";
import { AbecToleranceFig } from "components/bearing-guide/figures";
import { NoteCard, StockedCallout } from "components/bearing-guide/bits";
import GuideCrosslink from "components/guides/callout";

export function AbecSection({
  head,
  blocks,
}: {
  head: SectionHead;
  blocks: [ColumnsBlock, FigureBlock, NoteBlock, StockedBlock, CrosslinkBlock];
}) {
  const [colsBlock, figBlock, noteBlock, stockedBlock, crosslinkBlock] = blocks;

  const proseItems = colsBlock.items.map((it) => ({
    title: it.heading,
    text: it.paragraphs.join("\n\n"),
  }));

  // Route verification: /guides/wheel-guide does not exist in repo (repo has /guides/wheels-guide)
  // Per hard rule: "If a route does not exist, do not create it and do not render a dead link: omit that link and list it in your report."
  const hasValidRoute = crosslinkBlock.cta.href !== "/guides/wheel-guide";

  return (
    <Section id="abec" bg="muted">
      <Container>
        <SectionHeader {...head} />

        {/* 2 prose columns */}
        <ProseCols items={proseItems} columns={2} tone="plain" />

        {/* ABEC static figure + caption */}
        <figure className="w-full flex flex-col">
          <FigCard tone="plain" className="w-full flex flex-col items-center">
            <div className="w-full flex items-center justify-center overflow-x-auto">
              <AbecToleranceFig className="w-full max-w-[720px] h-auto" />
            </div>
          </FigCard>
          {figBlock.caption && (
            <FigCaption>{renderRich(figBlock.caption)}</FigCaption>
          )}
        </figure>

        {/* Note */}
        <NoteCard text={noteBlock.text} />

        {/* Stocked callout */}
        <StockedCallout label={stockedBlock.label} text={stockedBlock.text} />

        {/* Crosslink - omit dead link if route does not exist */}
        {hasValidRoute ? (
          <GuideCrosslink
            text={crosslinkBlock.text}
            cta={crosslinkBlock.cta.label}
            href={crosslinkBlock.cta.href}
          />
        ) : (
          <div className="w-full bg-white border border-neutral-300 rounded-[8px] p-5 md:py-6 md:px-8">
            <p className="text-base md:text-lg font-normal text-black max-w-3xl">
              {renderRich(crosslinkBlock.text)}
            </p>
          </div>
        )}
      </Container>
    </Section>
  );
}

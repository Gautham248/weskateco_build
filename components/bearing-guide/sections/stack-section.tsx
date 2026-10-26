import type {
  AxleStackBlock,
  ColumnsBlock,
  ImageBlock,
  NoteBlock,
  SectionHead,
  StockedBlock,
} from "content/guides/bearings";
import {
  Container,
  ProseCols,
  Section,
  SectionHeader,
} from "components/guides/ui";
import { CutawayImage } from "components/bearing-guide/cutaway-image";
import { AxleStackInteractive } from "components/bearing-guide/interactive/axle-stack-section";
import { NoteCard, StockedCallout } from "components/bearing-guide/bits";

export function StackSection({
  head,
  blocks,
}: {
  head: SectionHead;
  blocks: [ImageBlock, AxleStackBlock, ColumnsBlock, NoteBlock, StockedBlock];
}) {
  const [imageBlock, axleStackBlock, colsBlock, noteBlock, stockedBlock] =
    blocks;

  const proseItems = colsBlock.items.map((it) => ({
    title: it.heading,
    text: it.paragraphs.join("\n\n"),
  }));

  return (
    <Section id="stack" bg="white">
      <Container>
        <SectionHeader {...head} />

        {/* Wheel Cutaway Image */}
        <CutawayImage alt={imageBlock.alt} caption={imageBlock.caption} />

        {/* Interactive Axle Stack Toggle */}
        <AxleStackInteractive block={axleStackBlock} />

        {/* 2 columns (Spacers, Speed washers) */}
        <ProseCols items={proseItems} columns={2} tone="muted" />

        {/* Note */}
        <NoteCard text={noteBlock.text} />

        {/* Stocked callout */}
        <StockedCallout label={stockedBlock.label} text={stockedBlock.text} />
      </Container>
    </Section>
  );
}

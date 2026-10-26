import type {
  ColumnsBlock,
  CrosslinkBlock,
  NoteBlock,
  SectionHead,
  StockedBlock,
  TableBlock,
} from "content/guides/bearings";
import {
  Container,
  ProseCols,
  Section,
  SectionHeader,
} from "components/guides/ui";
import { BearingTable } from "components/bearing-guide/bearing-table";
import { NoteCard, StockedCallout } from "components/bearing-guide/bits";
import GuideCrosslink from "components/guides/callout";

export function RangeSection({
  head,
  blocks,
}: {
  head: SectionHead;
  blocks: [TableBlock, ColumnsBlock, NoteBlock, StockedBlock, CrosslinkBlock];
}) {
  const [tableBlock, colsBlock, noteBlock, stockedBlock, crosslinkBlock] =
    blocks;

  const proseItems = colsBlock.items.map((it) => ({
    title: it.heading,
    text: it.paragraphs.join("\n\n"),
  }));

  return (
    <Section id="range" bg="muted">
      <Container>
        <SectionHeader {...head} />

        {/* 3-product comparison table (12 rows) */}
        <BearingTable table={tableBlock} fade="muted" />

        {/* 2 columns (Which set to buy, What comes in the box) */}
        <ProseCols items={proseItems} columns={2} tone="plain" />

        {/* Note */}
        <NoteCard text={noteBlock.text} />

        {/* Stocked callout */}
        <StockedCallout label={stockedBlock.label} text={stockedBlock.text} />

        {/* Store Crosslink */}
        <GuideCrosslink
          text={crosslinkBlock.text}
          cta={crosslinkBlock.cta.label}
          href={crosslinkBlock.cta.href}
        />
      </Container>
    </Section>
  );
}

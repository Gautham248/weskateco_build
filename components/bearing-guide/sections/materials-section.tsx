import type {
  ColumnsBlock,
  NoteBlock,
  SectionHead,
  StockedBlock,
  SubheadBlock,
  TableBlock,
} from "content/guides/bearings";
import {
  Container,
  ProseCols,
  Section,
  SectionHeader,
  SubHead,
} from "components/guides/ui";
import { BearingTable } from "components/bearing-guide/bearing-table";
import { NoteCard, StockedCallout } from "components/bearing-guide/bits";

export function MaterialsSection({
  head,
  blocks,
}: {
  head: SectionHead;
  blocks: [
    ColumnsBlock,
    SubheadBlock,
    TableBlock,
    NoteBlock,
    ColumnsBlock,
    StockedBlock,
  ];
}) {
  const [
    colsBlock1,
    subheadBlock,
    tableBlock,
    noteBlock,
    colsBlock2,
    stockedBlock,
  ] = blocks;

  const proseItems1 = colsBlock1.items.map((it) => ({
    title: it.heading,
    text: it.paragraphs.join("\n\n"),
  }));

  const proseItems2 = colsBlock2.items.map((it) => ({
    title: it.heading,
    text: it.paragraphs.join("\n\n"),
  }));

  return (
    <Section id="mat" bg="white">
      <Container>
        <SectionHeader {...head} />

        {/* 3 columns on materials */}
        <ProseCols items={proseItems1} columns={3} tone="muted" />

        {/* Subhead */}
        <SubHead
          kicker={subheadBlock.kicker ?? "Comparison"}
          title={subheadBlock.title}
          intro={subheadBlock.intro}
        />

        {/* Comparison table */}
        <BearingTable table={tableBlock} fade="white" />

        {/* Note */}
        <NoteCard text={noteBlock.text} />

        {/* 2 columns (Titanium, Swiss) */}
        <ProseCols items={proseItems2} columns={2} tone="muted" />

        {/* Stocked callout */}
        <StockedCallout label={stockedBlock.label} text={stockedBlock.text} />
      </Container>
    </Section>
  );
}

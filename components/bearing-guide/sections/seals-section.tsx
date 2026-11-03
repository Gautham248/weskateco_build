import type {
  ColumnsBlock,
  FigureBlock,
  NoteBlock,
  SectionHead,
  StockedBlock,
  SubheadBlock,
} from "content/guides/bearings";
import {
  Container,
  FigCaption,
  FigCard,
  ProseCols,
  Section,
  SectionHeader,
  SubHead,
} from "components/guides/ui";
import { renderRich } from "components/guides/rich";
import { DragScrollArea } from "components/guides/drag-scroll-area";
import { ClosuresFig } from "components/bearing-guide/figures";
import { NoteCard, StockedCallout } from "components/bearing-guide/bits";

export function SealsSection({
  head,
  blocks,
}: {
  head: SectionHead;
  blocks: [
    NoteBlock,
    FigureBlock,
    ColumnsBlock,
    SubheadBlock,
    NoteBlock,
    StockedBlock,
  ];
}) {
  const [
    noteBlock1,
    figBlock,
    colsBlock,
    subheadBlock,
    noteBlock2,
    stockedBlock,
  ] = blocks;

  const proseItems = colsBlock.items.map((it) => ({
    title: it.heading,
    text: it.paragraphs.join("\n\n"),
  }));

  return (
    <Section id="seals" bg="muted">
      <Container>
        <SectionHeader {...head} />

        {/* Note 1 */}
        <NoteCard text={noteBlock1.text} />

        {/* Closures figure with horizontal drag-scroll cue */}
        <figure className="w-full flex flex-col">
          <FigCard tone="plain" className="w-full flex flex-col items-center">
            <DragScrollArea
              className="-mx-4 px-4 lg:mx-0 lg:px-0 w-full"
              ariaLabel="Three closures drawn at the same magnification, scrollable"
              cue={true}
              fade="muted"
            >
              <div className="min-w-[614px] flex items-center justify-center py-2">
                <ClosuresFig className="w-full max-w-[614px] h-auto" />
              </div>
            </DragScrollArea>
          </FigCard>
          {figBlock.caption && (
            <FigCaption>{renderRich(figBlock.caption)}</FigCaption>
          )}
        </figure>

        {/* 3 columns on closures */}
        <ProseCols items={proseItems} columns={3} tone="plain" />

        {/* Subhead */}
        <SubHead
          kicker={subheadBlock.kicker ?? "Single vs double"}
          title={subheadBlock.title}
          intro={subheadBlock.intro}
        />

        {/* Note 2 */}
        <NoteCard text={noteBlock2.text} />

        {/* Stocked callout */}
        <StockedCallout label={stockedBlock.label} text={stockedBlock.text} />
      </Container>
    </Section>
  );
}

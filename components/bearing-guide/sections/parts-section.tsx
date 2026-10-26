import type {
  AnatomyBlock,
  CaptionBlock,
  DefinitionsBlock,
  SectionHead,
} from "content/guides/bearings";
import {
  Container,
  DefList,
  FigCaption,
  Section,
  SectionHeader,
} from "components/guides/ui";
import { renderRich } from "components/guides/rich";
import { AnatomyInteractive } from "components/bearing-guide/interactive/anatomy-section";

export function PartsSection({
  head,
  blocks,
}: {
  head: SectionHead;
  blocks: [AnatomyBlock, CaptionBlock, DefinitionsBlock];
}) {
  const [anatomyBlock, captionBlock, definitionsBlock] = blocks;

  return (
    <Section id="parts" bg="white">
      <Container>
        <SectionHeader {...head} />

        {/* Interactive Anatomy Figure + Detail Panel */}
        <AnatomyInteractive block={anatomyBlock} />

        {/* Figure Caption */}
        {captionBlock && (
          <FigCaption>{renderRich(captionBlock.text)}</FigCaption>
        )}

        {/* 3 Definitions */}
        {definitionsBlock && (
          <div className="mt-4 md:mt-8">
            <DefList
              items={definitionsBlock.items.map((item) => ({
                term: item.term,
                note: item.termNote,
                def: item.body,
              }))}
            />
          </div>
        )}
      </Container>
    </Section>
  );
}

import type {
  NoteBlock,
  SectionHead,
  StepperBlock,
  ToolsBlock,
} from "content/guides/bearings";
import { Container, Section, SectionHeader } from "components/guides/ui";
import { CleaningStepperInteractive } from "components/bearing-guide/interactive/cleaning-stepper-section";
import { NoteCard, ToolsGrid } from "components/bearing-guide/bits";

export function CleanSection({
  head,
  blocks,
}: {
  head: SectionHead;
  blocks: [ToolsBlock, StepperBlock, NoteBlock];
}) {
  const [toolsBlock, stepperBlock, noteBlock] = blocks;

  return (
    <Section id="clean" bg="muted">
      <Container>
        <SectionHeader {...head} />

        {/* 4 Tool Cards */}
        <ToolsGrid items={toolsBlock.items} />

        {/* 8-step Interactive Stepper */}
        <CleaningStepperInteractive block={stepperBlock} />

        {/* Note */}
        <NoteCard text={noteBlock.text} />
      </Container>
    </Section>
  );
}

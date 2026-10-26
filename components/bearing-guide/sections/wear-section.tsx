import type { DiagnosisBlock, SectionHead } from "content/guides/bearings";
import { Container, Section, SectionHeader } from "components/guides/ui";
import { DiagnosisInteractive } from "components/bearing-guide/interactive/diagnosis-section";

export function WearSection({
  head,
  blocks,
}: {
  head: SectionHead;
  blocks: [DiagnosisBlock];
}) {
  const [diagnosisBlock] = blocks;

  return (
    <Section id="wear" bg="white">
      <Container>
        <SectionHeader {...head} />

        {/* 6-symptom diagnosis interactive */}
        <DiagnosisInteractive block={diagnosisBlock} />
      </Container>
    </Section>
  );
}

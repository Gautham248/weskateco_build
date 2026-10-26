import type { FaqBlock, SectionHead } from "content/guides/bearings";
import { Container, Section, SectionHeader } from "components/guides/ui";
import { BearingFaqInteractive } from "components/bearing-guide/interactive/bearing-faq-section";

export function FaqSection({
  head,
  blocks,
}: {
  head: SectionHead;
  blocks: [FaqBlock];
}) {
  const [faqBlock] = blocks;

  return (
    <Section id="faq" bg="white">
      <Container>
        <SectionHeader {...head} />

        {/* 8 accordion FAQ items */}
        <BearingFaqInteractive block={faqBlock} />
      </Container>
    </Section>
  );
}

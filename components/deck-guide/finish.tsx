import { FINISH_PROSE, FINISH_SECTION } from "lib/deck-guide/data";
import { ProseCols, SectionHeader, Container, Section } from "components/guides/ui";

export default function FinishSection() {
  return (
    <Section id="finish" bg="muted">
      <Container>
        <SectionHeader
          kicker={FINISH_SECTION.kicker}
          title={FINISH_SECTION.title}
          intro={FINISH_SECTION.intro}
        />

        <ProseCols items={FINISH_PROSE} tone="plain" />
      </Container>
    </Section>
  );
}

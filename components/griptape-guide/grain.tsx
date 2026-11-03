import {
  GRAIN_CARDS,
  GRAIN_DEFS,
  GRAIN_SECTION,
} from "lib/griptape-guide/data";
import { DefList, ProseCols, SectionHeader, Container, Section } from "components/guides/ui";

export default function GrainSection() {
  return (
    <Section id="grain">
      <Container>
        <SectionHeader
          kicker={GRAIN_SECTION.kicker}
          title={GRAIN_SECTION.title}
          intro={GRAIN_SECTION.intro}
        />

        <ProseCols items={GRAIN_CARDS} tone="muted" />

        <DefList items={GRAIN_DEFS} />
      </Container>
    </Section>
  );
}

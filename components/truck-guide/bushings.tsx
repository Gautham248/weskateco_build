import {
  BUSHING_DEFS,
  BUSHINGS_NOTE,
  BUSHINGS_SECTION,
} from "lib/truck-guide/data";
import { DefList, Note, SectionHeader, Container, Section } from "components/guides/ui";

export default function BushingsSection() {
  return (
    <Section id="bushings" bg="muted">
      <Container>
        <SectionHeader
          kicker={BUSHINGS_SECTION.kicker}
          title={BUSHINGS_SECTION.title}
          intro={BUSHINGS_SECTION.intro}
        />

        <DefList items={BUSHING_DEFS} />

        <Note text={BUSHINGS_NOTE} />
      </Container>
    </Section>
  );
}

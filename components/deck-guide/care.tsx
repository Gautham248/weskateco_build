import {
  CARE_DEFS,
  CARE_PROSE,
  CARE_SECTION,
  CARE_SUB,
} from "lib/deck-guide/data";
import { DefList, ProseCols, SectionHeader, SubHead, Container, Section } from "components/guides/ui";

export default function CareSection() {
  return (
    <Section id="care" bg="muted">
      <Container>
        <SectionHeader
          kicker={CARE_SECTION.kicker}
          title={CARE_SECTION.title}
          intro={CARE_SECTION.intro}
        />

        <DefList items={CARE_DEFS} />

        <SubHead
          kicker={CARE_SUB.kicker}
          title={CARE_SUB.title}
          intro={CARE_SUB.intro}
        />

        <ProseCols items={CARE_PROSE} tone="plain" />
      </Container>
    </Section>
  );
}

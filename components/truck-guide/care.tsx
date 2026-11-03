import { CARE_DEFS, CARE_SECTION } from "lib/truck-guide/data";
import { DefList, SectionHeader, Container, Section } from "components/guides/ui";

export default function CareSection() {
  return (
    <Section id="care">
      <Container>
        <SectionHeader
          kicker={CARE_SECTION.kicker}
          title={CARE_SECTION.title}
          intro={CARE_SECTION.intro}
        />

        <DefList items={CARE_DEFS} />
      </Container>
    </Section>
  );
}

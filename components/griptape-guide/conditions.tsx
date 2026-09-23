import {
  CONDITIONS_CARDS,
  CONDITIONS_CROSSLINK,
  CONDITIONS_SECTION,
} from "lib/griptape-guide/data";
import GripCrosslink from "components/guides/callout";
import { ProseCols, SectionHeader, Container, Section } from "components/guides/ui";

export default function ConditionsSection() {
  return (
    <Section id="conditions" bg="muted">
      <Container>
        <SectionHeader
          kicker={CONDITIONS_SECTION.kicker}
          title={CONDITIONS_SECTION.title}
          intro={CONDITIONS_SECTION.intro}
        />

        <ProseCols
          items={CONDITIONS_CARDS.map((card) => ({
            title: card.title,
            sub: card.sub,
            text: card.text,
          }))}
          columns={3}
          tone="plain"
        />

        <GripCrosslink {...CONDITIONS_CROSSLINK} />
      </Container>
    </Section>
  );
}

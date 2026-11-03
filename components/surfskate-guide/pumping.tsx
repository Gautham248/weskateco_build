import {
  Container,
  FigCaption,
  FigCard,
  Note,
  ProseCols,
  Section,
  SectionHeader,
} from "components/guides/ui";
import {
  PUMP_CAPTION,
  PUMP_NOTE,
  PUMP_PROSE,
  PUMP_SECTION,
} from "lib/surfskate-guide/data";
import { PUMP_FIGURE } from "lib/surfskate-guide/figures";
import { SurfFigure } from "./bits";

export default function PumpingSection() {
  return (
    <Section id="pump" bg="muted">
      <Container>
        <SectionHeader
          kicker={PUMP_SECTION.kicker}
          title={PUMP_SECTION.title}
          intro={PUMP_SECTION.intro}
        />

        <FigCard tone="plain">
          <figure>
            <SurfFigure html={PUMP_FIGURE} />
            <FigCaption>{PUMP_CAPTION}</FigCaption>
          </figure>
        </FigCard>

        <ProseCols items={PUMP_PROSE} tone="plain" />

        <Note text={PUMP_NOTE} />
      </Container>
    </Section>
  );
}

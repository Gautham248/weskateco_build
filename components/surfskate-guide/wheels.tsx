import {
  Container,
  GuideTable,
  Note,
  ProseCols,
  Section,
  SectionHeader,
} from "components/guides/ui";
import {
  WHEELS_NOTE,
  WHEELS_PROSE,
  WHEELS_SECTION,
  WHEELS_STOCKED,
  WHEELS_TABLE_COLS,
  WHEELS_TABLE_ROWS,
} from "lib/surfskate-guide/data";
import { Stocked } from "./bits";

export default function WheelsSection() {
  return (
    <Section id="wheels">
      <Container>
        <SectionHeader
          kicker={WHEELS_SECTION.kicker}
          title={WHEELS_SECTION.title}
          intro={WHEELS_SECTION.intro}
        />

        <GuideTable
          srLabel="Attribute"
          cols={WHEELS_TABLE_COLS}
          rows={WHEELS_TABLE_ROWS}
          cue
        />

        <ProseCols items={WHEELS_PROSE} columns={3} tone="muted" />

        <Note text={WHEELS_NOTE} />

        <Stocked text={WHEELS_STOCKED} />
      </Container>
    </Section>
  );
}

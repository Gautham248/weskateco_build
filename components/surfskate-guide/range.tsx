import {
  Container,
  GuideTable,
  ProseCols,
  Section,
  SectionHeader,
} from "components/guides/ui";
import {
  RANGE_PROSE,
  RANGE_SECTION,
  RANGE_STOCKED,
  RANGE_TABLE_COLS,
  RANGE_TABLE_ROWS,
} from "lib/surfskate-guide/data";
import { Stocked } from "./bits";

export default function RangeSection() {
  return (
    <Section id="range">
      <Container>
        <SectionHeader
          kicker={RANGE_SECTION.kicker}
          title={RANGE_SECTION.title}
          intro={RANGE_SECTION.intro}
        />

        <GuideTable
          srLabel="Model"
          cols={RANGE_TABLE_COLS}
          rows={RANGE_TABLE_ROWS}
          minW="min-w-[900px]"
          cue
        />

        <ProseCols items={RANGE_PROSE} columns={3} tone="muted" />

        <Stocked text={RANGE_STOCKED} />
      </Container>
    </Section>
  );
}

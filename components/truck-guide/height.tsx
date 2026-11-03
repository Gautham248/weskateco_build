import {
  HEIGHT_CARDS,
  HEIGHT_NOTE,
  HEIGHT_SECTION,
  HEIGHT_TABLE_COLS,
  HEIGHT_TABLE_ROWS,
  WHEELBITE_SUB,
} from "lib/truck-guide/data";
import { GuideTable, Note, ProseCols, SectionHeader, SubHead, Container, Section } from "components/guides/ui";

export default function HeightSection() {
  return (
    <Section id="height">
      <Container>
        <SectionHeader
          kicker={HEIGHT_SECTION.kicker}
          title={HEIGHT_SECTION.title}
          intro={HEIGHT_SECTION.intro}
        />

        <ProseCols items={HEIGHT_CARDS} columns={3} tone="muted" />

        <SubHead
          kicker={WHEELBITE_SUB.kicker}
          title={WHEELBITE_SUB.title}
          intro={WHEELBITE_SUB.intro}
        />

        <GuideTable
          srLabel="Wheel size"
          cols={HEIGHT_TABLE_COLS}
          rows={HEIGHT_TABLE_ROWS}
        />

        <Note text={HEIGHT_NOTE} />
      </Container>
    </Section>
  );
}

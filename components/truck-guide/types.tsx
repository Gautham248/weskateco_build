import {
  SURFSKATE_PROSE,
  SURFSKATE_SUB,
  SURFSKATE_TABLE_COLS,
  SURFSKATE_TABLE_ROWS,
  TYPES_CARDS,
  TYPES_NOTE,
  TYPES_NOTE_2,
  TYPES_NOTE_3,
  TYPES_SECTION,
  TYPES_TABLE_COLS,
  TYPES_TABLE_ROWS,
} from "lib/truck-guide/data";
import { GuideTable, Note, ProseCols, SectionHeader, SubHead, Container, Section } from "components/guides/ui";

export default function TypesSection() {
  return (
    <Section id="types">
      <Container>
        <SectionHeader
          kicker={TYPES_SECTION.kicker}
          title={TYPES_SECTION.title}
          intro={TYPES_SECTION.intro}
        />

        <ProseCols items={TYPES_CARDS} tone="muted" />

        <GuideTable
          srLabel="Truck family"
          cols={TYPES_TABLE_COLS}
          rows={TYPES_TABLE_ROWS}
        />

        <Note text={TYPES_NOTE} />

        <SubHead
          kicker={SURFSKATE_SUB.kicker}
          title={SURFSKATE_SUB.title}
          intro={SURFSKATE_SUB.intro}
        />

        <ProseCols items={SURFSKATE_PROSE} tone="muted" />

        <GuideTable
          srLabel="Surfskate mechanism"
          cols={SURFSKATE_TABLE_COLS}
          rows={SURFSKATE_TABLE_ROWS}
        />

        <Note text={TYPES_NOTE_2} />
        <Note text={TYPES_NOTE_3} />
      </Container>
    </Section>
  );
}

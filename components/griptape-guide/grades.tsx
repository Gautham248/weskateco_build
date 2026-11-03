import {
  GRADES_NOTE,
  GRADES_SECTION,
  GRADES_TABLE_COLS,
  GRADES_TABLE_ROWS,
} from "lib/griptape-guide/data";
import { GuideTable, Note, SectionHeader, Container, Section } from "components/guides/ui";

export default function GradesSection() {
  return (
    <Section id="grades" bg="muted">
      <Container>
        <SectionHeader
          kicker={GRADES_SECTION.kicker}
          title={GRADES_SECTION.title}
          intro={GRADES_SECTION.intro}
        />

        <GuideTable
          srLabel="Spec"
          cols={GRADES_TABLE_COLS}
          rows={GRADES_TABLE_ROWS}
        />

        <Note text={GRADES_NOTE} />
      </Container>
    </Section>
  );
}

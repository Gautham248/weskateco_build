import { RangeLayout } from "components/guides/range-layout";
import { GuideTable, Note } from "components/guides/ui";
import {
  RANGE_CROSSLINK,
  RANGE_NOTE_1,
  RANGE_NOTE_2,
  RANGE_SECTION,
  RANGE_TABLE_COLS,
  RANGE_TABLE_ROWS,
} from "lib/deck-guide/data";

export default function RangeSection() {
  return (
    <RangeLayout header={RANGE_SECTION} crosslink={RANGE_CROSSLINK}>
      <GuideTable
        srLabel="Spec"
        cols={RANGE_TABLE_COLS}
        rows={RANGE_TABLE_ROWS}
      />
      <Note text={RANGE_NOTE_1} />
      <Note text={RANGE_NOTE_2} />
    </RangeLayout>
  );
}

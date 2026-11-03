import { RangeLayout } from "components/guides/range-layout";
import { GuideTable, ProseCols } from "components/guides/ui";
import {
  RANGE_CROSSLINK,
  RANGE_PROSE,
  RANGE_SECTION,
  RANGE_TABLE_COLS,
  RANGE_TABLE_ROWS,
} from "lib/truck-guide/data";

export default function RangeSection() {
  return (
    <RangeLayout bg="muted" header={RANGE_SECTION} crosslink={RANGE_CROSSLINK}>
      <GuideTable
        srLabel="Attribute"
        cols={RANGE_TABLE_COLS}
        rows={RANGE_TABLE_ROWS}
        minW="min-w-[900px]"
      />
      <ProseCols items={RANGE_PROSE} tone="plain" />
    </RangeLayout>
  );
}

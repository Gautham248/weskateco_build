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
import { GuideTable, Note, ProseCols, SectionHeader, SubHead } from "./ui";

export default function TypesSection() {
  return (
    <section
      id="types"
      className="w-full bg-white text-black py-10 md:py-24 overflow-hidden scroll-mt-[136px]"
    >
      <div className="mx-auto max-w-(--breakpoint-2xl) px-4 lg:px-15 flex flex-col gap-6 md:gap-10">
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
      </div>
    </section>
  );
}

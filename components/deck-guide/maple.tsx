import {
  HUMIDITY_TABLE_COLS,
  HUMIDITY_TABLE_ROWS,
  MAPLE_LABEL_CARDS,
  MAPLE_LABEL_SUB,
  MAPLE_NOTE,
  MAPLE_PROSE,
  MAPLE_SECTION,
  MAPLE_TABLE_COLS,
  MAPLE_TABLE_ROWS,
  MOISTURE_MOVE_PROSE,
  MOISTURE_NOTE,
  MOISTURE_PROSE,
  MOISTURE_SUB,
} from "lib/deck-guide/data";
import { GuideTable, Note, ProseCols, SectionHeader, SubHead } from "./ui";

export default function MapleSection() {
  return (
    <section
      id="maple"
      className="w-full bg-white text-black py-10 md:py-24 overflow-hidden scroll-mt-[136px]"
    >
      <div className="mx-auto max-w-(--breakpoint-2xl) px-4 lg:px-15 flex flex-col gap-6 md:gap-10">
        <SectionHeader
          kicker={MAPLE_SECTION.kicker}
          title={MAPLE_SECTION.title}
          intro={MAPLE_SECTION.intro}
        />

        <GuideTable
          srLabel="Property"
          cols={MAPLE_TABLE_COLS}
          rows={MAPLE_TABLE_ROWS}
        />

        <Note text={MAPLE_NOTE} />

        <ProseCols items={MAPLE_PROSE} tone="muted" />

        <SubHead
          kicker={MAPLE_LABEL_SUB.kicker}
          title={MAPLE_LABEL_SUB.title}
          intro={MAPLE_LABEL_SUB.intro}
        />

        <ProseCols items={MAPLE_LABEL_CARDS} columns={3} tone="muted" />

        <SubHead
          kicker={MOISTURE_SUB.kicker}
          title={MOISTURE_SUB.title}
          intro={MOISTURE_SUB.intro}
        />

        <ProseCols items={MOISTURE_PROSE} tone="muted" />

        <GuideTable
          srLabel="Humidity"
          cols={HUMIDITY_TABLE_COLS}
          rows={HUMIDITY_TABLE_ROWS}
          minW="min-w-[880px]"
        />

        <Note text={MOISTURE_NOTE} />

        <ProseCols items={MOISTURE_MOVE_PROSE} tone="muted" />
      </div>
    </section>
  );
}

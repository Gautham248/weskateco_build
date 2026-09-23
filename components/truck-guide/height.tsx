import {
  HEIGHT_CARDS,
  HEIGHT_NOTE,
  HEIGHT_SECTION,
  HEIGHT_TABLE_COLS,
  HEIGHT_TABLE_ROWS,
  WHEELBITE_SUB,
} from "lib/truck-guide/data";
import { GuideTable, Note, ProseCols, SectionHeader, SubHead } from "./ui";

export default function HeightSection() {
  return (
    <section
      id="height"
      className="w-full bg-white text-black py-10 md:py-24 overflow-hidden scroll-mt-[136px]"
    >
      <div className="mx-auto max-w-(--breakpoint-2xl) px-4 lg:px-15 flex flex-col gap-6 md:gap-10">
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
      </div>
    </section>
  );
}

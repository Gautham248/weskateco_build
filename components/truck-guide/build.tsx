import {
  BUILD_CARDS,
  BUILD_NOTE,
  BUILD_PROSE,
  BUILD_SECTION,
  EXPENSIVE_NOTE,
  EXPENSIVE_PROSE,
  EXPENSIVE_SUB,
  MATERIALS_TABLE_COLS,
  MATERIALS_TABLE_ROWS,
  METALS_SUB,
} from "lib/truck-guide/data";
import { GuideTable, Note, ProseCols, SectionHeader, SubHead } from "./ui";

export default function BuildSection() {
  return (
    <section
      id="build"
      className="w-full bg-white text-black py-10 md:py-24 overflow-hidden scroll-mt-[136px]"
    >
      <div className="mx-auto max-w-(--breakpoint-2xl) px-4 lg:px-15 flex flex-col gap-6 md:gap-10">
        <SectionHeader
          kicker={BUILD_SECTION.kicker}
          title={BUILD_SECTION.title}
          intro={BUILD_SECTION.intro}
        />

        <ProseCols items={BUILD_CARDS} columns={3} tone="muted" />

        <Note text={BUILD_NOTE} />

        <ProseCols items={BUILD_PROSE} tone="muted" />

        <SubHead
          kicker={METALS_SUB.kicker}
          title={METALS_SUB.title}
          intro={METALS_SUB.intro}
        />

        <GuideTable
          srLabel="Part"
          cols={MATERIALS_TABLE_COLS}
          rows={MATERIALS_TABLE_ROWS}
        />

        <SubHead
          kicker={EXPENSIVE_SUB.kicker}
          title={EXPENSIVE_SUB.title}
          intro={EXPENSIVE_SUB.intro}
        />

        <ProseCols items={EXPENSIVE_PROSE} tone="muted" />

        <Note text={EXPENSIVE_NOTE} />
      </div>
    </section>
  );
}

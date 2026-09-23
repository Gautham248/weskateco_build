import {
  RANGE_CROSSLINK,
  RANGE_NOTE_1,
  RANGE_NOTE_2,
  RANGE_SECTION,
  RANGE_TABLE_COLS,
  RANGE_TABLE_ROWS,
} from "lib/deck-guide/data";
import DeckCrosslink from "./callout";
import { GuideTable, Note, SectionHeader } from "./ui";

export default function RangeSection() {
  return (
    <section
      id="range"
      className="w-full bg-white text-black py-10 md:py-24 overflow-hidden scroll-mt-[136px]"
    >
      <div className="mx-auto max-w-(--breakpoint-2xl) px-4 lg:px-15 flex flex-col gap-6 md:gap-10">
        <SectionHeader
          kicker={RANGE_SECTION.kicker}
          title={RANGE_SECTION.title}
          intro={RANGE_SECTION.intro}
        />

        <GuideTable
          srLabel="Spec"
          cols={RANGE_TABLE_COLS}
          rows={RANGE_TABLE_ROWS}
        />

        <Note text={RANGE_NOTE_1} />
        <Note text={RANGE_NOTE_2} />

        <DeckCrosslink
          text={RANGE_CROSSLINK.text}
          cta={RANGE_CROSSLINK.cta}
          href={RANGE_CROSSLINK.href}
        />
      </div>
    </section>
  );
}

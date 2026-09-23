import TruckCrosslink from "./callout";
import {
  RANGE_CROSSLINK,
  RANGE_PROSE,
  RANGE_SECTION,
  RANGE_TABLE_COLS,
  RANGE_TABLE_ROWS,
} from "lib/truck-guide/data";
import { GuideTable, ProseCols, SectionHeader } from "./ui";

export default function RangeSection() {
  return (
    <section
      id="range"
      className="w-full bg-[#F7F7F9] text-black py-10 md:py-24 overflow-hidden scroll-mt-[136px]"
    >
      <div className="mx-auto max-w-(--breakpoint-2xl) px-4 lg:px-15 flex flex-col gap-6 md:gap-10">
        <SectionHeader
          kicker={RANGE_SECTION.kicker}
          title={RANGE_SECTION.title}
          intro={RANGE_SECTION.intro}
        />

        <GuideTable
          srLabel="Attribute"
          cols={RANGE_TABLE_COLS}
          rows={RANGE_TABLE_ROWS}
          minW="min-w-[900px]"
        />

        <ProseCols items={RANGE_PROSE} tone="plain" />

        <TruckCrosslink
          text={RANGE_CROSSLINK.text}
          cta={RANGE_CROSSLINK.cta}
          href={RANGE_CROSSLINK.href}
        />
      </div>
    </section>
  );
}

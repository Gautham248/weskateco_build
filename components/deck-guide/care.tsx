import {
  CARE_DEFS,
  CARE_PROSE,
  CARE_SECTION,
  CARE_SUB,
} from "lib/deck-guide/data";
import { DefList, ProseCols, SectionHeader, SubHead } from "./ui";

export default function CareSection() {
  return (
    <section
      id="care"
      className="w-full bg-[#F7F7F9] text-black py-10 md:py-24 overflow-hidden scroll-mt-[136px]"
    >
      <div className="mx-auto max-w-(--breakpoint-2xl) px-4 lg:px-15 flex flex-col gap-6 md:gap-10">
        <SectionHeader
          kicker={CARE_SECTION.kicker}
          title={CARE_SECTION.title}
          intro={CARE_SECTION.intro}
        />

        <DefList items={CARE_DEFS} />

        <SubHead
          kicker={CARE_SUB.kicker}
          title={CARE_SUB.title}
          intro={CARE_SUB.intro}
        />

        <ProseCols items={CARE_PROSE} tone="plain" />
      </div>
    </section>
  );
}

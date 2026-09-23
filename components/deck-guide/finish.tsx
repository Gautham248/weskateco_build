import { FINISH_PROSE, FINISH_SECTION } from "lib/deck-guide/data";
import { ProseCols, SectionHeader } from "./ui";

export default function FinishSection() {
  return (
    <section
      id="finish"
      className="w-full bg-[#F7F7F9] text-black py-10 md:py-24 overflow-hidden scroll-mt-[136px]"
    >
      <div className="mx-auto max-w-(--breakpoint-2xl) px-4 lg:px-15 flex flex-col gap-6 md:gap-10">
        <SectionHeader
          kicker={FINISH_SECTION.kicker}
          title={FINISH_SECTION.title}
          intro={FINISH_SECTION.intro}
        />

        <ProseCols items={FINISH_PROSE} tone="plain" />
      </div>
    </section>
  );
}

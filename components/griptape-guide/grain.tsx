import {
  GRAIN_CARDS,
  GRAIN_DEFS,
  GRAIN_SECTION,
} from "lib/griptape-guide/data";
import { DefList, ProseCols, SectionHeader } from "./ui";

export default function GrainSection() {
  return (
    <section
      id="grain"
      className="w-full bg-white text-black py-10 md:py-24 overflow-hidden scroll-mt-[136px]"
    >
      <div className="mx-auto max-w-(--breakpoint-2xl) px-4 lg:px-15 flex flex-col gap-6 md:gap-10">
        <SectionHeader
          kicker={GRAIN_SECTION.kicker}
          title={GRAIN_SECTION.title}
          intro={GRAIN_SECTION.intro}
        />

        <ProseCols items={GRAIN_CARDS} tone="muted" />

        <DefList items={GRAIN_DEFS} />
      </div>
    </section>
  );
}

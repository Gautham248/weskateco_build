import {
  BUSHING_DEFS,
  BUSHINGS_NOTE,
  BUSHINGS_SECTION,
} from "lib/truck-guide/data";
import { DefList, Note, SectionHeader } from "./ui";

export default function BushingsSection() {
  return (
    <section
      id="bushings"
      className="w-full bg-[#F7F7F9] text-black py-10 md:py-24 overflow-hidden scroll-mt-[136px]"
    >
      <div className="mx-auto max-w-(--breakpoint-2xl) px-4 lg:px-15 flex flex-col gap-6 md:gap-10">
        <SectionHeader
          kicker={BUSHINGS_SECTION.kicker}
          title={BUSHINGS_SECTION.title}
          intro={BUSHINGS_SECTION.intro}
        />

        <DefList items={BUSHING_DEFS} />

        <Note text={BUSHINGS_NOTE} />
      </div>
    </section>
  );
}

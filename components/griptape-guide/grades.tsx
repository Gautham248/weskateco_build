import {
  GRADES_NOTE,
  GRADES_SECTION,
  GRADES_TABLE_COLS,
  GRADES_TABLE_ROWS,
} from "lib/griptape-guide/data";
import { GuideTable, Note, SectionHeader } from "./ui";

export default function GradesSection() {
  return (
    <section
      id="grades"
      className="w-full bg-[#F7F7F9] text-black py-10 md:py-24 overflow-hidden scroll-mt-[136px]"
    >
      <div className="mx-auto max-w-(--breakpoint-2xl) px-4 lg:px-15 flex flex-col gap-6 md:gap-10">
        <SectionHeader
          kicker={GRADES_SECTION.kicker}
          title={GRADES_SECTION.title}
          intro={GRADES_SECTION.intro}
        />

        <GuideTable
          srLabel="Spec"
          cols={GRADES_TABLE_COLS}
          rows={GRADES_TABLE_ROWS}
        />

        <Note text={GRADES_NOTE} />
      </div>
    </section>
  );
}

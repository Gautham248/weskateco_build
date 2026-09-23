import {
  EPOXY_CROSSLINK,
  EPOXY_LOCAL_DEFS,
  EPOXY_LOCAL_SUB,
  EPOXY_NOTE,
  EPOXY_PROSE,
  EPOXY_SECTION,
  EPOXY_TABLE_COLS,
  EPOXY_TABLE_ROWS,
} from "lib/deck-guide/data";
import DeckCrosslink from "./callout";
import {
  DefList,
  GuideTable,
  Note,
  ProseCols,
  SectionHeader,
  SubHead,
} from "./ui";

export default function EpoxySection() {
  return (
    <section
      id="epoxy"
      className="w-full bg-[#F7F7F9] text-black py-10 md:py-24 overflow-hidden scroll-mt-[136px]"
    >
      <div className="mx-auto max-w-(--breakpoint-2xl) px-4 lg:px-15 flex flex-col gap-6 md:gap-10">
        <SectionHeader
          kicker={EPOXY_SECTION.kicker}
          title={EPOXY_SECTION.title}
          intro={EPOXY_SECTION.intro}
        />

        <ProseCols items={EPOXY_PROSE} tone="plain" />

        <GuideTable
          srLabel="Property"
          cols={EPOXY_TABLE_COLS}
          rows={EPOXY_TABLE_ROWS}
        />

        <SubHead
          kicker={EPOXY_LOCAL_SUB.kicker}
          title={EPOXY_LOCAL_SUB.title}
          intro={EPOXY_LOCAL_SUB.intro}
        />

        <DefList items={EPOXY_LOCAL_DEFS} />

        <Note text={EPOXY_NOTE} />

        <DeckCrosslink
          text={EPOXY_CROSSLINK.text}
          cta={EPOXY_CROSSLINK.cta}
          href={EPOXY_CROSSLINK.href}
        />
      </div>
    </section>
  );
}

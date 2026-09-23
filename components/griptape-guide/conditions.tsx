import {
  CONDITIONS_CARDS,
  CONDITIONS_CROSSLINK,
  CONDITIONS_SECTION,
} from "lib/griptape-guide/data";
import GripCrosslink from "./callout";
import { ProseCols, SectionHeader } from "./ui";

export default function ConditionsSection() {
  return (
    <section
      id="conditions"
      className="w-full bg-[#F7F7F9] text-black py-10 md:py-24 overflow-hidden scroll-mt-[136px]"
    >
      <div className="mx-auto max-w-(--breakpoint-2xl) px-4 lg:px-15 flex flex-col gap-6 md:gap-10">
        <SectionHeader
          kicker={CONDITIONS_SECTION.kicker}
          title={CONDITIONS_SECTION.title}
          intro={CONDITIONS_SECTION.intro}
        />

        <ProseCols
          items={CONDITIONS_CARDS.map((card) => ({
            title: card.title,
            sub: card.sub,
            text: card.text,
          }))}
          columns={3}
          tone="plain"
        />

        <GripCrosslink {...CONDITIONS_CROSSLINK} />
      </div>
    </section>
  );
}

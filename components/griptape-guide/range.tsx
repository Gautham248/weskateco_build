import {
  RANGE_CAPTION,
  RANGE_CROSSLINK,
  RANGE_NOTE_1,
  RANGE_NOTE_2,
  RANGE_PRODUCTS,
  RANGE_SECTION,
  RANGE_TABLE_COLS,
  RANGE_TABLE_ROWS,
} from "lib/griptape-guide/data";
import GripCrosslink from "./callout";
import ProductTile from "./product-tile";
import { GuideTable, Note, SectionHeader } from "./ui";

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

        {/* Product strip — real product photography */}
        <div className="flex flex-col">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {RANGE_PRODUCTS.map((product) => (
              <ProductTile key={product.name} {...product} />
            ))}
          </div>
          <p className="mt-4 text-xs md:text-sm text-neutral-500 leading-[160%] max-w-4xl">
            {RANGE_CAPTION}
          </p>
        </div>

        <GuideTable
          srLabel="Sheet"
          cols={RANGE_TABLE_COLS}
          rows={RANGE_TABLE_ROWS}
        />

        <Note text={RANGE_NOTE_1} />
        <Note text={RANGE_NOTE_2} />

        <GripCrosslink {...RANGE_CROSSLINK} />
      </div>
    </section>
  );
}

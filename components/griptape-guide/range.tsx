import { RangeLayout } from "components/guides/range-layout";
import { GuideTable, Note } from "components/guides/ui";
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
import ProductTile from "./product-tile";

export default function RangeSection() {
  return (
    <RangeLayout bg="muted" header={RANGE_SECTION} crosslink={RANGE_CROSSLINK}>
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
    </RangeLayout>
  );
}

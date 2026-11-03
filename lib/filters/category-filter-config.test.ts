import { getLabelForFilterValue } from "lib/filters/category-filter-config";
import { describe, expect, it } from "vitest";

describe("getLabelForFilterValue", () => {
  it("getLabelForFilterValue('price', ...) formats as a currency range", () => {
    expect(getLabelForFilterValue("price", "1200-7500", [])).toBe(
      "₹1,200 - ₹7,500",
    );
  });
});

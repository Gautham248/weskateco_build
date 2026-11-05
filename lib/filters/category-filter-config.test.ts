import {
  getLabelForFilterValue,
  stripCategoryPrefix,
} from "lib/filters/category-filter-config";
import { describe, expect, it } from "vitest";

describe("getLabelForFilterValue", () => {
  it("getLabelForFilterValue('price', ...) formats as a currency range", () => {
    expect(getLabelForFilterValue("price", "1200-7500", [])).toBe(
      "₹1,200 - ₹7,500",
    );
  });
});

describe("stripCategoryPrefix", () => {
  it("drops the parent's word from an English title, singular or plural", () => {
    expect(stripCategoryPrefix("Skateboard Decks", "skateboards", "en")).toBe(
      "Decks",
    );
    expect(
      stripCategoryPrefix("Skateboards Complete", "skateboards", "en"),
    ).toBe("Complete");
    expect(stripCategoryPrefix("SURFSKATE Wheels", "surfskates", "en")).toBe(
      "Wheels",
    );
  });

  it("drops the parent's word from a Hindi title", () => {
    expect(stripCategoryPrefix("स्केटबोर्ड डेक्स", "skateboards", "hi")).toBe(
      "डेक्स",
    );
    expect(
      stripCategoryPrefix("सर्फ़स्केट्स व्हील्स", "surfskates", "hi"),
    ).toBe("व्हील्स");
  });

  it("shows a title that doesn't start with the word whole", () => {
    expect(stripCategoryPrefix("ग्रिपटेप", "skateboards", "hi")).toBe(
      "ग्रिपटेप",
    );
    expect(stripCategoryPrefix("Griptape", "skateboards", "en")).toBe(
      "Griptape",
    );
  });

  it("never strips a title down to nothing", () => {
    expect(stripCategoryPrefix("Skateboards", "skateboards", "en")).toBe(
      "Skateboards",
    );
  });

  it("leaves titles alone under an unknown parent", () => {
    expect(stripCategoryPrefix("Skateboard Decks", "", "en")).toBe(
      "Skateboard Decks",
    );
  });
});

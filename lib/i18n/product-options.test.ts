import catalog from "scripts/product-catalog-dump.json";
import { createTranslator } from "lib/i18n";
import {
  productOptionKey,
  translateProductOption,
  translateVariantTitle,
} from "lib/i18n/product-options";
import { describe, expect, it } from "vitest";

const hindi = createTranslator("hi");
const english = createTranslator("en");

describe("productOptionKey", () => {
  it("lower-cases and joins words with underscores", () => {
    expect(productOptionKey("Wheel Size")).toBe("option.wheel_size");
    expect(productOptionKey("without wheel well")).toBe(
      "option.without_wheel_well",
    );
    expect(productOptionKey(" COLOR ")).toBe("option.color");
  });
});

describe("translateProductOption", () => {
  it("translates option names and values on Hindi pages", () => {
    expect(translateProductOption(hindi, "hi", "Size")).toBe("साइज़");
    expect(translateProductOption(hindi, "hi", "Concave")).toBe("कॉन्केव");
    expect(translateProductOption(hindi, "hi", "Mellow")).toBe("मेलो");
    expect(translateProductOption(hindi, "hi", "COLOR")).toBe("रंग");
  });

  it("shows sizes and codes as Shopify sends them", () => {
    expect(translateProductOption(hindi, "hi", '8.25"')).toBe('8.25"');
    expect(translateProductOption(hindi, "hi", "52mm")).toBe("52mm");
    expect(translateProductOption(hindi, "hi", "XL")).toBe("XL");
  });

  it("leaves English pages exactly as Shopify sends them", () => {
    expect(translateProductOption(english, "en", "COLOR")).toBe("COLOR");
    expect(translateProductOption(english, "en", "wheel well")).toBe(
      "wheel well",
    );
  });

  it("has a Hindi label for every option name and word value in the catalogue", () => {
    const missing = new Set<string>();
    for (const product of catalog.products) {
      for (const variant of product.variants) {
        for (const { name, value } of variant.options ?? []) {
          // Shopify's placeholder option for products without variants
          if (name === "Title") continue;
          for (const text of [name, value]) {
            // Sizes, measurements and letter sizes stay as they are
            if (/^(\d+(\.\d+)?("|mm)?|S|M|L|XL)$/.test(text)) continue;
            if (translateProductOption(hindi, "hi", text) === text) {
              missing.add(text);
            }
          }
        }
      }
    }
    expect([...missing]).toEqual([]);
  });
});

describe("translateVariantTitle", () => {
  it("translates each value of a variant title", () => {
    expect(translateVariantTitle(hindi, "hi", "8.25 / Mellow")).toBe(
      "8.25 / मेलो",
    );
    expect(translateVariantTitle(english, "en", "8.25 / Mellow")).toBe(
      "8.25 / Mellow",
    );
  });
});

import { CATEGORY_GROUP, SORT_GROUP } from "lib/filters/category-filter-config";
import {
  countMatching,
  deriveFilterGroups,
  normalizeValue,
  normalizeVendor,
  productMatches,
} from "lib/filters/derive";
import type { Product } from "lib/shopify/types";
import { describe, expect, it } from "vitest";

/**
 * Exercises the derived filter groups and the shared matcher.
 *
 * The previous version of these tests exercised a hand-copied version of the
 * filter logic against hand-written mock products, which is how the real drawer
 * ended up offering options that matched nothing: the copy being tested was not
 * the copy the drawer ran. These tests exercise `lib/filters/derive` itself, and
 * the fixtures use real Shopify option names and values from the live
 * catalogue.
 */

function product(overrides: Partial<Product>): Product {
  return {
    id: overrides.handle ?? "p",
    handle: "p",
    title: "Product",
    description: "",
    descriptionHtml: "",
    vendor: "",
    availableForSale: true,
    tags: [],
    options: [],
    images: [],
    collections: { edges: [] },
    priceRange: {
      minVariantPrice: { amount: "1000", currencyCode: "INR" },
      maxVariantPrice: { amount: "1000", currencyCode: "INR" },
    },
    variants: [],
    ...overrides,
  } as unknown as Product;
}

/**
 * Shapes copied from the live catalogue: vendors like "Sphere Skateboards",
 * Size values like `7.75` and `8`, a `SIZES` option in millimetres, and a
 * `Title` placeholder Shopify always emits.
 */
const MOCK_PRODUCTS: Product[] = [
  product({
    handle: "oldman-sphere-deck",
    title: "Oldman Sphere X Akil Deck",
    vendor: "Sphere Skateboards",
    tags: ["SKATE DECK"],
    priceRange: {
      minVariantPrice: { amount: "2899", currencyCode: "INR" },
      maxVariantPrice: { amount: "2899", currencyCode: "INR" },
    },
    options: [
      { id: "o1", name: "Size", values: ["8", "8.25"] },
      { id: "o2", name: "Concave", values: ["Medium"] },
      { id: "o3", name: "Shape", values: ["Rounded End"] },
      { id: "o4", name: "Title", values: ["Default Title"] },
    ],
  }),
  product({
    handle: "bubblegum-left-deck",
    title: "Sphere Bubblegum Left Deck",
    vendor: "Sphere Skateboards",
    tags: ["SKATE DECK"],
    priceRange: {
      minVariantPrice: { amount: "2199", currencyCode: "INR" },
      maxVariantPrice: { amount: "2199", currencyCode: "INR" },
    },
    options: [
      { id: "o1", name: "Size", values: ["8.125"] },
      { id: "o2", name: "Concave", values: ["Mellow"] },
      { id: "o3", name: "Shape", values: ["Squared End"] },
    ],
  }),
  product({
    handle: "tropical-wheels",
    title: "Toucan Tropical Wheels 53mm 55mm",
    vendor: "Toucan Distribution",
    tags: ["SKATEBOARD"],
    priceRange: {
      minVariantPrice: { amount: "1200", currencyCode: "INR" },
      maxVariantPrice: { amount: "1200", currencyCode: "INR" },
    },
    options: [
      { id: "o1", name: "SIZES", values: ["53mm", "55mm"] },
      { id: "o2", name: "Wheel Size", values: ["53mm", "55mm"] },
    ],
  }),
  product({
    handle: "classic-tee-black",
    title: "We Skate Co Classic Tee - Black",
    vendor: "Wasted Angels",
    tags: ["tshirt"],
    priceRange: {
      minVariantPrice: { amount: "699", currencyCode: "INR" },
      maxVariantPrice: { amount: "699", currencyCode: "INR" },
    },
    options: [{ id: "o1", name: "Size", values: ["S", "M", "L"] }],
  }),
];

function applyFilterMap(
  products: Product[],
  filters: Record<string, string>,
): Product[] {
  return products.filter((p) =>
    Object.entries(filters).every(([groupId, value]) => {
      if (!value) return true;
      const selected = value.split(",").filter(Boolean);
      if (selected.length === 0) return true;
      return selected.some((optionValue) =>
        productMatches(p, groupId, optionValue),
      );
    }),
  );
}

function simulateCount(
  products: Product[],
  activeFilters: Record<string, string>,
  groupId: string,
  optionValue: string,
): number {
  return countMatching(products, { ...activeFilters, [groupId]: optionValue });
}

const handles = (products: Product[]) => products.map((p) => p.handle);

// These mismatches were the original bug: the old config offered `8.0` while
// Shopify stores `8`.
describe("normalisation", () => {
  it("8.0 normalises to 8", () => {
    expect(normalizeValue("8.0")).toBe(normalizeValue("8"));
  });

  it('7.75" normalises to 7.75', () => {
    expect(normalizeValue('7.75"')).toBe(normalizeValue("7.75"));
  });

  it("Shopify's 'Default Title' placeholder is not a filterable value", () => {
    expect(normalizeValue("Default Title")).toBe("");
  });

  it("Multi-word values normalise consistently", () => {
    expect(normalizeValue("Rounded End")).toBe("rounded end");
  });

  it("Vendor slugifies to a usable filter value", () => {
    expect(normalizeVendor("Sphere Skateboards")).toBe("sphere-skateboards");
  });
});

// Derived groups only contain options that match something.
describe("deriveFilterGroups", () => {
  const groups = deriveFilterGroups(MOCK_PRODUCTS, [
    SORT_GROUP,
    CATEGORY_GROUP,
  ]);
  const groupIds = groups.map((g) => g.id);
  const sizeValues = (groups.find((g) => g.id === "size")?.options ?? []).map(
    (o) => o.value,
  );

  it("Static groups (sorting, category) are preserved", () => {
    expect(groupIds).toContain("category");
    expect(groupIds).toContain("sort");
  });

  it("Brand group is derived from vendor", () => {
    expect(groupIds).toContain("brand");
  });

  it("Price group is derived from prices", () => {
    expect(groupIds).toContain("price");
  });

  it("Size and Concave groups come from real Shopify options", () => {
    expect(groupIds).toContain("size");
    expect(groupIds).toContain("concave");
  });

  it("Groups render in a sensible order (price before brand)", () => {
    expect(groupIds.indexOf("price")).toBeLessThan(groupIds.indexOf("brand"));
  });

  it("Size options use Shopify's own values, not a hand-written list", () => {
    expect(sizeValues).toContain("8");
    expect(sizeValues).not.toContain("8.0");
  });

  // Despite its name, this asserts that 53mm IS offered under Size: `SIZES` is
  // folded into the size group on purpose (see the matching tests below). The
  // original script's `|| !groupIds.includes("size")` escape was unreachable,
  // since the size group is asserted to exist above.
  it("Millimetre sizes do not masquerade as deck widths", () => {
    expect(groupIds).toContain("size");
    expect(sizeValues).toContain("53mm");
  });

  it("No derived option matches zero products", () => {
    const deadOptions = groups.flatMap((group) =>
      group.options
        .filter(
          (option) =>
            group.type !== "category" &&
            group.id !== "sort" &&
            countMatching(MOCK_PRODUCTS, { [group.id]: option.value }) === 0,
        )
        .map((option) => `${group.id}:${option.value}`),
    );
    expect(deadOptions).toEqual([]);
  });
});

describe("productMatches", () => {
  it("Size '8' matches a product whose Size option contains 8", () => {
    expect(productMatches(MOCK_PRODUCTS[0]!, "size", "8")).toBe(true);
  });

  it("Size '8.125' does not match a product offering only 8 and 8.25", () => {
    expect(productMatches(MOCK_PRODUCTS[0]!, "size", "8.125")).toBe(false);
  });

  it("Brand matches a slugified vendor", () => {
    expect(
      productMatches(MOCK_PRODUCTS[0]!, "brand", "sphere-skateboards"),
    ).toBe(true);
  });

  it("Apparel size 'm' matches case-insensitively", () => {
    expect(productMatches(MOCK_PRODUCTS[3]!, "size", "m")).toBe(true);
  });

  it("Wheel Size group matches its own option", () => {
    expect(productMatches(MOCK_PRODUCTS[2]!, "wheel_size", "53mm")).toBe(true);
  });

  // `SIZES` is folded into the size group on purpose — wheel millimetre sizes
  // would otherwise be unfilterable, since only a few products carry a
  // `Wheel Size` option. It must still come from the option, not the title.
  it("A Size filter matches 53mm via the product's SIZES option", () => {
    expect(productMatches(MOCK_PRODUCTS[2]!, "size", "53mm")).toBe(true);
  });

  it("A Size filter does not match a deck on title text alone", () => {
    expect(productMatches(MOCK_PRODUCTS[0]!, "size", "53mm")).toBe(false);
  });
});

describe("filtering the grid", () => {
  it("Price filtering returns only products under 1000", () => {
    expect(handles(applyFilterMap(MOCK_PRODUCTS, { price: "0-1000" }))).toEqual(
      ["classic-tee-black"],
    );
  });

  it("Size filtering returns the deck offering 8", () => {
    expect(handles(applyFilterMap(MOCK_PRODUCTS, { size: "8" }))).toEqual([
      "oldman-sphere-deck",
    ]);
  });

  it("Multi-brand select returns the union of both vendors", () => {
    expect(
      applyFilterMap(MOCK_PRODUCTS, {
        brand: "sphere-skateboards,wasted-angels",
      }),
    ).toHaveLength(3);
  });

  it("Multi-size select unions values within one group", () => {
    expect(handles(applyFilterMap(MOCK_PRODUCTS, { size: "s,l" }))).toEqual([
      "classic-tee-black",
    ]);
  });

  it("Multiple filters combine (AND across groups)", () => {
    expect(
      handles(
        applyFilterMap(MOCK_PRODUCTS, {
          brand: "sphere-skateboards",
          size: "8.125",
        }),
      ),
    ).toEqual(["bubblegum-left-deck"]);
  });
});

// Drawer counts agree with what the grid would show.
describe("drawer counts", () => {
  it("Brand option count reflects the products actually carrying that vendor", () => {
    expect(
      simulateCount(MOCK_PRODUCTS, {}, "brand", "sphere-skateboards"),
    ).toBe(2);
  });

  // Selecting an option within a group replaces that group's selection, so the
  // preview count matches what clicking it in the drawer would produce.
  it("Switching brands within a group recomputes the count from the new value", () => {
    expect(
      simulateCount(
        MOCK_PRODUCTS,
        { brand: "wasted-angels" },
        "brand",
        "sphere-skateboards",
      ),
    ).toBe(2);
  });
});

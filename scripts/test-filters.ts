import {
  CATEGORY_GROUP,
  SORT_GROUP,
  getLabelForFilterValue,
} from "../lib/filters/category-filter-config";
import {
  countMatching,
  deriveFilterGroups,
  normalizeValue,
  normalizeVendor,
  productMatches,
} from "../lib/filters/derive";
import { Product } from "../lib/shopify/types";

/**
 * Exercises the derived filter groups and the shared matcher.
 *
 * The previous version of this file tested a hand-copied version of the filter
 * logic against hand-written mock products, which is how the real drawer ended
 * up offering options that matched nothing: the copy being tested was not the
 * copy the drawer ran. These tests now exercise `lib/filters/derive` itself, and
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

function runTests() {
  console.log("🧪 STARTING FILTRATION SYSTEM END-TO-ENT TESTS...");
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, msg: string) {
    if (condition) {
      console.log(` ✅ PASS: ${msg}`);
      passed++;
    } else {
      console.error(` ❌ FAIL: ${msg}`);
      failed++;
    }
  }

  // 1. Normalisation. These mismatches were the original bug: the old config
  //    offered `8.0` while Shopify stores `8`.
  assert(normalizeValue("8.0") === normalizeValue("8"), "8.0 normalises to 8");
  assert(
    normalizeValue('7.75"') === normalizeValue("7.75"),
    '7.75" normalises to 7.75',
  );
  assert(
    normalizeValue("Default Title") === "",
    "Shopify's 'Default Title' placeholder is not a filterable value",
  );
  assert(
    normalizeValue("Rounded End") === "rounded end",
    "Multi-word values normalise consistently",
  );
  assert(
    normalizeVendor("Sphere Skateboards") === "sphere-skateboards",
    "Vendor slugifies to a usable filter value",
  );

  // 2. Derived groups only contain options that match something.
  const groups = deriveFilterGroups(MOCK_PRODUCTS, [
    SORT_GROUP,
    CATEGORY_GROUP,
  ]);
  const groupIds = groups.map((g) => g.id);

  assert(
    groupIds.includes("category") && groupIds.includes("sort"),
    "Static groups (sorting, category) are preserved",
  );
  assert(groupIds.includes("brand"), "Brand group is derived from vendor");
  assert(groupIds.includes("price"), "Price group is derived from prices");
  assert(
    groupIds.includes("size") && groupIds.includes("concave"),
    "Size and Concave groups come from real Shopify options",
  );
  assert(
    groupIds.indexOf("price") < groupIds.indexOf("brand"),
    "Groups render in a sensible order (price before brand)",
  );

  const sizeGroup = groups.find((g) => g.id === "size")!;
  assert(
    sizeGroup.options.some((o) => o.value === "8") &&
      !sizeGroup.options.some((o) => o.value === "8.0"),
    "Size options use Shopify's own values, not a hand-written list",
  );
  assert(
    sizeGroup.options.some((o) => o.value === "53mm") ||
      !groupIds.includes("size"),
    "Millimetre sizes do not masquerade as deck widths",
  );

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
  assert(
    deadOptions.length === 0,
    `No derived option matches zero products (found: ${deadOptions.join(", ") || "none"})`,
  );

  // 3. Matching.
  assert(
    productMatches(MOCK_PRODUCTS[0]!, "size", "8"),
    "Size '8' matches a product whose Size option contains 8",
  );
  assert(
    !productMatches(MOCK_PRODUCTS[0]!, "size", "8.125"),
    "Size '8.125' does not match a product offering only 8 and 8.25",
  );
  assert(
    productMatches(MOCK_PRODUCTS[0]!, "brand", "sphere-skateboards"),
    "Brand matches a slugified vendor",
  );
  assert(
    productMatches(MOCK_PRODUCTS[3]!, "size", "m"),
    "Apparel size 'm' matches case-insensitively",
  );
  assert(
    productMatches(MOCK_PRODUCTS[2]!, "wheel_size", "53mm"),
    "Wheel Size group matches its own option",
  );
  // `SIZES` is folded into the size group on purpose — wheel millimetre sizes
  // would otherwise be unfilterable, since only a few products carry a
  // `Wheel Size` option. It must still come from the option, not the title.
  assert(
    productMatches(MOCK_PRODUCTS[2]!, "size", "53mm"),
    "A Size filter matches 53mm via the product's SIZES option",
  );
  assert(
    !productMatches(MOCK_PRODUCTS[0]!, "size", "53mm"),
    "A Size filter does not match a deck on title text alone",
  );

  // 4. Filtering the grid.
  const priceFiltered = applyFilterMap(MOCK_PRODUCTS, { price: "0-1000" });
  assert(
    priceFiltered.length === 1 &&
      priceFiltered[0]?.handle === "classic-tee-black",
    "Price filtering returns only products under 1000",
  );

  const sizeFiltered = applyFilterMap(MOCK_PRODUCTS, { size: "8" });
  assert(
    sizeFiltered.length === 1 &&
      sizeFiltered[0]?.handle === "oldman-sphere-deck",
    "Size filtering returns the deck offering 8",
  );

  const multiBrand = applyFilterMap(MOCK_PRODUCTS, {
    brand: "sphere-skateboards,wasted-angels",
  });
  assert(
    multiBrand.length === 3,
    "Multi-brand select returns the union of both vendors",
  );

  const multiSize = applyFilterMap(MOCK_PRODUCTS, { size: "s,l" });
  assert(
    multiSize.length === 1 && multiSize[0]?.handle === "classic-tee-black",
    "Multi-size select unions values within one group",
  );

  const compound = applyFilterMap(MOCK_PRODUCTS, {
    brand: "sphere-skateboards",
    size: "8.125",
  });
  assert(
    compound.length === 1 && compound[0]?.handle === "bubblegum-left-deck",
    "Multiple filters combine (AND across groups)",
  );

  // 5. Drawer counts agree with what the grid would show.
  const sphereWithOtherBrand = simulateCount(
    MOCK_PRODUCTS,
    {},
    "brand",
    "sphere-skateboards",
  );
  assert(
    sphereWithOtherBrand === 2,
    "Brand option count reflects the products actually carrying that vendor",
  );

  // Selecting an option within a group replaces that group's selection, so the
  // preview count matches what clicking it in the drawer would produce.
  const switchedBrand = simulateCount(
    MOCK_PRODUCTS,
    { brand: "wasted-angels" },
    "brand",
    "sphere-skateboards",
  );
  assert(
    switchedBrand === 2,
    "Switching brands within a group recomputes the count from the new value",
  );

  const priceLabel = getLabelForFilterValue("price", "1200-7500", []);
  assert(
    priceLabel === "₹1,200 - ₹7,500",
    "getLabelForFilterValue('price', ...) formats as a currency range",
  );

  console.log(`\n🎉 TEST RESULTS: ${passed} Passed, ${failed} Failed.`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests();

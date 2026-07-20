import { deriveFiltersForCategory } from "../lib/filters/category-filter-config";
import { Product } from "../lib/shopify/types";

// Mock Products for test validation
const MOCK_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    handle: "popsicle-deck-8",
    title: "Classic Popsicle Deck 8.0\"",
    description: "7-ply maple construction popsicle shape skateboard deck.",
    priceRange: {
      minVariantPrice: { amount: "1800", currencyCode: "INR" },
      maxVariantPrice: { amount: "1800", currencyCode: "INR" },
    },
    vendor: "Sphere",
    tags: ["skateboard", "deck", "8.0", "medium", "popsicle"],
    options: [
      { id: "opt-1", name: "Width", values: ["8.0"] },
      { id: "opt-2", name: "Color", values: ["Black"] },
    ],
    featuredImage: { url: "", altText: "", width: 100, height: 100 },
    images: [],
    availableForSale: true,
    variants: [],
    updatedAt: "2026-07-19T00:00:00Z",
  },
  {
    id: "prod-2",
    handle: "surfskate-complete-30",
    title: "Mon Amour Surfskate Complete 30\"",
    description: "Perfect cruiser complete surfskate board for street surfing.",
    priceRange: {
      minVariantPrice: { amount: "7500", currencyCode: "INR" },
      maxVariantPrice: { amount: "7500", currencyCode: "INR" },
    },
    vendor: "Mon Amour Nepal",
    tags: ["surfskate", "complete", "30", "intermediate", "orange"],
    options: [
      { id: "opt-3", name: "Size", values: ["30\""] },
      { id: "opt-4", name: "Color", values: ["Orange"] },
    ],
    featuredImage: { url: "", altText: "", width: 100, height: 100 },
    images: [],
    availableForSale: true,
    variants: [],
    updatedAt: "2026-07-19T00:00:00Z",
  },
  {
    id: "prod-3",
    handle: "wes-tee-black",
    title: "We Skate Co Classic Tee - Black",
    description: "Premium cotton apparel skater tee.",
    priceRange: {
      minVariantPrice: { amount: "1200", currencyCode: "INR" },
      maxVariantPrice: { amount: "1200", currencyCode: "INR" },
    },
    vendor: "Wasted Angels",
    tags: ["apparel", "tee", "black", "cotton"],
    options: [{ id: "opt-5", name: "Size", values: ["M", "L", "XL"] }],
    featuredImage: { url: "", altText: "", width: 100, height: 100 },
    images: [],
    availableForSale: true,
    variants: [],
    updatedAt: "2026-07-19T00:00:00Z",
  }
] as unknown as Product[];

function toggleFilterValue(
  currentVal: string | undefined,
  optionVal: string
): string | null {
  const list = currentVal ? currentVal.split(",").filter(Boolean) : [];
  const idx = list.indexOf(optionVal);
  if (idx > -1) {
    list.splice(idx, 1);
  } else {
    list.push(optionVal);
  }
  return list.length > 0 ? list.join(",") : null;
}

function applyFilterMap(
  products: Product[],
  filters: Record<string, string>
): Product[] {
  let result = [...products];

  Object.entries(filters).forEach(([key, value]) => {
    if (!value || key === "sort") return;
    const values = value.split(",").filter(Boolean);
    if (values.length === 0) return;

    if (key === "price") {
      result = result.filter((p) => {
        const price = Number(p.priceRange.minVariantPrice.amount);
        return values.some((val) => {
          const parts = val.split("-").map(Number);
          const min = parts[0] ?? 0;
          const max = parts[1] ?? Infinity;
          return price >= min && price <= max;
        });
      });
    } else if (key === "color") {
      result = result.filter((p) => {
        return values.some((val) => {
          const vl = val.toLowerCase();
          return (
            p.options?.some(
              (o) =>
                o.name.toLowerCase() === "color" &&
                o.values.some((v) => v.toLowerCase() === vl)
            ) ||
            p.tags?.some((t) => t.toLowerCase() === vl) ||
            p.title.toLowerCase().includes(vl)
          );
        });
      });
    } else if (key === "level") {
      result = result.filter((p) => {
        return values.some((val) => {
          const vl = val.toLowerCase();
          return (
            p.tags?.some((t) => t.toLowerCase() === vl) ||
            p.title.toLowerCase().includes(vl)
          );
        });
      });
    } else if (key === "size") {
      result = result.filter((p) => {
        return values.some((val) => {
          const vl = val.toLowerCase();
          return (
            p.options?.some((o) =>
              o.values.some((v) => v.toLowerCase() === vl)
            ) || p.tags?.some((t) => t.toLowerCase().includes(vl))
          );
        });
      });
    } else if (key === "brand") {
      result = result.filter((p) => {
        return values.some((val) => {
          const vl = val.toLowerCase();
          return (
            p.vendor?.toLowerCase().replace(/\s+/g, "-") === vl ||
            p.tags?.some((t) => t.toLowerCase() === vl) ||
            p.title.toLowerCase().includes(vl)
          );
        });
      });
    } else {
      result = result.filter((p) => {
        return values.some((val) => {
          const vl = val.toLowerCase();
          return (
            p.tags?.some((t) => t.toLowerCase().includes(vl)) ||
            p.title.toLowerCase().includes(vl) ||
            p.options?.some((o) =>
              o.values.some((v) => v.toLowerCase().includes(vl))
            )
          );
        });
      });
    }
  });

  return result;
}

function simulateCount(
  products: Product[],
  activeFilters: Record<string, string>,
  groupId: string,
  optionValue: string
): number {
  const testFilters = { ...activeFilters };
  testFilters[groupId] = optionValue;
  return applyFilterMap(products, testFilters).length;
}

// ---------------------------------------------------------------------------
// Test Execution Block
// ---------------------------------------------------------------------------
function runTests() {
  console.log("🧪 STARTING FILTRATION SYSTEM END-TO-END TESTS...");
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

  // 1. Check Category configuration mapping
  const skateFilters = deriveFiltersForCategory("skateboards");
  assert(
    skateFilters.some((f) => f.id === "brand") && !skateFilters.some((f) => f.id === "level"),
    "deriveFiltersForCategory('skateboards') resolves with Brand and without Level filters"
  );

  const surfFilters = deriveFiltersForCategory("surfskates");
  assert(
    surfFilters.some((f) => f.id === "brand") && !surfFilters.some((f) => f.id === "level"),
    "deriveFiltersForCategory('surfskates') resolves with Brand and without Level filters"
  );

  const apparelFilters = deriveFiltersForCategory("apparel-1");
  assert(
    apparelFilters.some((f) => f.id === "size") &&
      !!apparelFilters.find((f) => f.id === "size")?.options.some((o) => o.value === "m"),
    "deriveFiltersForCategory('apparel-1') resolves sizes like 'm'"
  );

  const baseFilters = deriveFiltersForCategory("");
  assert(
    baseFilters.length === 4 && baseFilters.some((f) => f.id === "category"),
    "Empty handle maps correctly to base configuration filters"
  );

  // 2. Test Filtering Logic on mock products
  const priceFiltered = applyFilterMap(MOCK_PRODUCTS, { price: "0-2000" });
  assert(
    priceFiltered.length === 2 &&
      priceFiltered.some((p) => p.handle === "wes-tee-black") &&
      priceFiltered.some((p) => p.handle === "popsicle-deck-8"),
    "Price filtering correctly returns products under 2000 INR"
  );

  const colorFiltered = applyFilterMap(MOCK_PRODUCTS, { color: "orange" });
  assert(
    colorFiltered.length === 1 && colorFiltered[0]?.handle === "surfskate-complete-30",
    "Color filtering correctly resolves values from tags/options"
  );

  const compoundFiltered = applyFilterMap(MOCK_PRODUCTS, {
    price: "0-2000",
    color: "black",
  });
  assert(
    compoundFiltered.length === 2 &&
      compoundFiltered.some((p) => p.handle === "popsicle-deck-8") &&
      compoundFiltered.some((p) => p.handle === "wes-tee-black"),
    "Multiple filters combine correctly"
  );

  const multiBrandFiltered = applyFilterMap(MOCK_PRODUCTS, { brand: "sphere,wasted-angels" });
  assert(
    multiBrandFiltered.length === 2 &&
      multiBrandFiltered.some((p) => p.handle === "popsicle-deck-8") &&
      multiBrandFiltered.some((p) => p.handle === "wes-tee-black"),
    "Multi-brand select returns union of Sphere and Wasted Angels products"
  );

  const multiColorFiltered = applyFilterMap(MOCK_PRODUCTS, { color: "orange,black" });
  assert(
    multiColorFiltered.length === 3 &&
      multiColorFiltered.some((p) => p.handle === "surfskate-complete-30") &&
      multiColorFiltered.some((p) => p.handle === "popsicle-deck-8") &&
      multiColorFiltered.some((p) => p.handle === "wes-tee-black"),
    "Multi-color select returns union of orange and black products"
  );

  // 3. Option Simulating Counts (For Disabling Option Logic)
  // Ensure that option counts are computed independently of other active choices in their own group
  const sphereCountWithBrandSelected = simulateCount(
    MOCK_PRODUCTS,
    { brand: "wasted-angels" },
    "brand",
    "sphere"
  );
  assert(
    sphereCountWithBrandSelected === 1,
    "Brand 'sphere' count simulates as 1 product independently of selected brand 'wasted-angels'"
  );

  const orangeApparelCount = simulateCount(
    MOCK_PRODUCTS,
    { brand: "wasted-angels" }, // Apparel item brand
    "color",
    "orange" // Not applicable to this brand in our mock products
  );
  assert(
    orangeApparelCount === 0,
    "Option simulating resolves to 0 when filter combinations across groups produce no products"
  );

  // 4. Test price range formatting utility
  const { getLabelForFilterValue } = require("../lib/filters/category-filter-config");
  const priceLabel = getLabelForFilterValue("price", "1200-7500", []);
  assert(
    priceLabel === "₹1,200 - ₹7,500",
    "getLabelForFilterValue('price', '1200-7500') formats properly as currency range"
  );

  console.log(`\n🎉 TEST RESULTS: ${passed} Passed, ${failed} Failed.`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests();

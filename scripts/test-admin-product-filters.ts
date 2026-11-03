import { ADMIN_RESULTS_PAGE_SIZE, paginate } from "lib/admin/pagination";
import {
  applyAdminProductFilters,
  countActiveAdminFilters,
  deriveAdminFacets,
  EMPTY_ADMIN_PRODUCT_FILTERS,
  toggleFacetValue,
  type AdminFacets,
  type AdminProductFilters,
  type AdminProductOverrideSummary,
} from "lib/admin/product-filters";
import type { ShopifyProductSummary } from "lib/shopify/types";

let passed = 0;
const failures: string[] = [];

function check(name: string, condition: boolean, detail?: string) {
  if (condition) {
    passed += 1;
    console.log(`  ok  ${name}`);
    return;
  }

  failures.push(detail ? `${name} — ${detail}` : name);
  console.log(`FAIL  ${name}${detail ? ` — ${detail}` : ""}`);
}

function equal(name: string, actual: unknown, expected: unknown) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  check(name, a === e, `expected ${e}, got ${a}`);
}

function product(
  handle: string,
  overrides: Partial<ShopifyProductSummary> = {},
): ShopifyProductSummary {
  return {
    id: `gid://shopify/Product/${handle}`,
    handle,
    title: handle.toUpperCase(),
    vendor: "Sphere Skateboards",
    productType: "Deck",
    availableForSale: true,
    updatedAt: "2026-01-01T00:00:00Z",
    tags: [],
    featuredImage: {
      url: `https://cdn.shopify.com/${handle}.jpg`,
      altText: "",
      width: 100,
      height: 100,
    },
    priceRange: {
      minVariantPrice: { amount: "4299.0", currencyCode: "INR" },
    },
    ...overrides,
  };
}

function filters(
  patch: Partial<AdminProductFilters> = {},
): AdminProductFilters {
  return { ...EMPTY_ADMIN_PRODUCT_FILTERS, ...patch };
}

function handlesOf(products: ShopifyProductSummary[]): string[] {
  return products.map((p) => p.handle);
}

const catalog: ShopifyProductSummary[] = [
  product("deck-a", {
    productType: "Deck",
    tags: ["SKATEBOARD", "SKATE DECK"],
  }),
  product("deck-b", {
    productType: "Deck",
    vendor: "Toucan Distribution",
    tags: ["SKATEBOARD"],
  }),
  product("complete-a", {
    productType: "Full Setup",
    vendor: "Toucan Distribution",
    tags: ["SKATEBOARDING IN INDIA"],
  }),
  product("grip-a", {
    productType: "Griptape",
    tags: ["GRIPTAPE"],
    availableForSale: false,
  }),
];

const overrides: AdminProductOverrideSummary[] = [
  { handle: "deck-a", title: "Overridden Deck A" },
  { handle: "grip-a", title: null },
];

async function main() {
  console.log("\nderiveAdminFacets");

  const facets = deriveAdminFacets(catalog);

  equal(
    "product types are counted",
    facets.productTypes.map((o) => `${o.value}:${o.count}`),
    ["Deck:2", "Full Setup:1", "Griptape:1"],
  );
  equal(
    "vendors are counted and sorted by count",
    facets.vendors.map((o) => `${o.value}:${o.count}`),
    ["Sphere Skateboards:2", "Toucan Distribution:2"],
  );
  equal(
    "tags are counted",
    facets.tags.find((o) => o.value === "SKATEBOARD")?.count,
    2,
  );
  equal(
    "empty catalog yields no facets",
    deriveAdminFacets([]).productTypes.length,
    0,
  );

  console.log("\napplyAdminProductFilters");

  equal(
    "no filters returns everything",
    handlesOf(applyAdminProductFilters(catalog, overrides, filters())),
    ["deck-a", "deck-b", "complete-a", "grip-a"],
  );

  equal(
    "filtering by product type",
    handlesOf(
      applyAdminProductFilters(
        catalog,
        overrides,
        filters({ productTypes: ["Deck"] }),
      ),
    ),
    ["deck-a", "deck-b"],
  );

  equal(
    "multiple values in one group are OR'd",
    handlesOf(
      applyAdminProductFilters(
        catalog,
        overrides,
        filters({ productTypes: ["Full Setup", "Griptape"] }),
      ),
    ),
    ["complete-a", "grip-a"],
  );

  equal(
    "filtering by vendor",
    handlesOf(
      applyAdminProductFilters(
        catalog,
        overrides,
        filters({ vendors: ["Toucan Distribution"] }),
      ),
    ),
    ["deck-b", "complete-a"],
  );

  equal(
    "filtering by tag",
    handlesOf(
      applyAdminProductFilters(
        catalog,
        overrides,
        filters({ tags: ["GRIPTAPE"] }),
      ),
    ),
    ["grip-a"],
  );

  equal(
    "in-stock excludes sold out",
    handlesOf(
      applyAdminProductFilters(
        catalog,
        overrides,
        filters({ availability: "in-stock" }),
      ),
    ),
    ["deck-a", "deck-b", "complete-a"],
  );

  equal(
    "sold-out returns only unavailable",
    handlesOf(
      applyAdminProductFilters(
        catalog,
        overrides,
        filters({ availability: "sold-out" }),
      ),
    ),
    ["grip-a"],
  );

  equal(
    "override filter finds products with an override row",
    handlesOf(
      applyAdminProductFilters(
        catalog,
        overrides,
        filters({ override: "overridden" }),
      ),
    ),
    ["deck-a", "grip-a"],
  );

  equal(
    "an override row with a null title still counts as overridden",
    handlesOf(
      applyAdminProductFilters(
        catalog,
        overrides,
        filters({ override: "overridden" }),
      ),
    ).includes("grip-a"),
    true,
  );

  equal(
    "not-overridden excludes them",
    handlesOf(
      applyAdminProductFilters(
        catalog,
        overrides,
        filters({ override: "not-overridden" }),
      ),
    ),
    ["deck-b", "complete-a"],
  );

  console.log("\nsearch");

  equal(
    "query matches the handle",
    handlesOf(
      applyAdminProductFilters(
        catalog,
        overrides,
        filters({ query: "complete-" }),
      ),
    ),
    ["complete-a"],
  );
  equal(
    "query is case-insensitive and matches vendor",
    handlesOf(
      applyAdminProductFilters(
        catalog,
        overrides,
        filters({ query: "toucan" }),
      ),
    ),
    ["deck-b", "complete-a"],
  );
  equal(
    "query matches a tag",
    handlesOf(
      applyAdminProductFilters(
        catalog,
        overrides,
        filters({ query: "skate deck" }),
      ),
    ),
    ["deck-a"],
  );
  equal(
    "a query with no match returns nothing",
    handlesOf(
      applyAdminProductFilters(catalog, overrides, filters({ query: "zzzz" })),
    ),
    [],
  );

  console.log("\ncombining");

  equal(
    "groups are AND'd together",
    handlesOf(
      applyAdminProductFilters(
        catalog,
        overrides,
        filters({ productTypes: ["Deck"], vendors: ["Toucan Distribution"] }),
      ),
    ),
    ["deck-b"],
  );
  equal(
    "an impossible combination is empty",
    handlesOf(
      applyAdminProductFilters(
        catalog,
        overrides,
        filters({ productTypes: ["Deck"], availability: "sold-out" }),
      ),
    ),
    [],
  );

  console.log("\ndynamic facets");

  const at = (value: AdminFacets, key: "productTypes" | "vendors" | "tags") =>
    value[key].map((option) => `${option.value}:${option.count}`);

  const unfiltered = deriveAdminFacets(catalog, overrides, filters());

  equal(
    "with no filters, types are a plain count",
    at(unfiltered, "productTypes"),
    ["Deck:2", "Full Setup:1", "Griptape:1"],
  );
  equal(
    "with no filters, vendors are a plain count",
    at(unfiltered, "vendors"),
    ["Sphere Skateboards:2", "Toucan Distribution:2"],
  );
  equal("with no filters, all tags are offered", unfiltered.tags.length, 4);

  const byType = deriveAdminFacets(
    catalog,
    overrides,
    filters({ productTypes: ["Deck"] }),
  );

  equal("picking a type narrows the vendors", at(byType, "vendors"), [
    "Sphere Skateboards:1",
    "Toucan Distribution:1",
  ]);
  equal("picking a type narrows the tags", at(byType, "tags"), [
    "SKATEBOARD:2",
    "SKATE DECK:1",
  ]);
  equal("picking a type still offers every type", at(byType, "productTypes"), [
    "Deck:2",
    "Full Setup:1",
    "Griptape:1",
  ]);

  const byVendor = deriveAdminFacets(
    catalog,
    overrides,
    filters({ vendors: ["Toucan Distribution"] }),
  );

  equal("picking a vendor narrows the types", at(byVendor, "productTypes"), [
    "Deck:1",
    "Full Setup:1",
  ]);
  equal("picking a vendor narrows the tags", at(byVendor, "tags"), [
    "SKATEBOARD:1",
    "SKATEBOARDING IN INDIA:1",
  ]);
  equal("picking a vendor still offers every vendor", at(byVendor, "vendors"), [
    "Sphere Skateboards:2",
    "Toucan Distribution:2",
  ]);

  const byTag = deriveAdminFacets(
    catalog,
    overrides,
    filters({ tags: ["GRIPTAPE"] }),
  );

  equal("picking a tag narrows the types", at(byTag, "productTypes"), [
    "Griptape:1",
  ]);
  equal("picking a tag narrows the vendors", at(byTag, "vendors"), [
    "Sphere Skateboards:1",
  ]);
  equal("picking a tag still offers every tag", byTag.tags.length, 4);

  const contradictory = deriveAdminFacets(
    catalog,
    overrides,
    filters({ productTypes: ["Full Setup"], vendors: ["Sphere Skateboards"] }),
  );

  check(
    "a selection the other filters exclude stays listed, at zero, so it can be unticked",
    contradictory.vendors.find((o) => o.value === "Sphere Skateboards")
      ?.count === 0,
    JSON.stringify(contradictory.vendors),
  );

  const soldOutFacets = deriveAdminFacets(
    catalog,
    overrides,
    filters({ availability: "sold-out" }),
  );

  equal("availability narrows the types", at(soldOutFacets, "productTypes"), [
    "Griptape:1",
  ]);
  equal("availability narrows the vendors", at(soldOutFacets, "vendors"), [
    "Sphere Skateboards:1",
  ]);
  equal("availability narrows the tags", at(soldOutFacets, "tags"), [
    "GRIPTAPE:1",
  ]);

  console.log("\nhelpers");

  equal("active count starts at zero", countActiveAdminFilters(filters()), 0);
  equal(
    "active count totals every group plus the query",
    countActiveAdminFilters(
      filters({
        productTypes: ["Deck"],
        vendors: ["A", "B"],
        tags: ["X"],
        availability: "in-stock",
        override: "overridden",
        query: "  deck  ",
      }),
    ),
    7,
  );
  equal(
    "a whitespace-only query does not count as active",
    countActiveAdminFilters(filters({ query: "   " })),
    0,
  );
  equal("toggle adds a value", toggleFacetValue([], "Deck"), ["Deck"]);
  equal(
    "toggle removes an existing value",
    toggleFacetValue(["Deck", "Griptape"], "Deck"),
    ["Griptape"],
  );
  check(
    "toggle does not mutate the input",
    (() => {
      const original = ["Deck"];
      toggleFacetValue(original, "Deck");
      return original.length === 1;
    })(),
  );

  console.log("\npicker composition");

  const wideCatalog: ShopifyProductSummary[] = Array.from(
    { length: ADMIN_RESULTS_PAGE_SIZE + 1 },
    (_, index) => product(`deck-${index + 1}`, { productType: "Deck" }),
  );

  const allDecks = applyAdminProductFilters(
    wideCatalog,
    [],
    filters({ productTypes: ["Deck"] }),
  );
  const firstPage = paginate(allDecks, 1);
  const secondPage = paginate(allDecks, 2);

  equal(
    "the pager sees every filtered product, not just the page",
    allDecks.length,
    ADMIN_RESULTS_PAGE_SIZE + 1,
  );
  equal(
    "page one fills the page size",
    firstPage.items.length,
    ADMIN_RESULTS_PAGE_SIZE,
  );
  equal("page two holds the single leftover", secondPage.items.length, 1);
  equal(
    "page two continues where page one stopped",
    secondPage.items[0]?.handle,
    "deck-13",
  );
  equal(
    "page one stops before page two starts",
    firstPage.items.at(-1)?.handle,
    "deck-12",
  );

  const noMatches = applyAdminProductFilters(
    catalog,
    overrides,
    filters({ productTypes: ["Deck"], availability: "sold-out" }),
  );
  const emptyPage = paginate(noMatches, 1);

  equal("a filter set matching nothing yields no rows", emptyPage.items, []);
  equal("and still reports one page rather than zero", emptyPage.totalPages, 1);
  equal(
    "and reports an empty range rather than 1-0",
    [emptyPage.rangeStart, emptyPage.rangeEnd],
    [0, 0],
  );

  const decksOnly = applyAdminProductFilters(
    catalog,
    overrides,
    filters({ productTypes: ["Deck"] }),
  );

  check(
    "an already-added product stays in the results so its Added button can explain itself",
    decksOnly.some((entry) => entry.handle === "deck-a"),
  );
  check(
    "a filtered-out already-added product is excluded like any other",
    !applyAdminProductFilters(
      catalog,
      overrides,
      filters({ productTypes: ["Griptape"] }),
    ).some((entry) => entry.handle === "deck-a"),
  );

  console.log("");

  if (failures.length > 0) {
    console.error(`${failures.length} failed, ${passed} passed`);
    failures.forEach((failure) => console.error(`  - ${failure}`));
    process.exit(1);
  }

  console.log(`${passed} assertions passed`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

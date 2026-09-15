import {
  applyAdminProductFilters,
  countActiveAdminFilters,
  deriveAdminFacets,
  EMPTY_ADMIN_PRODUCT_FILTERS,
  toggleFacetValue,
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

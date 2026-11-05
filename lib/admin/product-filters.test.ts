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
import { describe, expect, it } from "vitest";

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

/** Handles left after applying `patch` to the shared catalog and overrides. */
function filteredHandles(patch: Partial<AdminProductFilters> = {}): string[] {
  return handlesOf(
    applyAdminProductFilters(catalog, overrides, filters(patch)),
  );
}

const at = (value: AdminFacets, key: "productTypes" | "vendors" | "tags") =>
  value[key].map((option) => `${option.value}:${option.count}`);

describe("deriveAdminFacets", () => {
  const facets = deriveAdminFacets(catalog);

  it("product types are counted", () => {
    expect(facets.productTypes.map((o) => `${o.value}:${o.count}`)).toEqual([
      "Deck:2",
      "Full Setup:1",
      "Griptape:1",
    ]);
  });

  it("vendors are counted and sorted by count", () => {
    expect(facets.vendors.map((o) => `${o.value}:${o.count}`)).toEqual([
      "Sphere Skateboards:2",
      "Toucan Distribution:2",
    ]);
  });

  it("tags are counted", () => {
    expect(facets.tags.find((o) => o.value === "SKATEBOARD")?.count).toBe(2);
  });

  it("empty catalog yields no facets", () => {
    expect(deriveAdminFacets([]).productTypes).toHaveLength(0);
  });
});

describe("applyAdminProductFilters", () => {
  it("no filters returns everything", () => {
    expect(filteredHandles()).toEqual([
      "deck-a",
      "deck-b",
      "complete-a",
      "grip-a",
    ]);
  });

  it("filtering by product type", () => {
    expect(filteredHandles({ productTypes: ["Deck"] })).toEqual([
      "deck-a",
      "deck-b",
    ]);
  });

  it("multiple values in one group are OR'd", () => {
    expect(
      filteredHandles({ productTypes: ["Full Setup", "Griptape"] }),
    ).toEqual(["complete-a", "grip-a"]);
  });

  it("filtering by vendor", () => {
    expect(filteredHandles({ vendors: ["Toucan Distribution"] })).toEqual([
      "deck-b",
      "complete-a",
    ]);
  });

  it("filtering by tag", () => {
    expect(filteredHandles({ tags: ["GRIPTAPE"] })).toEqual(["grip-a"]);
  });

  it("in-stock excludes sold out", () => {
    expect(filteredHandles({ availability: "in-stock" })).toEqual([
      "deck-a",
      "deck-b",
      "complete-a",
    ]);
  });

  it("sold-out returns only unavailable", () => {
    expect(filteredHandles({ availability: "sold-out" })).toEqual(["grip-a"]);
  });

  it("override filter finds products with an override row", () => {
    expect(filteredHandles({ override: "overridden" })).toEqual([
      "deck-a",
      "grip-a",
    ]);
  });

  it("an override row with a null title still counts as overridden", () => {
    expect(filteredHandles({ override: "overridden" })).toContain("grip-a");
  });

  it("not-overridden excludes them", () => {
    expect(filteredHandles({ override: "not-overridden" })).toEqual([
      "deck-b",
      "complete-a",
    ]);
  });
});

describe("search", () => {
  it("query matches the handle", () => {
    expect(filteredHandles({ query: "complete-" })).toEqual(["complete-a"]);
  });

  it("query is case-insensitive and matches vendor", () => {
    expect(filteredHandles({ query: "toucan" })).toEqual([
      "deck-b",
      "complete-a",
    ]);
  });

  it("query matches a tag", () => {
    expect(filteredHandles({ query: "skate deck" })).toEqual(["deck-a"]);
  });

  it("a query with no match returns nothing", () => {
    expect(filteredHandles({ query: "zzzz" })).toEqual([]);
  });
});

describe("combining", () => {
  it("groups are AND'd together", () => {
    expect(
      filteredHandles({
        productTypes: ["Deck"],
        vendors: ["Toucan Distribution"],
      }),
    ).toEqual(["deck-b"]);
  });

  it("an impossible combination is empty", () => {
    expect(
      filteredHandles({ productTypes: ["Deck"], availability: "sold-out" }),
    ).toEqual([]);
  });
});

describe("dynamic facets", () => {
  describe("with no filters", () => {
    const unfiltered = deriveAdminFacets(catalog, overrides, filters());

    it("with no filters, types are a plain count", () => {
      expect(at(unfiltered, "productTypes")).toEqual([
        "Deck:2",
        "Full Setup:1",
        "Griptape:1",
      ]);
    });

    it("with no filters, vendors are a plain count", () => {
      expect(at(unfiltered, "vendors")).toEqual([
        "Sphere Skateboards:2",
        "Toucan Distribution:2",
      ]);
    });

    it("with no filters, all tags are offered", () => {
      expect(unfiltered.tags).toHaveLength(4);
    });
  });

  describe("picking a type", () => {
    const byType = deriveAdminFacets(
      catalog,
      overrides,
      filters({ productTypes: ["Deck"] }),
    );

    it("picking a type narrows the vendors", () => {
      expect(at(byType, "vendors")).toEqual([
        "Sphere Skateboards:1",
        "Toucan Distribution:1",
      ]);
    });

    it("picking a type narrows the tags", () => {
      expect(at(byType, "tags")).toEqual(["SKATEBOARD:2", "SKATE DECK:1"]);
    });

    it("picking a type still offers every type", () => {
      expect(at(byType, "productTypes")).toEqual([
        "Deck:2",
        "Full Setup:1",
        "Griptape:1",
      ]);
    });
  });

  describe("picking a vendor", () => {
    const byVendor = deriveAdminFacets(
      catalog,
      overrides,
      filters({ vendors: ["Toucan Distribution"] }),
    );

    it("picking a vendor narrows the types", () => {
      expect(at(byVendor, "productTypes")).toEqual(["Deck:1", "Full Setup:1"]);
    });

    it("picking a vendor narrows the tags", () => {
      expect(at(byVendor, "tags")).toEqual([
        "SKATEBOARD:1",
        "SKATEBOARDING IN INDIA:1",
      ]);
    });

    it("picking a vendor still offers every vendor", () => {
      expect(at(byVendor, "vendors")).toEqual([
        "Sphere Skateboards:2",
        "Toucan Distribution:2",
      ]);
    });
  });

  describe("picking a tag", () => {
    const byTag = deriveAdminFacets(
      catalog,
      overrides,
      filters({ tags: ["GRIPTAPE"] }),
    );

    it("picking a tag narrows the types", () => {
      expect(at(byTag, "productTypes")).toEqual(["Griptape:1"]);
    });

    it("picking a tag narrows the vendors", () => {
      expect(at(byTag, "vendors")).toEqual(["Sphere Skateboards:1"]);
    });

    it("picking a tag still offers every tag", () => {
      expect(byTag.tags).toHaveLength(4);
    });
  });

  it("a selection the other filters exclude stays listed, at zero, so it can be unticked", () => {
    const contradictory = deriveAdminFacets(
      catalog,
      overrides,
      filters({
        productTypes: ["Full Setup"],
        vendors: ["Sphere Skateboards"],
      }),
    );

    expect(
      contradictory.vendors.find((o) => o.value === "Sphere Skateboards")
        ?.count,
    ).toBe(0);
  });

  describe("availability", () => {
    const soldOutFacets = deriveAdminFacets(
      catalog,
      overrides,
      filters({ availability: "sold-out" }),
    );

    it("availability narrows the types", () => {
      expect(at(soldOutFacets, "productTypes")).toEqual(["Griptape:1"]);
    });

    it("availability narrows the vendors", () => {
      expect(at(soldOutFacets, "vendors")).toEqual(["Sphere Skateboards:1"]);
    });

    it("availability narrows the tags", () => {
      expect(at(soldOutFacets, "tags")).toEqual(["GRIPTAPE:1"]);
    });
  });
});

describe("helpers", () => {
  it("active count starts at zero", () => {
    expect(countActiveAdminFilters(filters())).toBe(0);
  });

  it("active count totals every group plus the query", () => {
    expect(
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
    ).toBe(7);
  });

  it("a whitespace-only query does not count as active", () => {
    expect(countActiveAdminFilters(filters({ query: "   " }))).toBe(0);
  });

  it("toggle adds a value", () => {
    expect(toggleFacetValue([], "Deck")).toEqual(["Deck"]);
  });

  it("toggle removes an existing value", () => {
    expect(toggleFacetValue(["Deck", "Griptape"], "Deck")).toEqual([
      "Griptape",
    ]);
  });

  it("toggle does not mutate the input", () => {
    const original = ["Deck"];
    toggleFacetValue(original, "Deck");

    expect(original).toEqual(["Deck"]);
  });
});

describe("picker composition", () => {
  describe("paging a filtered result set", () => {
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

    it("the pager sees every filtered product, not just the page", () => {
      expect(allDecks).toHaveLength(ADMIN_RESULTS_PAGE_SIZE + 1);
    });

    it("page one fills the page size", () => {
      expect(firstPage.items).toHaveLength(ADMIN_RESULTS_PAGE_SIZE);
    });

    it("page two holds the single leftover", () => {
      expect(secondPage.items).toHaveLength(1);
    });

    it("page two continues where page one stopped", () => {
      expect(secondPage.items[0]?.handle).toBe("deck-13");
    });

    it("page one stops before page two starts", () => {
      expect(firstPage.items.at(-1)?.handle).toBe("deck-12");
    });
  });

  describe("a filter set matching nothing", () => {
    const noMatches = applyAdminProductFilters(
      catalog,
      overrides,
      filters({ productTypes: ["Deck"], availability: "sold-out" }),
    );
    const emptyPage = paginate(noMatches, 1);

    it("a filter set matching nothing yields no rows", () => {
      expect(emptyPage.items).toEqual([]);
    });

    it("and still reports one page rather than zero", () => {
      expect(emptyPage.totalPages).toBe(1);
    });

    it("and reports an empty range rather than 1-0", () => {
      expect([emptyPage.rangeStart, emptyPage.rangeEnd]).toEqual([0, 0]);
    });
  });

  it("an already-added product stays in the results so its Added button can explain itself", () => {
    expect(filteredHandles({ productTypes: ["Deck"] })).toContain("deck-a");
  });

  it("a filtered-out already-added product is excluded like any other", () => {
    expect(filteredHandles({ productTypes: ["Griptape"] })).not.toContain(
      "deck-a",
    );
  });
});

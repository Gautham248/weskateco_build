import type { ShopifyProductSummary } from "lib/shopify/types";

/**
 * Admin product filtering, kept pure so it can be tested without a browser or a
 * database. Mirrors the storefront's approach: filter the already-fetched list
 * in memory so every change is instant.
 */

export type AdminProductOverrideSummary = {
  handle: string;
  title: string | null;
};

export type AvailabilityFilter = "all" | "in-stock" | "sold-out";
export type OverrideFilter = "all" | "overridden" | "not-overridden";

export type AdminProductFilters = {
  query: string;
  productTypes: string[];
  vendors: string[];
  tags: string[];
  availability: AvailabilityFilter;
  override: OverrideFilter;
};

export const EMPTY_ADMIN_PRODUCT_FILTERS: AdminProductFilters = {
  query: "",
  productTypes: [],
  vendors: [],
  tags: [],
  availability: "all",
  override: "all",
};

export type AdminFacetOption = {
  value: string;
  count: number;
};

export type AdminFacets = {
  productTypes: AdminFacetOption[];
  vendors: AdminFacetOption[];
  tags: AdminFacetOption[];
};

function toFacetOptions(counts: Map<string, number>): AdminFacetOption[] {
  return [...counts.entries()]
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value));
}

function bump(counts: Map<string, number>, key: string | undefined) {
  if (!key) {
    return;
  }

  counts.set(key, (counts.get(key) ?? 0) + 1);
}

/** Facet values and counts are derived from the catalog, never hardcoded. */
export function deriveAdminFacets(
  products: ShopifyProductSummary[],
): AdminFacets {
  const productTypes = new Map<string, number>();
  const vendors = new Map<string, number>();
  const tags = new Map<string, number>();

  for (const product of products) {
    bump(productTypes, product.productType);
    bump(vendors, product.vendor);

    for (const tag of product.tags ?? []) {
      bump(tags, tag);
    }
  }

  return {
    productTypes: toFacetOptions(productTypes),
    vendors: toFacetOptions(vendors),
    tags: toFacetOptions(tags),
  };
}

export function buildProductHaystack(product: ShopifyProductSummary): string {
  return [
    product.title,
    product.handle,
    product.vendor,
    product.productType,
    ...(product.tags ?? []),
  ]
    .join(" ")
    .toLowerCase();
}

export function applyAdminProductFilters(
  products: ShopifyProductSummary[],
  overrides: AdminProductOverrideSummary[],
  filters: AdminProductFilters,
): ShopifyProductSummary[] {
  const overridden = new Set(overrides.map((override) => override.handle));
  const needle = filters.query.trim().toLowerCase();

  return products.filter((product) => {
    if (
      filters.productTypes.length > 0 &&
      !filters.productTypes.includes(product.productType)
    ) {
      return false;
    }

    if (
      filters.vendors.length > 0 &&
      !filters.vendors.includes(product.vendor)
    ) {
      return false;
    }

    if (
      filters.tags.length > 0 &&
      !filters.tags.some((tag) => (product.tags ?? []).includes(tag))
    ) {
      return false;
    }

    if (filters.availability === "in-stock" && !product.availableForSale) {
      return false;
    }

    if (filters.availability === "sold-out" && product.availableForSale) {
      return false;
    }

    const hasOverride = overridden.has(product.handle);

    if (filters.override === "overridden" && !hasOverride) {
      return false;
    }

    if (filters.override === "not-overridden" && hasOverride) {
      return false;
    }

    if (needle && !buildProductHaystack(product).includes(needle)) {
      return false;
    }

    return true;
  });
}

export function countActiveAdminFilters(filters: AdminProductFilters): number {
  return (
    filters.productTypes.length +
    filters.vendors.length +
    filters.tags.length +
    (filters.availability === "all" ? 0 : 1) +
    (filters.override === "all" ? 0 : 1) +
    (filters.query.trim() ? 1 : 0)
  );
}

export function toggleFacetValue(values: string[], value: string): string[] {
  return values.includes(value)
    ? values.filter((existing) => existing !== value)
    : [...values, value];
}

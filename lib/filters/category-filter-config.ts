/**
 * Filter types and the small amount of drawer configuration that genuinely
 * cannot be derived from product data.
 *
 * The option lists that used to live here — deck widths, shapes, concaves,
 * brands — were hand-written and had drifted from the live catalogue, so many
 * options matched nothing and rendered permanently disabled. Filter groups are
 * now built from the products actually in the collection by `lib/filters/derive`.
 * Only sorting and the category jump list are still static.
 */

export type FilterOptionType =
  | "checkbox"
  | "color-swatch"
  | "range-radio"
  | "category";

export interface FilterOption {
  label: string;
  value: string;
  /** For color-swatch type — hex color */
  hex?: string;
}

export interface FilterGroup {
  /** URL param key used to store the selected value */
  id: string;
  label: string;
  type: FilterOptionType;
  options: FilterOption[];
  /** If true, multiple values can be selected (stored as comma-separated) */
  multi?: boolean;
}

export const SORT_GROUP: FilterGroup = {
  id: "sort",
  label: "Sorting",
  type: "checkbox",
  options: [
    { label: "Relevance", value: "" },
    { label: "Trending", value: "trending-desc" },
    { label: "Latest Arrivals", value: "latest-desc" },
    { label: "Price: Low to High", value: "price-asc" },
    { label: "Price: High to Low", value: "price-desc" },
  ],
};

export const CATEGORY_GROUP: FilterGroup = {
  id: "category",
  label: "Category",
  type: "category",
  options: [
    { label: "All Products", value: "" },
    { label: "Skateboards", value: "skateboards" },
    { label: "Surfskates", value: "surfskates" },
    { label: "Apparel", value: "apparel-1" },
    { label: "Protection Gear", value: "protection-gears" },
  ],
};

/**
 * Maps a subcategory handle to its parent category handle, used to decide which
 * subcategory pills and which "category" group state apply.
 */
const SUB_TO_PARENT: Record<string, string> = {
  skateboards: "skateboards",
  decks: "skateboards",
  trucks: "skateboards",
  wheels: "skateboards",
  completes: "skateboards",
  accessories: "skateboards",
  "skateboard-completes": "skateboards",
  "skateboard-decks": "skateboards",
  "skateboard-trucks": "skateboards",
  "skateboard-wheels": "skateboards",
  "skateboard-accessories": "skateboards",

  surfskates: "surfskates",
  "surfskate-completes": "surfskates",
  "surfskate-decks": "surfskates",
  "surfskate-trucks": "surfskates",
  "surfskate-wheels": "surfskates",
  "surfskate-accessories": "surfskates",

  "apparel-1": "apparel-1",
  apparel: "apparel-1",

  "protection-gears": "protection-gears",
  "protective-gears": "protection-gears",
  helmets: "protection-gears",
  pads: "protection-gears",
  gloves: "protection-gears",
};

/**
 * Returns the parent category handle for a collection handle.
 *
 * Falls back to a substring match so a newly created Shopify collection still
 * lands under the right parent without a code change.
 */
export function getParentCategory(handle: string): string {
  if (!handle) return "";

  const exact = SUB_TO_PARENT[handle];
  if (exact) return exact;

  const lower = handle.toLowerCase();
  if (lower.includes("surfskate")) return "surfskates";
  if (lower.includes("apparel")) return "apparel-1";
  if (
    lower.includes("protect") ||
    lower.includes("helmet") ||
    lower.includes("pad")
  ) {
    return "protection-gears";
  }
  if (lower.includes("skateboard") || lower.includes("deck")) {
    return "skateboards";
  }
  return "";
}

/** Prefix used to recognise subcategory collections by title. */
export const CATEGORY_PREFIXES: Record<string, string> = {
  skateboards: "skateboard",
  surfskates: "surfskate",
  "apparel-1": "apparel",
  "protection-gears": "protection",
};

/**
 * Derives a human-readable label for a filter option value from a given group.
 * Used for rendering active filter chips.
 */
export function getLabelForFilterValue(
  groupId: string,
  value: string,
  filterGroups: FilterGroup[],
): string {
  if (groupId === "price") {
    const parts = value.split("-").map(Number);
    const min = parts[0];
    const max = parts[1];
    if (min !== undefined && max !== undefined && !isNaN(min) && !isNaN(max)) {
      return `₹${min.toLocaleString()} - ₹${max.toLocaleString()}`;
    }
  }
  const group = filterGroups.find((g) => g.id === groupId);
  if (!group) return value;
  const option = group.options.find((o) => o.value === value);
  return option ? option.label : value;
}

/**
 * Returns the hex colour for a color-swatch filter value.
 */
export function getHexForColorValue(
  value: string,
  filterGroups: FilterGroup[],
): string | undefined {
  const colorGroup = filterGroups.find((g) => g.type === "color-swatch");
  if (!colorGroup) return undefined;
  return colorGroup.options.find((o) => o.value === value)?.hex;
}

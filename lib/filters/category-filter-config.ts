/**
 * Category-aware filter configuration.
 *
 * Defines which filter groups appear in the filter drawer based on the active
 * collection handle. Uses product options, tags, and price for filtering —
 * no metafield queries needed.
 */

export type FilterOptionType = "checkbox" | "color-swatch" | "range-radio" | "category";

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
  /** Pre-defined options. Can be overridden at runtime by dynamic derivation. */
  options: FilterOption[];
  /** If true, multiple values can be selected (stored as comma-separated) */
  multi?: boolean;
}

// ---------------------------------------------------------------------------
// Shared option banks
// ---------------------------------------------------------------------------

const BRAND_OPTIONS: FilterOption[] = [
  { label: "Sphere", value: "sphere" },
  { label: "Baker", value: "baker" },
  { label: "Girl", value: "girl" },
  { label: "Disorder", value: "disorder" },
  { label: "MACBA Life", value: "macba-life" },
  { label: "Wasted Angels", value: "wasted-angels" },
  { label: "Mon Amour Nepal", value: "mon-amour-nepal" },
  { label: "Toucan", value: "toucan" },
];

const COLOR_OPTIONS: FilterOption[] = [
  { label: "Orange", value: "orange", hex: "#f97316" },
  { label: "Blue", value: "blue", hex: "#3b82f6" },
  { label: "Yellow", value: "yellow", hex: "#eab308" },
  { label: "Black", value: "black", hex: "#000000" },
  { label: "White", value: "white", hex: "#ffffff" },
  { label: "Red", value: "red", hex: "#ef4444" },
  { label: "Green", value: "green", hex: "#22c55e" },
  { label: "Purple", value: "purple", hex: "#a855f7" },
  { label: "Pink", value: "pink", hex: "#ec4899" },
];

const PRICE_OPTIONS: FilterOption[] = [
  { label: "Under \u20b92,000", value: "0-2000" },
  { label: "\u20b92,000 \u2013 \u20b95,000", value: "2000-5000" },
  { label: "\u20b95,000 \u2013 \u20b910,000", value: "5000-10000" },
  { label: "Over \u20b910,000", value: "10000-999999" },
];

const SKILL_LEVEL_OPTIONS: FilterOption[] = [
  { label: "Beginner", value: "beginner" },
  { label: "Intermediate", value: "intermediate" },
  { label: "Professional", value: "professional" },
];

const APPAREL_SIZE_OPTIONS: FilterOption[] = [
  { label: "XS", value: "xs" },
  { label: "S", value: "s" },
  { label: "M", value: "m" },
  { label: "L", value: "l" },
  { label: "XL", value: "xl" },
  { label: "XXL", value: "xxl" },
];

// ---------------------------------------------------------------------------
// Skateboard-specific options
// ---------------------------------------------------------------------------

const DECK_WIDTH_OPTIONS: FilterOption[] = [
  { label: "7.5\"", value: "7.5" },
  { label: "7.75\"", value: "7.75" },
  { label: "8.0\"", value: "8.0" },
  { label: "8.125\"", value: "8.125" },
  { label: "8.25\"", value: "8.25" },
  { label: "8.375\"", value: "8.375" },
  { label: "8.5\"", value: "8.5" },
  { label: "8.75\"", value: "8.75" },
  { label: "9.0\"", value: "9.0" },
];

const DECK_SHAPE_OPTIONS: FilterOption[] = [
  { label: "Popsicle", value: "popsicle" },
  { label: "Old School", value: "old-school" },
  { label: "Shaped", value: "shaped" },
  { label: "Cruiser", value: "cruiser" },
];

const DECK_CONCAVE_OPTIONS: FilterOption[] = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
  { label: "Steep", value: "steep" },
];

const DECK_CONSTRUCTION_OPTIONS: FilterOption[] = [
  { label: "7-Ply Maple", value: "7-ply-maple" },
  { label: "8-Ply Maple", value: "8-ply-maple" },
  { label: "Bamboo", value: "bamboo" },
  { label: "Carbon Fiber", value: "carbon-fiber" },
];

const TRUCK_AXLE_WIDTH_OPTIONS: FilterOption[] = [
  { label: "7.6\" (for 7.5\" deck)", value: "7.6" },
  { label: "7.75\" (for 7.75\" deck)", value: "7.75" },
  { label: "8.0\" (for 8.0\" deck)", value: "8.0" },
  { label: "8.25\" (for 8.25\" deck)", value: "8.25" },
  { label: "8.5\" (for 8.5\"+ deck)", value: "8.5" },
];

const WHEEL_DIAMETER_OPTIONS: FilterOption[] = [
  { label: "50mm", value: "50" },
  { label: "52mm", value: "52" },
  { label: "53mm", value: "53" },
  { label: "54mm", value: "54" },
  { label: "56mm", value: "56" },
  { label: "58mm+", value: "58" },
];

const WHEEL_HARDNESS_OPTIONS: FilterOption[] = [
  { label: "99a (Hard \u2013 Street)", value: "99a" },
  { label: "101a (Extra Hard)", value: "101a" },
  { label: "97a (Medium)", value: "97a" },
  { label: "78a\u201387a (Soft \u2013 Cruising)", value: "78a" },
];

// ---------------------------------------------------------------------------
// Surfskate-specific options
// ---------------------------------------------------------------------------

const SURFSKATE_DECK_LENGTH_OPTIONS: FilterOption[] = [
  { label: "28\"", value: "28" },
  { label: "29\"", value: "29" },
  { label: "30\"", value: "30" },
  { label: "31\"", value: "31" },
  { label: "32\"", value: "32" },
  { label: "33\"", value: "33" },
  { label: "34\"", value: "34" },
  { label: "36\"", value: "36" },
];

const SURFSKATE_DECK_WIDTH_OPTIONS: FilterOption[] = [
  { label: "9.0\"", value: "9.0" },
  { label: "9.5\"", value: "9.5" },
  { label: "10.0\"", value: "10.0" },
  { label: "10.5\"", value: "10.5" },
];

// ---------------------------------------------------------------------------
// Shared filter groups (reusable building blocks)
// ---------------------------------------------------------------------------

const SORT_GROUP: FilterGroup = {
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

const CATEGORY_GROUP: FilterGroup = {
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

const PRICE_GROUP: FilterGroup = {
  id: "price",
  label: "Price",
  type: "range-radio",
  options: PRICE_OPTIONS,
};

const COLOR_GROUP: FilterGroup = {
  id: "color",
  label: "Colors",
  type: "color-swatch",
  options: COLOR_OPTIONS,
};

const BRAND_GROUP: FilterGroup = {
  id: "brand",
  label: "Brands",
  type: "checkbox",
  options: BRAND_OPTIONS,
};

const SKILL_LEVEL_GROUP: FilterGroup = {
  id: "level",
  label: "Skill Level",
  type: "checkbox",
  options: SKILL_LEVEL_OPTIONS,
};

// ---------------------------------------------------------------------------
// BASE_FILTERS — shown when no category is active (all-products /store)
// ---------------------------------------------------------------------------

export const BASE_FILTERS: FilterGroup[] = [
  SORT_GROUP,
  CATEGORY_GROUP,
  PRICE_GROUP,
  COLOR_GROUP,
];

// ---------------------------------------------------------------------------
// Per-category filter definitions
// ---------------------------------------------------------------------------

const SKATEBOARD_DECKS_FILTERS: FilterGroup[] = [
  SORT_GROUP,
  CATEGORY_GROUP,
  {
    id: "size",
    label: "Sizes",
    type: "checkbox",
    options: DECK_WIDTH_OPTIONS,
  },
  BRAND_GROUP,
  {
    id: "width",
    label: "Width",
    type: "checkbox",
    options: DECK_WIDTH_OPTIONS,
  },
  {
    id: "shape",
    label: "Shape",
    type: "checkbox",
    options: DECK_SHAPE_OPTIONS,
  },
  {
    id: "concave",
    label: "Concave",
    type: "checkbox",
    options: DECK_CONCAVE_OPTIONS,
  },
  {
    id: "construction",
    label: "Construction",
    type: "checkbox",
    options: DECK_CONSTRUCTION_OPTIONS,
  },
  {
    id: "kids",
    label: "For Kids",
    type: "checkbox",
    options: [
      { label: "Yes", value: "yes" },
      { label: "No", value: "no" },
    ],
  },
  PRICE_GROUP,
];

const SKATEBOARD_COMPLETES_FILTERS: FilterGroup[] = [
  SORT_GROUP,
  CATEGORY_GROUP,
  {
    id: "size",
    label: "Sizes",
    type: "checkbox",
    options: DECK_WIDTH_OPTIONS,
  },
  BRAND_GROUP,
  SKILL_LEVEL_GROUP,
  COLOR_GROUP,
  PRICE_GROUP,
];

const SKATEBOARD_TRUCKS_FILTERS: FilterGroup[] = [
  SORT_GROUP,
  CATEGORY_GROUP,
  {
    id: "size",
    label: "Axle Width",
    type: "checkbox",
    options: TRUCK_AXLE_WIDTH_OPTIONS,
  },
  BRAND_GROUP,
  PRICE_GROUP,
];

const SKATEBOARD_WHEELS_FILTERS: FilterGroup[] = [
  SORT_GROUP,
  CATEGORY_GROUP,
  {
    id: "size",
    label: "Diameter",
    type: "checkbox",
    options: WHEEL_DIAMETER_OPTIONS,
  },
  BRAND_GROUP,
  {
    id: "hardness",
    label: "Hardness",
    type: "checkbox",
    options: WHEEL_HARDNESS_OPTIONS,
  },
  PRICE_GROUP,
];

const SKATEBOARD_ACCESSORIES_FILTERS: FilterGroup[] = [
  SORT_GROUP,
  CATEGORY_GROUP,
  BRAND_GROUP,
  PRICE_GROUP,
];

const SURFSKATE_COMPLETES_FILTERS: FilterGroup[] = [
  SORT_GROUP,
  CATEGORY_GROUP,
  {
    id: "size",
    label: "Deck Length",
    type: "checkbox",
    options: SURFSKATE_DECK_LENGTH_OPTIONS,
  },
  BRAND_GROUP,
  SKILL_LEVEL_GROUP,
  COLOR_GROUP,
  PRICE_GROUP,
];

const SURFSKATE_DECKS_FILTERS: FilterGroup[] = [
  SORT_GROUP,
  CATEGORY_GROUP,
  {
    id: "size",
    label: "Deck Length",
    type: "checkbox",
    options: SURFSKATE_DECK_LENGTH_OPTIONS,
  },
  BRAND_GROUP,
  {
    id: "width",
    label: "Width",
    type: "checkbox",
    options: SURFSKATE_DECK_WIDTH_OPTIONS,
  },
  PRICE_GROUP,
];

const SURFSKATE_TRUCKS_FILTERS: FilterGroup[] = [
  SORT_GROUP,
  CATEGORY_GROUP,
  BRAND_GROUP,
  PRICE_GROUP,
];

const SURFSKATE_WHEELS_FILTERS: FilterGroup[] = [
  SORT_GROUP,
  CATEGORY_GROUP,
  {
    id: "size",
    label: "Diameter",
    type: "checkbox",
    options: WHEEL_DIAMETER_OPTIONS,
  },
  BRAND_GROUP,
  PRICE_GROUP,
];

const APPAREL_FILTERS: FilterGroup[] = [
  SORT_GROUP,
  CATEGORY_GROUP,
  {
    id: "size",
    label: "Sizes",
    type: "checkbox",
    options: APPAREL_SIZE_OPTIONS,
  },
  BRAND_GROUP,
  COLOR_GROUP,
  PRICE_GROUP,
];

const PROTECTION_FILTERS: FilterGroup[] = [
  SORT_GROUP,
  CATEGORY_GROUP,
  {
    id: "size",
    label: "Sizes",
    type: "checkbox",
    options: APPAREL_SIZE_OPTIONS,
  },
  BRAND_GROUP,
  COLOR_GROUP,
  PRICE_GROUP,
];

const SKATEBOARDS_PARENT_FILTERS: FilterGroup[] = [
  SORT_GROUP,
  CATEGORY_GROUP,
  BRAND_GROUP,
  SKILL_LEVEL_GROUP,
  COLOR_GROUP,
  PRICE_GROUP,
];

const SURFSKATES_PARENT_FILTERS: FilterGroup[] = [
  SORT_GROUP,
  CATEGORY_GROUP,
  BRAND_GROUP,
  SKILL_LEVEL_GROUP,
  COLOR_GROUP,
  PRICE_GROUP,
];

// ---------------------------------------------------------------------------
// Collection handle → FilterGroup[] map
// ---------------------------------------------------------------------------

const CATEGORY_FILTER_MAP: Record<string, FilterGroup[]> = {
  // Skateboard parent
  skateboards: SKATEBOARDS_PARENT_FILTERS,

  // Skateboard sub-collections
  "skateboard-completes": SKATEBOARD_COMPLETES_FILTERS,
  completes: SKATEBOARD_COMPLETES_FILTERS,
  "skateboard-decks": SKATEBOARD_DECKS_FILTERS,
  decks: SKATEBOARD_DECKS_FILTERS,
  "skateboard-trucks": SKATEBOARD_TRUCKS_FILTERS,
  trucks: SKATEBOARD_TRUCKS_FILTERS,
  "skateboard-wheels": SKATEBOARD_WHEELS_FILTERS,
  wheels: SKATEBOARD_WHEELS_FILTERS,
  "skateboard-accessories": SKATEBOARD_ACCESSORIES_FILTERS,
  accessories: SKATEBOARD_ACCESSORIES_FILTERS,

  // Surfskate parent
  surfskates: SURFSKATES_PARENT_FILTERS,

  // Surfskate sub-collections
  "surfskate-completes": SURFSKATE_COMPLETES_FILTERS,
  "surfskate-decks": SURFSKATE_DECKS_FILTERS,
  "surfskate-trucks": SURFSKATE_TRUCKS_FILTERS,
  "surfskate-wheels": SURFSKATE_WHEELS_FILTERS,
  "surfskate-accessories": SKATEBOARD_ACCESSORIES_FILTERS,

  // Apparel
  "apparel-1": APPAREL_FILTERS,
  apparel: APPAREL_FILTERS,

  // Protection
  "protection-gears": PROTECTION_FILTERS,
  "protective-gears": PROTECTION_FILTERS,
  helmets: PROTECTION_FILTERS,
  pads: PROTECTION_FILTERS,
  gloves: PROTECTION_FILTERS,
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Returns the filter groups to display for a given collection handle.
 * Falls back to BASE_FILTERS when the handle is empty or unknown.
 */
export function deriveFiltersForCategory(handle: string): FilterGroup[] {
  if (!handle) return BASE_FILTERS;

  const exact = CATEGORY_FILTER_MAP[handle];
  if (exact) return exact;

  // Fuzzy match by substring
  const lower = handle.toLowerCase();
  if (lower.includes("deck")) return SKATEBOARD_DECKS_FILTERS;
  if (lower.includes("complete")) return SKATEBOARD_COMPLETES_FILTERS;
  if (lower.includes("truck")) return SKATEBOARD_TRUCKS_FILTERS;
  if (lower.includes("wheel")) return SKATEBOARD_WHEELS_FILTERS;
  if (lower.includes("accessor")) return SKATEBOARD_ACCESSORIES_FILTERS;
  if (lower.includes("surfskate")) return SURFSKATES_PARENT_FILTERS;
  if (lower.includes("skateboard")) return SKATEBOARDS_PARENT_FILTERS;
  if (lower.includes("apparel")) return APPAREL_FILTERS;
  if (
    lower.includes("protect") ||
    lower.includes("helmet") ||
    lower.includes("pad")
  ) {
    return PROTECTION_FILTERS;
  }

  // Brand pages: show brand + price + color
  return [SORT_GROUP, CATEGORY_GROUP, COLOR_GROUP, PRICE_GROUP];
}

/**
 * Derives a human-readable label for a filter option value from a given group.
 * Used for rendering active filter chips.
 */
export function getLabelForFilterValue(
  groupId: string,
  value: string,
  filterGroups: FilterGroup[]
): string {
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
  filterGroups: FilterGroup[]
): string | undefined {
  const colorGroup = filterGroups.find((g) => g.type === "color-swatch");
  if (!colorGroup) return undefined;
  return colorGroup.options.find((o) => o.value === value)?.hex;
}

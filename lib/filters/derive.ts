import type { FilterGroup, FilterOption } from "./category-filter-config";
import type { Product } from "lib/shopify/types";

/**
 * Derives filter groups from the products actually in a collection.
 *
 * The drawer used to render a hardcoded list of options (deck widths, shapes,
 * concaves, brands) written by hand and never reconciled with the store. Those
 * lists had drifted from the live catalogue, so a large share of options
 * matched zero products — and the drawer disables zero-count options, which
 * meant the user saw permanently greyed-out controls and concluded filtering
 * was broken.
 *
 * Deriving instead means an option only exists if something in the current
 * collection actually has it, so nothing dead can be rendered.
 */

/** Group order in the drawer. Anything not listed sorts last, alphabetically. */
const GROUP_ORDER = [
  "category",
  "price",
  "brand",
  "size",
  "concave",
  "shape",
  "wheel_size",
  "color",
];

const GROUP_LABELS: Record<string, string> = {
  size: "Size",
  concave: "Concave",
  shape: "Shape",
  wheel_size: "Wheel Size",
  color: "Color",
  brand: "Brands",
  price: "Price",
};

const GROUP_TYPES: Record<string, FilterGroup["type"]> = {
  color: "color-swatch",
  size: "checkbox",
  concave: "checkbox",
  shape: "checkbox",
  wheel_size: "checkbox",
};

/** Colours we can render a swatch for; anything else falls back to text. */
const COLOR_HEX: Record<string, string> = {
  black: "#000000",
  white: "#ffffff",
  red: "#ef4444",
  blue: "#3b82f6",
  green: "#22c55e",
  yellow: "#eab308",
  orange: "#f97316",
  purple: "#a855f7",
  pink: "#ec4899",
  grey: "#9ca3af",
  gray: "#9ca3af",
  brown: "#92400e",
  beige: "#e7d8c9",
  navy: "#1e3a8a",
};

/**
 * Shopify option names to filter ids. `SIZES` and `Title` are not customer
 * facing (the latter is always "Default Title"), so they are excluded.
 */
const OPTION_NAME_TO_GROUP: Record<string, string> = {
  size: "size",
  sizes: "size",
  color: "color",
  colour: "color",
  concave: "concave",
  shape: "shape",
  "wheel size": "wheel_size",
};

/**
 * Normalises a value so `8.0` from a filter and `8` from Shopify compare
 * equal, and so a trailing quote never decides a match. Returns "" for values
 * that carry no filterable meaning.
 */
export function normalizeValue(value: string): string {
  const trimmed = value.trim().toLowerCase();
  if (!trimmed) return "";
  // "Default Title" is Shopify's placeholder, not a real option.
  if (trimmed === "default title") return "";
  // Strip a trailing inch mark only when it's decoration on a measurement.
  const withoutUnit = trimmed.replace(/["']/g, "").trim();
  if (!withoutUnit) return "";
  // Collapse 8.0 / 8.00 to 8 so numeric options line up.
  if (/^\d*\.?\d+$/.test(withoutUnit)) {
    return String(Number(withoutUnit));
  }
  return withoutUnit;
}

/** Turns a Shopify vendor into a filter value: "Sphere Skateboards" → "sphere-skateboards". */
export function normalizeVendor(vendor: string): string {
  return vendor
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

/** Human label from a raw Shopify value, e.g. `7.75` → `7.75`, `rounded end` → `Rounded End`. */
function toLabel(value: string): string {
  const trimmed = value.trim();
  // A bare measurement reads better with its inch mark back on.
  if (/^\d+(\.\d+)?$/.test(trimmed)) {
    return /^\d{1,2}$/.test(trimmed) ? trimmed : `${trimmed}"`;
  }
  return trimmed;
}

/** Numeric sort for values like 7.5, 51, 99a — keeps 8 before 8.25. */
function compareValues(a: string, b: string): number {
  const aNum = Number(a);
  const bNum = Number(b);
  if (!Number.isNaN(aNum) && !Number.isNaN(bNum)) return aNum - bNum;
  return a.localeCompare(b, undefined, { numeric: true });
}

/** Stable sort key for a group id, used to order the drawer. */
function groupRank(id: string): number {
  const index = GROUP_ORDER.indexOf(id);
  return index === -1 ? GROUP_ORDER.length : index;
}

/**
 * Does a product satisfy one filter group's option?
 *
 * Option-derived groups match on the Shopify option of the same name and on an
 * exact normalised tag — deliberately *not* on the product title. Titles are
 * marketing copy: a wheels product titled "Toucan Tropical Wheels 53mm 55mm"
 * would otherwise satisfy a deck-width Size filter for 53mm, so selecting a
 * width would drag in unrelated products. Because groups are derived from the
 * same option values they match on, every derived option is guaranteed to match
 * at least the product it came from.
 */
export function productMatches(
  product: Product,
  groupId: string,
  value: string,
): boolean {
  const target = normalizeValue(value);
  if (!target) return false;

  if (groupId === "price") {
    const [min, max] = value.split("-").map(Number);
    const price = Number(product.priceRange.minVariantPrice.amount);
    return price >= (min ?? 0) && price <= (max ?? Infinity);
  }

  if (groupId === "brand") {
    const vendor = normalizeVendor(product.vendor ?? "");
    if (vendor && (vendor === target || vendor.startsWith(`${target}-`))) {
      return true;
    }
    const byTag = (product.tags ?? []).some(
      (tag) => normalizeValue(tag) === target,
    );
    if (byTag) return true;
    // Titles are the last resort for brands, where naming the brand in the
    // product name is normal and a false positive is unlikely.
    return product.title.toLowerCase().includes(target);
  }

  const optionNames = Object.entries(OPTION_NAME_TO_GROUP)
    .filter(([, group]) => group === groupId)
    .map(([name]) => name);

  const matchedByOption = (product.options ?? []).some(
    (option) =>
      optionNames.includes(option.name.toLowerCase().trim()) &&
      option.values.some(
        (optionValue) => normalizeValue(optionValue) === target,
      ),
  );
  if (matchedByOption) return true;

  return (product.tags ?? []).some((tag) => normalizeValue(tag) === target);
}

/**
 * Builds the drawer groups for one collection.
 *
 * `staticGroups` are the groups that cannot be derived from product data —
 * sorting, and the category jump list the parent component supplies.
 */
export function deriveFilterGroups(
  products: Product[],
  staticGroups: FilterGroup[],
): FilterGroup[] {
  const priceGroup = buildPriceGroup(products);
  const optionGroups = buildOptionGroups(products);
  const brandGroup = buildBrandGroup(products);

  const derived = [priceGroup, brandGroup, ...optionGroups].filter(
    (group): group is FilterGroup => group !== null,
  );

  derived.sort((a, b) => groupRank(a.id) - groupRank(b.id));

  return [...staticGroups, ...derived];
}

function buildPriceGroup(products: Product[]): FilterGroup | null {
  const prices = products
    .map((product) => Number(product.priceRange.minVariantPrice.amount))
    .filter((price) => !Number.isNaN(price));

  if (prices.length === 0) return null;

  const min = Math.floor(Math.min(...prices));
  const max = Math.ceil(Math.max(...prices));
  if (max <= min) return null;

  // Bands sized to the collection's own spread, so a ₹699–₹3,999 deck
  // collection does not get the same fixed bands as a ₹200–₹14,000 one.
  const bandCount = 4;
  const step = Math.max(1, Math.ceil((max - min) / bandCount));
  const options: FilterOption[] = [];

  for (let low = min; low < max; low += step) {
    const high = Math.min(low + step, max);
    // A band can land in a gap in the catalogue's pricing. The drawer disables
    // zero-count options, so an empty band would show as a dead control —
    // drop it instead.
    const inBand = products.some((product) => {
      const price = Number(product.priceRange.minVariantPrice.amount);
      return price >= low && price <= high;
    });
    if (!inBand) continue;

    options.push({
      label: `₹${low.toLocaleString("en-IN")} – ₹${high.toLocaleString("en-IN")}`,
      value: `${low}-${high}`,
    });
  }

  if (options.length === 0) return null;

  return {
    id: "price",
    label: GROUP_LABELS.price!,
    type: "range-radio",
    options,
  };
}

function buildBrandGroup(products: Product[]): FilterGroup | null {
  const byValue = new Map<string, string>();

  for (const product of products) {
    const vendor = product.vendor?.trim();
    if (!vendor) continue;
    const value = normalizeVendor(vendor);
    if (!value) continue;
    // First spelling wins, so the label reads as the vendor wrote it.
    if (!byValue.has(value)) byValue.set(value, vendor);
  }

  if (byValue.size === 0) return null;

  const options = [...byValue.entries()]
    .sort((a, b) => a[1].localeCompare(b[1]))
    .map(([value, label]) => ({ label, value }));

  return { id: "brand", label: GROUP_LABELS.brand!, type: "checkbox", options };
}

function buildOptionGroups(products: Product[]): FilterGroup[] {
  // group id → the first raw spelling of each value, for a readable label.
  const values = new Map<string, Map<string, string>>();

  for (const product of products) {
    for (const option of product.options ?? []) {
      const groupId = OPTION_NAME_TO_GROUP[option.name.toLowerCase().trim()];
      if (!groupId) continue;

      let bucket = values.get(groupId);
      if (!bucket) {
        bucket = new Map();
        values.set(groupId, bucket);
      }

      for (const raw of option.values) {
        const value = normalizeValue(raw);
        if (!value) continue;
        if (!bucket.has(value)) bucket.set(value, raw.trim());
      }
    }
  }

  return [...values.entries()].map(([groupId, bucket]) => {
    const sorted = [...bucket.entries()].sort((a, b) =>
      compareValues(a[0], b[0]),
    );

    const options: FilterOption[] = sorted.map(([value, raw]) => {
      const option: FilterOption = { label: toLabel(raw), value };
      const hex = groupId === "color" ? COLOR_HEX[value] : undefined;
      if (hex) option.hex = hex;
      return option;
    });

    return {
      id: groupId,
      label: GROUP_LABELS[groupId] ?? groupId,
      type: GROUP_TYPES[groupId] ?? "checkbox",
      options,
    };
  });
}

/**
 * How many of `products` survive the given filter map. Used for the drawer's
 * running count and for disabling options that would yield nothing.
 */
export function countMatching(
  products: Product[],
  filters: Record<string, string>,
): number {
  const entries = Object.entries(filters).filter(([, value]) => value);
  if (entries.length === 0) return products.length;

  return products.filter((product) =>
    entries.every(([groupId, value]) =>
      value
        .split(",")
        .filter(Boolean)
        .some((optionValue) => productMatches(product, groupId, optionValue)),
    ),
  ).length;
}

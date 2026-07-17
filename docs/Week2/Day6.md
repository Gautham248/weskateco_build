# DAY 6 IMPLEMENTATION — CONFIGURATOR ENGINE

## CONTEXT

This is a Next.js 15.6.0-canary.60 App Router project for WeSkate Co (skateboarding brand). We are building a skateboard configurator — a step-by-step wizard that lets customers build a compatible skateboard setup by selecting components (deck, trucks, wheels, bearings, griptape). The configurator filters each subsequent step based on the previous selection's compatibility.

The project uses bare imports (e.g., `import { getCart } from "lib/shopify"` — no `@/` alias). Follow this convention for all new files.

**Today we build the engine only — pure TypeScript logic, no UI components.** The wizard UI is Day 7.

## KEY ARCHITECTURAL DECISIONS

1. **The entire configurator runs client-side.** With ~50 products, we prefetch everything on page load and filter in-memory. Zero API calls during the wizard.

2. **Products have variants with different sizes.** A single deck product can have variants like "7.75", "8.0", "8.25". Each variant has its own width. The configurator treats each variant as a separate selectable option — the user picks a specific variant, not just a product.

3. **Mock data is used until real Shopify metafields exist.** A `config/mock-configurator-data.json` file maps product handles to configurator attributes. A mock data adapter enriches Shopify product data with these attributes. When real metafields are synced to Shopify later, we switch to reading from the API response directly.

4. **Not all board types are buildable yet.** The real catalog only supports Skateboard and Old School builds from components. Surfskate decks aren't sold separately (only completes). Longboard and Cruiser have no components. The engine handles all 5 types, but the UI will show "coming soon" for unbuildable types.

## FILES TO CREATE

All new files go in `lib/configurator/` and `config/`.

---

### FILE 1: `config/compatibility-rules.json`

The compatibility rules configuration. This is the single source of truth for all matching logic.

```json
{
  "hanger_to_axle_offset": 2.75,
  "truck_width_tolerance": 0.25,
  "board_type_truck_map": {
    "Skateboard": ["Standard (TKP)"],
    "Surfskate": ["Surfskate"],
    "Longboard": ["Longboard (RKP)"],
    "Old School": ["Standard (TKP)"],
    "Cruiser": ["Standard (TKP)", "Longboard (RKP)"]
  },
  "board_type_wheel_map": {
    "Skateboard": ["Street/Park", "All-Terrain"],
    "Surfskate": ["Surfskate", "Cruiser/Longboard"],
    "Longboard": ["Cruiser/Longboard"],
    "Old School": ["Street/Park", "All-Terrain", "Cruiser/Longboard"],
    "Cruiser": ["Cruiser/Longboard", "All-Terrain"]
  },
  "surfskate_skip_width_match": true,
  "riser_hardware_map": {
    "none": ["7/8\"", "1\""],
    "1/8\"": ["1\"", "1 1/8\""],
    "1/4\"": ["1 1/4\""],
    "1/2\"": ["1 1/2\""]
  },
  "griptape_deck_max_width": {
    "9": 8.75,
    "10": 9.75,
    "11": 10.75
  },
  "board_type_availability": {
    "Skateboard": true,
    "Old School": true,
    "Surfskate": false,
    "Longboard": false,
    "Cruiser": false
  },
  "board_type_unavailable_message": {
    "Surfskate": "Surfskate decks coming soon. Check out our complete surfskates instead!",
    "Longboard": "Longboard components coming soon.",
    "Cruiser": "Cruiser components coming soon."
  }
}
```

This file already exists at `config/mock-configurator-data.json` (the product data). The compatibility rules go in a SEPARATE file: `config/compatibility-rules.json`.

---

### FILE 2: `lib/configurator/types.ts`

All TypeScript types for the configurator.

```typescript
// Board types supported by the configurator
export type BoardType =
  | "Skateboard"
  | "Surfskate"
  | "Longboard"
  | "Old School"
  | "Cruiser";

// Product categories in the configurator
export type ConfiguratorCategory =
  | "deck"
  | "truck"
  | "wheel"
  | "bearing"
  | "griptape"
  | "riser"
  | "hardware";

// A single selectable option in the configurator
// This represents a specific product variant (e.g., "Twisted Human Deck — 8.25 / Regular")
export interface ConfiguratorItem {
  // Shopify product data
  productId: string;
  productHandle: string;
  productTitle: string;
  productImage?: string;
  brand?: string;

  // Variant data (each variant is a separate selectable option)
  variantId: string;
  variantTitle: string;
  price: {
    amount: string;
    currencyCode: string;
  };
  availableForSale: boolean;

  // Configurator metafields (from mock data or real Shopify metafields)
  meta: ConfiguratorMeta;
}

// Metafield data for each product category
export type ConfiguratorMeta =
  | DeckMeta
  | TruckMeta
  | WheelMeta
  | BearingMeta
  | GriptapeMeta
  | RiserMeta
  | HardwareMeta;

export interface DeckMeta {
  category: "deck";
  deck_board_type: BoardType;
  deck_width: number; // inches — specific to this variant
}

export interface TruckMeta {
  category: "truck";
  truck_type:
    | "Standard (TKP)"
    | "Surfskate"
    | "Longboard (RKP)"
    | "Longboard (TKP)";
  truck_hanger_size: number | null; // inches — null for surfskate trucks
  truck_sold_as: "Pair" | "Set (front+rear)";
  truck_compatible_board_types: string; // comma-separated: "Skateboard,Old School"
}

export interface WheelMeta {
  category: "wheel";
  wheel_diameter: number; // mm — specific to this variant
  wheel_hardness: string; // e.g., "85BD", "99A"
  wheel_type: "Street/Park" | "Cruiser/Longboard" | "All-Terrain" | "Surfskate";
  wheel_compatible_board_types: string; // comma-separated
}

export interface BearingMeta {
  category: "bearing";
  bearing_type: "Steel" | "Ceramic" | "Swiss";
}

export interface GriptapeMeta {
  category: "griptape";
  griptape_width: number; // inches
  griptape_type?: string;
}

export interface RiserMeta {
  category: "riser";
  riser_height: string; // e.g., '1/8"'
  riser_type?: string;
}

export interface HardwareMeta {
  category: "hardware";
  hardware_length: string; // e.g., '1"'
  hardware_head_type?: "Phillips" | "Allen";
}

// The full state of the configurator wizard
export interface ConfiguratorState {
  boardType: BoardType | null;
  deck: ConfiguratorItem | null;
  trucks: ConfiguratorItem | null;
  wheels: ConfiguratorItem | null;
  bearings: ConfiguratorItem | null;
  griptape: ConfiguratorItem | null;
  risers: ConfiguratorItem | null; // optional
  hardware: ConfiguratorItem | null; // optional
}

// Wizard step definition
export interface ConfiguratorStep {
  id: number;
  key: string; // translation key prefix, e.g., "configurator.step1"
  category: ConfiguratorCategory | "board_type" | "review";
  isOptional: boolean;
}

// Compatibility rules loaded from config
export interface CompatibilityRules {
  hanger_to_axle_offset: number;
  truck_width_tolerance: number;
  board_type_truck_map: Record<string, string[]>;
  board_type_wheel_map: Record<string, string[]>;
  surfskate_skip_width_match: boolean;
  riser_hardware_map: Record<string, string[]>;
  griptape_deck_max_width: Record<string, number>;
  board_type_availability: Record<string, boolean>;
  board_type_unavailable_message: Record<string, string>;
}

// The result of a compatibility filter
export interface FilterResult {
  compatible: ConfiguratorItem[];
  incompatible: ConfiguratorItem[]; // shown greyed out with reason
  empty: boolean; // true if no compatible items exist
  emptyMessage?: string; // "No compatible trucks found for this deck width"
}
```

---

### FILE 3: `lib/configurator/mock-data.ts`

Reads the mock JSON and transforms Shopify product data into `ConfiguratorItem` arrays. This is the adapter layer between Shopify's product format and the configurator's expected format.

```typescript
import type { Product } from "lib/shopify/types";
import type {
  ConfiguratorItem,
  DeckMeta,
  TruckMeta,
  WheelMeta,
  BearingMeta,
  GriptapeMeta,
  ConfiguratorCategory,
} from "./types";
import mockData from "config/mock-configurator-data.json";

// Type for the mock data JSON structure
interface MockProductData {
  [key: string]: any;
  deck_board_type?: string;
  deck_width_by_variant?: Record<string, number>;
  truck_type?: string;
  truck_hanger_size_by_variant?: Record<string, number | null>;
  truck_sold_as?: string;
  truck_compatible_board_types?: string;
  wheel_diameter_by_variant?: Record<string, number>;
  wheel_hardness?: string;
  wheel_type?: string;
  wheel_compatible_board_types?: string;
  bearing_type?: string;
  griptape_width?: number;
  griptape_type?: string;
  brand?: string;
}

/**
 * Transforms Shopify products into ConfiguratorItems using mock metafield data.
 * Each product variant becomes a separate ConfiguratorItem.
 *
 * When real Shopify metafields are available, replace this function with one that
 * reads metafields directly from the product.metafields array.
 */
export function buildConfiguratorItems(products: Product[]): {
  decks: ConfiguratorItem[];
  trucks: ConfiguratorItem[];
  wheels: ConfiguratorItem[];
  bearings: ConfiguratorItem[];
  griptape: ConfiguratorItem[];
  risers: ConfiguratorItem[];
  hardware: ConfiguratorItem[];
} {
  const decks: ConfiguratorItem[] = [];
  const trucks: ConfiguratorItem[] = [];
  const wheels: ConfiguratorItem[] = [];
  const bearings: ConfiguratorItem[] = [];
  const griptape: ConfiguratorItem[] = [];
  const risers: ConfiguratorItem[] = [];
  const hardware: ConfiguratorItem[] = [];

  for (const product of products) {
    const handle = product.handle;

    // Check each category in mock data
    if (handle in (mockData.decks || {})) {
      const mock = (mockData.decks as Record<string, MockProductData>)[handle]!;
      const widthByVariant = mock.deck_width_by_variant || {};

      for (const variant of product.variants) {
        const width = widthByVariant[variant.title];
        if (width === undefined) continue; // skip variants we don't have width data for

        decks.push({
          productId: product.id,
          productHandle: handle,
          productTitle: product.title,
          productImage: product.featuredImage?.url,
          brand: mock.brand,
          variantId: variant.id,
          variantTitle: variant.title,
          price: {
            amount: variant.price.amount,
            currencyCode: variant.price.currencyCode,
          },
          availableForSale: variant.availableForSale,
          meta: {
            category: "deck" as const,
            deck_board_type: mock.deck_board_type as any,
            deck_width: width,
          },
        });
      }
    }

    if (handle in (mockData.trucks || {})) {
      const mock = (mockData.trucks as Record<string, MockProductData>)[
        handle
      ]!;
      const hangerByVariant = mock.truck_hanger_size_by_variant || {};

      for (const variant of product.variants) {
        const hangerSize = hangerByVariant[variant.title];

        trucks.push({
          productId: product.id,
          productHandle: handle,
          productTitle: product.title,
          productImage: product.featuredImage?.url,
          brand: mock.brand,
          variantId: variant.id,
          variantTitle: variant.title,
          price: {
            amount: variant.price.amount,
            currencyCode: variant.price.currencyCode,
          },
          availableForSale: variant.availableForSale,
          meta: {
            category: "truck" as const,
            truck_type: mock.truck_type as any,
            truck_hanger_size: hangerSize ?? null,
            truck_sold_as: (mock.truck_sold_as as any) || "Pair",
            truck_compatible_board_types:
              mock.truck_compatible_board_types || "",
          },
        });
      }
    }

    if (handle in (mockData.wheels || {})) {
      const mock = (mockData.wheels as Record<string, MockProductData>)[
        handle
      ]!;
      const diameterByVariant = mock.wheel_diameter_by_variant || {};

      for (const variant of product.variants) {
        const diameter = diameterByVariant[variant.title];
        if (diameter === undefined) continue;

        wheels.push({
          productId: product.id,
          productHandle: handle,
          productTitle: product.title,
          productImage: product.featuredImage?.url,
          brand: mock.brand,
          variantId: variant.id,
          variantTitle: variant.title,
          price: {
            amount: variant.price.amount,
            currencyCode: variant.price.currencyCode,
          },
          availableForSale: variant.availableForSale,
          meta: {
            category: "wheel" as const,
            wheel_diameter: diameter,
            wheel_hardness: mock.wheel_hardness || "",
            wheel_type: mock.wheel_type as any,
            wheel_compatible_board_types:
              mock.wheel_compatible_board_types || "",
          },
        });
      }
    }

    if (handle in (mockData.bearings || {})) {
      const mock = (mockData.bearings as Record<string, MockProductData>)[
        handle
      ]!;

      for (const variant of product.variants) {
        bearings.push({
          productId: product.id,
          productHandle: handle,
          productTitle: product.title,
          productImage: product.featuredImage?.url,
          brand: mock.brand,
          variantId: variant.id,
          variantTitle: variant.title,
          price: {
            amount: variant.price.amount,
            currencyCode: variant.price.currencyCode,
          },
          availableForSale: variant.availableForSale,
          meta: {
            category: "bearing" as const,
            bearing_type: (mock.bearing_type as any) || "Steel",
          },
        });
      }
    }

    if (handle in (mockData.griptape || {})) {
      const mock = (mockData.griptape as Record<string, MockProductData>)[
        handle
      ]!;

      for (const variant of product.variants) {
        griptape.push({
          productId: product.id,
          productHandle: handle,
          productTitle: product.title,
          productImage: product.featuredImage?.url,
          brand: mock.brand,
          variantId: variant.id,
          variantTitle: variant.title,
          price: {
            amount: variant.price.amount,
            currencyCode: variant.price.currencyCode,
          },
          availableForSale: variant.availableForSale,
          meta: {
            category: "griptape" as const,
            griptape_width: mock.griptape_width || 9,
            griptape_type: mock.griptape_type,
          },
        });
      }
    }

    // Risers and Hardware: no products in store yet.
    // When they're added, handle them the same way as above.
  }

  return { decks, trucks, wheels, bearings, griptape, risers, hardware };
}
```

**IMPORTANT about JSON imports**: The project may need `resolveJsonModule: true` and `esModuleInterop: true` in `tsconfig.json` for JSON imports to work. Check `tsconfig.json` — if these aren't set, add them. Also, the mock data JSON uses string keys with special characters like `"5.25\""` — make sure the JSON is valid. If TypeScript complains about importing JSON, you can alternatively read the file with `fs.readFileSync` in a server context, or convert the import to a require.

For client-side usage (the configurator runs client-side), the JSON import must work in the browser. The simplest approach is to ensure `tsconfig.json` has `"resolveJsonModule": true` and the import works. If there are issues, convert the mock data to a `.ts` file that exports the object directly:

```typescript
// config/mock-configurator-data.ts
export const mockConfiguratorData = { decks: { ... }, trucks: { ... }, ... };
```

---

### FILE 4: `lib/configurator/engine.ts`

The core compatibility engine. Pure functions — no side effects, no API calls, no React.

```typescript
import type {
  BoardType,
  ConfiguratorItem,
  DeckMeta,
  TruckMeta,
  WheelMeta,
  GriptapeMeta,
  CompatibilityRules,
  FilterResult,
} from "./types";
import rules from "config/compatibility-rules.json";

const compatRules: CompatibilityRules = rules as CompatibilityRules;

/**
 * Check if a board type has products available in the current catalog.
 */
export function isBoardTypeAvailable(boardType: BoardType): boolean {
  return compatRules.board_type_availability[boardType] ?? false;
}

/**
 * Get the unavailability message for a board type.
 */
export function getBoardTypeUnavailableMessage(boardType: BoardType): string {
  return (
    compatRules.board_type_unavailable_message[boardType] ?? "Coming soon."
  );
}

/**
 * Filter decks by board type.
 */
export function getCompatibleDecks(
  allDecks: ConfiguratorItem[],
  boardType: BoardType,
): FilterResult {
  const compatible = allDecks.filter((item) => {
    const meta = item.meta as DeckMeta;
    return meta.deck_board_type === boardType && item.availableForSale;
  });

  const incompatible = allDecks.filter((item) => {
    const meta = item.meta as DeckMeta;
    return meta.deck_board_type !== boardType || !item.availableForSale;
  });

  return {
    compatible,
    incompatible,
    empty: compatible.length === 0,
    emptyMessage:
      compatible.length === 0
        ? `No ${boardType.toLowerCase()} decks available yet.`
        : undefined,
  };
}

/**
 * Filter trucks by board type and deck width compatibility.
 *
 * Rules:
 * - Truck type must be in the allowed list for this board type
 * - For Standard (TKP): axle_width (= hanger_size + 2.75) must be within ±tolerance of deck_width
 * - For Surfskate: skip width matching (trucks are universal for surfskate)
 * - For Longboard (RKP): use mm-based mapping (not implemented yet — no products)
 */
export function getCompatibleTrucks(
  allTrucks: ConfiguratorItem[],
  selectedDeck: ConfiguratorItem,
  boardType: BoardType,
): FilterResult {
  const deckMeta = selectedDeck.meta as DeckMeta;
  const deckWidth = deckMeta.deck_width;
  const allowedTruckTypes = compatRules.board_type_truck_map[boardType] || [];
  const tolerance = compatRules.truck_width_tolerance;
  const offset = compatRules.hanger_to_axle_offset;

  const compatible: ConfiguratorItem[] = [];
  const incompatible: ConfiguratorItem[] = [];

  for (const item of allTrucks) {
    const meta = item.meta as TruckMeta;

    // Must be correct truck type for this board
    if (!allowedTruckTypes.includes(meta.truck_type)) {
      incompatible.push(item);
      continue;
    }

    // Must be compatible with this board type
    const compatibleBoardTypes = meta.truck_compatible_board_types
      .split(",")
      .map((s) => s.trim());
    if (!compatibleBoardTypes.includes(boardType)) {
      incompatible.push(item);
      continue;
    }

    // Surfskate trucks: skip width matching
    if (
      meta.truck_type === "Surfskate" &&
      compatRules.surfskate_skip_width_match
    ) {
      if (item.availableForSale) {
        compatible.push(item);
      } else {
        incompatible.push(item);
      }
      continue;
    }

    // Standard TKP trucks: width matching
    if (meta.truck_hanger_size !== null) {
      const axleWidth = meta.truck_hanger_size + offset;
      const widthDiff = Math.abs(axleWidth - deckWidth);

      if (widthDiff <= tolerance && item.availableForSale) {
        compatible.push(item);
      } else {
        incompatible.push(item);
      }
      continue;
    }

    // Fallback: if we can't determine compatibility, exclude
    incompatible.push(item);
  }

  return {
    compatible,
    incompatible,
    empty: compatible.length === 0,
    emptyMessage:
      compatible.length === 0
        ? `No compatible trucks found for a ${deckWidth}" deck. Try a different deck width.`
        : undefined,
  };
}

/**
 * Filter wheels by board type and wheel type compatibility.
 *
 * Rules:
 * - Wheel type must be in the allowed list for this board type
 * - If the selected truck has a max_wheel_diameter, filter by that too
 */
export function getCompatibleWheels(
  allWheels: ConfiguratorItem[],
  selectedTruck: ConfiguratorItem,
  boardType: BoardType,
): FilterResult {
  const allowedWheelTypes = compatRules.board_type_wheel_map[boardType] || [];

  const compatible: ConfiguratorItem[] = [];
  const incompatible: ConfiguratorItem[] = [];

  for (const item of allWheels) {
    const meta = item.meta as WheelMeta;

    // Check wheel type compatibility
    if (!allowedWheelTypes.includes(meta.wheel_type)) {
      incompatible.push(item);
      continue;
    }

    // Check board type compatibility
    const compatibleBoardTypes = meta.wheel_compatible_board_types
      .split(",")
      .map((s) => s.trim());
    if (!compatibleBoardTypes.includes(boardType)) {
      incompatible.push(item);
      continue;
    }

    if (item.availableForSale) {
      compatible.push(item);
    } else {
      incompatible.push(item);
    }
  }

  return {
    compatible,
    incompatible,
    empty: compatible.length === 0,
    emptyMessage:
      compatible.length === 0
        ? `No compatible wheels found for this setup.`
        : undefined,
  };
}

/**
 * Get all bearings. Bearings are universally compatible.
 */
export function getCompatibleBearings(
  allBearings: ConfiguratorItem[],
): FilterResult {
  const compatible = allBearings.filter((item) => item.availableForSale);
  const incompatible = allBearings.filter((item) => !item.availableForSale);

  return {
    compatible,
    incompatible,
    empty: compatible.length === 0,
    emptyMessage:
      compatible.length === 0 ? "No bearings available." : undefined,
  };
}

/**
 * Filter griptape by deck width.
 *
 * Rules:
 * - Griptape width must be >= deck width
 * - Use griptape_deck_max_width to determine the maximum deck width each grip width can cover
 */
export function getCompatibleGriptape(
  allGriptape: ConfiguratorItem[],
  selectedDeck: ConfiguratorItem,
): FilterResult {
  const deckMeta = selectedDeck.meta as DeckMeta;
  const deckWidth = deckMeta.deck_width;

  const compatible: ConfiguratorItem[] = [];
  const incompatible: ConfiguratorItem[] = [];

  for (const item of allGriptape) {
    const meta = item.meta as GriptapeMeta;
    const gripWidth = meta.griptape_width;
    const maxDeckWidth = compatRules.griptape_deck_max_width[String(gripWidth)];

    if (
      maxDeckWidth !== undefined &&
      deckWidth <= maxDeckWidth &&
      item.availableForSale
    ) {
      compatible.push(item);
    } else {
      incompatible.push(item);
    }
  }

  return {
    compatible,
    incompatible,
    empty: compatible.length === 0,
    emptyMessage:
      compatible.length === 0
        ? `No griptape wide enough for a ${deckWidth}" deck.`
        : undefined,
  };
}

/**
 * Get all risers. Currently no products — returns empty.
 */
export function getCompatibleRisers(
  allRisers: ConfiguratorItem[],
): FilterResult {
  return {
    compatible: allRisers.filter((item) => item.availableForSale),
    incompatible: [],
    empty: allRisers.length === 0,
    emptyMessage: "Riser pads coming soon.",
  };
}

/**
 * Filter hardware by riser height.
 * Currently no hardware products — returns empty.
 */
export function getCompatibleHardware(
  allHardware: ConfiguratorItem[],
  selectedRiser: ConfiguratorItem | null,
): FilterResult {
  return {
    compatible: [],
    incompatible: [],
    empty: true,
    emptyMessage: "Hardware is included with your trucks.",
  };
}

/**
 * Calculate the total price of the current configurator build.
 */
export function calculateBuildTotal(state: {
  deck: ConfiguratorItem | null;
  trucks: ConfiguratorItem | null;
  wheels: ConfiguratorItem | null;
  bearings: ConfiguratorItem | null;
  griptape: ConfiguratorItem | null;
  risers: ConfiguratorItem | null;
  hardware: ConfiguratorItem | null;
}): { amount: number; currencyCode: string } {
  const items = [
    state.deck,
    state.trucks,
    state.wheels,
    state.bearings,
    state.griptape,
    state.risers,
    state.hardware,
  ].filter(Boolean) as ConfiguratorItem[];

  const total = items.reduce(
    (sum, item) => sum + parseFloat(item.price.amount),
    0,
  );
  const currencyCode = items[0]?.price.currencyCode || "INR";

  return { amount: total, currencyCode };
}

/**
 * Get the list of configurator steps.
 * Steps with no available products are marked as skippable.
 */
export function getConfiguratorSteps(
  hasRisers: boolean,
  hasHardware: boolean,
): Array<{
  id: number;
  translationKey: string;
  category: string;
  isOptional: boolean;
  skip: boolean;
  skipMessage?: string;
}> {
  return [
    {
      id: 1,
      translationKey: "configurator.step1",
      category: "board_type",
      isOptional: false,
      skip: false,
    },
    {
      id: 2,
      translationKey: "configurator.step2",
      category: "deck",
      isOptional: false,
      skip: false,
    },
    {
      id: 3,
      translationKey: "configurator.step3",
      category: "truck",
      isOptional: false,
      skip: false,
    },
    {
      id: 4,
      translationKey: "configurator.step4",
      category: "wheel",
      isOptional: false,
      skip: false,
    },
    {
      id: 5,
      translationKey: "configurator.step5",
      category: "bearing",
      isOptional: false,
      skip: false,
    },
    {
      id: 6,
      translationKey: "configurator.step6",
      category: "griptape",
      isOptional: false,
      skip: false,
    },
    {
      id: 7,
      translationKey: "configurator.step7",
      category: "riser",
      isOptional: true,
      skip: !hasRisers,
      skipMessage: "Riser pads coming soon.",
    },
    {
      id: 8,
      translationKey: "configurator.step8",
      category: "hardware",
      isOptional: true,
      skip: !hasHardware,
      skipMessage: "Hardware included with trucks.",
    },
    {
      id: 9,
      translationKey: "configurator.step9",
      category: "review",
      isOptional: false,
      skip: false,
    },
  ];
}
```

---

### FILE 5: `lib/configurator/index.ts`

Public API — re-exports everything other files need.

```typescript
export * from "./types";
export * from "./engine";
export { buildConfiguratorItems } from "./mock-data";
```

---

### CHANGE 6: Ensure JSON imports work

**Check file**: `tsconfig.json`

Ensure these compiler options are set:

```json
{
  "compilerOptions": {
    "resolveJsonModule": true,
    "esModuleInterop": true
  }
}
```

If `resolveJsonModule` is missing, add it. Without it, `import rules from "config/compatibility-rules.json"` will fail.

**ALSO**: If the project's `tsconfig.json` has `"moduleResolution": "bundler"` or similar, JSON imports should work. But if you get errors like "Cannot find module 'config/compatibility-rules.json'", the fix is to either:

- Add the config directory to the `paths` in tsconfig, OR
- Change the import to a relative path: `import rules from "../../config/compatibility-rules.json"`, OR
- Convert the JSON files to `.ts` files that export objects

Use whatever approach works with the existing tsconfig. The key requirement is that both `config/compatibility-rules.json` and `config/mock-configurator-data.json` are importable from `lib/configurator/` files.

---

### VERIFICATION

This is a logic-only day — no pages or UI to verify visually. Verification is done by creating a test script.

**Create file**: `scripts/test-configurator.ts`

This script imports the engine and mock data, runs through a test scenario, and prints the results:

```typescript
/**
 * Quick test script for the configurator engine.
 * Run with: npx tsx scripts/test-configurator.ts
 *
 * Or if tsx is not available: npx ts-node scripts/test-configurator.ts
 *
 * This is NOT a production file — it's for development verification only.
 */

// NOTE: Adjust imports based on how the project resolves modules.
// You may need to use relative paths here since this runs outside Next.js.

async function test() {
  // Since this runs outside Next.js, we may need to load data differently.
  // For now, just verify the types and logic compile correctly.
  console.log("=== Configurator Engine Test ===\n");

  // Test 1: Compatibility rules loaded
  const rules = require("../config/compatibility-rules.json");
  console.log("✓ Compatibility rules loaded");
  console.log(
    `  Board types: ${Object.keys(rules.board_type_truck_map).join(", ")}`,
  );
  console.log(`  Hanger-to-axle offset: ${rules.hanger_to_axle_offset}"`);
  console.log(`  Width tolerance: ±${rules.truck_width_tolerance}"\n`);

  // Test 2: Mock data loaded
  const mockData = require("../config/mock-configurator-data.json");
  const deckCount = Object.keys(mockData.decks || {}).length;
  const truckCount = Object.keys(mockData.trucks || {}).length;
  const wheelCount = Object.keys(mockData.wheels || {}).length;
  const bearingCount = Object.keys(mockData.bearings || {}).length;
  const gripCount = Object.keys(mockData.griptape || {}).length;
  console.log("✓ Mock data loaded");
  console.log(
    `  Decks: ${deckCount}, Trucks: ${truckCount}, Wheels: ${wheelCount}, Bearings: ${bearingCount}, Griptape: ${gripCount}\n`,
  );

  // Test 3: Width matching logic
  const offset = rules.hanger_to_axle_offset; // 2.75
  const tolerance = rules.truck_width_tolerance; // 0.25

  // Double Hollow trucks hanger size 5.25 → axle 8.0"
  const axle525 = 5.25 + offset; // 8.0
  console.log("✓ Width matching test");
  console.log(
    `  Truck hanger 5.25" → axle ${axle525}" → fits decks ${axle525 - tolerance}" to ${axle525 + tolerance}"`,
  );

  // Deck 8.25" should match hanger 5.25" (axle 8.0", diff 0.25 = within tolerance)
  const diff825 = Math.abs(axle525 - 8.25);
  console.log(
    `  8.25" deck ↔ 5.25" hanger: diff = ${diff825}" → ${diff825 <= tolerance ? "COMPATIBLE ✓" : "INCOMPATIBLE ✗"}`,
  );

  // Deck 8.5" should NOT match hanger 5.25" (axle 8.0", diff 0.5 > tolerance)
  const diff85 = Math.abs(axle525 - 8.5);
  console.log(
    `  8.5" deck ↔ 5.25" hanger: diff = ${diff85}" → ${diff85 <= tolerance ? "COMPATIBLE ✓" : "INCOMPATIBLE ✗"}`,
  );

  // Truck hanger 5.5" → axle 8.25"
  const axle55 = 5.5 + offset; // 8.25
  const diff825_55 = Math.abs(axle55 - 8.25);
  console.log(
    `  8.25" deck ↔ 5.5" hanger: diff = ${diff825_55}" → ${diff825_55 <= tolerance ? "COMPATIBLE ✓" : "INCOMPATIBLE ✗"}`,
  );

  console.log("\n=== All checks passed ===");
}

test().catch(console.error);
```

**Run the test**:

```bash
npx tsx scripts/test-configurator.ts
```

If `tsx` is not installed, install it: `pnpm add -D tsx`

Expected output:

```
=== Configurator Engine Test ===

✓ Compatibility rules loaded
  Board types: Skateboard, Surfskate, Longboard, Old School, Cruiser
  Hanger-to-axle offset: 2.75"
  Width tolerance: ±0.25"

✓ Mock data loaded
  Decks: 18, Trucks: 3, Wheels: 3, Bearings: 2, Griptape: 5

✓ Width matching test
  Truck hanger 5.25" → axle 8.0" → fits decks 7.75" to 8.25"
  8.25" deck ↔ 5.25" hanger: diff = 0.25" → COMPATIBLE ✓
  8.5" deck ↔ 5.25" hanger: diff = 0.5" → INCOMPATIBLE ✗
  8.25" deck ↔ 5.5" hanger: diff = 0" → COMPATIBLE ✓

=== All checks passed ===
```

### Also verify

1. `pnpm build` passes — no TypeScript errors from the new files
2. The existing site still works (`pnpm dev` → `/search` shows products, cart works)

### FILES CREATED

- `config/compatibility-rules.json`
- `lib/configurator/types.ts`
- `lib/configurator/engine.ts`
- `lib/configurator/mock-data.ts`
- `lib/configurator/index.ts`
- `scripts/test-configurator.ts`

### FILES MODIFIED

- `tsconfig.json` (add `resolveJsonModule` if missing)
- `config/mock-configurator-data.json` (should already exist — verify it matches the complete version provided by the team lead)

List every file created and modified when done.

One thing to watch for: the JSON imports. If the agent hits TypeScript errors importing from config/compatibility-rules.json, the fix is either adding resolveJsonModule: true to tsconfig or converting the JSON to a .ts export. The prompt covers both paths.

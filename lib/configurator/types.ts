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

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
  return compatRules.board_type_unavailable_message[boardType] ?? "Coming soon.";
}

/**
 * Filter decks by board type.
 */
export function getCompatibleDecks(
  allDecks: ConfiguratorItem[],
  boardType: BoardType
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
    emptyMessage: compatible.length === 0
      ? `No ${boardType.toLowerCase()} decks available yet.`
      : undefined,
  };
}

/**
 * Filter trucks by board type and deck width compatibility.
 */
export function getCompatibleTrucks(
  allTrucks: ConfiguratorItem[],
  selectedDeck: ConfiguratorItem,
  boardType: BoardType
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
    if (meta.truck_type === "Surfskate" && compatRules.surfskate_skip_width_match) {
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
    emptyMessage: compatible.length === 0
      ? `No compatible trucks found for a ${deckWidth}" deck. Try a different deck width.`
      : undefined,
  };
}

/**
 * Filter wheels by board type and wheel type compatibility.
 */
export function getCompatibleWheels(
  allWheels: ConfiguratorItem[],
  selectedTruck: ConfiguratorItem,
  boardType: BoardType
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
    emptyMessage: compatible.length === 0
      ? `No compatible wheels found for this setup.`
      : undefined,
  };
}

/**
 * Get all bearings. Bearings are universally compatible.
 */
export function getCompatibleBearings(
  allBearings: ConfiguratorItem[]
): FilterResult {
  const compatible = allBearings.filter((item) => item.availableForSale);
  const incompatible = allBearings.filter((item) => !item.availableForSale);

  return {
    compatible,
    incompatible,
    empty: compatible.length === 0,
    emptyMessage: compatible.length === 0
      ? "No bearings available."
      : undefined,
  };
}

/**
 * Filter griptape by deck width.
 */
export function getCompatibleGriptape(
  allGriptape: ConfiguratorItem[],
  selectedDeck: ConfiguratorItem
): FilterResult {
  const deckMeta = selectedDeck.meta as DeckMeta;
  const deckWidth = deckMeta.deck_width;

  const compatible: ConfiguratorItem[] = [];
  const incompatible: ConfiguratorItem[] = [];

  for (const item of allGriptape) {
    const meta = item.meta as GriptapeMeta;
    const gripWidth = meta.griptape_width;
    const maxDeckWidth = compatRules.griptape_deck_max_width[String(gripWidth)];

    if (maxDeckWidth !== undefined && deckWidth <= maxDeckWidth && item.availableForSale) {
      compatible.push(item);
    } else {
      incompatible.push(item);
    }
  }

  return {
    compatible,
    incompatible,
    empty: compatible.length === 0,
    emptyMessage: compatible.length === 0
      ? `No griptape wide enough for a ${deckWidth}" deck.`
      : undefined,
  };
}

/**
 * Get all risers. Currently no products — returns empty.
 */
export function getCompatibleRisers(
  allRisers: ConfiguratorItem[]
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
  selectedRiser: ConfiguratorItem | null
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

  const total = items.reduce((sum, item) => sum + parseFloat(item.price.amount), 0);
  const currencyCode = items[0]?.price.currencyCode || "INR";

  return { amount: total, currencyCode };
}

/**
 * Get the list of configurator steps.
 */
export function getConfiguratorSteps(
  hasRisers: boolean,
  hasHardware: boolean
): Array<{
  id: number;
  translationKey: string;
  category: string;
  isOptional: boolean;
  skip: boolean;
  skipMessage?: string;
}> {
  return [
    { id: 1, translationKey: "configurator.step1", category: "board_type", isOptional: false, skip: false },
    { id: 2, translationKey: "configurator.step2", category: "deck", isOptional: false, skip: false },
    { id: 3, translationKey: "configurator.step3", category: "truck", isOptional: false, skip: false },
    { id: 4, translationKey: "configurator.step4", category: "wheel", isOptional: false, skip: false },
    { id: 5, translationKey: "configurator.step5", category: "bearing", isOptional: false, skip: false },
    { id: 6, translationKey: "configurator.step6", category: "griptape", isOptional: false, skip: false },
    { id: 7, translationKey: "configurator.step7", category: "riser", isOptional: true, skip: !hasRisers, skipMessage: "Riser pads coming soon." },
    { id: 8, translationKey: "configurator.step8", category: "hardware", isOptional: true, skip: !hasHardware, skipMessage: "Hardware included with trucks." },
    { id: 9, translationKey: "configurator.step9", category: "review", isOptional: false, skip: false },
  ];
}

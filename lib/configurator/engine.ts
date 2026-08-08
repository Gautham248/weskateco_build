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

// ─── Deck ────────────────────────────────────────────────────────────────────

/**
 * Filter decks by board type.
 * Also marks decks as incompatible when a truck is already selected —
 * deck-truck width compatibility is bidirectional.
 */
export function getCompatibleDecks(
  allDecks: ConfiguratorItem[],
  boardType: BoardType,
  selectedTruck?: ConfiguratorItem | null,
  showOutOfStock?: boolean,
): FilterResult {
  const tolerance = compatRules.truck_width_tolerance;
  const offset = compatRules.hanger_to_axle_offset;

  const compatible: ConfiguratorItem[] = [];
  const incompatible: ConfiguratorItem[] = [];

  for (const item of allDecks) {
    const meta = item.meta as DeckMeta;

    // Out-of-stock gating
    if (!item.availableForSale && !showOutOfStock) {
      continue; // exclude out of stock when toggle is off
    }

    // Board type gate
    if (meta.deck_board_type !== boardType) {
      incompatible.push({
        ...item,
        incompatibilityReason: `This deck is for ${meta.deck_board_type}, not ${boardType}`,
      });
      continue;
    }

    // If a truck is already selected, validate width compatibility
    if (selectedTruck) {
      const truckMeta = selectedTruck.meta as TruckMeta;
      if (
        truckMeta.truck_hanger_size !== null &&
        truckMeta.truck_type !== "Surfskate"
      ) {
        const axleWidth = truckMeta.truck_hanger_size + offset;
        const widthDiff = Math.abs(axleWidth - meta.deck_width);
        if (widthDiff > tolerance) {
          incompatible.push({
            ...item,
            incompatibilityReason: `Width mismatch with selected ${selectedTruck.productTitle}: deck ${meta.deck_width}" vs axle ${axleWidth.toFixed(2)}" (max ±${tolerance}")`,
          });
          continue;
        }
      }
    }

    compatible.push(item);
  }

  // Add out-of-stock items when showOutOfStock is on
  if (showOutOfStock) {
    for (const item of allDecks) {
      const meta = item.meta as DeckMeta;
      if (!item.availableForSale && meta.deck_board_type === boardType) {
        // Check if already added as incompatible
        const alreadyAdded =
          incompatible.some((i) => i.variantId === item.variantId) ||
          compatible.some((i) => i.variantId === item.variantId);
        if (!alreadyAdded) {
          incompatible.push({
            ...item,
            incompatibilityReason: "Out of stock",
          });
        }
      }
    }
  }

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

// ─── Trucks ───────────────────────────────────────────────────────────────────

/**
 * Filter trucks by board type and optionally by a selected deck's width.
 * If no deck is selected yet, returns all trucks valid for the board type
 * without width filtering — the user can browse all trucks first.
 */
export function getCompatibleTrucks(
  allTrucks: ConfiguratorItem[],
  boardType: BoardType,
  selectedDeck?: ConfiguratorItem | null,
  showOutOfStock?: boolean,
): FilterResult {
  const allowedTruckTypes = compatRules.board_type_truck_map[boardType] || [];
  const tolerance = compatRules.truck_width_tolerance;
  const offset = compatRules.hanger_to_axle_offset;

  const compatible: ConfiguratorItem[] = [];
  const incompatible: ConfiguratorItem[] = [];

  for (const item of allTrucks) {
    const meta = item.meta as TruckMeta;

    // Out-of-stock gating
    if (!item.availableForSale && !showOutOfStock) continue;

    // Truck type must match board type
    if (!allowedTruckTypes.includes(meta.truck_type)) {
      incompatible.push({
        ...item,
        incompatibilityReason: `${meta.truck_type} trucks are not recommended for ${boardType}`,
      });
      continue;
    }

    // Board type in the truck's own compatibility list
    const compatibleBoardTypes = meta.truck_compatible_board_types
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (
      compatibleBoardTypes.length > 0 &&
      !compatibleBoardTypes.includes(boardType)
    ) {
      incompatible.push({
        ...item,
        incompatibilityReason: `Not compatible with ${boardType}`,
      });
      continue;
    }

    // Surfskate trucks skip width matching
    if (
      meta.truck_type === "Surfskate" &&
      compatRules.surfskate_skip_width_match
    ) {
      if (item.availableForSale) {
        compatible.push(item);
      } else {
        incompatible.push({ ...item, incompatibilityReason: "Out of stock" });
      }
      continue;
    }

    // Width matching — only if a deck is already selected
    if (selectedDeck && meta.truck_hanger_size !== null) {
      const deckMeta = selectedDeck.meta as DeckMeta;
      const deckWidth = deckMeta.deck_width;
      const axleWidth = meta.truck_hanger_size + offset;
      const widthDiff = Math.abs(axleWidth - deckWidth);

      if (widthDiff > tolerance) {
        incompatible.push({
          ...item,
          incompatibilityReason: item.availableForSale
            ? `Width mismatch: axle ${axleWidth.toFixed(2)}" vs deck ${deckWidth}" (max ±${tolerance}")` 
            : "Out of stock",
        });
        continue;
      }
    }

    if (item.availableForSale) {
      compatible.push(item);
    } else {
      incompatible.push({ ...item, incompatibilityReason: "Out of stock" });
    }
  }

  return {
    compatible,
    incompatible,
    empty: compatible.length === 0,
    emptyMessage:
      compatible.length === 0
        ? selectedDeck
          ? `No compatible trucks found for your deck. Try a different deck width.`
          : `No ${boardType} trucks available.`
        : undefined,
  };
}

// ─── Wheels ───────────────────────────────────────────────────────────────────

/**
 * Filter wheels by board type.
 * If a truck is already selected, that is noted but doesn't change filtering
 * (wheel-truck compatibility is via board type, not dimensions).
 */
export function getCompatibleWheels(
  allWheels: ConfiguratorItem[],
  boardType: BoardType,
  selectedTruck?: ConfiguratorItem | null,
  showOutOfStock?: boolean,
): FilterResult {
  const allowedWheelTypes = compatRules.board_type_wheel_map[boardType] || [];

  const compatible: ConfiguratorItem[] = [];
  const incompatible: ConfiguratorItem[] = [];

  for (const item of allWheels) {
    const meta = item.meta as WheelMeta;

    if (!item.availableForSale && !showOutOfStock) continue;

    if (!allowedWheelTypes.includes(meta.wheel_type)) {
      incompatible.push({
        ...item,
        incompatibilityReason: `${meta.wheel_type} wheels are not recommended for ${boardType}`,
      });
      continue;
    }

    const compatibleBoardTypes = meta.wheel_compatible_board_types
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (
      compatibleBoardTypes.length > 0 &&
      !compatibleBoardTypes.includes(boardType)
    ) {
      incompatible.push({
        ...item,
        incompatibilityReason: `Not compatible with ${boardType}`,
      });
      continue;
    }

    if (item.availableForSale) {
      compatible.push(item);
    } else {
      incompatible.push({ ...item, incompatibilityReason: "Out of stock" });
    }
  }

  return {
    compatible,
    incompatible,
    empty: compatible.length === 0,
    emptyMessage:
      compatible.length === 0
        ? `No compatible wheels found for ${boardType}.`
        : undefined,
  };
}

// ─── Bearings ─────────────────────────────────────────────────────────────────

/** Bearings are universally compatible. */
export function getCompatibleBearings(
  allBearings: ConfiguratorItem[],
  showOutOfStock?: boolean,
): FilterResult {
  const compatible = allBearings.filter((item) => item.availableForSale);
  const incompatible = allBearings
    .filter((item) => !item.availableForSale && showOutOfStock)
    .map((item) => ({ ...item, incompatibilityReason: "Out of stock" }));

  return {
    compatible,
    incompatible,
    empty: compatible.length === 0,
    emptyMessage:
      compatible.length === 0 ? "No bearings available." : undefined,
  };
}

// ─── Griptape ─────────────────────────────────────────────────────────────────

/**
 * Filter griptape by deck width.
 * If no deck is selected yet, show all griptape without width filtering.
 */
export function getCompatibleGriptape(
  allGriptape: ConfiguratorItem[],
  selectedDeck?: ConfiguratorItem | null,
  showOutOfStock?: boolean,
): FilterResult {
  const compatible: ConfiguratorItem[] = [];
  const incompatible: ConfiguratorItem[] = [];

  for (const item of allGriptape) {
    const meta = item.meta as GriptapeMeta;

    if (!item.availableForSale && !showOutOfStock) continue;

    // If no deck selected yet, all griptape is shown as compatible
    if (!selectedDeck) {
      if (item.availableForSale) {
        compatible.push(item);
      } else {
        incompatible.push({ ...item, incompatibilityReason: "Out of stock" });
      }
      continue;
    }

    const deckMeta = selectedDeck.meta as DeckMeta;
    const deckWidth = deckMeta.deck_width;
    const gripWidth = meta.griptape_width;
    const maxDeckWidth =
      compatRules.griptape_deck_max_width[String(gripWidth)];

    if (maxDeckWidth !== undefined && deckWidth <= maxDeckWidth) {
      if (item.availableForSale) {
        compatible.push(item);
      } else {
        incompatible.push({ ...item, incompatibilityReason: "Out of stock" });
      }
    } else {
      incompatible.push({
        ...item,
        incompatibilityReason:
          maxDeckWidth !== undefined && gripWidth < deckWidth
            ? `Too narrow: ${gripWidth}" griptape for ${deckWidth}" deck`
            : "Out of stock",
      });
    }
  }

  return {
    compatible,
    incompatible,
    empty: compatible.length === 0,
    emptyMessage:
      compatible.length === 0
        ? selectedDeck
          ? `No griptape wide enough for a ${(selectedDeck.meta as DeckMeta).deck_width}" deck.`
          : "No griptape available."
        : undefined,
  };
}

// ─── Risers & Hardware (stub) ─────────────────────────────────────────────────

export function getCompatibleRisers(
  allRisers: ConfiguratorItem[],
  showOutOfStock?: boolean,
): FilterResult {
  return {
    compatible: allRisers.filter((item) => item.availableForSale),
    incompatible: [],
    empty: allRisers.length === 0,
    emptyMessage: "Riser pads coming soon.",
  };
}

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

// ─── Totals ───────────────────────────────────────────────────────────────────

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

// ─── Steps ────────────────────────────────────────────────────────────────────

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

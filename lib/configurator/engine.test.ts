import { describe, expect, it } from "vitest";
import {
  calculateBuildTotal,
  getBoardTypeUnavailableMessage,
  getCompatibleBearings,
  getCompatibleDecks,
  getCompatibleGriptape,
  getCompatibleHardware,
  getCompatibleRisers,
  getCompatibleTrucks,
  getCompatibleWheels,
  getConfiguratorSteps,
  isBoardTypeAvailable,
} from "./engine";
import type {
  ConfiguratorItem,
  ConfiguratorMeta,
  DeckMeta,
  TruckMeta,
  WheelMeta,
} from "./types";

// Rules under test come from config/compatibility-rules.json:
// axle width = hanger + 2.75", and a truck fits a deck within ±0.25"

function item(
  id: string,
  meta: ConfiguratorMeta,
  { price = "1000", availableForSale = true } = {},
): ConfiguratorItem {
  return {
    productId: id,
    productHandle: id,
    productTitle: id,
    variantId: `${id}-variant`,
    variantTitle: "Default",
    price: { amount: price, currencyCode: "INR" },
    availableForSale,
    meta,
  };
}

const deck = (
  id: string,
  width: number | undefined,
  extra: Partial<DeckMeta> = {},
  opts = {},
) =>
  item(
    id,
    {
      category: "deck",
      deck_board_type: "Skateboard",
      deck_width: width,
      ...extra,
    } as DeckMeta,
    opts,
  );

const tkpTruck = (
  id: string,
  hanger: number | null,
  opts = {},
  boardTypes = "Skateboard,Old School",
) =>
  item(
    id,
    {
      category: "truck",
      truck_type: "Standard (TKP)",
      truck_hanger_size: hanger,
      truck_sold_as: "Pair",
      truck_compatible_board_types: boardTypes,
    } as TruckMeta,
    opts,
  );

const surfTruck = (id: string, opts = {}) =>
  item(
    id,
    {
      category: "truck",
      truck_type: "Surfskate",
      truck_hanger_size: null,
      truck_sold_as: "Set (front+rear)",
      truck_compatible_board_types: "Surfskate",
    } as TruckMeta,
    opts,
  );

const wheel = (
  id: string,
  wheelType: WheelMeta["wheel_type"],
  boardTypes: string,
  opts = {},
) =>
  item(
    id,
    {
      category: "wheel",
      wheel_diameter: 53,
      wheel_hardness: "99A",
      wheel_type: wheelType,
      wheel_compatible_board_types: boardTypes,
    } as WheelMeta,
    opts,
  );

const grip = (id: string, width: number, opts = {}) =>
  item(id, { category: "griptape", griptape_width: width }, opts);

const ids = (items: ConfiguratorItem[]) => items.map((i) => i.productId);
const reasons = (items: ConfiguratorItem[]) =>
  items.map(
    (i) => (i as { incompatibilityReason?: string }).incompatibilityReason,
  );

describe("board type availability", () => {
  it("reports which board types the catalog supports", () => {
    expect(isBoardTypeAvailable("Skateboard")).toBe(true);
    expect(isBoardTypeAvailable("Old School")).toBe(true);
    expect(isBoardTypeAvailable("Surfskate")).toBe(false);
  });

  it("returns the configured message for unavailable board types", () => {
    expect(getBoardTypeUnavailableMessage("Surfskate")).toMatch(/coming soon/i);
    expect(getBoardTypeUnavailableMessage("Longboard")).toBe(
      "Longboard components coming soon.",
    );
  });

  it("defaults to 'Coming soon.' when no message is configured", () => {
    expect(getBoardTypeUnavailableMessage("Skateboard")).toBe("Coming soon.");
  });
});

describe("getCompatibleDecks", () => {
  const decks = [
    deck("street-825", 8.25),
    deck("street-sold-out", 8.0, {}, { availableForSale: false }),
    deck("old-school", 9.0, { deck_board_type: "Old School" }),
  ];

  it("keeps in-stock decks of the chosen board type and explains the rest", () => {
    const result = getCompatibleDecks(decks, "Skateboard");
    expect(ids(result.compatible)).toEqual(["street-825"]);
    expect(ids(result.incompatible)).toEqual(["old-school"]);
    expect(reasons(result.incompatible)).toEqual([
      "This deck is for Old School, not Skateboard",
    ]);
    expect(result.empty).toBe(false);
  });

  it("hides sold-out decks unless asked to show them", () => {
    expect(
      ids(getCompatibleDecks(decks, "Skateboard").incompatible),
    ).not.toContain("street-sold-out");
    const shown = getCompatibleDecks(decks, "Skateboard", null, true);
    expect(
      shown.incompatible.find((d) => d.productId === "street-sold-out"),
    ).toMatchObject({ incompatibilityReason: "Out of stock" });
  });

  it("rules out decks too wide or narrow for an already-chosen truck", () => {
    // 5.25" hanger -> 8.0" axle, so 7.75"–8.25" decks fit
    const truck = tkpTruck("truck", 5.25);
    const result = getCompatibleDecks(
      [
        deck("fits", 8.25),
        deck("too-wide", 8.5),
        deck("unknown-width", undefined),
      ],
      "Skateboard",
      truck,
    );
    expect(ids(result.compatible)).toEqual(["fits", "unknown-width"]);
    expect(ids(result.incompatible)).toEqual(["too-wide"]);
    expect(reasons(result.incompatible)[0]).toMatch(/Width mismatch/);
  });

  it("ignores width when the chosen truck is a surfskate truck", () => {
    const result = getCompatibleDecks(
      [deck("any", 10, { deck_board_type: "Surfskate" })],
      "Surfskate",
      surfTruck("surf"),
    );
    expect(ids(result.compatible)).toEqual(["any"]);
  });

  it("reports an empty result with a message", () => {
    const result = getCompatibleDecks(decks, "Cruiser");
    expect(result.empty).toBe(true);
    expect(result.emptyMessage).toBe("No cruiser decks available yet.");
  });
});

describe("getCompatibleTrucks", () => {
  it.each([
    [8.0, 5.25, true], // axle 8.0, exact match
    [8.25, 5.25, true], // diff 0.25, at the tolerance limit
    [8.5, 5.25, false], // diff 0.5
    [7.75, 5.25, true],
    [7.5, 5.25, false],
    [8.25, 5.5, true],
    [8.5, 5.5, true],
    [9.0, 5.5, false],
  ])('a %s" deck with a %s" hanger fits: %s', (deckWidth, hanger, fits) => {
    const result = getCompatibleTrucks(
      [tkpTruck("truck", hanger)],
      "Skateboard",
      deck("deck", deckWidth),
    );
    expect(result.compatible).toHaveLength(fits ? 1 : 0);
  });

  it("shows every truck for the board type before a deck is chosen", () => {
    const result = getCompatibleTrucks(
      [tkpTruck("narrow", 5.0), tkpTruck("wide", 6.0)],
      "Skateboard",
    );
    expect(ids(result.compatible)).toEqual(["narrow", "wide"]);
  });

  it("doesn't block trucks when the chosen deck's width is unknown", () => {
    const result = getCompatibleTrucks(
      [tkpTruck("truck", 6.0)],
      "Skateboard",
      deck("deck", undefined),
    );
    expect(ids(result.compatible)).toEqual(["truck"]);
  });

  it("rejects trucks of the wrong type for the board", () => {
    const rkp = item("rkp", {
      category: "truck",
      truck_type: "Longboard (RKP)",
      truck_hanger_size: 5.25,
      truck_sold_as: "Pair",
      truck_compatible_board_types: "Skateboard",
    });
    const result = getCompatibleTrucks([rkp], "Skateboard", deck("deck", 8.0));
    expect(reasons(result.incompatible)).toEqual([
      "Longboard (RKP) trucks are not recommended for Skateboard",
    ]);
  });

  it("rejects trucks not listed for the board type, trimming spaces in the list", () => {
    const result = getCompatibleTrucks(
      [
        tkpTruck("not-listed", 5.25, {}, "Old School"),
        tkpTruck("spaced", 5.25, {}, " Old School , Skateboard "),
      ],
      "Skateboard",
      deck("deck", 8.0),
    );
    expect(ids(result.compatible)).toEqual(["spaced"]);
    expect(reasons(result.incompatible)).toEqual([
      "Not compatible with Skateboard",
    ]);
  });

  it("treats an empty board-type list as compatible with any board", () => {
    const result = getCompatibleTrucks(
      [tkpTruck("unlisted", 5.25, {}, "")],
      "Skateboard",
      deck("deck", 8.0),
    );
    expect(ids(result.compatible)).toEqual(["unlisted"]);
  });

  it("labels sold-out trucks only when asked to show them", () => {
    const soldOut = [tkpTruck("sold-out", 5.25, { availableForSale: false })];
    expect(getCompatibleTrucks(soldOut, "Skateboard").incompatible).toEqual([]);
    expect(
      reasons(
        getCompatibleTrucks(soldOut, "Skateboard", null, true).incompatible,
      ),
    ).toEqual(["Out of stock"]);
  });

  it("skips width matching for surfskate trucks", () => {
    const result = getCompatibleTrucks(
      [surfTruck("surf")],
      "Surfskate",
      deck("deck", 10.0, { deck_board_type: "Surfskate" }),
    );
    expect(ids(result.compatible)).toEqual(["surf"]);
  });

  it("explains an empty result, with or without a chosen deck", () => {
    expect(
      getCompatibleTrucks([], "Skateboard", deck("deck", 8.5)).emptyMessage,
    ).toBe(
      "No compatible trucks found for your deck. Try a different deck width.",
    );
    expect(getCompatibleTrucks([], "Skateboard").emptyMessage).toBe(
      "No Skateboard trucks available.",
    );
  });
});

describe("getCompatibleWheels", () => {
  it("keeps in-stock wheels of an allowed type listed for the board", () => {
    const result = getCompatibleWheels(
      [
        wheel("street", "Street/Park", "Skateboard,Old School"),
        wheel("all-terrain", "All-Terrain", "Skateboard"),
        wheel("cruiser", "Cruiser/Longboard", "Skateboard"),
        wheel("not-listed", "Street/Park", "Old School"),
        wheel("sold-out", "Street/Park", "Skateboard", {
          availableForSale: false,
        }),
      ],
      "Skateboard",
    );
    expect(ids(result.compatible)).toEqual(["street", "all-terrain"]);
    expect(ids(result.incompatible)).toEqual(["cruiser", "not-listed"]);
    expect(reasons(result.incompatible)).toEqual([
      "Cruiser/Longboard wheels are not recommended for Skateboard",
      "Not compatible with Skateboard",
    ]);
  });

  it("reports an empty result with a message", () => {
    const result = getCompatibleWheels([], "Skateboard");
    expect(result.empty).toBe(true);
    expect(result.emptyMessage).toBe(
      "No compatible wheels found for Skateboard.",
    );
  });
});

describe("getCompatibleBearings", () => {
  const bearing = (id: string, opts = {}) =>
    item(id, { category: "bearing", bearing_type: "Steel" }, opts);
  const bearings = [
    bearing("abec"),
    bearing("sold-out", { availableForSale: false }),
  ];

  it("treats every in-stock bearing as compatible", () => {
    const result = getCompatibleBearings(bearings);
    expect(ids(result.compatible)).toEqual(["abec"]);
    expect(result.incompatible).toEqual([]);
    expect(getCompatibleBearings([]).emptyMessage).toBe(
      "No bearings available.",
    );
  });

  it("labels sold-out bearings when asked to show them", () => {
    expect(reasons(getCompatibleBearings(bearings, true).incompatible)).toEqual(
      ["Out of stock"],
    );
  });
});

describe("getCompatibleGriptape", () => {
  it.each([
    [8.75, 9, true], // 9" grip covers decks up to 8.75"
    [9.0, 9, false],
    [9.0, 10, true],
    [10.75, 11, true],
    [11.0, 11, false],
  ])('a %s" deck with %s" griptape fits: %s', (deckWidth, gripWidth, fits) => {
    const result = getCompatibleGriptape(
      [grip("grip", gripWidth)],
      deck("deck", deckWidth),
    );
    expect(result.compatible).toHaveLength(fits ? 1 : 0);
  });

  it("explains griptape that's too narrow for the deck", () => {
    const result = getCompatibleGriptape(
      [grip("narrow", 9)],
      deck("deck", 9.5),
    );
    expect(reasons(result.incompatible)).toEqual([
      'Too narrow: 9" griptape for 9.5" deck',
    ]);
    expect(result.emptyMessage).toBe(
      'No griptape wide enough for a 9.5" deck.',
    );
  });

  it("shows all griptape before a deck is chosen, or when its width is unknown", () => {
    const griptape = [grip("a", 9), grip("b", 11)];
    expect(ids(getCompatibleGriptape(griptape).compatible)).toEqual(["a", "b"]);
    expect(
      ids(getCompatibleGriptape(griptape, deck("deck", undefined)).compatible),
    ).toEqual(["a", "b"]);
  });

  it("labels sold-out griptape only when asked to show it", () => {
    const soldOut = [grip("sold-out", 9, { availableForSale: false })];
    expect(
      getCompatibleGriptape(soldOut, deck("deck", 8)).incompatible,
    ).toEqual([]);
    expect(
      reasons(
        getCompatibleGriptape(soldOut, deck("deck", 8), true).incompatible,
      ),
    ).toEqual(["Out of stock"]);
  });

  // Known bug: in-stock griptape whose width has no rule in
  // compatibility-rules.json is labelled "Out of stock". When fixed, change
  // it.fails to it.
  it.fails(
    "doesn't call in-stock griptape with an unknown width out of stock",
    () => {
      const result = getCompatibleGriptape(
        [grip("odd", 12)],
        deck("deck", 8.0),
      );
      expect(reasons(result.incompatible)).not.toContain("Out of stock");
    },
  );
});

describe("risers and hardware", () => {
  const riser = (id: string, opts = {}) =>
    item(id, { category: "riser", riser_height: '1/8"' }, opts);

  it("lists in-stock risers and is only empty when there are none at all", () => {
    const result = getCompatibleRisers([
      riser("r1"),
      riser("r2", { availableForSale: false }),
    ]);
    expect(ids(result.compatible)).toEqual(["r1"]);
    expect(result.empty).toBe(false);
    expect(getCompatibleRisers([]).empty).toBe(true);
  });

  it("always reports hardware as included with trucks", () => {
    expect(getCompatibleHardware([], null)).toEqual({
      compatible: [],
      incompatible: [],
      empty: true,
      emptyMessage: "Hardware is included with your trucks.",
    });
  });
});

describe("calculateBuildTotal", () => {
  const empty = {
    deck: null,
    trucks: null,
    wheels: null,
    bearings: null,
    griptape: null,
    risers: null,
    hardware: null,
  };

  it("sums the selected parts and skips empty slots", () => {
    const total = calculateBuildTotal({
      ...empty,
      deck: deck("deck", 8.0, {}, { price: "3499" }),
      trucks: tkpTruck("truck", 5.25, { price: "4999.50" }),
      wheels: wheel("wheel", "Street/Park", "Skateboard", { price: "2500.25" }),
    });
    expect(total.amount).toBeCloseTo(10998.75);
    expect(total.currencyCode).toBe("INR");
  });

  it("returns zero in INR for an empty build", () => {
    expect(calculateBuildTotal(empty)).toEqual({
      amount: 0,
      currencyCode: "INR",
    });
  });
});

describe("getConfiguratorSteps", () => {
  it("lists the nine steps in order, ending with review", () => {
    const steps = getConfiguratorSteps(true, true);
    expect(steps.map((s) => s.category)).toEqual([
      "board_type",
      "deck",
      "truck",
      "wheel",
      "bearing",
      "griptape",
      "riser",
      "hardware",
      "review",
    ]);
    expect(steps.filter((s) => s.isOptional).map((s) => s.category)).toEqual([
      "riser",
      "hardware",
    ]);
  });

  it("skips the riser and hardware steps when those products are missing", () => {
    const steps = getConfiguratorSteps(false, false);
    expect(steps.filter((s) => s.skip).map((s) => s.category)).toEqual([
      "riser",
      "hardware",
    ]);
    expect(getConfiguratorSteps(true, true).some((s) => s.skip)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Truck Guide — data and copy, ported verbatim from the spec.
// Cells may carry **bold** / *italic* markers; warn cells/rows are flagged.
// The table types are shared across guides (lib/guides/types).
// ---------------------------------------------------------------------------

import type { GuideFaqItem, TableCol, TableRow } from "lib/guides/types";

// ── Hero ──────────────────────────────────────────────────────────────────

export const TRUCK_HERO = {
  eyebrow: "Sphere Skateboards · WeSkate Co. · Guide 03",
  titleLead: "The",
  titleAccent: "Trucks",
  lede: "Nine parts, three different ways of quoting a size, and one adjustment that costs nothing. Trucks are the least understood part of a skateboard and the one that decides most about how it feels — this is what each piece does, how to pick a size when three brands describe it three different ways, and how to tune the turn instead of putting up with it.",
  ctaPrimary: { label: "Find my truck size →", href: "#size" },
  ctaSecondary: {
    label: "Buying guide",
    href: "/guides/skateboard-buying-guide",
  },
};

export const ANCHOR_NAV: { label: string; href: string }[] = [
  { label: "Parts", href: "#parts" },
  { label: "Size", href: "#size" },
  { label: "Height", href: "#height" },
  { label: "Turn", href: "#turn" },
  { label: "Types", href: "#types" },
  { label: "Bushings", href: "#bushings" },
  { label: "Build", href: "#build" },
  { label: "Range", href: "#range" },
  { label: "Care", href: "#care" },
  { label: "FAQ", href: "#faq" },
];

// ── Section 1 — #parts ────────────────────────────────────────────────────

export const PARTS_SECTION = {
  kicker: "Anatomy",
  title: "The nine parts of a truck",
  intro:
    "A truck is a hinge with a rubber spring in it. Two views, because three of the nine parts are hidden inside an assembled one — and those three are the ones you are most likely to need.",
  hint: "Tap a numbered part.",
  caption:
    "Everything above the hanger and below it is a stack of rubber and steel threaded onto one bolt. That is the whole mechanism: you lean, the bushings squash on one side and rebound on the other, and the hanger tilts. Two views because neither carries all nine parts on its own — assembled shows how they sit together, exploded shows the three that are hidden inside.",
  assembledAlt:
    "A skateboard truck photographed square from behind, showing the baseplate bolted to the deck, the hanger, the axle and an axle nut",
};

export interface TruckPart {
  n: number;
  hidden: boolean;
  name: string;
  text: string;
  spec: [string, string][];
}

export const TRUCK_PARTS: TruckPart[] = [
  {
    n: 1,
    hidden: false,
    name: "Baseplate",
    text: "The plate bolted flat to the underside of the deck. It holds the kingpin and the pivot cup, and the angle it sets them at is the truck's geometry — the thing that decides how much turn you get for a given lean. You cannot adjust it; you choose it when you choose the truck.",
    spec: [
      ["Bolts", "4 per truck, 8 per board"],
      ["Sets", "Kingpin angle, pivot position"],
      ["Adjustable", "No — it is the design"],
    ],
  },
  {
    n: 2,
    hidden: true,
    name: "Pivot cup",
    text: "A small plastic socket in the baseplate that the hanger's pivot arm sits in. It is the hinge the whole truck swings on, and it is the part nobody thinks about until it wears — at which point the truck develops a click and a vague floaty feel that no kingpin adjustment fixes. It costs almost nothing and takes five minutes to replace.",
    spec: [
      ["Material", "Plastic, replaceable"],
      ["Symptom of wear", "A click, then vagueness"],
      ["Fix", "Swap the pivot cup"],
      ["In this view", "Directly behind the kingpin"],
    ],
  },
  {
    n: 3,
    hidden: false,
    name: "Kingpin",
    text: "The bolt that holds the stack together and that the hanger rotates around. The nut on the end preloads the bushings: tighter makes the board resist lean sooner, looser lets it carve. It is the only free adjustment on a skateboard, and a quarter turn is a real change.",
    spec: [
      ["Also comes", "Hollow, to save weight"],
      ["The nut sets", "Bushing preload"],
      ["Adjust in", "Quarter turns"],
      ["Tool", "The same T-tool"],
    ],
  },
  {
    n: 4,
    hidden: true,
    name: "Boardside bushing",
    text: "The rubber barrel between the hanger and the deck. It takes most of the load when you lean, so it is the one that decides how stable the truck feels. Riders chasing stability without a dead rebound run this one harder than the bushing below it.",
    spec: [
      ["Position", "Between hanger and baseplate"],
      ["Controls", "Resistance to lean"],
      ["Beginner truck", "90a"],
      ["Cost to change", "A fraction of a truck"],
    ],
  },
  {
    n: 5,
    hidden: false,
    name: "Roadside bushing",
    text: "The barrel under the hanger, on the road side. It governs the return — how quickly and how firmly the board comes back to level after a turn. Softer here gives a livelier rebound; harder settles the board down.",
    spec: [
      ["Position", "Under the hanger"],
      ["Controls", "Return to centre"],
      ["Often run", "Softer than boardside"],
      ["Shapes", "Barrel, cone, fatcone, chubby"],
    ],
  },
  {
    n: 6,
    hidden: true,
    name: "Washers",
    text: "The cupped or flat plates above and below each bushing. They decide how much of the bushing is free to deform, which makes them a real tuning part rather than a spacer — a deep cupped washer restrains the rubber and firms everything up, a flat one lets it move and turns more freely.",
    spec: [
      ["Count", "Two per bushing"],
      ["Cupped", "Firmer, more restrained"],
      ["Flat", "Freer, turns more"],
      ["Cheapest tuning step", "Yes"],
    ],
  },
  {
    n: 7,
    hidden: false,
    name: "Hanger",
    text: "The T-shaped arm that carries the axle and takes the weight of the board. Its width is what a truck's size refers to — either measured on its own, or measured across the axle. It is also the part you grind on, and it is meant to wear a flat where it meets ledges and rails.",
    spec: [
      ["Sphere widths", "5.0″ · 5.25″ · 5.5″ hanger"],
      ["Kids", "4.0″ · 4.75″"],
      ["Made by", "Casting, or forging"],
      ["Wear", "A ground flat is normal"],
    ],
  },
  {
    n: 8,
    hidden: false,
    name: "Axle",
    text: "An 8mm steel rod running right through the hanger, with a wheel and two bearings on each end. It is the same diameter on every skateboard in the world, which is why any wheel fits any truck. A bent one is one of the few things that finishes a truck off.",
    spec: [
      ["Diameter", "8mm, universal"],
      ["Carries", "Two bearings per wheel"],
      ["Also comes", "Hollow, to save weight"],
      ["Bent axle", "End of life"],
    ],
  },
  {
    n: 9,
    hidden: false,
    name: "Axle nut",
    text: "The locknut that holds each wheel on, with a speed washer either side of the bearing. Snug is right: the wheel should still spin freely. The nylon insert that stops it backing off only works once or twice, so a nut that spins loosely down the thread is a nut to replace rather than re-use.",
    spec: [
      ["Count", "4 per board"],
      ["Correct tension", "Snug, wheel spins free"],
      ["Speed washers", "One each side"],
      ["Check", "Weekly"],
    ],
  },
];

// ── Section 2 — #size ─────────────────────────────────────────────────────

export const SIZE_SECTION = {
  kicker: "Sizing",
  title: "Three ways a truck's size is quoted",
  intro:
    "The rule is simple — the truck should be about as wide as the deck. Finding out whether a given truck is that wide is where it gets silly, because brands use three different numbering systems and none of them are wrong.",
};

export const SIZE_CARDS: { title: string; text: string }[] = [
  {
    title: "Hanger width",
    text: "The metal arm only, measured tip to tip without the axle sticking out. Numbers land around 4″ to 5.5″. This is how Sphere quotes its pro trucks — 5.0″, 5.25″, 5.5″ — and how Independent and several others do it.",
  },
  {
    title: "Axle width",
    text: "The whole thing, axle end to axle end, which lands close to the deck width it suits. Numbers around 7″ to 9.5″. This is how ACE quotes, how Thunder quotes, and how our fitted beginner truck is described as an 8″.",
  },
  {
    title: "A model number",
    text: "A house code that means nothing outside the brand. ACE runs 00, 11, 22, 33, 44, 55, 66. Independent runs 109 through 215, and theirs is literal — the number is the hanger width in millimetres, so a 139 has a 139mm hanger. You cannot compare two brands' codes to each other, and with ACE you cannot even compare the two lines: a Classic 44 and an AF1 44 come out at different widths.",
  },
];

export const SIZE_NOTE =
  "**The number that never lies is the axle width**, because it is the one you can hold a tape measure against. When a spec sheet gives you a hanger number or a model code, find the axle width before you compare it to anything.";

export const CALC_SUB = {
  kicker: "Work it out",
  title: "Pick a deck width, get every number",
  intro:
    "Sphere deck widths, translated into every system at once — marked with which ACE sizes are on the incoming order, and with Independent shown purely so you can translate a size you have seen elsewhere.",
};

export const CALC_NOTES: string[] = [
  "Ranges overlap on purpose. Where two sizes both fit, the narrower one turns a little quicker and the wider one is a little more stable — neither is wrong.",
  "ACE sizes outside the incoming order are still shown, because the size is the size whoever you buy it from. We just won't have that one.",
  "**Independent is there as a ruler.** We don't stock Indys — they are the most widely quoted trucks in skateboarding, so if someone tells you a board runs 149s, this tells you what that means in inches and what it would be in ours.",
];

// Deck-width chips: label shown, numeric value for range lookups.
export const DECK_WIDTHS: { label: string; w: number }[] = [
  { label: "7″", w: 7 },
  { label: "7.25″", w: 7.25 },
  { label: "7.5″", w: 7.5 },
  { label: "7.75″", w: 7.75 },
  { label: "8″", w: 8 },
  { label: "8.125″", w: 8.125 },
  { label: "8.25″", w: 8.25 },
  { label: "8.5″", w: 8.5 },
  { label: "8.875″", w: 8.875 },
];

export const DEFAULT_WIDTH = "8″";

// Widths that ship on the beginner complete → sub-kicker + beginner row.
export const BEGINNER_WIDTHS = ["7.75″", "8″", "8.25″"];

// Toucan mapping: half-open [min, max).
export const TOUCAN_MAP: {
  min: number;
  max: number | null;
  value: string;
  line: string;
}[] = [
  { min: -Infinity, max: 7.0, value: "4.0″ hanger", line: "Toucan Kids" },
  { min: 7.0, max: 7.5, value: "4.75″ hanger", line: "Toucan Kids" },
  { min: 7.5, max: 7.9, value: "5.0″ hanger", line: "Double Hollow" },
  { min: 7.9, max: 8.25, value: "5.25″ hanger", line: "Double Hollow" },
  { min: 8.25, max: null, value: "5.5″ hanger", line: "Double Hollow" },
];

export const BEGINNER_ROW = {
  label: "Beginner truck",
  value: "8″ axle",
  sub: "Fitted to the complete, one size for all three widths, 90a bushings",
  chip: "Not sold separately",
};

export interface LadderSize {
  size: string;
  axle: string;
  min: number;
  max: number | null;
  onOrder: boolean;
}

export const ACE_CLASSIC: LadderSize[] = [
  { size: "00", axle: "6.5″", min: 0, max: 6.5, onOrder: false },
  { size: "11", axle: "7.25″", min: 7.0, max: 7.3, onOrder: true },
  { size: "22", axle: "7.6″", min: 7.12, max: 7.75, onOrder: true },
  { size: "33", axle: "8.0″", min: 7.75, max: 8.12, onOrder: true },
  { size: "44", axle: "8.35″", min: 8.12, max: 8.5, onOrder: true },
  { size: "55", axle: "9.0″", min: 8.5, max: 9.12, onOrder: true },
  { size: "66", axle: "9.35″", min: 9.12, max: 9.62, onOrder: false },
];

const AF1_SIZES: Omit<LadderSize, "onOrder">[] = [
  { size: "22", axle: "7.75″", min: 7.5, max: 8.0 },
  { size: "33", axle: "8.0″", min: 7.75, max: 8.12 },
  { size: "44", axle: "8.25″", min: 8.12, max: 8.3 },
  { size: "55", axle: "8.5″", min: 8.3, max: 8.75 },
  { size: "60", axle: "8.75″", min: 8.5, max: 9.0 },
  { size: "66", axle: "9.0″", min: 8.75, max: 9.25 },
  { size: "77", axle: "9.5″", min: 9.25, max: 9.75 },
  { size: "80", axle: "10.0″", min: 9.75, max: null },
];

export const ACE_AF1_HOLLOW: LadderSize[] = AF1_SIZES.map((s) => ({
  ...s,
  onOrder: s.size === "22" || s.size === "33" || s.size === "44",
}));

export const ACE_AF1: LadderSize[] = AF1_SIZES.map((s) => ({
  ...s,
  onOrder: s.size === "33" || s.size === "44",
}));

export const INDEPENDENT: LadderSize[] = [
  { size: "109", axle: "6.9″", min: 6.25, max: 7.6, onOrder: false },
  { size: "129", axle: "7.6″", min: 7.4, max: 7.8, onOrder: false },
  { size: "139", axle: "8.0″", min: 7.8, max: 8.2, onOrder: false },
  { size: "144", axle: "8.25″", min: 8.2, max: 8.375, onOrder: false },
  { size: "149", axle: "8.5″", min: 8.375, max: 8.6, onOrder: false },
  { size: "159", axle: "8.75″", min: 8.6, max: 9.0, onOrder: false },
  { size: "169", axle: "9.125″", min: 9.0, max: 9.5, onOrder: false },
  { size: "215", axle: "10.0″", min: 9.5, max: 10.5, onOrder: false },
];

export const CALC_ROWS: {
  id: string;
  label: string;
  sub: string;
  ladder: LadderSize[];
  reference?: boolean;
}[] = [
  {
    id: "classic",
    label: "ACE Classic",
    sub: "Solid axle and kingpin, polished — quoted by axle width",
    ladder: ACE_CLASSIC,
  },
  {
    id: "af1-hollow",
    label: "ACE AF1 Hollow",
    sub: "Hollow axle and hollow kingpin, polished — quoted by axle width",
    ladder: ACE_AF1_HOLLOW,
  },
  {
    id: "af1",
    label: "ACE AF1",
    sub: "Solid axle and kingpin, polished — quoted by axle width",
    ladder: ACE_AF1,
  },
  {
    id: "indy",
    label: "Independent",
    sub: "For reference — the model number is the hanger width in millimetres. We don't stock Indys",
    ladder: INDEPENDENT,
    reference: true,
  },
];

// ── Section 3 — #height ───────────────────────────────────────────────────

export const HEIGHT_SECTION = {
  kicker: "The second number",
  title: "Height, and the wheel that bites",
  intro:
    "Width decides whether the truck matches the deck. Height decides whether your wheel touches it in a hard turn, and how the board feels to pop.",
};

export const HEIGHT_CARDS: { title: string; text: string }[] = [
  {
    title: "Low",
    text: "Sits the deck closer to the ground. Less leverage to pop, but the board is quicker to flip and more stable because the centre of gravity drops. Pairs with small wheels — 50–53mm territory. Go low with big wheels and you will get wheelbite.",
  },
  {
    title: "Mid",
    text: "The default, and what most riders should be on. Around 53mm of truck height on a typical pro truck — enough clearance for 52–56mm wheels without a riser, enough leverage for a normal pop. If you don't have a reason to choose, choose this.",
  },
  {
    title: "High",
    text: "More clearance, more leverage on the tail, a taller ride. Made for bigger wheels, rougher ground and cruising, and for riders who want maximum pop out of a deep kick. The trade is a board that feels further away from your feet.",
  },
];

export const WHEELBITE_SUB = {
  kicker: "Wheelbite",
  title: "When the wheel touches the deck, the board stops",
  intro:
    "Not slows — stops. It is one of the few dangerous setup mistakes, and it is entirely preventable with a washer's worth of plastic.",
};

export const HEIGHT_TABLE_COLS: TableCol[] = [
  { name: "49–54mm", sub: "Street and park" },
  { name: "55–57mm", sub: "All-round" },
  { name: "58–64mm", sub: "Cruising" },
  { name: "65mm+", sub: "Surfskate and soft setups" },
];

export const HEIGHT_TABLE_ROWS: TableRow[] = [
  {
    label: "Riser needed",
    cells: [
      "None",
      "1/8″",
      "1/8″–1/4″",
      { text: "**1/4″–1/2″ and up**", warn: true },
    ],
  },
  {
    label: "Bolt length (7-ply deck)",
    cells: ["7/8″", "1″–1 1/8″", "1 1/8″–1 1/4″", "1 1/4″–1 1/2″"],
  },
  {
    label: "Truck height",
    cells: ["Low or mid", "Mid", "Mid or high", "High"],
  },
];

export const HEIGHT_NOTE =
  "**The bolt rule:** add 1″ to your riser thickness to get the bolt length you need — a 1/4″ riser wants 1 1/4″ bolts. Fitting a riser without longer bolts leaves you a couple of threads of engagement holding the truck on, which is its own kind of dangerous. And if you are getting bite only occasionally, try tightening the kingpin nut first: it is free, and sometimes that is all it was.";

// ── Section 4 — #turn ─────────────────────────────────────────────────────

export const TURN_SECTION = {
  kicker: "Mechanism",
  title: "Where the turn comes from",
  intro:
    "A skateboard has no steering. It turns because leaning on it squashes a piece of rubber, and the geometry decides how much turn you get for how much lean.",
  hint: "Two views of the same truck — from behind, and from above.",
  caption:
    "Two views of the same moment, because neither one shows it on its own. From behind you can see the load going into the bushings. From above you can see what that produces: because the kingpin is angled along the length of the board, the hanger does not just tilt — it swings, and the axle stops being square to the direction of travel. That is the steering. Everything you can change about how a truck turns — bushings, washers, kingpin tension, baseplate angle — changes how far it swings for a given lean.",
};

export const TURN_ALTS = {
  levelBehind:
    "A skateboard truck seen from behind with the deck level, both bushings at rest",
  levelAbove:
    "A skateboard truck seen from directly above with the deck level, the axle square across the board",
  leanBehind:
    "A skateboard truck seen from behind with the deck leaned over, the boardside bushing compressed and the roadside one released",
  leanAbove:
    "A skateboard truck seen from directly above with the deck leaned over, the axle swung out of square with the board",
};

export const TURN_PROSE: { title: string; text: string }[] = [
  {
    title: "Angle is built in, tension is not",
    text: "The baseplate sets the angle the kingpin sits at, and that angle is a design decision you buy rather than adjust. A steeper geometry gives more turn per degree of lean, which is why two trucks of identical width can feel nothing alike — ACE built its reputation on how sharply its trucks turn. What you *can* change on any truck is how hard the bushings resist that lean, and there are two ways to do it: the nut, and the rubber.",
  },
  {
    title: "What the nut can and cannot do",
    text: "Tightening the kingpin nut preloads the bushings so they resist sooner. It makes the board feel firmer, and past a point it makes it feel dead — you are crushing the rubber rather than letting it work, and it wears out faster that way. If you have wound the nut down hard and the board still turns too easily, you do not have a tension problem. You have the wrong bushings.",
  },
];

// ── Section 5 — #types ────────────────────────────────────────────────────

export const TYPES_SECTION = {
  kicker: "Families",
  title: "Which way the kingpin faces",
  intro:
    "One decision splits every truck ever made into families: which direction the kingpin points.",
};

export const TYPES_CARDS: { title: string; text: string }[] = [
  {
    title: "Traditional kingpin — TKP",
    text: "The kingpin sits tucked inside the hanger, close to vertical, with the nut facing in toward the middle of the board. On a set-up board the two kingpins face each other. Everything we make is TKP, every ACE truck is TKP, and so is every street truck you have ever seen. Burying the kingpin inside the hanger makes the truck short, so the deck sits low. It also means nothing sticks out to catch on a ledge or a coping. These are the trucks you grind on.",
  },
  {
    title: "Reverse kingpin — RKP",
    text: "The kingpin is flipped: it passes through the hanger at an angle, typically 40–50°, and points outward, away from the centre of the board, so the nut ends up on the outside above the hanger. The steeper the kingpin, the further the hanger swings for a given degree of lean — so an RKP turns deeper and recentres more progressively. It is the standard on longboards, cruisers and downhill boards, and you do not grind one.",
  },
];

export const TYPES_TABLE_COLS: TableCol[] = [
  { name: "TKP", sub: "Traditional kingpin" },
  { name: "RKP", sub: "Reverse kingpin" },
];

export const TYPES_TABLE_ROWS: TableRow[] = [
  {
    label: "Kingpin",
    cells: [
      "Inside the hanger, facing in",
      "Through the hanger at 40–50°, facing out",
    ],
  },
  { label: "Ride height", cells: ["Low", "Tall"] },
  {
    label: "Turn",
    cells: ["Quick and snappy, limited range", "Deep and progressive"],
  },
  { label: "At speed", cells: ["Twitchier", "Self-correcting"] },
  {
    label: "Grinding",
    cells: ["Yes — kingpin protected", "**No — kingpin exposed**"],
  },
  {
    label: "Quoted in",
    cells: ["Inches, by hanger or axle", "Millimetres — 150, 180"],
  },
  {
    label: "Built for",
    cells: ["Street, park, bowls", "Carving, commuting, downhill"],
  },
];

export const TYPES_NOTE =
  "**One will not stand in for the other.** Bolt RKPs to a popsicle and you get a board that rides high, carves beautifully and is wrong for everything the deck was shaped to do — no pop worth having, wheelbite waiting, and a kingpin in the way of every grind. The families exist because the boards do.";

export const SURFSKATE_SUB = {
  kicker: "The third family",
  title: "Surfskate trucks",
  intro:
    "A surfskate goes further than a steep baseplate on an RKP. The front truck has an extra axis of rotation that no ordinary truck has, and that is what separates the machine from a cruiser.",
};

export const SURFSKATE_PROSE: { title: string; text: string }[] = [
  {
    title: "What the front truck actually adds",
    text: "An ordinary truck has one hinge: the hanger tilts on the pivot. A surfskate front truck adds a swivelling arm in front of the axle, so the nose can steer on its own axis rather than only as a consequence of lean. That is what lets you generate speed by pumping your hips instead of pushing, and it is why the rear truck is deliberately left conventional — all that movement at the front needs something stable behind it.",
  },
  {
    title: "Two ways to load it",
    text: "Whatever the arm is, something has to resist it and return it to centre. There are two schools, and the choice changes the feel more than the geometry does: a steel spring, or a urethane bushing. Almost every surfskate on the market is one or the other, and brands are rarely explicit about which you are buying.",
  },
];

export const SURFSKATE_TABLE_COLS: TableCol[] = [
  { name: "Spring-loaded", sub: "A coil spring returns the arm — ours" },
  { name: "Bushing-loaded", sub: "Urethane returns the arm" },
];

export const SURFSKATE_TABLE_ROWS: TableRow[] = [
  {
    label: "Feel",
    cells: [
      "Flowing and loose, a distinct snap back to centre",
      "Progressive — resistance builds as you lean, like a skate truck",
    ],
  },
  {
    label: "Closest to",
    cells: [
      "Surfing — the point of the design",
      "Skateboarding, with a much deeper turn",
    ],
  },
  {
    label: "Learning on it",
    cells: [
      "Demands attention, wanders when you ride straight",
      "**Easier — recentres directly, predictable at low speed**",
    ],
  },
  {
    label: "Tuning",
    cells: [
      "Spring tension, and the spring itself",
      "Kingpin tension and bushing durometer — same skills as any truck",
    ],
  },
  {
    label: "Moving parts",
    cells: [
      "More — the swivel assembly wants periodic checking",
      "Fewer — nothing beyond ordinary truck maintenance",
    ],
  },
  { label: "Weight", cells: ["Heavier", "Lighter"] },
  {
    label: "Suits",
    cells: [
      "Surf training, low-speed pumping, flowing carves",
      "First surfskate, bowls, commuting, all-round use",
    ],
  },
];

export const TYPES_NOTE_2 =
  "**Ours is spring-loaded.** The Toucan S6 runs a 360° pivot front truck returned by a spring, with an adjustable tension system so you can set how hard it fights you, paired with a conventional rear truck. That puts it firmly in the left-hand column: flowing, surf-like, strong snap back to centre, and a front end that asks for your attention when you are riding in a straight line. It is built for surf training and pumping rather than as an easy first board, and the swivel assembly is worth a look over every few months.";

export const TYPES_NOTE_3 =
  "If you are choosing between surfskates generally, the question worth asking a seller is whether a spring or a bushing is bringing it back. That is the thing you feel on every turn and the thing you eventually have to service, and it is the spec most brands leave off the listing.";

// ── Section 6 — #bushings ─────────────────────────────────────────────────

export const BUSHINGS_SECTION = {
  kicker: "The cheapest change you can make",
  title: "Bushings",
  intro:
    "Two small rubber barrels per truck, worth a fraction of what a truck costs, and the single biggest lever over how a board feels. Almost nobody changes them.",
};

export const BUSHING_DEFS: { term: string; note: string; def: string }[] = [
  {
    term: "Two per truck",
    note: "Boardside and roadside",
    def: "The boardside bushing sits between the hanger and the deck, and it does most of the work resisting lean — it is the one that decides how stable the truck feels. The roadside bushing sits under the hanger and controls the return, how quickly the board comes back to level. Many riders run a harder boardside and a softer roadside, which gives stability without a dead-feeling rebound.",
  },
  {
    term: "Durometer",
    note: "The A scale again",
    def: "Same scale as wheels: higher is harder. Roughly, 90–97a is hard, 80–88a medium hard, 70–78a medium soft and 60–68a soft. Heavier riders need harder bushings to get the same feel, lighter riders softer — a light rider on hard stock bushings has a board that simply will not turn, and usually concludes the truck is bad. Our fitted beginner truck runs 90a.",
  },
  {
    term: "Shape",
    note: "How the resistance builds",
    def: "A barrel is the standard, and resists evenly through the turn. A cone has less material at the top, so it gives way earlier and turns faster for less effort. A fatcone flares outward and fights you harder the deeper you lean. A chubby is the most stable of the lot. Shape changes the character of the turn in a way durometer cannot — hard and easy-turning is a shape question.",
  },
  {
    term: "Washers",
    note: "Often overlooked",
    def: "The cupped or flat plates above and below each bushing decide how much of it is free to deform. A deep cupped washer restrains the bushing and firms everything up; a flat washer lets it move and turns more freely. Swapping washers is the cheapest tuning step there is, and on a truck that feels nearly right it is often the only change needed.",
  },
  {
    term: "Break-in",
    note: "Give it a fortnight",
    def: "New bushings are stiff, and a truck that feels locked out of the box usually is not. Ride it a couple of weeks before deciding, then adjust. If it still will not turn after a month of riding and a loosened nut, change the bushings rather than the truck.",
  },
];

export const BUSHINGS_NOTE =
  "**What wrong bushings feel like.** Too hard: the board resists you, carving takes real effort, and you end up hopping the nose round corners instead of turning. Too soft: fine at walking pace, then wobbly at speed and vague on landings, with the hanger bottoming out against the baseplate in a hard turn. Both get blamed on the truck far more often than on the twenty rupees of rubber inside it.";

// ── Section 7 — #build ────────────────────────────────────────────────────

export const BUILD_SECTION = {
  kicker: "Construction",
  title: "Cast, forged, hollow",
  intro:
    "Three words that get used as though they were a ladder from worst to best. Two of them are about how the metal was made. The third is about what was taken out of it, and it is the one most often misread.",
};

export const BUILD_CARDS: { title: string; text: string }[] = [
  {
    title: "Cast",
    text: "Molten aluminium poured into a mould. It is how nearly every hanger and baseplate is made, including very good ones, and there is nothing second-rate about it. The quality differences that matter are in the alloy and the consistency of the pour — a cheap truck fails because it was cast from soft pot metal, and casting itself is what nearly every good truck is made by.",
  },
  {
    title: "Forged",
    text: "Metal pressed into shape under pressure rather than poured. It aligns the grain of the alloy and gives a denser, stronger part for the same weight, so it can be made thinner. It costs more and it is an improvement — but the improvement is in the hanger rather than in how the truck turns, and a forged truck with bushings that don't suit you still feels wrong.",
  },
  {
    title: "Hollow",
    text: "A hollow axle and a hollow kingpin instead of solid bar, taking weight out of the heaviest part of the board without losing strength. Less to throw around on a flip, less to carry all day. This is the one people treat as a grade, and it isn't.",
  },
];

export const BUILD_NOTE =
  "**Hollow is a spec, and people read it as a tier.** Plenty of excellent trucks are solid, and some of the pro trucks we are bringing in are solid by design. What hollow reliably tells you is the tier a truck isn't — nobody spends money drilling out the axle on an entry-level truck, so a hollow spec rules out the bottom of the market without telling you anything about the top of it. Treat it as a weight saving you may or may not want to pay for.";

export const BUILD_PROSE: { title: string; text: string }[] = [
  {
    title: "What actually separates a beginner truck from a pro one",
    text: "Not hollowness. It is the alloy and the casting quality, the bushings and the seats they sit in, the pivot cup material and how precisely it fits, and whether the geometry was designed or copied. A beginner truck is built to a price, and the place the price comes out is usually the bushings and the pivot — which is exactly why it feels vague and why it is the first part most riders replace.",
  },
  {
    title: "Weight, honestly",
    text: "Truck weight is the largest single lever on how heavy a board feels, because trucks are the heaviest components on it. Hollow axles and kingpins take out real grams and you can feel it on a flip. What you cannot feel is the marketing between two trucks that are within a few grams of each other, and no weight saving compensates for a truck that turns wrong for you.",
  },
];

export const METALS_SUB = {
  kicker: "The metal",
  title: "What a truck is actually made of",
  intro:
    "Two aluminium alloys, two steels, and a cheap alternative that explains most of what goes wrong with a budget board. Brands print these codes and almost nobody reads them.",
};

export const MATERIALS_TABLE_COLS: TableCol[] = [
  { name: "Typical material (on a good truck)", sub: "" },
  { name: "What it buys you", sub: "" },
];

export const MATERIALS_TABLE_ROWS: TableRow[] = [
  {
    label: "Hanger and baseplate",
    cells: [
      "A356 aluminium, T6",
      "A casting alloy that flows well into a mould and takes heat treatment. The T6 is not decoration — it is a solution-treat-and-age cycle that roughly doubles the strength of the raw casting. A356 without T6 is a softer part wearing the same name.",
    ],
  },
  {
    label: "Forged baseplate",
    cells: [
      "6061 aluminium, forged",
      "Pressed into shape rather than poured, which aligns the grain and gives a denser part. Denser means the same strength in less metal, so a forged baseplate can be thinner and lighter than a cast one doing the same job.",
    ],
  },
  {
    label: "Kingpin",
    cells: [
      "Grade 8 steel",
      "A high-tensile bolt spec. The kingpin carries every bit of load the bushings transmit, and a bent one is the end of a truck, so this is a part where the cheap version fails early and the good version effectively never does.",
    ],
  },
  {
    label: "Axle",
    cells: [
      "SCM435 chromoly steel",
      "Chromium-molybdenum steel — tougher and far more resistant to bending than plain carbon steel at the same diameter. All axles are 8mm, so the only variable left is what the 8mm is made of.",
    ],
  },
  {
    label: "Hollow versions",
    cells: [
      "Hollow chromoly",
      "The same alloy with the middle drilled out. A tube resists bending almost as well as a solid rod of the same diameter, because the metal doing the work is at the outside — which is why hollow works at all.",
    ],
  },
  {
    label: "Cheap trucks",
    warnRow: true,
    cells: [
      '**Zinc alloy — "pot metal"**',
      "Melts at a low temperature and casts cheaply, which is the entire appeal. It is soft, heavy for its strength and brittle at the edges. This is the metal behind the trucks that will not lean, the baseplates that crack and the stripped threads on a sports-shop board.",
    ],
  },
];

export const EXPENSIVE_SUB = {
  kicker: "The expensive metals",
  title: "Magnesium and titanium",
  intro:
    "Both are real engineering, both cost money, and neither does what people assume. One saves weight and gives something up for it. The other is barely about weight at all.",
};

export const EXPENSIVE_PROSE: { title: string; text: string }[] = [
  {
    title: "Magnesium — lighter, and softer",
    text: "Magnesium alloy is about a third lighter than aluminium by volume, and the difference on a scale is not subtle: a magnesium truck can come in around 264g where comparable aluminium trucks weigh 364g and 394g. That is most of a wheel's worth of weight off each end of the board.\n\nWhat you give up is the hanger. Magnesium is softer and wears faster on a grind, and the thin hangers that make the weight saving possible leave less metal between the grinding surface and the kingpin — a wear test of one popular magnesium truck found the kingpin taking a share of the grind from new. Magnesium alloys are also more prone to corrosion than aluminium, which is worth a thought in a humid coastal city. Buy it if what you want is the lightest board.\n\n**We don't stock magnesium trucks.**",
  },
  {
    title: "Titanium — bought for strength",
    text: "Titanium is heavier than aluminium — roughly 4.5 against 2.7 grams per cubic centimetre. The reason it appears on trucks is that it is far stronger than either aluminium or steel for its weight, so the parts that must not bend can be made of less of it.\n\nThat is why you almost always see it as a Ti64 axle or kingpin rather than a titanium hanger: a titanium axle weighs less than the chromoly one it replaces while bending less, which is the exact trade you want on the part whose failure ends a truck. Full titanium hangers exist and cost accordingly. Treat titanium as insurance on the parts that break.\n\n**We don't stock titanium trucks either.**",
  },
];

export const EXPENSIVE_NOTE =
  "**What this is worth knowing for.** You buy a truck rather than a billet, so the point is simply that 'aluminium trucks' stops sounding like a specification. Most trucks on the market are aluminium, including the bad ones. A356-T6, a grade 8 kingpin and a chromoly axle are a specification, and a brand that prints them is telling you something a brand that says 'high-quality alloy' is not.";

// ── Section 8 — #range ────────────────────────────────────────────────────

export const RANGE_SECTION = {
  kicker: "The range",
  title: "What we stock, and what's landing",
  intro:
    "Toucan makes our own trucks. ACE is the one outside brand we carry — a US maker with a long reputation for a reactive, high-turning geometry.",
};

export const RANGE_TABLE_COLS: TableCol[] = [
  { name: "Beginner truck", sub: "Fitted only" },
  { name: "Toucan Double Hollow", sub: "Our pro truck" },
  { name: "Toucan solid pro", sub: "Coming soon" },
  { name: "ACE", sub: "Coming soon, three lines" },
];

export const RANGE_TABLE_ROWS: TableRow[] = [
  {
    label: "Sizes",
    cells: [
      "One — 8″ axle",
      "5.0″ · 5.25″ · 5.5″ hanger",
      "To be confirmed",
      "Classic 11, 22, 33, 44, 55 · AF1 Hollow 22, 33, 44 · AF1 33, 44 — all polished",
    ],
  },
  {
    label: "Axle and kingpin",
    cells: [
      "Solid",
      "Hollow axle and hollow kingpin",
      "Solid",
      "Classic solid; AF1 in both a solid and a hollow version",
    ],
  },
  {
    label: "Bushings",
    cells: [
      "90a, not specified further",
      "Standard barrels",
      "To be confirmed",
      "Both AF1 versions run revised bushing and washer shapes for a faster rebound",
    ],
  },
  {
    label: "Turn",
    cells: [
      "Vague — it is an entry part",
      "Standard street geometry",
      "Standard street geometry",
      "**Very reactive — ACE's whole reputation**",
    ],
  },
  {
    label: "How you get it",
    cells: [
      "On a beginner complete. Not sold separately",
      "Sold on its own, and on pro completes",
      "Will be sold on its own",
      "Will be sold on its own",
    ],
  },
];

export const RANGE_PROSE: { title: string; text: string }[] = [
  {
    title: "The ACE sizes, and a trap in them",
    text: "Three lines are arriving, all in the polished finish. Classic in 11, 22, 33, 44 and 55. AF1 Hollow in 22, 33 and 44. And AF1 in its solid form in 33 and 44, for riders who want the AF1 geometry without paying for drilled-out metal. Worth knowing before you buy: Classic and AF1 do not share a size ladder. A Classic 44 is an 8.35″ axle; an AF1 44 is 8.25″. At 33 they happen to agree at 8.0″. Match the axle width to your deck, whatever the number on the box says.",
  },
  {
    title: "Also in the range",
    text: "Toucan Kids in 4.0″ and 4.75″ hanger, for the 7″–7.5″ decks a small rider actually needs. Toucan S6 surfskate trucks — a spring-loaded front truck that swings through a full circle on its own arm, with an adjustable tension system and a conventional rear truck. A different machine rather than a different size; the two surfskate mechanisms are compared in the types section above.",
  },
];

export const RANGE_CROSSLINK = {
  text: "Picking parts rather than reading about them? The configurator only shows trucks that fit the deck you chose, so the compatibility question answers itself.",
  cta: "Open the configurator →",
  href: "/configurator",
};

// ── Section 9 — #care ─────────────────────────────────────────────────────

export const CARE_SECTION = {
  kicker: "Upkeep",
  title: "Setting up and living with them",
  intro:
    "Trucks outlast almost everything else on a board. What they need is a T-tool and about two minutes every few sessions.",
};

export const CARE_DEFS: { term: string; note: string; def: string }[] = [
  {
    term: "Kingpin nut",
    note: "Your one free adjustment",
    def: "Sets how easily the board leans. Tighter is more stable and harder to turn; looser carves more and gets wobbly at speed. Move it a quarter turn at a time and ride between changes — the difference is bigger than it looks. New riders usually start a little tight and loosen off over the first few weeks. Never tighten it so far that the bushings bulge out past the washers; that is crushing them.",
  },
  {
    term: "Axle nuts",
    note: "Check weekly",
    def: "These hold your wheels on, and the failure mode is a wheel leaving the board at speed. Snug, with the wheel still spinning freely — overtightened, the bearings are squeezed out of true and the wheel drags. If a nut is spinning loosely on the thread rather than gripping, replace it: the nylon insert in a locknut only works once or twice.",
  },
  {
    term: "Mounting bolts",
    note: "Every two or three sessions",
    def: "Four per truck, eight per board. Loose ones let the baseplate shift a fraction on every landing, which works the deck's bolt holes oval and starts pressure cracks around them. This is a deck problem caused by a truck part, and it is the most common piece of neglect in skateboarding.",
  },
  {
    term: "Pivot cup",
    note: "The quiet one",
    def: "A plastic socket in the baseplate that the hanger's pivot arm sits in. It wears, and as it does the truck develops a click and a vague, floaty feel that no amount of kingpin adjustment fixes. It costs almost nothing and takes five minutes to change. If a truck has gone sloppy and the bushings are fine, look here before you buy a new truck.",
  },
  {
    term: "Grinding wear",
    note: "Expected behaviour",
    def: "The hanger is meant to be ground on, and it will develop a flat where it meets ledges and rails. That is normal and even desirable — a worn-in hanger grinds better than a new one. It matters only when the flat gets deep enough to reach the axle, or when a corner of the hanger cracks. Both are end-of-life, and both take a long time.",
  },
  {
    term: "When a truck is finished",
    note: "Rarely",
    def: "A bent axle — the wheel wobbles visibly and will not sit square — or a cracked hanger or baseplate. Everything else is a replaceable part: bushings, washers, pivot cup, kingpin, axle nuts. Trucks are the component you keep through several decks, which is why it is worth buying the ones that suit you.",
  },
];

// ── Section 10 — #faq ─────────────────────────────────────────────────────

export const FAQ_SECTION = {
  kicker: "Common questions",
  title: "Straight answers",
  intro:
    "True of any trucks from any brand. What we happen to stock is at the end of each one.",
};

export const TRUCK_FAQ: GuideFaqItem[] = [
  {
    q: "Do expensive trucks actually turn better?",
    a: "They turn differently, and more predictably. The geometry that decides how much turn you get per degree of lean is designed rather than adjustable, and a well-made truck holds that geometry under load because the casting is stiff and the pivot fits properly. A cheap truck flexes and the pivot is loose, so the same lean gives you a slightly different turn each time — which reads as vagueness rather than as a different feel.\n\nWhat a price tag does not buy is a turn that suits you. That comes from bushings and washers, and a mid-priced truck with the right bushings will beat an expensive one with the wrong ones every time. Spend on the truck once you know what feel you are chasing.",
    stock:
      "Toucan Double Hollow in three hanger widths, with solid pro Toucans arriving, and ACE in three lines — Classic, AF1 Hollow and solid AF1.",
  },
  {
    q: "My board won't turn. Do I need new trucks?",
    a: "Almost certainly not. Work through it in this order, cheapest first. Loosen the kingpin nut a quarter turn at a time and ride between adjustments. Ride it in — new bushings are stiff for a couple of weeks. Check your weight against the bushing durometer: a light rider on hard stock bushings has a board that physically will not lean far enough, and no amount of nut adjustment fixes that. Then change the bushings, which costs a fraction of a truck.\n\nOnly after all four is the truck itself the problem, and then the answer is usually that its geometry does not suit you, rather than that it is broken.",
    stock:
      "Trucks with standard bushing seats, so any aftermarket bushing fits. Our fitted beginner truck runs 90a.",
  },
  {
    q: "Does truck width really have to match the deck?",
    a: "Close enough, and exact is not the goal. The wheels should sit roughly under the edges of the deck. Too narrow and the board feels twitchy, tips more easily, and catches wheels on landings. Too wide and it turns slowly, the wheels take hits they shouldn't, and grinds sit awkwardly because the hanger sticks out past the rail.\n\nWithin about a quarter of an inch either way is fine, and riders do deliberately run slightly narrow for quicker flips or slightly wide for stability. The mistake worth avoiding is being out by half an inch or more without meaning to be — which is exactly what happens when someone compares a hanger number to an axle number.",
    stock:
      "Hanger widths covering 7.5″ to 8.875″ decks, kids trucks for 7″–7.5″, and ACE sizes quoted by axle width.",
  },
  {
    q: "What are risers for, and do I need them?",
    a: "Risers are plastic shims between the truck and the deck. They do two things: raise the board so a bigger wheel cannot touch it in a hard turn, and spread the shock of a landing across a wider area of the deck rather than concentrating it at the baseplate edge.\n\nIf you run wheels under about 54mm on a mid truck you do not need them. Above that they stop wheelbite, which is worth avoiding because the board does not slow down when the wheel touches — it stops. Remember the bolts: add an inch to the riser thickness to get the bolt length, or you will be holding the truck on with two threads.",
    stock:
      "Hardware in the lengths our own setups need. For big-wheel builds, check the bolt length against the riser before you order.",
  },
  {
    q: "Can I put any trucks on any deck?",
    a: "On a modern popsicle, yes. There is one mounting pattern — eight holes in two clusters of four, the same spacing on every brand — so any current truck bolts to any current deck. Axles are 8mm and every skate bearing is a 608, so wheels and bearings move across too. This standardisation is the reason a deck is a consumable rather than a whole new setup.\n\nTwo exceptions. Old-school and reissue shapes sometimes use a wider vintage pattern modern baseplates won't line up with. And surfskate trucks will not stand in for standard ones at all — the front truck is a different mechanism altogether.",
    stock:
      "Standard-pattern trucks throughout. Our old-school decks are the shape to check before mixing.",
  },
  {
    q: "Hollow, forged, titanium — which should I care about?",
    a: "In order of how much difference they make to riding: bushings, by a distance; then geometry, which you buy rather than tune; then construction quality, meaning the alloy and the pivot fit; and only then weight. Hollow and titanium parts are real weight savings and you can feel them on a flip, but they are refinements on top of a truck that already suits you.\n\nBe especially wary of reading hollow as a quality grade. It tells you a truck is above entry level and nothing about whether it is good, and some of the best trucks made are solid.",
    stock:
      "Hollow axle and kingpin on the Toucan Double Hollow and on ACE AF1 Hollow; solid on ACE Classic, on the solid version of the AF1, on the incoming solid pro Toucan, and on the fitted beginner truck. The AF1 arriving in both forms is the clearest illustration of the point — same truck, same geometry, one with the metal drilled out.",
  },
];

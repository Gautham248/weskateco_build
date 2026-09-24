// ---------------------------------------------------------------------------
// Deck Guide — data and copy, ported verbatim from the source artifact.
// Cells may carry **bold** / *italic* markers; warn cells are flagged.
// The table types are shared across guides (lib/guides/types).
// ---------------------------------------------------------------------------

import type { GuideFaqItem, TableCol, TableRow } from "lib/guides/types";

// ── Hero ──────────────────────────────────────────────────────────────────

export const DECK_HERO = {
  eyebrow: "Sphere Skateboards · WeSkate Co. · Guide 02",
  titleLead: "The",
  titleAccent: "Deck",
  lede: "The buying guide gets you to a width. This one is about the plank itself — what seven plies of maple actually do, why it is maple and not something else, what moisture does to it, what the glue is holding together in Indian heat, where a deck’s numbers are measured from, what concave is in cross‑section, and the four ways a deck dies. Read it once and you’ll know what you’re looking at on any spec sheet, ours or anyone else’s.",
  ctaPrimary: { label: "Start with the plies →", href: "#plies" },
  ctaSecondary: {
    label: "Buying guide",
    href: "/guides/skateboard-buying-guide",
  },
};

export const ANCHOR_NAV: { label: string; href: string }[] = [
  { label: "Plies", href: "#plies" },
  { label: "Shape", href: "#shape" },
  { label: "Maple", href: "#maple" },
  { label: "Epoxy", href: "#epoxy" },
  { label: "Concave", href: "#concave" },
  { label: "Finish", href: "#finish" },
  { label: "Wear", href: "#wear" },
  { label: "Care", href: "#care" },
  { label: "Range", href: "#range" },
  { label: "FAQ", href: "#faq" },
];

// ── Section 1 — #plies ────────────────────────────────────────────────────

export const PLIES_SECTION = {
  kicker: "Construction",
  title: "Seven plies, and what each one does",
  intro:
    "A skateboard deck is seven thin sheets of maple glued into one board under pressure. The number is almost universal, and the reason is in how the sheets are stacked.",
  hint: "Tap a ply to see its job. The board is drawn cut across its width.",
  caption:
    "Plies 3 and 5 are laid at right angles to the rest. That cross‑grain is what stops a deck splitting along its length and what gives it torsional stiffness — the resistance you feel when you twist the nose against the tail.",
};

export interface Ply {
  n: number;
  dir: "long" | "cross";
  name: string;
  text: string;
  spec: [string, string][];
}

export const PLIES: Ply[] = [
  {
    n: 1,
    dir: "long",
    name: "Top ply",
    text: "The face you stand on, under the griptape. It runs along the length of the board and it is the ply that takes every heel dent and every board-to-board collision. On a stained deck this is usually one of the dyed layers, which is why the colour shows at the nose where the grip stops.",
    spec: [
      ["Grain", "Along the board"],
      ["Job", "Wear surface, tension on landing"],
      ["Fails by", "Heel dents, then pressure cracks"],
    ],
  },
  {
    n: 2,
    dir: "long",
    name: "Second ply",
    text: "Another lengthwise layer sitting directly under the top. Together with ply 1 it carries most of the tension when the board bends under your weight, which is what makes a deck spring back instead of staying bent.",
    spec: [
      ["Grain", "Along the board"],
      ["Job", "Tension with ply 1"],
      ["Dyed on", "1-2-4-7 stain only"],
    ],
  },
  {
    n: 3,
    dir: "cross",
    name: "Cross ply",
    text: "Laid at right angles to everything around it. Maple splits easily along its grain, so a stack of seven lengthwise layers would be a board waiting to split down the middle. Turning this one sideways ties the whole width together and stops a crack running the length of the deck.",
    spec: [
      ["Grain", "Across the board"],
      ["Job", "Stops lengthwise splitting"],
      ["Also gives", "Torsional stiffness"],
    ],
  },
  {
    n: 4,
    dir: "long",
    name: "Core",
    text: "The middle ply, and the axis the board bends around. It sits at the neutral point of the stack, so it does the least work under bending and is the natural one to dye without weakening anything — which is why it is the 4 in a 1-4-7 stain.",
    spec: [
      ["Grain", "Along the board"],
      ["Job", "Neutral axis"],
      ["Dyed on", "Both stains"],
    ],
  },
  {
    n: 5,
    dir: "cross",
    name: "Cross ply",
    text: "The mirror of ply 3. Cross plies are placed in pairs, symmetrically either side of the core, because an unbalanced stack warps as the glue cures and as humidity changes. A deck that arrives twisted usually got this wrong.",
    spec: [
      ["Grain", "Across the board"],
      ["Job", "Balances ply 3"],
      ["If unbalanced", "The board warps"],
    ],
  },
  {
    n: 6,
    dir: "long",
    name: "Sixth ply",
    text: "Lengthwise again, working in compression while the top plies work in tension. This is one half of the pair that holds the concave: press a curve into a symmetrical stack and the outer plies on both faces have to fight to flatten it back out.",
    spec: [
      ["Grain", "Along the board"],
      ["Job", "Compression under load"],
      ["Holds", "The pressed concave"],
    ],
  },
  {
    n: 7,
    dir: "long",
    name: "Bottom ply",
    text: "The graphic ply. It faces the ground, so it is the one that gets ground away on ledges and rails, and it takes the impact when you drop the board. The artwork sits on it under a clear coat; the stain sits in it.",
    spec: [
      ["Grain", "Along the board"],
      ["Job", "Compression, impact"],
      ["Carries", "The graphic and the clear coat"],
    ],
  },
];

export const PLIES_PROSE: { title: string; text: string }[] = [
  {
    title: "Why seven",
    text: "Fewer plies and the board goes soft early — it loses pop, the springy snap that lifts the tail off the ground, and starts to flex under landings instead of returning. More plies and you get a stiffer, heavier board that resists a flick and hits harder on the feet. Seven is where the industry settled because it is the lightest stack that survives repeated landings. A deck advertised as 8‑ply is usually built for a heavier rider or for ramp riding.",
  },
  {
    title: "Cold press versus hot",
    text: "Glued veneers are clamped into a mould until the glue cures. A cold press holds one board at a time at room temperature for hours; a hot press cures several at once in minutes with heat. Cold pressing is slower and costs more per board, and the case for it is that the wood is never cooked — the fibres keep more of their spring, so the concave and the kicks hold their shape longer. Every maple deck we make is cold‑pressed with epoxy — and the glue turns out to matter as much as the press, which is its own section below.",
  },
];

// ── Section 2 — #shape ────────────────────────────────────────────────────

export const SHAPE_SECTION = {
  kicker: "Geometry",
  title: "Where a deck’s numbers are measured from",
  intro:
    "Width is the number everyone quotes. The other four are on the spec sheet too, and two of them are measured from places that aren’t obvious.",
  figHint: "An 8.000 × 31.875″ deck, seen from above.",
  figCaption:
    "Real figures from the shape drawing for an 8.000 × 31.875″ deck. The dashed lines show what each measurement is taken from — wheelbase and nose/tail all start at bolt holes rather than at the trucks or the kicks. Add it up: nose + wheelbase + tail + the two 2.125″ bolt patterns comes back to the overall length, which is the check that tells you a spec sheet is using these definitions.",
};

export const DIM_TOGGLES = [
  { id: "all", label: "All" },
  { id: "len", label: "Length" },
  { id: "wb", label: "Wheelbase" },
  { id: "nt", label: "Nose & tail" },
  { id: "w", label: "Width" },
] as const;

export const SHAPE_TOGGLES = [
  { id: "std", label: "Standard" },
  { id: "sym", label: "Twin Tail" },
] as const;

export const SHAPE_DEFS: { term: string; note: string; def: string }[] = [
  {
    term: "Width",
    note: "The one you choose",
    def: "Measured across the middle of the board, and the only number the buying guide asks you to pick. Everything else on this list follows from it: a wider deck is almost always a longer deck with a longer wheelbase, because manufacturers scale the mould.",
  },
  {
    term: "Wheelbase",
    note: "Inner holes to inner holes",
    def: "The gap between the two trucks, measured between the inner pair of bolt holes at each end, which is a different span from the axles or the outer holes. Shorter turns quicker and spins faster; longer is calmer and more stable at speed. Two decks of the same width can differ by half an inch here, and you feel it.",
  },
  {
    term: "Nose and tail",
    note: "Outer holes to the tip",
    def: "Measured from the outer bolt holes out to each end. On a standard popsicle the nose is the longer of the two — a quarter of an inch on the 8″ shape above — and the tail is usually a touch rounder at the tip, which is how you tell them apart on an unmounted deck. More nose gives you more to catch on a flip; more tail gives you more leverage for pop. On a **Twin Tail**, where the two ends are cut symmetrically, they are identical and there is nothing to tell apart.",
  },
  {
    term: "Overall length",
    note: "Tip to tip",
    def: "Nose plus wheelbase plus tail plus the two bolt patterns. Useful mostly for knowing whether a board fits in a bag or a boot. Wheelbase is the number that changes how the board rides.",
  },
  {
    term: "Kick angle",
    note: "Rarely printed",
    def: "How steeply the nose and tail rise. Almost nobody publishes it, and you judge it by feel: a steeper kick gives sharper pop and a higher ollie but sits your foot at more of an angle and drags sooner when you push. If a deck feels “poppy” and you can’t say why, this is usually it.",
  },
];

export const SHAPE_SUB = {
  kicker: "Three shapes",
  title: "Standard, Twin Tail and old school",
  intro:
    "Almost every deck sold today is a popsicle, and the cuts still differ. Two of these are popsicles that differ by a quarter of an inch at each end; the third is a deliberate throwback.",
};

export const SHAPE_CARDS: {
  title: string;
  tag?: string;
  text: string;
}[] = [
  {
    title: "Popsicle",
    text: "Symmetrical, rounded at both ends, kicked at both ends, roughly 7″ to 8.9″ wide. It is symmetrical because a trick can land either way round and the board has to behave the same. Fifty years of skateboarding converged on this shape for street and park, and everything else on a modern setup — bolt pattern, truck width, wheel size — is built around it.",
  },
  {
    title: "Twin Tail",
    tag: "Coming soon",
    text: "The same popsicle cut symmetrically: the nose is shortened to match the tail, both tips are cut the same, and the wheelbase sits centred between them. Two tails, no front. Switch feels like regular because the board is the same either way round, which is the reason to buy one if you skate both stances. It also wears more evenly — because the ends are identical and the holes are symmetrical, you can turn the deck end for end when one tail starts going thin rather than riding it to a blade.",
  },
  {
    title: "Old school",
    text: "Wide body, pointed nose, flat tail, sometimes a fishtail: the 1980s silhouette. The nose and tail do different jobs, so the board has a front. It is made for pool and bowl riding and for cruising, with far more foot space and far less interest in flip tricks. Ours come in a rounded end and a squared end, which changes how the tail catches when you scrape it on a coping or a kerb.",
  },
];

export const SHAPE_CROSSLINK = {
  text: "Choosing a width, rather than understanding one? The board finder takes your shoe size and gives you a width, a concave and a truck size.",
  cta: "Open the board finder →",
  href: "/guides/skateboard-buying-guide",
};

// ── Section 3 — #maple ────────────────────────────────────────────────────

export const MAPLE_SECTION = {
  kicker: "The wood",
  title: "Why decks are made of maple",
  intro:
    "Every serious deck in the world is pressed from one species: sugar maple, *Acer saccharum*, sold in the trade as hard rock maple. That is convergence, and the reason behind it is rarely the one given.",
};

export const MAPLE_TABLE_COLS: TableCol[] = [
  { name: "Hard maple", sub: "Sugar maple · what decks are made of" },
  { name: "Yellow birch", sub: "The nearest alternative" },
  { name: "Poplar", sub: "What cheap boards use" },
];

export const MAPLE_TABLE_ROWS: TableRow[] = [
  {
    label: "Density",
    cells: ["**705 kg/m³**", "690 kg/m³", "455 kg/m³"],
  },
  {
    label: "Hardness",
    note: "(Janka)",
    cells: ["**1,450 lbf**", "1,260 lbf", "540 lbf"],
  },
  {
    label: "Bending strength",
    note: "(MOR)",
    cells: ["109 MPa", "**114.5 MPa**", "69.7 MPa"],
  },
  {
    label: "Stiffness",
    note: "(MOE)",
    cells: ["12.62 GPa", "**13.86 GPa**", "10.90 GPa"],
  },
  {
    label: "Pore structure",
    cells: [
      "**Diffuse-porous, fine even texture**",
      "Diffuse-porous, medium pores",
      "Diffuse-porous, soft and open",
    ],
  },
];

export const MAPLE_NOTE =
  "**Read that table honestly and maple loses two of the four rows.** Yellow birch is stiffer and stronger in bending on paper, and it does get used in decks. If stiffness were the whole story we would all be riding birch. It isn’t, and the reasons maple wins are the two properties a spec sheet is worst at showing.";

export const MAPLE_PROSE: { title: string; text: string }[] = [
  {
    title: "It is harder, and a deck gets hit",
    text: "Maple is about 15% harder than birch on the Janka scale and nearly three times harder than poplar. A deck is a beam that gets jumped on, dropped tail-first onto concrete, and ground along steel. Hardness is what resists the heel dents, the crushed bolt holes and the worn tail that actually finish a board off, and it is why the same species ends up in bowling lanes, gym floors and butcher blocks.",
  },
  {
    title: "It is consistent, and a deck is seven of them",
    text: "Maple is diffuse-porous with a fine, even texture: its pores are spread evenly through the growth ring rather than concentrated in soft early‑wood bands. That means a sheet peeled from one log behaves like a sheet peeled from the next, and it peels clean and uniform in the first place. A deck is seven plies pressed into one part, so a species that varies ply to ply gives you a board that varies board to board. Predictability is worth more than a few percent on a stiffness chart.",
  },
];

export const MAPLE_LABEL_SUB = {
  kicker: "The label",
  title: "What “Canadian maple” is actually telling you",
  intro:
    "It is the most quoted phrase in skateboarding and the least examined. Two parts of it are real and one part is geography.",
};

export const MAPLE_LABEL_CARDS: { title: string; text: string }[] = [
  {
    title: "The species is the real spec",
    text: "“Maple” on its own means very little — the genus includes soft maples that are closer to poplar than to the wood above. What you want named is *hard* maple, hard rock maple or sugar maple. A deck described only as “maple”, with no species and no ply count, is telling you what it is by omission.",
  },
  {
    title: "The climate is the second half",
    text: "Sugar maple growing in a cold northern climate has a short growing season, so it grows slowly and lays down tight, closely spaced growth rings. That is what produces the density and the uniformity in the table — the same species grown fast and warm comes out a different material.",
  },
  {
    title: "What the border actually tells you",
    text: "Sugar maple grows right across the Great Lakes region on both sides of the Canada–US line, and a log does not know which side it stood on. “Canadian maple” is shorthand for cold‑climate hard rock maple, which is worth having. The phrase carries no certification behind it, and nobody should pay extra for the passport.",
  },
];

export const MOISTURE_SUB = {
  kicker: "The spec nobody prints",
  title: "Moisture content, and why maple cares about the weather",
  intro:
    "Wood is **hygroscopic**: it gains and loses water from the air around it, and it changes size when it does. A deck’s moisture content is a running conversation with wherever the board is kept.",
};

export const MOISTURE_PROSE: { title: string; text: string }[] = [
  {
    title: "Before the press",
    text: "Freshly cut veneer is somewhere between 30% and 60% water. It has to come down a long way before it can be glued: plywood standards put the target at **10% or below** for structural panels and **12% or below** in the European standard. Press it wetter than that and the moisture sits between the plies as a barrier the glue cannot bond through, then redistributes afterwards and warps the panel. Dry it too hard and the veneer turns brittle and drinks the glue instead of holding it. This is a step you never see and cannot check, and it is a large part of what separates one press from another.",
  },
  {
    title: "After the press",
    text: "A deck leaves the press at press‑shop moisture and then equilibrates to wherever it lives — which, in most of India, is a great deal wetter. Wood settles at an **equilibrium moisture content** set by the humidity around it, and the relationship curves: below about 55% humidity the movement is small, and past 85% it gets significantly larger. A monsoon parks a deck in that top band for months at a stretch.",
  },
];

export const HUMIDITY_TABLE_COLS: TableCol[] = [
  { name: "30%", sub: "Relative humidity" },
  { name: "50%", sub: "Relative humidity" },
  { name: "65%", sub: "Relative humidity" },
  { name: "80%", sub: "Relative humidity" },
  { name: "90%+", sub: "Relative humidity" },
];

export const HUMIDITY_TABLE_ROWS: TableRow[] = [
  {
    label: "Wood settles at",
    cells: ["~6%", "~9%", "~12%", "~15–16%", { text: "20%+", warn: true }],
  },
  {
    label: "Roughly",
    cells: [
      "An air-conditioned room",
      "A dry, comfortable day",
      "A warm day inland",
      "Humid — much of the coastal year",
      { text: "Monsoon, for months", warn: true },
    ],
  },
];

export const MOISTURE_NOTE =
  "**Around 30% moisture the wood is saturated** — the fibre saturation point. Below it, every change in humidity moves the wood; above it, the plies have swollen as far as they are going to and any further water simply sits in the wood working on the glue line. That is the line a puddle takes a deck across, and it is why the care section is so blunt about water.";

export const MOISTURE_MOVE_PROSE: { title: string; text: string }[] = [
  {
    title: "Maple moves, and unevenly",
    text: "Hard maple shrinks and swells about **4.8% radially and 9.9% tangentially** — 14.7% by volume across its full range. The two numbers being nearly a factor of two apart is the part that matters: the wood moves roughly twice as much in one direction as the other, and uneven movement is what makes a flat laminate want to cup, twist or lift at a corner.",
  },
  {
    title: "Which is what the cross plies are for",
    text: "Turn plies 3 and 5 across the board and each layer’s swelling is restrained by neighbours pulling the other way. The cross‑grain that stops a deck splitting is the same cross‑grain that stops it moving itself apart through a wet season — and it is why a balanced, symmetrical stack matters more here than in a dry climate. A deck that arrives twisted, or twists in its first monsoon, is usually a stack that was not balanced or veneer that went into the press too wet.",
  },
];

// ── Section 4 — #epoxy ────────────────────────────────────────────────────

export const EPOXY_SECTION = {
  kicker: "The glue",
  title: "Why epoxy, and why it matters more here",
  intro:
    "Seven plies means six glue lines. The glue is a structural material rather than an assembly detail, and in Indian heat and monsoon it is the material under the most stress.",
};

export const EPOXY_PROSE: { title: string; text: string }[] = [
  {
    title: "What the glue is actually doing",
    text: "A deck is stiff because seven thin sheets are forced to bend as one thick beam. That only works if the glue lines refuse to shear: the moment one ply can slide against the next, you have seven floppy sheets instead of one board, and the pop goes with it. The same bond is what holds the pressed concave and the kicks in shape against wood that would rather spring flat. Every bit of snap you feel in a tail is the glue lines saying no.",
  },
  {
    title: "The two chemistries",
    text: "**PVA** — ordinary white wood glue — is **thermoplastic**. Its chains are tangled together without being chemically linked, so it softens when it is heated and its bonds creep under sustained load. **Epoxy** is a **thermoset**: two parts react into a chemically crosslinked network that does not soften on reheating and is waterproof and inert once cured. That difference is chemistry, and it holds for the best PVA ever made.",
  },
];

export const EPOXY_TABLE_COLS: TableCol[] = [
  { name: "PVA", sub: "Standard white wood glue" },
  { name: "Cross-linked PVA", sub: "The “waterproof” upgrade" },
  { name: "Epoxy", sub: "What we press with" },
];

export const EPOXY_TABLE_ROWS: TableRow[] = [
  { label: "Type", cells: ["Thermoplastic", "Thermoplastic", "**Thermoset**"] },
  {
    label: "Softens with heat",
    cells: [
      { text: "Yes", warn: true },
      { text: "Yes — waterproofing doesn’t change this", warn: true },
      "No, once cured",
    ],
  },
  {
    label: "Creep under load",
    cells: [
      { text: "Bonds creep over time", warn: true },
      { text: "Bonds creep over time", warn: true },
      "Holds under sustained stress",
    ],
  },
  {
    label: "Water",
    cells: [
      { text: "Minimal resistance", warn: true },
      "Water-resistant to waterproof",
      "Waterproof and inert",
    ],
  },
  {
    label: "Gap filling",
    cells: [
      "Poor — wants a perfect fit",
      "Poor",
      "Good — tolerates real veneer",
    ],
  },
  {
    label: "Cost and process",
    cells: [
      "Cheapest, fastest",
      "Cheap",
      { text: "Dearer, mixed to ratio, longer in the press", warn: true },
    ],
  },
];

export const EPOXY_LOCAL_SUB = {
  kicker: "Local conditions",
  title: "Why this is a bigger deal in India than in California",
  intro:
    "Every argument above is true everywhere. What changes here is how often a board meets the conditions that expose it.",
};

export const EPOXY_LOCAL_DEFS: { term: string; note: string; def: string }[] = [
  {
    term: "Heat",
    note: "The one people underestimate",
    def: "Most of the country runs past 40°C for months, and the air temperature is the least of it — a board in a closed car, a bag on a scooter, or lying graphic-down on tar in the sun gets far hotter than the day does. A thermoplastic glue line spends that time softened, and a softened glue line under the sustained load of a pressed curve is a glue line slowly giving up the curve. This is how a board can lose its concave and its pop while the wood still looks new.",
  },
  {
    term: "Monsoon humidity",
    note: "Months of drying",
    def: "Wet air alone doesn’t destroy a deck, but it keeps the plies swollen and the glue lines worked for most of a season, and it turns one ride through a puddle from a bad day into the start of delamination. A waterproof bond is the difference between a board that dries out and a board that comes apart at the nose.",
  },
  {
    term: "Coastal air",
    note: "Chennai, Mumbai, Goa, Vizag",
    def: "Salt air is corrosive to your bearings and hardware long before it bothers the deck, but it comes with permanently high humidity, so the point above applies year-round rather than seasonally. If you skate near the sea, the glue line and the bearings are the two things worth paying attention to.",
  },
];

export const EPOXY_NOTE =
  "**What epoxy is not.** It seals nothing: the wood underneath is still wood. Ride through standing water often enough and an epoxy‑pressed deck still dies; it just dies of plies swelling rather than of the bond letting go. Epoxy also costs more, has to be mixed to a ratio, and needs longer in the press, which is why it pairs naturally with cold pressing rather than a fast hot cycle. It buys you a deck that keeps its shape through a hot, wet year. It does not buy you an excuse to leave it in the rain.";

export const EPOXY_CROSSLINK = {
  text: "The rest of what shortens a deck’s life here — water, heat, storage, and how you stop — is in the care section.",
  cta: "Read the care section →",
  href: "#care",
};

// ── Section 5 — #concave ──────────────────────────────────────────────────

export const CONCAVE_SECTION = {
  kicker: "Cross-section",
  title: "What concave is actually doing",
  intro:
    "Concave is the curve pressed across the width of the deck. Described in words it sounds like comfort. Drawn in cross‑section it is obviously a lever.",
  hint: "Four profiles, same board, same rail width.",
  svgLabel:
    "Four concave profiles drawn as cross-sections of the same deck, side by side: mellow is the shallowest dish, then mellow-medium, then medium, with deep the steepest",
  svgCaption:
    "RAIL TO RAIL, SHALLOWEST TO STEEPEST — DEPTH EXAGGERATED TO READ",
  figCaption:
    "Each one is the same 8″ board cut across its middle, with the rails level and the shaded area showing how much dish sits between them. The rails end up higher than the middle, so the edge of the board meets the side of your foot — and that contact is what a flip trick is levered off. A flatter board gives your foot more area to stand on and less edge to push against; a deeper one reverses the trade. The Mellow–Medium lands exactly where the drawing puts it, between the two we build today, and is not out yet.",
};

export const CONCAVE_TOGGLES = [
  { id: "all", label: "Compare" },
  { id: "Mel", label: "Mellow" },
  { id: "MM", label: "Mellow–Med" },
  { id: "Med", label: "Medium" },
  { id: "Deep", label: "Deep" },
] as const;

export const CONCAVE_PROSE: { title: string; text: string }[] = [
  {
    title: "Why it decides more than comfort",
    text: "Concave and width interact. A wide deck with deep concave has a long way from rail to rail, so the dish is a shallow arc over that distance and the edges feel far from your feet. The same concave on a narrow deck feels much steeper. This is why a 7.5″ in medium and an 8.5″ in medium do not feel like the same board, and why riders moving up a width often want to move down a concave at the same time.",
  },
  {
    title: "How to tell what you’re on",
    text: "Stand the deck on a flat floor on one rail. The gap under the other rail is the concave, and you can see the difference between two boards in a second. Do the same across the nose and tail — many decks have more concave through the middle and flatten out at the ends, which is deliberate and is why your foot feels different on the tail than it does between the trucks.",
  },
];

export const CONCAVE_NOTE =
  "**Sphere pro decks come in both Mellow and Medium, in every width.** Mellow covers far more than beginners — it is what every beginner complete ships with, and it is equally a pro deck option for riders who want a flatter board. Medium is the one you can only get on a pro deck or pro complete. A **Mellow–Medium** is coming and sits exactly where the drawing puts it — a shallower dish than Medium, a deeper one than Mellow. It is aimed at riders who find Mellow too flat to flick off and Medium too much to stand on for an hour, and at anyone who doesn’t yet know which camp they are in. **Deep** concave decks are made and widely sold by other brands — we just don’t stock one, and if Medium already feels like a lot underfoot, deep will feel like more rather than better.";

// ── Section 6 — #finish ───────────────────────────────────────────────────

export const FINISH_SECTION = {
  kicker: "Finish",
  title: "Stain, graphic, and what wears off",
  intro:
    "Two things sit on the outside of a deck. One of them is only skin deep, and the other one goes right through the wood.",
};

export const FINISH_PROSE: { title: string; text: string }[] = [
  {
    title: "The stain is in the wood",
    text: "Veneers are dyed before they are pressed, so the colour is part of the ply rather than a coat on top. That is what the numbers on a spec sheet mean: **1‑4‑7** is a stack where the top ply, the core and the bottom ply carry dye; **1‑2‑4‑7** adds the second ply. The result is the coloured stripes you see in the cut edge of the board, and it doesn’t wear off — it is still there when the graphic is long gone. Because veneers are dyed in batches, two decks of the same model can arrive different colours, which is why the listing says the stain may not match the photo.",
  },
  {
    title: "The graphic is a consumable",
    text: "The artwork is printed or heat‑transferred onto the bottom ply and sits under a thin clear coat. Every time you slide the board along a ledge, a rail or a kerb you take some of it off, and a deck that is skated properly will lose its graphic long before it loses its pop. Nothing about the graphic changes how a deck rides or how long it lasts. Buy the one you like looking at, and accept that you are going to destroy it.",
  },
];

// ── Section 7 — #wear ─────────────────────────────────────────────────────

export const WEAR_SECTION = {
  kicker: "Diagnosis",
  title: "How a deck dies",
  intro:
    "Four failure modes and one slow decline. Pick what your board is doing and you’ll get what it is, whether it is finished, and what to do next.",
};

export interface WearSymptom {
  t: string;
  n: string;
  fatal: boolean;
  verdict: string;
  what: string;
  cause: string;
  spec: [string, string][];
}

export const WEAR: WearSymptom[] = [
  {
    t: "The tail is worn to a blade",
    n: "Razor tail",
    fatal: true,
    verdict: "Replace it soon",
    what: "The tail has been ground down at an angle until the end is thin enough to flex, and the plies are visible as stripes running off the edge. It will chip, then split up the middle of the tail.",
    cause:
      "Dragging the tail on the road to slow down, every single time you stop. It is the most common way a deck dies in a city, and it is entirely self-inflicted.",
    spec: [
      ["Warning sign", "Pop goes dull before it splits"],
      ["Caused by", "Dragging to brake"],
      ["Prevent", "Foot brake instead"],
      ["Rideable now", "Yes, briefly"],
    ],
  },
  {
    t: "Fine cracks near the bolts",
    n: "Pressure cracks",
    fatal: false,
    verdict: "Watch it",
    what: "Hairline cracks running across the top of the board near the truck bolts, sometimes with the grip slightly raised over them. The board is still in one piece but it has started to hinge there.",
    cause:
      "Landing hard between the trucks, repeatedly. The deck flexes, the top ply goes into tension, and the fibres give at the stiffest point — which is right where the baseplate holds the board rigid.",
    spec: [
      ["What it means", "The deck is softening"],
      ["Timeline", "Weeks to months"],
      ["Accelerated by", "Loose hardware"],
      ["Rideable now", "Yes"],
    ],
  },
  {
    t: "The layers are separating",
    n: "Delamination",
    fatal: true,
    verdict: "It is finished",
    what: "Plies coming apart along the edge, usually at the nose or tail, sometimes with a visible gap you can get a fingernail into. The board may still feel fine underfoot for a while, and then it won’t.",
    cause:
      "Water, nearly always. Moisture gets between the plies through a chip or the end grain, swells the wood and breaks the glue line. A dropped board can start it mechanically, but wet is the usual culprit.",
    spec: [
      ["Usual cause", "Riding through water"],
      ["Can it be glued", "Not durably"],
      ["Prevent", "Never ride wet, dry it fully"],
      ["Rideable now", "Not safely"],
    ],
  },
  {
    t: "It snapped",
    n: "A clean break",
    fatal: true,
    verdict: "It is finished",
    what: "A break straight across the board, almost always just in front of or behind a truck, or through the nose or tail. Sometimes it goes in one piece with a crack; sometimes it comes apart entirely.",
    cause:
      "A single bad landing — usually a foot landing between the trucks with the board unsupported, or a drop that exceeded what a 7-ply can take. It is bad luck plus accumulated fatigue.",
    spec: [
      ["Where", "Just past a truck"],
      ["Warning", "Often none"],
      ["Parts to save", "Trucks, wheels, bearings, bolts"],
      ["Rideable now", "No"],
    ],
  },
  {
    t: "It just feels dead",
    n: "Loss of pop",
    fatal: true,
    verdict: "Time for a new one",
    what: "Nothing looks wrong. The board simply doesn't respond — the tail feels dull when you snap it, ollies come out lower for no reason you can name, and the deck feels soft and slow underfoot.",
    cause:
      "Thousands of small flexes. Every landing works the glue lines and the fibres a fraction, and the stack slowly stops springing back. This is the normal end of a deck's life and it arrives gradually enough that most riders only notice it after riding a new board.",
    spec: [
      ["The test", "Press the tail, feel for spring"],
      ["Reversible", "No"],
      ["Speeds it up", "Heat, damp, water"],
      ["Rideable now", "Yes, it just won't pop"],
    ],
  },
];

// ── Section 8 — #care ─────────────────────────────────────────────────────

export const CARE_SECTION = {
  kicker: "Upkeep",
  title: "Getting more life out of it",
  intro:
    "You cannot stop a deck wearing out — that is what skating it means. You can stop it dying early, and almost all of that is about water and about how you stop.",
};

export const CARE_DEFS: { term: string; note: string; def: string }[] = [
  {
    term: "Never ride through water",
    note: "The big one",
    def: "Water is the single thing that kills a deck before its time. It gets in through the edge, through the bolt holes and through any chip in the finish, swells the plies and softens the glue line between them. A board that has been ridden through one good puddle can lose its pop within a week and will start to separate along the edge soon after. If it does get wet, stand it on end indoors and let it dry fully before skating it again.",
  },
  {
    term: "Learn to foot brake",
    note: "Saves the tail",
    def: "Dragging the tail to slow down is the fastest way to wear a board into a blade. Putting your back foot down on the road instead costs a pair of shoes over a season and buys you months of deck. If you must drag, drag on the very tip rather than scraping the whole tail along.",
  },
  {
    term: "Keep the bolts snug",
    note: "Two minutes, every few sessions",
    def: "Loose hardware lets the baseplate move a fraction on every landing, and that movement works the bolt holes oval and starts pressure cracks around them. Check all eight with a T‑tool every couple of sessions. Snug is the target — overtightening dishes the top ply around the bolt head and does its own damage.",
  },
  {
    term: "Store it flat and dry",
    note: "Not in the boot of a car",
    def: "Heat and humidity both work on the glue. A board left in a hot car or against a damp wall for a month comes back softer than it went in. Indoors, upright against a wall, out of the sun.",
  },
  {
    term: "Rotate it if you can",
    note: "For the two-deck rider",
    def: "A deck recovers a little of its stiffness resting between sessions. Riders who keep two boards and alternate get noticeably more total life out of the pair than out of two boards ridden to death one after the other. This is a nice-to-have.",
  },
];

export const CARE_SUB = {
  kicker: "Changing decks",
  title: "Moving your setup onto a new one",
  intro:
    "Everything except the griptape transfers. The whole job is one T‑tool and about fifteen minutes.",
};

export const CARE_PROSE: { title: string; text: string }[] = [
  {
    title: "What comes across",
    text: "Trucks, wheels, bearings and the eight bolts all move to the new deck unchanged — popsicle decks share one mounting pattern, so anything that fitted the old board fits the new one. The exception is an old‑school shaped deck, some of which use a wider vintage pattern that modern baseplates will not line up with. Check before you buy if you are going that way.",
  },
  {
    title: "What doesn’t",
    text: "Griptape. It cannot come off one deck and go onto another in usable condition, so a new deck needs a new sheet — budget for it at the same time. Lay it from the nose, press out the air as you go, file the edge with the edge of a file or an old bolt until you see a white line, then cut from underneath along that line.",
  },
];

// ── Section 9 — #range ────────────────────────────────────────────────────

export const RANGE_SECTION = {
  kicker: "The range",
  title: "What we make, and what we carry",
  intro:
    "Sphere decks are made by Toucan Distribution and sold through WeSkate Co. We also stock decks from other brands, which is worth saying out loud on a page like this.",
};

export const RANGE_TABLE_COLS: TableCol[] = [
  { name: "Sphere pro deck", sub: "The main line" },
  { name: "Old school", sub: "Special edition" },
  { name: "Guest brands", sub: "Distributed for us" },
];

export const RANGE_TABLE_ROWS: TableRow[] = [
  {
    label: "Shape",
    cells: [
      "Double kick popsicle — standard, with a **Twin Tail** arriving",
      "Wide body, pointed nose, flat tail",
      "Popsicle",
    ],
  },
  {
    label: "Widths",
    cells: [
      "7″, 7.25″, 7.5″, 7.75″, 8″, 8.125″, 8.25″, 8.5″, 8.875″",
      "One size, in a rounded end or a squared end",
      "Usually 8″ and 8.25″",
    ],
  },
  {
    label: "Concave",
    cells: [
      "Mellow and Medium in every width — Mellow–Medium coming",
      "Old-school profile, no concave option",
      "Whatever that brand presses",
    ],
  },
  {
    label: "Construction",
    cells: [
      "7-ply 100% Canadian maple, cold-pressed with epoxy — plus one carbon-fibre tech deck, 1 ply carbon over 6 of maple",
      "7-ply 100% Canadian maple",
      "7-ply maple, varies by maker",
    ],
  },
  {
    label: "Stain",
    cells: [
      "1-4-7 or 1-2-4-7, colour varies by batch",
      "1-2-4-7, colour varies by batch",
      "Varies",
    ],
  },
  {
    label: "Artwork",
    cells: [
      "Commissioned from artists — LEFT, MIA, Anusha, A-Kill",
      "The same artists, on the old-school silhouette",
      "That brand’s own graphics and pro models",
    ],
  },
  {
    label: "Comes as",
    cells: [
      "Deck only, or built into a pro complete",
      "Deck only",
      "Deck only, or a complete",
    ],
  },
];

export const RANGE_NOTE_1 =
  "**Two edges of the range worth knowing.** The **Twin Tail** shape is coming and is not in the store yet. The **carbon‑fibre tech deck** — one ply of carbon with six of maple, in 7.75″ and 8″ — is a one‑off we are unlikely to restock, so treat it as something to catch rather than something to plan a setup around.";

export const RANGE_NOTE_2 =
  "**Beginner completes are a different deck.** They ship in 7.75″, 8″ and 8.25″ in Mellow only, gripped with 80AB. If you want a specific width outside those three, or Medium concave, you are looking at a pro deck or a pro complete.";

export const RANGE_CROSSLINK = {
  text: "Building a setup around a deck rather than buying one assembled? The configurator only shows parts that fit each other, so the choices left are the ones that change how the board rides.",
  cta: "Open the configurator →",
  href: "/configurator",
};

// ── Section 10 — #faq ─────────────────────────────────────────────────────

export const FAQ_SECTION = {
  kicker: "Common questions",
  title: "Straight answers",
  intro:
    "True for any deck from any brand. What we happen to stock is at the end of each one.",
};

export const DECK_FAQ: GuideFaqItem[] = [
  {
    q: "Is an expensive deck actually better than a cheap one?",
    a: "Up to a point, and then no. Below a certain price the compromises are real and you can feel them: fewer plies, lower-grade veneer with knots and voids in it, cheaper glue, a hot press run fast, and a concave that flattens out within weeks. That board goes soft early and the pop disappears.\n\nAbove that floor, most decks are made in a handful of factories from the same Canadian maple to similar specifications, and what you are paying extra for is the brand, the artist, the pro model and the rider it supports. The life of the board comes out much the same. A mid-priced blank from a good press and a famous pro model from the same press will often last you the same number of sessions.\n\nThe things worth paying for are **7-ply hard-rock maple** rather than a mixed or softwood stack, a **press you can name**, and a shape that suits what you skate. Everything past that is taste.",
    stock:
      "7-ply 100% Canadian maple decks, cold-pressed with epoxy, across nine widths and two concaves — plus decks from Girl and Disorder for riders who want a particular pro model.",
  },
  {
    q: "Is 8-ply or a carbon-reinforced deck an upgrade?",
    a: "It is a different trade at the same tier. An extra ply, or a layer of carbon, fibreglass or resin-impregnated veneer, makes a board stiffer and slower to lose its pop. It also makes it heavier, harder to flick, and considerably more expensive, and when it does finally break it tends to go all at once rather than warning you.\n\nThe riders who benefit are heavy riders, people landing big drops, and anyone skating transition all day where flick matters less than a board that stays stiff. For street skating, most riders are better off with a standard 7-ply and replacing it when it dies — you spend the same money and ride a lighter board the whole time.\n\nBe sceptical of reinforcement claims that don’t say where the material is. A layer between plies 3 and 4 does something; a sticker does not.",
    stock:
      "Standard 7-ply maple across the range, and one exception: a carbon-fibre tech deck, one ply of carbon with six of maple, in 7.75″ and 8″. It is the last of a run rather than a direction — we are unlikely to restock it.",
  },
  {
    q: "Will my old trucks fit a new deck?",
    a: "Almost certainly. Modern popsicle decks share one mounting pattern — eight holes, two clusters of four, the same spacing on every brand — so trucks, bolts, wheels and bearings all move across unchanged. This is the single most useful piece of standardisation in skateboarding and it is why a deck is a consumable rather than a whole new setup.\n\nTwo exceptions. **Old-school and reissue shapes** sometimes use a wider vintage pattern that modern baseplates won’t line up with; check the deck listing before you buy. And if you are changing width by a lot — say 7.75″ to 8.5″ — your existing trucks will now be noticeably narrow for the board, which is rideable but not right.",
    stock:
      "Standard-pattern popsicle decks throughout, so anything you own already fits. Our old-school special editions are the shape to check on.",
  },
  {
    q: "How long should a deck last?",
    a: "There is no useful number in months, because it depends entirely on what you do to it. A rider learning to push and turn can get a year out of a board. Someone skating stairs and ledges most days can snap one in a fortnight. The same deck, the same rider, a wetter city — half the life.\n\nWhat to watch is the pop. A deck is finished when you press the tail and it feels dull instead of springing back, or when the nose and tail have worn thin enough that they flex when you stand on them. Both happen gradually, which is why most riders realise the old board was dead only after riding a new one.",
    stock:
      "Decks sold on their own so you can replace just the plank, and grip sold by the sheet to go with it.",
  },
  {
    q: "Does the graphic affect anything?",
    a: "No. Artwork is printed or heat-transferred onto the bottom ply under a thin clear coat, and it has no effect on stiffness, pop, weight or lifespan. It will also be substantially gone within weeks if you skate ledges or rails, because every slide takes some of it off.\n\nWhat does vary is the wood underneath, and that is invisible from the photo. Two decks with the same graphic can come out different colours because veneers are dyed in batches — that is a normal property of stained maple.",
    stock:
      "Artwork commissioned from artists rather than licensed stock, and listings that say the stain colour may not match the photo, because it often won’t.",
  },
  {
    q: "Should I buy a blank deck instead?",
    a: "A blank is the same construction without the graphic, usually cheaper, and for a rider destroying a board a month it is a perfectly rational choice. The wood is what you are riding and a blank from a good press rides like a printed deck from the same press.\n\nThe arguments against are about the rest of skateboarding rather than the board. Graphics are how skate companies pay artists and riders, and a scene with no one buying pro models is a scene with no pro riders in it. Plenty of people split the difference: blanks for the daily beating, a graphic deck when they want one.",
    stock:
      "Graphic decks only — every one carries work by an artist we commissioned.",
  },
];

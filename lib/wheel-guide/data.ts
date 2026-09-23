// ---------------------------------------------------------------------------
// Wheel Guide — data and copy, ported verbatim from the source artifact spec.
// ---------------------------------------------------------------------------

// ── Section 1 — Parts (anatomy) ───────────────────────────────────────────

export interface WheelPart {
  n: number;
  name: string;
  text: string;
  spec: [string, string][];
}

export const WHEEL_PARTS: WheelPart[] = [
  {
    n: 1,
    name: "Riding surface",
    text: "The outer band of urethane, the only part of the wheel that ever touches the ground. It is what wears away over a wheel's life, and when enough of it has gone the wheel is finished — there is nothing underneath it to keep riding on.",
    spec: [
      ["What it is", "Urethane, no coating"],
      ["Wears by", "Abrasion against the road"],
      ["Grit", "Wears it faster than distance does"],
    ],
  },
  {
    n: 2,
    name: "Contact patch",
    text: "The strip of the riding surface actually in contact with the road at any moment — always narrower than the wheel. Everything a wheel does happens here: grip comes from its area, slide comes from how cleanly it breaks away, and wear is concentrated in it. A wider patch grips more and slides less. It is the number nobody prints.",
    spec: [
      ["Typical, street wheel", "About 18–21mm"],
      ["Set by", "Shape"],
      ["Wider", "More grip, more weight"],
      ["Narrower", "Slides more readily"],
    ],
  },
  {
    n: 3,
    name: "Lips",
    text: "The two edges where the riding surface turns into the sidewall. How sharply they are cut decides how the wheel behaves at the moment it stops gripping — a rounded lip eases into a slide and rolls onto a kerb without catching; a squarer one holds on longer and supports the wheel when it is locked into a grind.",
    spec: [
      ["Rounded", "Slides in early and predictably"],
      ["Square", "More grip, more support in a grind"],
      ["First to go", "On a coned wheel"],
    ],
  },
  {
    n: 4,
    name: "Sidewall",
    text: "The face of the wheel, where the graphic and the numbers are printed. Structurally it is just the outside of the urethane body, and cutting material away from it — which is what a conical shape does — is how a maker takes weight out without touching the contact patch.",
    spec: [
      ["Carries", "Diameter, durometer, graphic"],
      ["Cut away", "On conical shapes, to save weight"],
      ["Print wears off", "Normal, means nothing"],
    ],
  },
  {
    n: 5,
    name: "Core",
    text: "A hard plastic centre that some wheels are moulded around. It holds the bearings in place properly, stops the urethane distorting under the axle nut, cuts weight, and lets heat escape. Small skate wheels often do without one; bigger cruiser and surfskate wheels almost always have one, because there is more urethane to keep under control.",
    spec: [
      ["Material", "Hard plastic"],
      ["Jobs", "Bearing location, weight, heat"],
      ["Centre-set", "Wears evenly, can be flipped"],
      ["Ours", "Centre-set on the surfskate wheel"],
    ],
  },
  {
    n: 6,
    name: "Bearing seats",
    text: "The two recesses a bearing presses into, one from each side, with a spacer between them. This is the one dimension that is identical on every skateboard wheel ever made — they all take a 608 bearing — which is why any wheel fits any truck and any bearing fits any wheel.",
    spec: [
      ["Takes", "608 bearings, 8 × 22 × 7mm"],
      ["Per wheel", "Two, plus a spacer"],
      ["Universal", "Yes — every wheel, every brand"],
    ],
  },
  {
    n: 7,
    name: "The urethane",
    text: "The material itself, and the part of a wheel that actually varies between one maker and another. Durometer describes how hard it is; rebound describes how much of your energy it gives back rather than losing as heat. Two wheels at the same hardness with different formulas roll very differently, and only one of those properties is printed on the side.",
    spec: [
      ["Hardness", "Printed — the A or B number"],
      ["Rebound", "Not printed — the real variable"],
      ["Ours", "100A and 82A, both high rebound"],
    ],
  },
];

export const PARTS_INTRO =
  "A wheel looks like one solid object and behaves like several. Cut one through the middle and the parts that decide how it rides are obvious.";

// ── Section 2 — Diameter ──────────────────────────────────────────────────

export interface Diameter {
  id: string;
  size: string;
  category: string;
  text: string;
  spec: [string, string][];
}

export const DIAMETERS: Diameter[] = [
  {
    id: "51",
    size: "51mm",
    category: "Skate wheel",
    text: "The smallest we make, and the lightest. Sits the board lowest and spins up quickest, which is what you want when the board has to come off the ground and rotate. Gives up the most on rough ground — a stone that a 55 rolls over will stop a 51.",
    spec: [
      ["Best for", "Flip tricks, technical street"],
      ["Ride height", "Lowest"],
      ["Riser", "Not needed"],
      ["On bad tar", "Weakest of the four"],
    ],
  },
  {
    id: "52",
    size: "52mm",
    category: "Skate wheel",
    text: "A millimetre up and the most common street size in the world. Almost everything said about 51 applies, with a fraction more roll. If you have no particular reason to choose, this is the safe one.",
    spec: [
      ["Best for", "Street, all-round"],
      ["Ride height", "Low"],
      ["Riser", "Not needed"],
      ["Popularity", "The default size worldwide"],
    ],
  },
  {
    id: "53",
    size: "53mm",
    category: "Skate wheel",
    text: "The middle of the range and the sensible default for skating in India, where the ground is rarely smooth. Enough extra roll to notice on broken tar without materially changing how the board flips.",
    spec: [
      ["Best for", "Street and park on real roads"],
      ["Ride height", "Medium"],
      ["Riser", "Not needed"],
      ["Our pick", "For most riders here"],
    ],
  },
  {
    id: "55",
    size: "55mm",
    category: "Skate wheel",
    text: "The largest skate wheel we make. Holds speed best over bad ground and clears small stones the others catch on, at the cost of weight and height. Worth checking clearance if your trucks are low — this is the size where wheelbite starts to be a question.",
    spec: [
      ["Best for", "Rough ground, transition, cruising"],
      ["Ride height", "Highest of the four"],
      ["Riser", "Check on low trucks"],
      ["Weight", "Heaviest to flip"],
    ],
  },
  {
    id: "66",
    size: "66mm",
    category: "Surfskate wheel",
    text: "A different category of wheel altogether. 66mm at 82A on a 55mm-wide body, made to grip through a hard carve and roll over ground a trick wheel skips across. It is built for carving and travel, and gives up flip tricks to do it.",
    spec: [
      ["Durometer", "82A"],
      ["Width", "55mm overall"],
      ["Core", "Centre-set"],
      ["Fits", "Surfskates and most longboards"],
    ],
  },
];

export const DIAMETER_DEFAULT = "53";

export const DIAMETER_INTRO =
  "Printed first, quoted most, and on a skateboard it is the smaller of the two levers. Drawn to scale, the reason is obvious.";

export const DIAMETER_CAPTION =
  "Every skate wheel we make, and the surfskate wheel, at true relative size on one road line. The whole skateboard range spans 4mm — about the thickness of two coins. That is why durometer is the number that changes how a board feels underfoot, with diameter a long way behind, and why the surfskate sits in a different conversation entirely.";

export const DIAMETER_BLURBS: {
  title: string;
  text: string;
  linkLabel?: string;
  href?: string;
}[] = [
  {
    title: "Bigger rolls, smaller flips",
    text: "A larger wheel carries speed better over broken ground and clears small stones that stop a smaller one dead, because the obstacle is a smaller fraction of the wheel. It also weighs more and sits the board higher, so it takes longer to spin up and the deck comes off the ground more slowly under a flick.",
  },
  {
    title: "The height it adds costs you",
    text: "Every millimetre of diameter is half a millimetre of ride height, and past a point the wheel reaches the deck in a hard turn. Above roughly 54mm on a mid truck you are into riser territory, and a riser means longer bolts. ",
    linkLabel: "The truck guide has the table.",
    href: "/guides/truck-guide",
  },
];

// ── Section 3 — Durometer ─────────────────────────────────────────────────

export const DURO_INTRO =
  "The letter matters as much as the number: a wheel marked 84B is considerably harder than one marked 99A.";

export const DURO_SCALES: { title: string; text: string }[] = [
  {
    title: "The A scale",
    text: "Shore A is the standard hardness scale for urethane, running in practice from about 75A at the soft end to 101A at the hard end. Higher is harder. Almost every skateboard wheel you will ever see is quoted on it, and for most riders it is the only one they need.",
  },
  {
    title: "The B scale, and the trap in it",
    text: "The A scale loses precision at its top end, so some makers quote very hard wheels on Shore B instead, which is offset by 20 points. An 83B is a 103A; an 84B is a 104A. So a wheel marked 84B is harder than anything the A scale can reach. It is the single most misread number in skateboarding, and it catches people out in shops constantly.",
  },
];

export const DURO_BANDS: { range: string; name: string }[] = [
  { range: "78–87A", name: "Soft" },
  { range: "88–95A", name: "Medium" },
  { range: "96–99A", name: "Hard" },
  { range: "100–101A · 83–84B", name: "Very hard" },
];

export const DURO_ROWS: {
  label: string;
  cells: [string, string, string, string];
}[] = [
  {
    label: "On the road",
    cells: [
      "Deforms around grit, quiet, absorbs vibration",
      "Some give, still rolls quickly",
      "Firm, a little chatter on rough tar",
      "Transmits everything the road has",
    ],
  },
  {
    label: "Grip",
    cells: [
      "High — holds a line through a hard carve",
      "Good",
      "Breaks away predictably",
      "Slides readily and repeatably",
    ],
  },
  {
    label: "Flip tricks",
    cells: [
      "Harder — the board sits higher and the wheels grab",
      "Workable",
      "Good",
      "Best",
    ],
  },
  {
    label: "Made for",
    cells: [
      "Cruising, surfskate, rough ground",
      "Cruising with the odd trick",
      "Street and park, all-round",
      "Street, park, smooth concrete",
    ],
  },
  {
    label: "Ours",
    cells: ["Surfskate, 82A", "—", "—", "Skate wheels, 100A"],
  },
];

export const DURO_NOTE =
  "Hardness says nothing about quality. Two wheels marked 99A from different makers can behave nothing alike, because the number describes one property of the urethane and not the formula behind it. Rebound — how much energy the urethane returns rather than absorbing as heat — is what separates a fast wheel from a dead one at the same hardness, and there is no number for it on the side of the wheel. 'High rebound' on a listing is a claim you cannot verify from the packaging; the way you actually judge it is that the wheel still rolls well after a season.";

// ── Section 4 — Shape ─────────────────────────────────────────────────────

export const SHAPE_INTRO =
  "Two wheels of the same diameter and the same durometer can ride completely differently, and nothing printed on the side tells you why.";

export const SHAPE_OPENING =
  "Start with the measurement people get wrong. A wheel quoted as 53 × 33mm is 53mm across and 33mm wide overall — that second figure is the whole wheel, sidewall to sidewall. The contact patch, the strip actually touching the road, is much narrower: on a typical street wheel somewhere around 18–21mm of that 33. Grip, slide and wear all happen in the contact patch, and the shape of the wheel is what decides how wide it is and how it behaves at the edges.";

export interface ShapeProfile {
  id: string;
  name: string;
  text: string;
  /** contact patch width as a share of overall width, for the diagrams */
  patch: number;
}

export const SHAPES: ShapeProfile[] = [
  {
    id: "classic",
    name: "Classic",
    text: "The narrowest strip on the road. A rounded profile with a relatively small contact patch. Rolls onto a kerb or a coping at an angle without catching, and breaks into a slide easily. The most common shape and a reasonable default for someone who does a bit of everything.",
    patch: 0.45,
  },
  {
    id: "conical",
    name: "Conical",
    text: "A wider strip, and less urethane to carry. The sidewall is cut away at a straight angle toward the lip, which takes weight out and widens the patch at the same time. More grip, less to hang up on when you are riding transition, lighter under a flip. The shape pool and ramp riders tend to favour.",
    patch: 0.58,
  },
  {
    id: "radial",
    name: "Radial",
    text: "The same wide strip, rounded off instead of cut. A rounded profile carried over a wider patch, with the sidewall scooped in at the waist — the dip you can feel with a thumb on a real wheel. More support when locking into a grind and a little less willingness to slide than a classic cut, which is the trade you want if you are spending your time on ledges and rails rather than sliding.",
    patch: 0.58,
  },
];

export const SHAPE_CAPTION =
  "Each shape is drawn twice, and the contact patch is highlighted in both views. On the left the wheel is square on to its riding surface, so the highlighted band is the strip that actually touches the road — compare the three. On the right the same wheel is cut through the axle: the shaded area is urethane, the solid block is the two bearing seats with the axle passage between them. The bore is identical on all three because every skate wheel in the world takes the same 608 bearing. Proportions follow a 53 × 33mm wheel; the real strip runs about 14–17mm and varies by model and maker.";

export const SHAPE_EXTRA: { title: string; text: string }[] = [
  {
    title: "Wide against slim",
    text: "Independently of the profile, wheels are cut wide or slim. A wide wheel puts more urethane on the road: more grip, more stability, more weight. A slim one has a smaller riding surface, slides more readily and weighs less, which is why technical street riders reach for them. Neither is better — it is a choice between holding on and letting go, and you should know which one you are asking for.",
  },
  {
    title: "Where the core sits",
    text: "Wheels big enough to need a core — cruiser and surfskate sizes — can have it placed in different positions, and it changes the wheel more than the material does. Centre-set puts the core in the middle: the wheel wears evenly and can be flipped to even it out further. Moving the core toward the inside edge trades that even wear for more grip, or for an easier slide, depending which way it goes. Our surfskate wheel is centre-set, which is the choice that lasts longest.",
  },
];

// ── Section 5 — Indian roads ──────────────────────────────────────────────

export const ROADS_INTRO =
  "Most wheel advice is written for smooth American concrete. Very little of India is smooth American concrete, and the standard answer changes when the ground does.";

export const ROAD_TERMS: { term: string; note: string; definition: string }[] =
  [
    {
      term: "Durometer decides it",
      note: "Not diameter",
      definition:
        "The instinct on bad ground is to go bigger. The better lever is softer. A soft wheel deforms around grit and small stones and keeps rolling; a hard wheel of any size hits them and stops or skips. Going from 51mm to 55mm changes very little on broken tar. Going from 100A to the low 80s changes everything — the ride goes quiet, the vibration stops coming up through your feet, and the wheel stops being deflected by every piece of gravel.",
    },
    {
      term: "What softness costs",
      note: "Be honest about it",
      definition:
        "Soft wheels are slower to spin up, they sit the board higher, and they grip when you want to slide, which makes flip tricks and powerslides harder. If you are learning to ollie, a soft setup is working against you. Something real is given up on both sides, and it is why the answer is different for a rider commuting across a city than for someone skating a park.",
    },
    {
      term: "Grit is the wear mechanism",
      note: "Not distance",
      definition:
        "Sand and grit act like a very slow grinding wheel. The same distance on a dusty road costs the urethane far more than it does on smooth concrete, and wheels in a dusty city measurably do not last as long. Nothing to do about it except expect it and rotate them.",
    },
    {
      term: "Wet roads",
      note: "Monsoon",
      definition:
        "Urethane grips far less on wet ground, and wet grit behaves like a lubricant carrying abrasive in it. The bigger problem is downstream: water gets into the bearings through the shields, and a set of bearings ridden wet and left wet is finished in weeks. The wheels will survive the monsoon. The bearings are what you should be worrying about.",
    },
    {
      term: "The recommendation",
      note: "For most riders here",
      definition:
        "If you want to learn tricks, take the hard wheels and accept the rough ride — there is no soft setup that will teach you a kickflip. If you mostly want to get across a city and enjoy it, stop trying to make a trick board do that job, and ride something on soft wheels. Trying to split the difference in the middle of the durometer range usually produces a board that is mediocre at both.",
    },
  ];

export const ROADS_CALLOUT =
  "Going big enough that the wheel might reach the deck? The riser and bolt-length table is in the truck guide.";

// ── Section 6 — Wear (diagnosis) ──────────────────────────────────────────

export const WEAR_INTRO =
  "Five ways, and only one of them is the wheel's fault. Pick what yours are doing.";

export interface Symptom {
  id: string;
  name: string;
  label: string;
  fatal: boolean;
  verdict: string;
  what: string;
  cause: string;
  spec: [string, string][];
}

export const SYMPTOMS: Symptom[] = [
  {
    id: "flat-spots",
    name: "Flat spots",
    label: "One side is flat",
    fatal: true,
    verdict: "Replace the set",
    what: "A flattened section on an otherwise round wheel. You feel it as a thump once per revolution and hear it before you feel it. It gets worse over time, because the flat now takes every impact.",
    cause:
      "Urethane abraded away in one place, almost always by locking the wheels in a slide without them turning. Very hard wheels on very smooth ground are the easiest way to put one in.",
    spec: [
      ["Repairable", "No — the material is gone"],
      ["Prevent", "Keep wheels turning in a slide"],
      ["Replace", "All four"],
      ["Warning", "You will hear it first"],
    ],
  },
  {
    id: "coning",
    name: "Coning",
    label: "They have gone tapered",
    fatal: false,
    verdict: "Rotate them now",
    what: "The inner edge has worn down faster than the outer one, so the wheel is visibly cone-shaped. The wheel no longer sits flat on the road and the lip that is left grips unevenly.",
    cause:
      "Normal uneven wear, left unmanaged. The wheels you lean on hardest and push from wear first, and nothing redistributes that unless you do. This is the most common wheel problem there is and the most preventable.",
    spec: [
      ["Repairable", "Partly — rotating evens it out"],
      ["Prevent", "Rotate diagonally every few weeks"],
      ["If severe", "Replace the set"],
      ["Fault", "Maintenance"],
    ],
  },
  {
    id: "chunking",
    name: "Chunking",
    label: "Chunks are missing",
    fatal: true,
    verdict: "Replace the set",
    what: "Pieces torn out of the riding surface or the lip, leaving ragged holes in the urethane. The wheel becomes noisy and unpredictable, and the damage spreads from the edges of each chunk.",
    cause:
      "Usually impact on a sharp edge — landing hard on a kerb or coping — or urethane that was too hard for the job. It can also mean a poor formula: cheap urethane tears where good urethane abrades.",
    spec: [
      ["Repairable", "No"],
      ["Points to", "Impact, or a bad formula"],
      ["More common on", "Very hard wheels"],
      ["Rideable", "Briefly, badly"],
    ],
  },
  {
    id: "cracking",
    name: "Cracking",
    label: "The urethane is cracked",
    fatal: true,
    verdict: "Stop riding them",
    what: "Fine cracks in the sidewall or around the core, sometimes with the urethane looking dull or chalky. The wheel may still roll normally right up until a section lets go.",
    cause:
      "Age and UV. Urethane hardens and goes brittle over years, and sunlight accelerates it — a board stored on a balcony ages faster than one kept indoors. Old wheels from the back of a shop can arrive like this.",
    spec: [
      ["Repairable", "No"],
      ["Cause", "Age and sunlight"],
      ["Store", "Indoors, out of the sun"],
      ["Rideable", "Not safely"],
    ],
  },
  {
    id: "core-separation",
    name: "Core separation",
    label: "The core is separating",
    fatal: true,
    verdict: "Replace immediately",
    what: "The urethane has come loose from the plastic core, so the outside of the wheel can rotate independently of the bearings. You feel it as a wheel that suddenly slips or judders under load.",
    cause:
      "A bonding failure between the urethane and the core — a manufacturing fault, though heat from long hard slides makes it more likely. Only affects cored wheels, so on skate sizes it is rare.",
    spec: [
      ["Repairable", "No"],
      ["Whose fault", "Usually the maker's"],
      ["Affects", "Cored wheels only"],
      ["Rideable", "No — this one is dangerous"],
    ],
  },
];

export const WEAR_CLOSING =
  "Rotate them, and do it before you need to. Wheels do not wear evenly — the two on the side you push from and the ones you lean on hardest go first. Swapping them diagonally every few weeks, front-left to back-right, spreads that around and buys you a noticeably longer set. It takes five minutes with the same T-tool as everything else, and almost nobody does it.";

// ── Section 7 — Range ─────────────────────────────────────────────────────

export const RANGE_INTRO =
  "Two families, at opposite ends of the durometer scale, because they are doing opposite jobs.";

export const RANGE_COLUMNS = [
  "Skate wheels (Toucan · street and park)",
  "Surfskate wheels (Toucan · carving)",
];

export const RANGE_ROWS: { label: string; cells: [string, string] }[] = [
  { label: "Diameters", cells: ["51 · 52 · 53 · 55 mm", "66 mm"] },
  { label: "Width", cells: ["33 mm overall", "55 mm overall"] },
  { label: "Durometer", cells: ["100A high rebound", "82A high rebound"] },
  {
    label: "Made for",
    cells: [
      "Flip tricks, ledges, parks, predictable slides",
      "Carving and pumping, grip through a hard turn, broken tar",
    ],
  },
  { label: "Core", cells: ["—", "Centre-set"] },
  {
    label: "Fits",
    cells: ["Any standard skateboard", "Surfskates and most longboards"],
  },
];

export const RANGE_BEARINGS =
  "Not included with either — every skate wheel in the world takes two 608 bearings, so anything you already own fits.";

export const RANGE_NOTE =
  "There is nothing in the middle, and that is deliberate. 100A is a trick wheel and 82A is a cruising wheel, and the ground between them mostly produces a board that does neither well. If you want a soft setup for Indian roads, the answer today is the surfskate rather than a medium wheel on a popsicle — cruisers are coming, and that is the product that will fill the space properly.";

export const RANGE_CALLOUT =
  "Building a setup rather than replacing a set? The configurator only shows wheels that suit the trucks and deck you picked.";

// ── Section 8 — FAQ ───────────────────────────────────────────────────────

export interface WheelFaqItem {
  q: string;
  a: string;
  stock: string;
}

export const WHEEL_FAQ: WheelFaqItem[] = [
  {
    q: "Are expensive wheels actually faster?",
    a: "Sometimes, and not for the reason on the packaging. Two wheels at the same durometer can return very different amounts of the energy you put into them — that property is rebound, and it comes from the urethane formula rather than the hardness number. A high-rebound wheel rolls further for the same push and keeps doing it after months of use. A cheap one feels fine new and goes dead.\n\nWhat you cannot do is read that off a listing. Every wheel on the market claims high rebound. The real test is a season: if a set still rolls like it did when you bought it, the formula was good. If they went slow and started flat-spotting, it wasn't, whatever the number said.\n\nBearings get blamed for most of this and deserve very little of it. A dead wheel feels exactly like a dirty bearing, and swapping bearings into a dead wheel proves it.",
    stock:
      "100A high-rebound skate wheels in four diameters, and an 82A high-rebound surfskate wheel.",
  },
  {
    q: "Which wheels for a beginner?",
    a: "Harder than feels intuitive. The instinct is that a softer wheel will be more forgiving, and for the ride itself it is — but a beginner is mostly learning to push, turn, stop and eventually pop the board, and soft wheels grip when you need them to let go, sit the board higher and make every one of those harder.\n\nDiameter matters less than people think at this stage. Anything from about 51 to 54mm is fine; the smaller end is a fraction lighter and lower, the bigger end rolls a little better over bad ground. Do not spend the decision here.\n\nThe exception is a rider who has no intention of learning tricks and just wants to travel. That person should be on soft wheels, and probably not on a popsicle at all.",
    stock:
      "Beginner completes ship on 100A wheels. The complete's listing says which diameter.",
  },
  {
    q: "What is 84B, and is it softer than 99A?",
    a: "No — it is considerably harder. Shore B is a second hardness scale used for wheels too hard to measure precisely on the A scale, and it is offset by 20 points: an 83B is a 103A and an 84B is a 104A. Both are past the top of the A scale entirely.\n\nThe reason makers bother is precision. Near 100A the A scale compresses and the differences between one very hard wheel and another stop being readable, so the B scale spreads them out again. It is a manufacturing convenience that ended up on the side of the wheel, and it misleads people every week.",
    stock:
      "Everything we make is quoted on the A scale — 100A skate, 82A surfskate. No B-scale wheels.",
  },
  {
    q: "Can I fix a flat spot?",
    a: "Not really. A flat spot is urethane that has been abraded away in one place, usually by locking the wheels in a slide without rotating them, and the material is gone rather than displaced. You can sometimes take the edges off by riding it out on rough ground, but you are grinding the rest of the wheel down to meet the flat, which costs you most of the wheel to fix a bump.\n\nWhat actually helps is prevention: keep the wheels turning during a slide rather than locking them, rotate the set every few weeks so no single wheel takes every stop, and be wary of very hard wheels on very smooth ground, which is where flat spots are easiest to put in.\n\nIf one wheel of four is flat-spotted, replace the set rather than the wheel. A mismatched diameter is worse than a small flat.",
    stock:
      "Wheels in sets of four, which is the unit that makes sense to replace.",
  },
  {
    q: "Do I need to rotate my wheels?",
    a: "Yes, and hardly anybody does. Wheels wear unevenly by design — your back foot, the side you push from and the direction you turn hardest all mean one or two wheels take more abrasion than the others. Left alone, they cone: the inner edge wears down faster than the outer one until the wheel is visibly tapered and no longer sits flat on the road.\n\nSwapping them diagonally — front-left to back-right, front-right to back-left — every few weeks evens that out and gets you a noticeably longer set for five minutes of work. Take the opportunity to check the axle nuts while you are there.",
    stock:
      "Nothing special needed — the same T-tool that fits the rest of the board.",
  },
  {
    q: "Bigger wheels for rough roads — right or wrong?",
    a: "Half right, and it is the half that helps least. A bigger wheel does roll over a given stone more easily, because the obstacle is a smaller fraction of the wheel's radius. But the range of diameters available on a skateboard is narrow — a few millimetres — and a few millimetres does not transform a broken road.\n\nDurometer is the lever that does. A softer wheel deforms around grit instead of being deflected by it, absorbs the vibration that makes a rough road exhausting, and keeps contact with a surface that a hard wheel skips across. If the road is the problem, go softer before you go bigger.\n\nThe catch is that going softer costs you flip tricks and slides, and going bigger costs you ride height and may need risers. Neither is free, which is why the real answer is usually a second setup rather than a compromise on one.",
    stock:
      "100A for tricks and 82A on the surfskate for bad ground. Cruisers, which are the proper answer to this question, are coming.",
  },
];

// ── Page-level strings ────────────────────────────────────────────────────

export const ANCHOR_NAV: { label: string; href: string }[] = [
  { label: "Parts", href: "#parts" },
  { label: "Diameter", href: "#diameter" },
  { label: "Durometer", href: "#durometer" },
  { label: "Shape", href: "#shape" },
  { label: "Indian roads", href: "#indian-roads" },
  { label: "Wear", href: "#wear" },
  { label: "Range", href: "#range" },
  { label: "FAQ", href: "#faq" },
];

export const HERO_LEDE =
  "Four lumps of urethane, two numbers printed on the side, and more disagreement per gram than any other part of a skateboard. This is what the numbers mean, why the one everybody quotes is the less important of the two, what the shape does that the numbers cannot tell you, and how to choose for roads that were not built for this.";

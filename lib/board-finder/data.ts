// ---------------------------------------------------------------------------
// Board Finder — data, types and recommendation logic.
// Copy ported verbatim from the source artifact spec.
// ---------------------------------------------------------------------------

import type { GuideFaqItem } from "lib/guides/types";
export const SHOP = "https://weskateco.vercel.app";

// Widths we stock, inches
export const STOCK = [7, 7.25, 7.5, 7.75, 8, 8.125, 8.25, 8.5, 8.875] as const;
// Which of the STOCK widths ship as a "beginner complete"
export const BEGINNER = [7.75, 8, 8.25] as const;

/** Convert a `${SHOP}/...` href into an internal route path. */
export function toPath(href: string) {
  return href.startsWith(SHOP) ? href.slice(SHOP.length) : href;
}

// ── Shoe bands ───────────────────────────────────────────────────────────

export interface ShoeBand {
  id: "xs" | "s" | "m" | "l";
  uk: string;
  us: string;
  lo: number;
  hi: number;
  rider: string;
  base: number;
  min: number;
  max: number;
  note: string;
}

export const BANDS: ShoeBand[] = [
  {
    id: "xs",
    uk: "Under UK 4",
    us: "Under US 5",
    lo: 7.0,
    hi: 7.5,
    rider: "Kids & small feet",
    base: 2,
    min: 0,
    max: 3,
    note: "Three widths land here — 7″, 7.25″ and 7.5″. 7″ is the narrowest deck made and the right call for a small child; 7.5″ is where most kids end up. Beginner completes start at 7.75″, so a deck this small comes as a pro complete or a deck build.",
  },
  {
    id: "s",
    uk: "UK 4 – UK 6",
    us: "US 5 – US 7",
    lo: 7.5,
    hi: 7.75,
    rider: "Teens & smaller adults",
    base: 3,
    min: 2,
    max: 4,
    note: "7.5″ and 7.75″ both land here. 7.75″ is also the smallest beginner complete, and the size a growing rider stays on longest.",
  },
  {
    id: "m",
    uk: "UK 6 – UK 9",
    us: "US 7 – US 10",
    lo: 7.75,
    hi: 8.0,
    rider: "Most adults",
    base: 4,
    min: 3,
    max: 6,
    note: "The busiest range we sell, and 8″ is the most common street width in India — it is what most riders here land on and stay on. 7.75″ flips a little quicker if you are light on your feet; 8.125″ exists for riders who find 8″ a fraction short.",
  },
  {
    id: "l",
    uk: "UK 9+",
    us: "US 10+",
    lo: 8.0,
    hi: 8.875,
    rider: "Bigger feet",
    base: 6,
    min: 4,
    max: 7,
    note: "Five widths land in this range. 8.25″ is where most big-footed street riders sit; 8.5″ and 8.875″ are transition and cruising widths, and 8.875″ is the widest we make. Beginner completes stop at 8.25″, so anything above that is pro complete or deck-only.",
  },
];

// ── Quiz ─────────────────────────────────────────────────────────────────

export interface QuizOption {
  value: string;
  title: string;
  description: string;
}

export interface QuizQuestion {
  key: "who" | "shoe" | "goal" | "form";
  title: string;
  hint: string;
  options: QuizOption[] | null;
}

export const QUESTIONS: QuizQuestion[] = [
  {
    key: "who",
    title: "Who is the board for?",
    hint: "This sets how forgiving the setup needs to be.",
    options: [
      {
        value: "kid",
        title: "A child",
        description: "Roughly 12 or under, or just small feet.",
      },
      {
        value: "new",
        title: "A first-timer",
        description: "Teen or adult, never really skated.",
      },
      {
        value: "back",
        title: "Coming back to it",
        description: "Skated years ago, starting again.",
      },
      {
        value: "exp",
        title: "An experienced skater",
        description: "Knows what a good board feels like.",
      },
    ],
  },
  {
    key: "shoe",
    title: "What shoe size?",
    hint: "Feet are the fastest route to the right deck width.",
    options: null,
  },
  {
    key: "goal",
    title: "What do you want to do most?",
    hint: "Pick the one you'd do on a normal day.",
    options: [
      {
        value: "learn",
        title: "Learn to ride",
        description: "Push, turn, stop, get comfortable.",
      },
      {
        value: "street",
        title: "Street & flatground",
        description: "Tricks on level ground, kerbs and ledges.",
      },
      {
        value: "trans",
        title: "Ramps & bowls",
        description: "Curved surfaces at a skatepark, riding for speed.",
      },
      {
        value: "surf",
        title: "Carve & flow",
        description: "Surf-style turning for speed, no tricks.",
      },
    ],
  },
  {
    key: "form",
    title: "Ready to ride, or build it?",
    hint: "Both end up as the same board. One of them arrives assembled.",
    options: [
      {
        value: "complete",
        title: "Assembled",
        description: "Out of the box, grip on, bolts torqued.",
      },
      {
        value: "build",
        title: "I'll build it",
        description: "Deck, trucks, wheels, bearings, my picks.",
      },
    ],
  },
];

// ── Quiz result ──────────────────────────────────────────────────────────

export interface QuizAnswers {
  who: "kid" | "new" | "back" | "exp";
  shoeBandIndex: number;
  goal: "learn" | "street" | "trans" | "surf";
  form: "complete" | "build";
}

export interface QuizResult {
  title: string;
  subtitle: string;
  headline: string;
  tags: { tone: "cyan" | "pink" | "neutral"; label: string }[];
  reasons: string[];
  spec: [string, string][];
  ctaLabel: string;
  ctaHref: string;
}

function goalPhrase(goal: string) {
  return goal === "street"
    ? "street and flatground"
    : goal === "trans"
      ? "ramps and bowls"
      : "learning to ride";
}

export function buildResult(answers: QuizAnswers): QuizResult {
  const band = BANDS[answers.shoeBandIndex]!;
  const { goal, who, form } = answers;

  // ---- Surfskate branch: goal === "surf" ignores shoe size, who, and form entirely ----
  if (goal === "surf") {
    return {
      title: "A surfskate",
      subtitle:
        "You described carving. A surfskate runs a swivelling front truck, so the board turns and pumps from your hips — you can hold a line without putting a foot down.",
      headline: "32″ deck · 66mm wheels",
      tags: [
        { tone: "cyan", label: "Assembled" },
        { tone: "neutral", label: "Front truck pivots 360°" },
      ],
      reasons: [
        "Deck length 32″, wide underfoot, with rocker — a gentle upward curve — through the nose and tail. Shoe size barely matters here; wheelbase does, meaning the distance between the two trucks.",
        "A short wheelbase (around 17″) turns tighter and pumps harder; a longer one (around 19″) is calmer and holds a line at speed.",
        "66 × 55mm wheels at 82A — big, wide and soft, so they roll over broken tar instead of stopping on it and hold their line through a hard carve.",
        "A skateboard truck leans a few degrees. A surfskate front truck swings a full circle, which is why it carves like it does — and why you cannot learn ollies on one.",
      ],
      spec: [
        ["Board type", "Surfskate"],
        ["Deck length", "32″"],
        ["Wheelbase", "~17″ or ~19″"],
        ["Wheels", "66 × 55mm · 82A"],
        ["Front truck", "360° pivot"],
        ["Comes", "Fully assembled"],
      ],
      ctaLabel: "See surfskates →",
      ctaHref: `${SHOP}/store/surfskates`,
    };
  }

  // ---- Everything else derives width/concave/axle/wheels/grip from band + goal ----
  const adj = goal === "trans" ? 2 : 0; // street sits on the band's base width
  const idx = Math.min(band.max, Math.max(band.min, band.base + adj));
  const width = STOCK[idx]!;
  const wStr = `${width}″`;

  const concave = goal === "street" || goal === "trans" ? "Medium" : "Mellow";
  const concaveWhy =
    concave === "Medium"
      ? "Medium concave — a deeper dish that locks your foot against the edge, which is where flick comes from."
      : "Mellow concave — flatter underfoot, more comfortable to stand on and more forgiving while you're still finding your feet.";

  const axle =
    width < 7.5
      ? "4.75″"
      : width < 7.9
        ? "5.0″"
        : width <= 8.25
          ? "5.25″"
          : "5.5″";

  const wheels = goal === "street" ? "51–52mm" : "53–55mm";
  const wheelWhy =
    goal === "street"
      ? "51–52mm sits the board lower and shaves rotating weight, so the deck comes up faster under a flick."
      : "53–55mm holds speed over broken tar and clears small stones that stop a smaller wheel dead.";

  const wantsHeavy = goal === "trans" || goal === "street";
  const grip = wantsHeavy ? "HS780" : "OS780";
  const gripWhy = wantsHeavy
    ? "HS780 — the coarse grade — keeps your back foot where you put it once your shoes and the tape are both hot. It is build-only, so you choose it in the configurator or you don't get it; OS780 is the standard alternative and sold as a sheet."
    : "OS780 — the standard grade. Grippy enough that you're not sliding off, loose enough to shuffle your feet mid-line. 9 × 33 inch, fits any deck up to 9″.";

  let result: QuizResult;

  if (form === "build") {
    result = {
      title: `Build it: ${wStr}, ${concave.toLowerCase()} concave`,
      subtitle:
        "Take this spec into the configurator. It only shows you parts that fit each other, so the choices left are the ones that change how the board rides.",
      headline: `${wStr} · ${concave} · ${axle} hanger`,
      tags: [
        { tone: "pink", label: "You assemble" },
        { tone: "neutral", label: wStr },
        { tone: "neutral", label: `${concave} concave` },
      ],
      reasons: [
        `Deck first: ${wStr}, 7-ply 100% Canadian maple, cold-pressed, double kick. ${concaveWhy}`,
        `Trucks: a ${axle} hanger matches a ${wStr} deck — the hanger (the metal arm carrying the axle) should end level with the deck edge rather than sticking out past it. Hollow axle and kingpin if you want the weight off.`,
        `Wheels: ${wheels}, 100A high rebound. ${wheelWhy}`,
        "Bearings: steel balls in heat-treated races are the sensible starting point. Ceramic balls in stainless races run cooler and cost more.",
        `Grip: ${gripWhy}`,
      ],
      spec: [
        ["Deck width", wStr],
        ["Concave", concave],
        ["Truck hanger", axle],
        ["Wheels", `${wheels} · 100A`],
        ["Grip", grip + (wantsHeavy ? " (build only)" : "")],
        ["Compatibility", "Filtered in the configurator"],
      ],
      ctaLabel: "Open the configurator →",
      ctaHref: `${SHOP}/configurator`,
    };
  } else {
    const isBeg = BEGINNER.includes(width as (typeof BEGINNER)[number]);
    const wantsPro = who === "exp";

    if (isBeg && !wantsPro) {
      result = {
        title: `Beginner complete, ${wStr}`,
        subtitle:
          "Deck, trucks, wheels, bearings, grip and hardware, assembled and torqued — sized so the first month is about riding.",
        headline: `${wStr} · 7-ply maple · assembled`,
        tags: [
          { tone: "cyan", label: "Assembled" },
          { tone: "neutral", label: wStr },
          { tone: "neutral", label: "80AB grip fitted" },
        ],
        reasons: [
          `Your shoe size puts you at ${band.lo}″–${band.hi}″. ${wStr} is the width in that range that suits ${goalPhrase(goal)}.`,
          "7-ply 100% Canadian maple, cold-pressed, double kick popsicle — seven thin layers of maple glued under pressure, with a kick at both ends. The shape 50 years of skateboarding settled on.",
          "Comes gripped with 80AB, the fitted grade. When it dulls you move up to an OS780 or HS780 sheet.",
          wheelWhy,
          "Every part on it is a standard size, so it upgrades one piece at a time rather than being replaced whole.",
        ],
        spec: [
          ["Deck width", wStr],
          ["Available", "7.75″ · 8″ · 8.25″"],
          ["Construction", "7-ply Canadian maple"],
          ["Grip fitted", "80AB"],
          ["Wheels", `${wheels} · 100A`],
          ["Comes", "Assembled"],
        ],
        ctaLabel: "See completes →",
        ctaHref: `${SHOP}/store/skateboard-completes`,
      };
    } else {
      result = {
        title: `Pro complete, ${wStr}`,
        subtitle: isBeg
          ? "You already know what a board should feel like. The pro complete is the same idea with parts you won't immediately want to change — and a concave choice."
          : `${wStr} sits outside the beginner complete's three widths, so the pro complete is the one that comes in your size.`,
        headline: `${wStr} · ${concave} concave`,
        tags: [
          { tone: "pink", label: "Assembled" },
          { tone: "neutral", label: wStr },
          { tone: "neutral", label: `${concave} concave` },
        ],
        reasons: [
          `Nine widths from 7″ to 8.875″ — ${wStr} is yours${isBeg ? "." : ", and beginner completes don't reach it."}`,
          `${concaveWhy} Pro decks come in both Mellow and Medium — beginner completes don't give you the choice — and a Mellow-Medium is coming for riders who find one too flat and the other too deep.`,
          "7-ply 100% Canadian maple, cold-pressed with epoxy, stained 1-4-7 or 1-2-4-7 — the numbers are which plies carry the dye.",
          wheelWhy,
          wantsHeavy
            ? "Grip: if you want HS780's coarse grain you have to build the setup — it isn't sold as a sheet, so it can't be added to a complete afterwards. OS780 is the standard grade and the one you can re-grip with any time."
            : `Grip: ${gripWhy}`,
        ],
        spec: [
          ["Deck width", wStr],
          ["Available", "7″ → 8.875″, nine steps"],
          ["Concave", "Mellow, Medium"],
          ["Construction", "7-ply Canadian maple"],
          ["Wheels", `${wheels} · 100A`],
          ["Comes", "Assembled"],
        ],
        ctaLabel: "See completes →",
        ctaHref: `${SHOP}/store/skateboard-completes`,
      };
    }
  }

  if (who === "kid" || goal === "trans") {
    result.reasons.push(
      "Add a helmet before anything else — non-negotiable for kids and for anything with a transition in it.",
    );
  }

  return result;
}

// ── Anatomy parts ────────────────────────────────────────────────────────

export interface Part {
  n: number;
  view: "top" | "under";
  x: number;
  y: number;
  name: string;
  text: string;
  spec: [string, string][];
}

export const PARTS: Part[] = [
  {
    n: 1,
    view: "top",
    x: 61,
    y: 15,
    name: "Grip tape",
    text: "The black sheet running the whole length of the deck, wrapping over the nose and tail. It is the entire reason an ollie works — the jump where you snap the tail down and the board comes up with you. Without grip, your back foot just slides off the tail instead of dragging the board up. Grain size is the spec that matters — we run three grades, compared in the griptape section below.",
    spec: [
      ["Sheet size", "9″ × 33″"],
      ["Fits", "Any deck up to 9″"],
      ["Abrasive", "Silicon carbide, all three grades"],
      ["Grades", "80AB · OS780 · HS780"],
      ["Replace when", "It stops biting dry shoes"],
    ],
  },
  {
    n: 2,
    view: "top",
    x: 31,
    y: 34,
    name: "Deck",
    text: "Those coloured stripes in the edge are the seven plies of maple, cold-pressed with epoxy into a double kick popsicle — the standard modern shape, with an upturned kick at both ends so the board works either way round. The curve rising at the right is the nose kick, the leverage an ollie is levered off. Two numbers describe a deck: width, which follows your feet, and concave — the dish across the board. Mellow is flatter and easier to stand on; Medium digs deeper and gives your flick — the sideways kick that spins the board — something to push against.",
    spec: [
      ["Construction", "7-ply 100% Canadian maple"],
      ["Press", "Cold-pressed, epoxy"],
      ["Shape", "Double kick popsicle"],
      ["Concave", "Mellow, Medium"],
      ["Coming", "Mellow-Medium"],
      ["Not stocked", "Deep"],
      ["Widths", "7″ → 8.875″, nine steps"],
      ["Stain", "1-4-7 or 1-2-4-7 plies"],
    ],
  },
  {
    n: 3,
    view: "under",
    x: 20,
    y: 39,
    name: "Hardware",
    text: "The bolt heads sitting flush in the graphic — four per truck, eight per board, in a pattern every deck and baseplate shares. Unglamorous, and the single most common thing people neglect. One T-tool covers every fastener on the board — a build without one is a board you can't adjust.",
    spec: [
      ["Bolts", "4 per truck, 8 per board"],
      ["Tool", "One T-tool fits all sizes"],
      ["Also fits", "Axle and kingpin nuts"],
      ["Check every", "2–3 sessions"],
    ],
  },
  {
    n: 4,
    view: "under",
    x: 75,
    y: 48,
    name: "Trucks",
    text: "The metal assembly under the deck that holds the wheels and lets the board turn. Lean, and the rubber bushings squash while the hanger — the T-shaped part carrying the axle — tilts on the kingpin, the big bolt through the middle. Match the truck to the deck width so the hanger ends sit level with the deck edge — see the trucks section for the two ways truck size gets quoted. Tighter is more stable, looser turns harder — that adjustment is one nut, and it's free.",
    spec: [
      ["Hanger widths", "5.0″ · 5.25″ · 5.5″"],
      ["Kids hanger", "4.0″ · 4.75″"],
      ["Body", "Aluminium hanger and baseplate"],
      ["Hollow option", "Hollow axle and kingpin"],
      ["5.0″ suits", "7.5″ – 7.9″ decks"],
      ["5.25″ suits", "7.9″ – 8.25″ decks"],
      ["5.5″ suits", "8.25″ and wider"],
    ],
  },
  {
    n: 5,
    view: "under",
    x: 77.5,
    y: 18,
    name: "Wheels",
    text: "Measured two ways: diameter in millimetres, and hardness on the A scale, where a higher number means a harder wheel. Skateboard wheels are 100A high rebound — hard and fast, built to break traction predictably rather than to soak up bumps — so on a skateboard the real choice is diameter: bigger holds speed over broken ground, smaller sits lower and spins up quicker under a flip. Surfskates go the other way entirely, on 66 × 55mm at 82A. The size is printed on the face — the one here reads 53 × 33mm 100A.",
    spec: [
      ["Skate diameters", "51 · 52 · 53 · 55 mm"],
      ["Contact width", "33 mm"],
      ["Skate durometer", "100A high rebound"],
      ["Surfskate wheel", "66 × 55 mm, 82A"],
      ["51–52mm", "Lower, lighter, flip tricks"],
      ["53–55mm", "Speed and clearance on rough tar"],
      ["Rotate", "When one edge wears to a cone"],
    ],
  },
  {
    n: 6,
    view: "under",
    x: 21.8,
    y: 80,
    name: "Bearings",
    text: "Hidden inside the wheel you're pointing at — two per wheel, eight per board, pressed into the middle of the wheel either side of a spacer, the small tube that keeps them square. They decide how far one push carries you. Clean, lubed cheap bearings beat neglected expensive ones every single time — so lube comes before ceramics, and never ride through standing water.",
    spec: [
      ["Per board", "8 (two per wheel)"],
      ["Steel", "Heat-treated steel, high-speed"],
      ["Ceramic", "Ceramic balls, stainless races"],
      ["Pro line", "Black ABEC-9"],
      ["Lube", "Every few weeks"],
    ],
  },
];

export const CAPTIONS: Record<string, string> = {
  top: "The same board edge-on: griptape along the top, the seven-ply stack in the edge, and the nose kick rising at the right.",
  under:
    "Graphic side of a built complete — both trucks bolted through, all four wheels on.",
};

export const HINTS: Record<string, string> = {
  top: "Grip side, in profile",
  under: "Graphic side, built up",
};

// ── Decision helper ──────────────────────────────────────────────────────

export interface RouteQuestion {
  key: "width" | "parts" | "first";
  question: string;
  options: [label: string, scoreDelta: number][];
}

export const ROUTE_QUESTIONS: RouteQuestion[] = [
  {
    key: "width",
    question: "Do you already know the deck width you want?",
    options: [
      ["Yes", 1],
      ["Not yet", 0],
    ],
  },
  {
    key: "parts",
    question:
      "Is there a specific part you want — a truck brand, a wheel size, a bearing?",
    options: [
      ["Yes", 2],
      ["No preference", 0],
    ],
  },
  {
    key: "first",
    question: "Is this your first skateboard?",
    options: [
      ["Yes", -2],
      ["No", 1],
    ],
  },
];

export const DEFAULT_SELECTION = { width: 1, parts: 1, first: 0 };

export function getVerdict(score: number) {
  if (score >= 2) {
    return {
      verdict: "Build it",
      why: "You know what you want, and you want particular parts. The configurator is faster than shopping part by part — it only shows you components that fit together, and it totals the build as you go.",
      ctaLabel: "Open the configurator →",
      ctaHref: `${SHOP}/configurator`,
      altLabel: "Or see completes",
      altHref: `${SHOP}/store/skateboard-completes`,
    };
  }
  if (score <= 0) {
    return {
      verdict: "Buy a complete",
      why: "Nothing here says you need to pick parts. A complete arrives assembled and torqued, with the axle matched to the deck width and the wheels already in. Upgrade it later, one part at a time.",
      ctaLabel: "Shop completes →",
      ctaHref: `${SHOP}/store/skateboard-completes`,
      altLabel: "Or build it anyway",
      altHref: `${SHOP}/configurator`,
    };
  }
  return {
    verdict: "Either works",
    why: "You're on the line. If the fun is in choosing the parts, build it. If the fun is in riding this week, take the complete — it will not hold you back, and nothing about it is locked shut.",
    ctaLabel: "Shop completes →",
    ctaHref: `${SHOP}/store/skateboard-completes`,
    altLabel: "Open the configurator",
    altHref: `${SHOP}/configurator`,
  };
}

// ── Maintenance checklist ────────────────────────────────────────────────

export const CARE_ITEMS: [title: string, detail: string][] = [
  [
    "Check the axle and kingpin nuts",
    "Weekly. A loose axle nut is how a wheel leaves the board.",
  ],
  [
    "Run the T-tool over the eight bolts",
    "Hardware works loose faster than you'd think, especially on a new board.",
  ],
  [
    "Lube the bearings",
    "Every few weeks. Sooner if you've ridden anything damp or dusty.",
  ],
  [
    "Rotate the wheels",
    "Swap them diagonally when one edge starts coning. Doubles their life.",
  ],
  [
    "Clean the grip tape",
    "Grip cleaner or a stiff brush. Do it before you decide the grip is dead.",
  ],
  [
    "Keep it dry",
    "Water kills bearings and swells the ply. Never ride through a puddle.",
  ],
];

export const CARE_STORAGE_KEY = "wsk-care-v1";

// ── FAQ ──────────────────────────────────────────────────────────────────

export const FAQ: GuideFaqItem[] = [
  {
    q: "Is a cheap board from a general sports shop fine to start on?",
    a: "Usually not, and the reasons are specific rather than snobbery. Four things tend to be wrong at once:\n\n**The trucks.** Cast from soft pot metal or part-plastic, with a kingpin done up hard against stiff bushings. The board barely leans, so it won't carve — the rider ends up steering by hopping the nose around instead of turning. That is the single biggest reason a cheap board feels impossible.\n\n**The wheels.** Unmarked, over-hard urethane — or worse, filled plastic. It skates fine on a showroom floor and skids on the first patch of grit, then flat-spots and thumps for the rest of its life.\n\n**The bearings.** Dry, often fitted without spacers, so tightening the axle nut squeezes them out of true. They feel gritty within weeks.\n\n**The deck.** Fewer plies, lower-grade veneer, cheaper glue, and often no real concave or kick. It goes soft fast, and a deck without pop — the springy snap that launches an ollie — can't ollie no matter who's standing on it.\n\nThe result is that learning gets harder, and beginners conclude the problem is them. Three checks in any shop: lean the board hard onto one edge and see if the trucks actually turn; spin a wheel and count how long it rolls; press the tail down and feel whether it springs back or just thuds.",
    stock:
      "Beginner completes in 7.75″, 8″ and 8.25″, assembled and torqued, with maple decks, aluminium trucks and 100A urethane.",
  },
  {
    q: "What size board for a young kid?",
    a: "Width follows the foot. Under a UK 4 / US 5 shoe, 7.25″–7.5″; UK 4–6, 7.5″–7.75″. Around 7″ is the narrowest a real popsicle deck gets made — below that you are into toys with plastic trucks.\n\n**Don't buy big to grow into.** It is the most common mistake and it backfires. A board that is too wide is heavier to swing, harder to lean over, and puts the child's feet outside the sweet spot, so they learn to push the board around rather than turn it. A year on a board that fits beats two on one that doesn't.\n\nTwo things that matter as much as width: the truck should be about as wide as the deck, so the wheels sit under the edges rather than poking out or tucking in; and a shorter wheelbase — the gap between the front and back trucks — turns more easily, which is what a small, light rider needs.",
    stock:
      "Decks and pro completes from 7″ upward, and kids trucks in 4.0″ and 4.75″ hangers. Beginner completes start at 7.75″.",
  },
  {
    q: "Which wheels for Indian roads?",
    a: "Two numbers describe a wheel and both matter on bad tar: **diameter** in millimetres and **durometer** on the A scale.\n\n**Durometer is the one that decides how the road feels.** Around 99–101A is standard street and park — hard, fast on smooth concrete, and predictable when it breaks traction, which is what tricks need. Drop to 78–87A and the urethane deforms around grit and cracks instead of stopping on them; the ride goes quiet and the wheel grips. The cost is that soft wheels feel sluggish on smooth ground and make flip tricks harder, because the board sits higher and the wheels don't slide.\n\n**Diameter is the smaller lever.** Bigger wheels (54–60mm) carry speed better and clear small stones; smaller ones (50–53mm) sit the board lower and spin up faster. On broken tar, going softer helps far more than going bigger.\n\nContact width counts too: a wider wheel spreads the load and rolls over ruts more calmly, while a narrow one slides more willingly.\n\nSo the rule for rough Indian roads: if you need to flip the board, stay hard and take the largest diameter you can fit. If you don't, go soft — it is a different ride entirely.",
    stock:
      "100A skate wheels in 51, 52, 53 and 55mm with a 33mm contact width. The soft option in our range is the surfskate, on 66 × 55mm at 82A.",
  },
  {
    q: "Do bearings really matter?",
    a: "Less than the marketing suggests, and not in the way the numbers imply.\n\n**ABEC ratings measure machining tolerance for industrial high-RPM use.** They say nothing about the steel, the cage, the shields or the lubricant, and a skateboard wheel never spins fast enough for the tolerance to be the limiting factor. Plenty of good skate bearings carry no ABEC number at all.\n\nWhat actually decides how far one push carries you, in order: **whether they're clean and lubricated**; **whether they're fitted with spacers and speed washers**, so tightening the axle nut doesn't side-load the races; and **what the shields are** — rubber shields pop off for cleaning, metal ones mostly don't. A clean, oiled cheap bearing beats a neglected expensive one every single time.\n\n**Ceramic balls** are harder, lighter and rust-proof, so they deform less under load and survive water better. Those are advantages — just small next to the difference between maintained and ignored. Spend on lubricant before you spend on ceramics, and never ride through standing water.",
    stock:
      "Heat-treated steel bearings, a ceramic-ball option with stainless races, and a Black ABEC-9 pro line.",
  },
  {
    q: "Skateboard, surfskate or cruiser?",
    a: "Three different machines that happen to share a silhouette.\n\n**A skateboard** is a symmetrical popsicle, roughly 7″–8.9″ wide, kicked at both ends, on hard wheels and trucks that lean a few degrees. Everything about it is arranged so the board can be popped off the tail, flipped and landed on. It is the only one of the three you can learn tricks on.\n\n**A cruiser** is a shorter, often shaped deck on soft wheels, built for getting somewhere over imperfect ground. Soft urethane and a bit more diameter do most of the work; the deck is usually small enough to carry.\n\n**A surfskate** replaces the front truck. Where a skateboard truck pivots a few degrees on a fixed kingpin, a surfskate's front truck swings through a full circle on its own arm, so the nose can steer independently of the tail. That lets you generate speed by pumping your hips rather than pushing — the closest thing on land to surfing or snowboarding. The deck is longer and wider with rocker through the nose and tail, and the wheels are big and soft, because a carve wants grip rather than release. The rear truck stays conventional, for control.\n\nChoosing is simple: tricks, take a skateboard. Getting places comfortably, a cruiser. Flow and carving without pushing, a surfskate.",
    stock:
      "Skateboards across nine widths, and 32″ surfskates on 66 × 55mm 82A wheels with a spring-loaded 360° pivot front truck. Cruisers are coming.",
  },
  {
    q: "How long does a deck last?",
    a: "Anywhere from a few weeks to a couple of years, and the variable is what you land on rather than how often you ride.\n\nDecks die four ways. **Razor tail** — dragging the tail to stop wears it down to a blade, which kills pop and eventually splits. **Pressure cracks** — fine lines across the top near the bolts, from landing hard between the trucks; the board goes soft before it breaks. **Delamination** — plies separating, almost always because the board got wet. **A clean snap** across the nose or tail, from a bad landing.\n\nThe one accelerator you control is water. Maple is strong in compression and helpless once moisture gets between the plies, so a wet session ages a board faster than a hard one. Stopping with your shoe rather than the tail buys months.\n\nYou'll know it's done when the pop is gone — the board thuds instead of snapping back. At that point the deck is a consumable, and the trucks, wheels and bearings all carry straight over to the next one.",
    stock:
      "7-ply Canadian maple decks, cold-pressed with epoxy, across nine widths and two concaves.",
  },
  {
    q: "Do I need protective gear?",
    a: "A helmet for anything with speed or transition, and for any child, anywhere. Head injuries are the ones you don't walk back from, and no amount of skill prevents the fall that arrives from behind.\n\n**Wrists take the most damage.** Falling on outstretched hands is the commonest way skaters get hurt, and a fractured wrist keeps you off a board for months. Wrist guards with a rigid splint are the cheapest injury prevention in skating.\n\n**Knee pads change how you ride transition**, which is what they are for: with hard-capped pads you can drop to your knees and slide out of a failed trick deliberately, instead of trying to run it out. Elbow pads do the same job for the other end.\n\n**On helmets:** look for ASTM F1492, which is the skate standard and covers repeated impacts, rather than a bike-only certification (CPSC, EN 1078) designed around one crash. Fit matters more than the sticker — level on the head, low on the forehead, no rocking when you shake your head. Replace it after any hard hit, even if it looks fine.",
    stock:
      "Helmets, knee and elbow pads and wrist guards — see the protective gear page.",
  },
  {
    q: "Can I upgrade a complete later?",
    a: "Yes, and more freely than most people expect, because skateboard parts are standardised. Popsicle decks share one 8-bolt mounting pattern; axles are 8mm; every skate bearing is a 608 (8 × 22 × 7mm). So a deck, trucks, wheels and bearings from four different brands bolt together without adapters.\n\nThree compatibility points are worth knowing. **Truck width** should roughly match deck width. **Wheel diameter versus truck height** — large wheels on low trucks will touch the deck in a hard turn, which stops the board dead. Riser pads — thin plastic shims between the truck and the deck — fix it. And **old-school shaped decks** sometimes use a wider, older bolt pattern that modern trucks won't match.\n\nIf you're upgrading piece by piece, the order that gives the most change per rupee is: bearings and wheels first — cheap, and they transform how the board rolls; then trucks, which change how it turns; then the deck, which you were going to replace anyway.",
    stock:
      "Decks, trucks, wheels, bearings, grip and hardware as separate parts, all standard sizes — and a configurator that filters for what fits.",
  },
];

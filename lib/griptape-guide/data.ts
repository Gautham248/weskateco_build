// ---------------------------------------------------------------------------
// Griptape Guide — data and copy, ported verbatim from the spec.
// Cells may carry **bold** markers; warn cells/rows are flagged; `span`
// merges cells across columns.
// ---------------------------------------------------------------------------

// ── Table primitives ──────────────────────────────────────────────────────

export type TableCell =
  | string
  | { text: string; warn?: boolean; span?: number };

export interface TableCol {
  name: string;
  sub: string;
}

export interface TableRow {
  label: string;
  note?: string;
  cells: TableCell[];
  warnRow?: boolean;
}

// ── Hero ──────────────────────────────────────────────────────────────────

export const GRIP_HERO = {
  eyebrow: "Sphere Skateboards · WeSkate Co. · Guide 05",
  titleLead: "The",
  titleAccent: "Griptape",
  lede: "The cheapest part of a skateboard and the only one you actually stand on. Griptape — the sandpaper-like sheet stuck to the top of the deck — decides whether your feet stay where you put them, how the board answers a flick, and how quickly your shoes fall apart. Two things describe a sheet: how big the abrasive grain is, and what that grain is made of. They are independent, almost nobody separates them, and the codes on the label — 80AB, OS780, HS780 — encode one in the number and the other in the letters.",
  ctaPrimary: { label: "Start with grit →", href: "#grit" },
  ctaSecondary: {
    label: "Buying guide",
    href: "/guides/skateboard-buying-guide",
  },
};

export const ANCHOR_NAV: { label: string; href: string }[] = [
  { label: "Layers", href: "#layers" },
  { label: "Grit", href: "#grit" },
  { label: "Grain", href: "#grain" },
  { label: "Grades", href: "#grades" },
  { label: "Apply", href: "#apply" },
  { label: "Conditions", href: "#conditions" },
  { label: "Wear", href: "#wear" },
  { label: "Range", href: "#range" },
  { label: "FAQ", href: "#faq" },
];

// ── Section 1 — #layers ───────────────────────────────────────────────────

export const LAYERS_SECTION = {
  kicker: "Anatomy",
  title: "What a sheet of griptape is",
  intro:
    "Five materials stacked a fraction of a millimetre thick, and each of them is a way the sheet can fail.",
};

export const LAYERS_IMAGE_ALT =
  "Cross-section of a sheet of griptape on a deck: the grain standing proud of the bond, the backing, the adhesive, and the release liner peeling off the wood";

export interface GripLayer {
  n: number;
  name: string;
  text: string;
  spec: [string, string][];
}

export const LAYERS: GripLayer[] = [
  {
    n: 1,
    name: "The grain",
    text: "The abrasive itself — crushed mineral, sorted by size, standing proud of the surface. This is the only part of the sheet that touches your shoe, and how big these particles are and what mineral they are cut from is the whole of what makes one tape different from another.",
    spec: [
      ["Made of", "Silicon carbide, aluminium oxide, or both"],
      ["Sized by", "Grit number — lower is coarser"],
      ["Fails by", "Rounding over until it stops cutting"],
    ],
  },
  {
    n: 2,
    name: "The bond",
    text: "A resin coat that glues the grain to the backing. It has to be deep enough to hold each particle through years of a shoe dragging sideways across it, and shallow enough to leave the sharp tips exposed. Get it wrong in either direction and the sheet is either bald in a month or feels blunt out of the packet.",
    spec: [
      ["What it is", "Cured resin, applied over the grain"],
      ["Too thin", "Grain sheds — bald patches"],
      ["Too thick", "Tips buried — sheet feels dull new"],
    ],
  },
  {
    n: 3,
    name: "The backing",
    text: "The carrier the grain is bonded to, and the layer that decides how the sheet behaves in your hands. It has to be stiff enough to lie flat while you position it and pliable enough to follow the concave and wrap over a kick without creasing. A polymer film does that; paper cracks at the nose.",
    spec: [
      ["Job", "Carries the grain, takes the tension"],
      ["Needs", "Stiff flat, pliable over a curve"],
      ["Fails by", "Tearing through, usually from a bubble"],
    ],
  },
  {
    n: 4,
    name: "The adhesive",
    text: "A pressure-sensitive glue — it bonds by being pressed rather than by drying or curing, which is why how hard you press matters more than how long you wait. It is also heat-sensitive, which cuts both ways: warm it with a hairdryer and the sheet lifts off cleanly, but leave the board in the sun and the same softening works against you. It grabs harder the more contact area it gets, so dust between it and the wood is what most lifted edges are made of.",
    spec: [
      ["Type", "Pressure-sensitive — bonds on contact"],
      ["Wants", "Clean dry wood and firm pressure"],
      ["Heat", "Softens it — how you lift a sheet, and how one creeps"],
    ],
  },
  {
    n: 5,
    name: "The release liner",
    text: "The paper backing you peel off and almost everyone throws away. It is treated so the adhesive lets go of it cleanly, and it is the right thing to press the sheet down through — it spreads the load, protects your palm from the grain, and lets you push hard enough for the adhesive to take.",
    spec: [
      ["What it is", "Release-coated paper"],
      ["Keep it", "It is the pressing pad"],
      ["Also", "Cut offcuts make a good edge sander"],
    ],
  },
];

// ── Section 2 — #grit ─────────────────────────────────────────────────────

export const GRIT_SECTION = {
  kicker: "Grain size",
  title: "Grit — and why a smaller number means rougher",
  intro:
    "Grit counts how many grains fit in a given space, so a low number means few large grains and a high number means many small ones. Low is coarse. It reads backwards to almost everyone the first time — and skateboard grip has one grade that breaks the pattern outright.",
};

export const DEFAULT_GRIT = "80";

export interface Grit {
  label: string;
  tag: string;
  name: string;
  warn?: boolean;
  body: string;
}

export const GRITS: Grit[] = [
  {
    label: "24",
    tag: "Super coarse",
    name: "24 grit",
    warn: true,
    body: "Downhill and freeride longboarding, and nothing else. Grain this size is closer to gravel than sandpaper — it exists so that a rider going quickly enough to need it can stand on a board through a slide without being thrown off. On a street board it is unusable. It will not let you shift a foot at all, and it takes the sole off a shoe in weeks.",
  },
  {
    label: "36",
    tag: "Very coarse",
    name: "36 grit",
    warn: true,
    body: "Still downhill territory. Slightly more civilised than 24 and used for the same reason: grip that does not negotiate, on boards where your feet are meant to stay exactly where they were placed for the whole run. You will see it recommended for heavy transition skating occasionally. That advice comes from people with very specific problems.",
  },
  {
    label: "50",
    tag: "Coarse",
    name: "50 grit",
    body: "The coarse end of what is sensible on anything you are going to move your feet on. Used on longboards and by a minority of transition skaters who want more bite than street tape gives. This is roughly where a coarse skateboard sheet sits in feel, even when it is not sold with a grit number on it.",
  },
  {
    label: "60",
    tag: "Medium",
    name: "60 grit",
    body: "General longboard and dancing tape, and the grade most industrial anti-slip tape is made in. Noticeably rougher than street tape without being aggressive. It is a good illustration that a grit number alone tells you very little — 60 grit in a tough, blunt mineral grips less than 80 in a sharp one.",
  },
  {
    label: "80",
    tag: "Standard",
    name: "80 grit",
    body: "The skateboard number. Street, park, vert and essentially every popsicle board sold anywhere. If a sheet does not say what it is, it is this. Fine enough that you can slide a foot into position without picking it up, coarse enough to hold that foot through a landing. The fact that an entire sport converged on one grade is a reasonably strong argument that it is the right one.",
  },
];

export const GRIT_NOTE =
  "**780 is a grit, and the letters are not.** Every grip tape code is a number and a prefix doing two different jobs. The number is the grain. 60 is coarse, 80 is the street standard, and 780 — despite reading like a very fine paper — is a blend of size 70 and 80 crystals, which our manufacturer calls the most-used grade for pro grip tape. It sits right beside 80 on the scale, which is the opposite of where the number suggests. The letters are the abrasive and the glue, and they are what separate one 780 sheet from another.";

export const GRIT_DEFS: { term: string; note: string; def: string }[] = [
  {
    term: "The number",
    note: "Grain size",
    def: "60, 80, or 780. Lower is coarser, and 780 is the odd one out: a mix of 70 and 80 crystals, which is why it lands beside 80 instead of far above it. Our OS780 and HS780 are both in the 80-grit class — the same grain in both sheets.",
  },
  {
    term: "AB",
    note: "Abrasive",
    def: "The budget grade. Dark black tape, the grade that goes on entry-level completes rather than being sold to people replacing a sheet by choice. 80AB is 80 grit in this grade.",
  },
  {
    term: "S",
    note: "Silicon carbide",
    def: "Straight silicon carbide, the standard good material. 80S is 80 grit in plain silicon carbide.",
  },
  {
    term: "OS",
    note: "Oil glue and crystals",
    def: "The professional-grade combination our standard sheet uses. OS780 and OS60 are the same grade at two different grain sizes.",
  },
  {
    term: "HS",
    note: "High-level silicon carbide",
    def: "The best abrasive in the range and the most expensive to make. HS780 is the same grain as OS780 in a better material — which is the whole of the difference between our two sheets.",
  },
];

export const GRIT_ATTRIBUTION = {
  before: "Naming conventions from ",
  linkText: "2HEX",
  href: "https://www.2hex.com/skateboards-manufacturer/blog/become-a-grip-tape-pro",
  after:
    ", who manufacture grip tape. Codes vary between factories; these are the ones behind the sheets we sell. A factory taking a grip order asks three questions — what grit, what glue, what print — and those three answers are the whole specification.",
};

// ── Section 3 — #grain ────────────────────────────────────────────────────

export const GRAIN_SECTION = {
  kicker: "Grain material",
  title: "What the grain is made of",
  intro:
    "The second variable, and the one nobody prints on the sheet. Two grains of identical size made of different minerals do not grip the same, do not last the same, and do not cost your shoes the same.",
};

export const GRAIN_CARDS: { title: string; tag: string; text: string }[] = [
  {
    title: "Silicon carbide",
    tag: "Sharper",
    text: "The harder and sharper of the two, with angular grains that bite rather than rub. It is also the more brittle: under load the grains microfracture, and each fracture leaves a fresh edge behind. A silicon carbide sheet therefore keeps cutting as it wears — it loses material instead of going smooth. That is why it is the standard for street and park tape, and why it goes through shoes. The grain that holds your foot on a ledge is holding onto your suede with the same enthusiasm.",
  },
  {
    title: "Aluminium oxide",
    tag: "Tougher",
    text: "Less sharp, but the individual grains are tougher and survive longer before breaking. Instead of fracturing into new edges it tends to round over, so the sheet wears evenly and gently and gradually feels less like it is gripping and more like it is just rough. Kinder to shoes, more consistent over its life, and the usual choice where the tape is doing a safety job — stair treads, ramps, walkways. On a skateboard it turns up blended into finer grades.",
  },
];

export const GRAIN_DEFS: { term: string; note: string; def: string }[] = [
  {
    term: "The trade, in one line",
    note: "There is no better grain",
    def: "Silicon carbide gives you more bite and spends itself and your shoes doing it. Aluminium oxide gives you less bite and lasts longer being less useful. Which one is right depends entirely on whether you need the board to hold a foot through a flip trick or simply need to not slip off it.",
  },
  {
    term: "Why sharp beats hard",
    note: "Friability",
    def: "Hardness decides whether a grain can cut. Friability — how readily it breaks — decides whether it goes on cutting. A grain that never breaks eventually polishes smooth and stops working while still physically there, which is why a worn sheet can look perfectly intact and grip like glass.",
  },
  {
    term: "Blends exist",
    note: "As a way of tuning",
    def: "Plenty of tape is made with both minerals in the coating. It is a way of tuning how quickly a sheet gives up its bite. Our budget grade is a blend; both our 780 sheets are silicon carbide, one a higher grade of it than the other.",
  },
  {
    term: "What holds it on",
    note: "The resin bond",
    def: "The grain is glued to the backing with resin, in a coat that has to be thick enough to hold and thin enough to leave the sharp tips proud. Cheap tape gives itself away here: grain that sheds onto your hand the first time you press it down was never properly bonded, and that sheet will go bald in patches.",
  },
];

// ── Section 4 — #grades ───────────────────────────────────────────────────

export const GRADES_SECTION = {
  kicker: "Our three grades",
  title: "80AB, OS780 and HS780",
  intro:
    "Three sheets, and only two grain sizes between them: reading the codes is most of the work.",
};

export const GRADES_TABLE_COLS: TableCol[] = [
  { name: "80AB", sub: "Budget grade" },
  { name: "OS780", sub: "Standard" },
  { name: "HS780", sub: "Best material" },
];

export const GRADES_TABLE_ROWS: TableRow[] = [
  {
    label: "Grain size",
    cells: ["80 grit", "780 — a 70/80 blend", "780 — the same as OS780"],
  },
  {
    label: "Abrasive grade",
    cells: [
      "AB — the budget abrasive",
      "OS — oil glue and crystals, professional grade",
      "HS — high-level silicon carbide, the best in the range",
    ],
  },
  {
    label: "What differs",
    cells: [
      {
        text: "80AB is a step down in both grain and material. OS780 and HS780 differ only in the abrasive — same grain, better mineral.",
        span: 2,
      },
      "Holds its edge longer and bites harder for it",
    ],
  },
  {
    label: "How it feels",
    cells: [
      "Grips without shouting about it. You can shuffle a foot into position rather than having to lift it.",
      "The default. Firm enough that your feet stay put, loose enough to move them mid-line.",
      "Sharper under the same foot, and stays sharper. You place a foot once and it stays there.",
    ],
  },
  {
    label: "Best for",
    cells: [
      "Learning, cruising, anyone who does not want their shoes destroyed in a month",
      "Almost everybody, almost all of the time",
      "Skating in heat, sweaty feet, and anyone who wants no doubt about where their back foot is",
    ],
  },
  {
    label: "Shoe wear",
    cells: ["Slowest of the three", "Normal", "Noticeably faster"],
  },
  {
    label: "Sheet",
    cells: [
      "Pre-cut and applied at the factory",
      "9″ × 33″ — 22.8 × 83.8cm",
      "9″ × 33″ — 22.8 × 83.8cm",
    ],
  },
  {
    label: "How you get it",
    cells: [
      "Fitted to beginner completes. Not sold on its own",
      "Sold as a sheet",
      "Sold as a sheet",
    ],
  },
];

export const GRADES_NOTE =
  "**HS780 has the same grain as OS780.** The 'extra grip' sheet sounds like it should have a bigger one, and both are 780, in the 80-grit class. What HS780 has is a better abrasive: a higher grade of silicon carbide that starts sharper and keeps its edge longer under the same foot. So the choice comes down to how long you want the bite to last and how fast you are willing to go through shoes to have it. Plenty of people who skate very well prefer the standard sheet.";

// ── Section 5 — #apply ────────────────────────────────────────────────────

export const APPLY_SECTION = {
  kicker: "Putting it on",
  title: "Applying a sheet without ruining it",
  intro:
    "Re-gripping is the first repair most skaters do themselves, it takes about ten minutes, and almost every way it goes wrong is decided before the sheet touches the wood.",
};

export const APPLY_TOOLS: { title: string; text: string }[] = [
  {
    title: "A blade",
    text: "A fresh craft or utility blade. A blunt one tears the backing and leaves a ragged edge that starts lifting within a week.",
  },
  {
    title: "A file or screwdriver",
    text: "Anything with a hard straight edge, to score the outline. A flat file is best; a screwdriver shaft works.",
  },
  {
    title: "Something to poke with",
    text: "A nail, a bradawl, a thin screwdriver — for finding the eight bolt holes from underneath.",
  },
  {
    title: "The backing paper",
    text: "Don't throw it away. It is the pad you press through, and it stops your palm shredding.",
  },
];

export interface ApplyStep {
  n: number;
  title: string;
  body: string;
  watch: string;
}

export const APPLY_STEPS: ApplyStep[] = [
  {
    n: 1,
    title: "Clean the deck",
    body: "Wipe the top of the deck and let it dry properly. On a new deck that means getting the dust off; on a re-grip it means getting every scrap of old adhesive off, because the new sheet will bond to residue rather than to wood and lift early. If you are pulling an old sheet, warm it with a hairdryer until the adhesive lets go and peel it back from a corner rather than tearing at it.",
    watch:
      "A deck that feels clean and looks clean can still have a fine film of dust on it. Run a dry cloth over it once more than you think you need to — this is where most lifted edges are created.",
  },
  {
    n: 2,
    title: "Peel and lay it on",
    body: "Take the liner off the whole sheet, hold it by the two long edges so it bows slightly away from you, and bring it down onto the deck from one end rather than dropping it flat. Air escapes ahead of the sheet as it lands instead of getting trapped under it. Get the position right before any of it makes contact. Centre it across the width, and leave a little spare at the nose and tail rather than lining one end up perfectly and running short at the other.",
    watch:
      "On our widest deck there is barely a millimetre and a half of spare width a side. There, line one long edge of the sheet up with one rail and work across, rather than trying to centre it by eye.",
  },
  {
    n: 3,
    title: "Press from the middle out",
    body: "Put the liner you just peeled off back on top, face down, and press through it with the heel of your hand. Start in the middle and work outwards in every direction, so any trapped air is always being driven towards an edge rather than cornered. Then do the nose and the tail again, harder, with your thumb. Those are the parts under the most tension because the sheet is bridging a curve, and they are where a sheet lifts first if the adhesive never fully took.",
    watch:
      "This glue bonds by pressure. Leaving the board overnight does not improve a sheet that was laid on gently — press it properly now or it will lift later.",
  },
  {
    n: 4,
    title: "Score the outline",
    body: "Run something hard down the edge of the deck all the way round, held at roughly forty-five degrees — a flat file is ideal, the shaft of a screwdriver works. You are pressing the sheet into the rail hard enough to abrade a pale line into it. That line is your cutting guide. Go round twice: the first pass finds the shape, the second makes it clear enough to follow with a blade without looking at the deck edge itself.",
    watch:
      "Do the whole perimeter before you pick up the blade. Alternating between scoring and cutting is how people end up with a line that wanders in and out at the nose.",
  },
  {
    n: 5,
    title: "Cut it off",
    body: "With a fresh blade, cut along the scored line with the blade angled slightly under the deck rather than straight down — pointing in towards the wood. That undercuts the edge very slightly, which tucks it in instead of leaving a lip proud of the rail for a shoe to catch. Cut in one continuous stroke where you can, in sections where you cannot, and pull the waste away as you go.",
    watch:
      "A blunt blade tears the backing instead of slicing it, and a torn edge is a frayed edge, which is a lifting edge. If it is dragging rather than cutting, change it — a blade costs nothing next to a sheet.",
  },
  {
    n: 6,
    title: "Sand the edge",
    body: "Take one of the offcut strips you just trimmed away, and run it grain-down along the cut edge of the sheet, all the way round. It knocks off the burr the blade left and slightly rounds the edge over. It takes about thirty seconds and it is the difference between an edge that is still flat in six months and one that starts curling at the nose after a fortnight. Almost nobody does it.",
    watch:
      "Do not skip the nose and tail because they are curved and awkward. Those are exactly the edges that lift.",
  },
  {
    n: 7,
    title: "Find the bolt holes",
    body: "Turn the board over and push something thin through each of the eight holes from underneath — a nail, a bradawl, the tip of a small screwdriver. Working from the bottom means the hole opens in the right place every time, because the wood is guiding you. Then push through once more from the top to clear the edges. Eight holes: four per truck.",
    watch:
      "Do not try to find them from the top by eye, and do not force a bolt through an unpunched sheet — it drags the backing down into the hole and starts a tear that will spread.",
  },
];

// ── Section 6 — #conditions ───────────────────────────────────────────────

export const CONDITIONS_SECTION = {
  kicker: "Heat, dust and monsoon",
  title: "Griptape in Indian conditions",
  intro:
    "Grip is the part of a skateboard most affected by where you skate, and almost every piece of advice written about it was written for somewhere cooler and cleaner than here.",
};

export const CONDITIONS_CARDS: { title: string; sub: string; text: string }[] =
  [
    {
      title: "Heat",
      sub: "Sweat beats fine grain",
      text: "A damp sole and a fine grain is the combination that slips. The moisture fills the space between the grains and your shoe starts riding on a film instead of biting into the sheet. It is the single best argument for the sharpest abrasive you can get, and the reason our HS780 sheet exists. Heat works on the adhesive as well. It is a pressure-sensitive glue and it softens as it warms; a board left in a parked car or lying in the sun gets far hotter than the air around it. Softened adhesive does not fail on its own, but it will happily let an edge that has already started lifting carry on lifting. It is the same property you exploit deliberately when you take an old sheet off with a hairdryer.",
    },
    {
      title: "Dust",
      sub: "Dirt reads as wear",
      text: "Fine dust packs into the gaps between grains until the surface feels smooth. It reads exactly like a dead sheet while the grain underneath is still sharp, just buried. This is the most common reason people re-grip a perfectly good sheet. Tell them apart with a stiff dry brush. If a minute of scrubbing brings the bite back, it was dirt. If the sheet still feels polished under the dust, the grain has rounded over and no amount of cleaning will fix it.",
    },
    {
      title: "Monsoon",
      sub: "The tape survives, the deck doesn't",
      text: "Water does very little to the grain or the backing. What it does is get in at the cut edge and at the bolt holes, and then sit there — the sheet is effectively a lid holding moisture against end grain. Maple swells, the plies start to separate, and the board goes soft long before the grip looks worn. So the rule is about drying. Stand a wet board on its tail so the water runs off, dry it in shade, and get the water out of the bolt holes. A neatly cut edge helps here too: a ragged one is a wick.",
    },
  ];

export const CONDITIONS_CROSSLINK = {
  text: "The water-and-maple half of this is a deck problem, and the deck guide covers what moisture does to a seven-ply once it gets in.",
  cta: "Open the deck guide →",
  href: "/guides/deck-guide",
};

// ── Section 7 — #wear ─────────────────────────────────────────────────────

export const WEAR_SECTION = {
  kicker: "When to re-grip",
  title: "How griptape dies",
  intro:
    "Five ways, and only three of them are the end of the sheet. Knowing which one you are looking at saves you a sheet more often than not.",
};

export interface WearMode {
  name: string;
  status: string;
  fatal: boolean;
  text: string;
}

export const WEAR: WearMode[] = [
  {
    name: "Polished patches",
    status: "Terminal",
    fatal: true,
    text: "Two shiny areas where your feet live — over the front bolts and on the tail. The grain there has rounded off and stopped cutting. It is the normal way a sheet ends its life, it is not repairable, and it is dangerous in exactly the place you need grip most, because the tail patch is where your foot goes to pop.",
  },
  {
    name: "Clogged with dust",
    status: "Cleanable",
    fatal: false,
    text: "Looks like the wear above. The surface is grey rather than shiny, and a stiff brush brings it back. Try the brush before you buy a sheet — on dusty ground this happens several times before the grain itself wears out.",
  },
  {
    name: "Lifting at the nose or tail",
    status: "Fixable early, terminal late",
    fatal: false,
    text: "Always starts at a corner or an edge, almost always because that edge was cut badly or the sheet was pressed down cold onto a dusty deck. Caught in the first millimetre you can press it back and it will usually hold. Once a flap is big enough to catch a shoe, it will keep peeling and take dirt in under itself as it goes.",
  },
  {
    name: "Bald patches",
    status: "Terminal, and a manufacturing fault",
    fatal: true,
    text: "Grain missing in areas while the backing stays intact. That is the resin bond failing: the grain was never properly held on. A sheet that sheds grit onto your palm when you first press it down is going to do this. It is the one failure mode that says you bought bad tape rather than that you skated a lot.",
  },
  {
    name: "Torn through",
    status: "Terminal, locally",
    fatal: true,
    text: "A cut or a tear right through the backing, usually from a hard landing on a sharp edge or from a bubble that finally split. Water gets in and the tear grows. Small ones on a sheet that is otherwise fine can be lived with; anywhere near a bolt hole, re-grip.",
  },
];

export const WEAR_NOTE =
  "**There is no schedule.** A sheet can last a couple of months of daily skating or well over a year of weekends, and the variable that matters most is how much of your skating happens on the same two patches. Slides, ledges and bail marks wear the middle; flatground wears the tail. Re-grip when the tail stops holding your foot. And re-grip before concluding the board is finished: a smoothed sheet makes a deck feel dead, and a great many boards get replaced when what they needed was a sheet of tape.";

// ── Section 8 — #range ────────────────────────────────────────────────────

export const RANGE_SECTION = {
  kicker: "What we stock",
  title: "The range",
  intro:
    "Two sheets of our own, one grade you only get fitted, and a shelf of other people's tape because not everybody wants black.",
};

export const RANGE_PRODUCTS: {
  name: string;
  caption: string;
  handle: string;
  image: string;
  alt: string;
}[] = [
  {
    name: "Sphere Original OS780",
    caption: "Standard grip. 9″ × 33″",
    handle: "skateboard-griptape-sphere",
    image:
      "https://cdn.shopify.com/s/files/1/0702/8106/8696/files/YFZG5139.jpg?v=1747161337",
    alt: "Sphere Original OS780 griptape sheet",
  },
  {
    name: "Sphere Heavy HS780",
    caption: "Extra grip. 9″ × 33″",
    handle: "sphere-heavy-griptape",
    image:
      "https://cdn.shopify.com/s/files/1/0702/8106/8696/files/sphere-heavy-griptape-01-main.jpg?v=1788363224",
    alt: "Sphere Heavy HS780 griptape sheet",
  },
  {
    name: "Wasted Angels × Mon Amour",
    caption: "Printed collaboration on the OS780 base",
    handle: "wasted-angels-x-mon-amour-griptape",
    image:
      "https://cdn.shopify.com/s/files/1/0702/8106/8696/files/Untitleddesign.png?v=1767471592&width=1200",
    alt: "Wasted Angels × Mon Amour printed griptape",
  },
  {
    name: "Shake Junt",
    caption: "Distributed by WeSkate Co.",
    handle: "shake-junt-red-black-grip",
    image:
      "https://cdn.shopify.com/s/files/1/0702/8106/8696/files/LqaVaJDSCMyqmtUPhK-PmAU_0_gps_generated.png?v=1755327980",
    alt: "Shake Junt red and black griptape",
  },
];

export const RANGE_CAPTION =
  "Product photography. Grain size and abrasive are not visible at this scale — the drawings above are where those live.";

export const RANGE_TABLE_COLS: TableCol[] = [
  { name: "Ours (Sphere)", sub: "" },
  { name: "Everything else (Distributed)", sub: "" },
];

export const RANGE_TABLE_ROWS: TableRow[] = [
  {
    label: "Sold as a sheet",
    cells: [
      "OS780 and HS780, both black, both 9″ × 33″ (22.8 × 83.8cm)",
      "Shake Junt, including pro-model sheets. Same 9″ × 33″",
    ],
  },
  {
    label: "Fitted only",
    cells: ["80AB fine, on beginner completes. Not sold separately", "—"],
  },
  {
    label: "Graphic sheets",
    cells: [
      "Printed collaborations on the OS780 base, in runs rather than as a permanent line",
      "Coloured and printed sheets from the brands we carry",
    ],
  },
  {
    label: "Grain",
    cells: [
      "Both sheets are 780 (80-grit class). OS780 is professional-grade, HS780 is the higher grade of silicon carbide",
      "Varies by brand — most street tape is silicon carbide. The Shake Junt sheets feel like an OS780 to us",
    ],
  },
  {
    label: "Fits",
    cells: [
      {
        text: "Any deck up to 9″ wide, which is the whole of our nine-width range — though on the widest deck it is very nearly edge to edge",
        span: 2,
      },
    ],
  },
];

export const RANGE_NOTE_1 =
  "**Names you will see and we don't make.** Mob, Jessup and Grizzly come up constantly in videos and forums, and none of them are stocked here. Treat them as reference points: Mob is the byword for coarse and perforated, Jessup for a gentler classic feel. If a video tells you to use one of them, what it is telling you is roughly where on the coarse-to-fine axis that skater sits.";

export const RANGE_NOTE_2 =
  "**On the imported sheets, since we sell both.** Our read, having used them: the Shake Junt tape feels like an OS780 — same class of grain, same kind of bite, wearing much the same way. That is a judgement made with our feet, and someone who skates more than we do might well separate them. The extra you pay for the import buys the graphic, the pro model and the name on it. The grip comes out the same. Those are fair reasons to buy one, and we stock them for that reason. If what you want is grip, the standard sheet does it.";

export const RANGE_CROSSLINK = {
  text: "Grip is the one part of a build where the choice is about preference rather than sizing. If you are picking the rest of a setup, start with the deck.",
  cta: "Open the configurator →",
  href: "/configurator",
};

// ── Section 9 — #faq ──────────────────────────────────────────────────────

export const FAQ_SECTION = {
  kicker: "Common questions",
  title: "Straight answers",
  intro:
    "True for any griptape from any brand. What we happen to stock is at the end of each one.",
};

export interface GripFaqItem {
  q: string;
  a: string;
  stock: string;
}

export const GRIP_FAQ: GripFaqItem[] = [
  {
    q: "Can I put new grip straight over the old sheet?",
    a: "You can, and it is the most common shortcut in skateboarding, but it costs you something every time. The new sheet is bonding to the old backing rather than to wood, so it holds less well and lifts sooner. You also add thickness, which rounds off the feel of the concave under your feet — two or three layers deep and the board rides differently.\n\nThe right way takes ten more minutes. Warm the old sheet with a hairdryer until the adhesive gives up, peel it from one corner, and take the residue off with a bit of heat and a rag. For the patches that will not shift, nail-polish remover on a cloth softens the glue and lets you scrape it away — work it gently and keep it off the graphic on the underside. A heat gun does the heating faster and will scorch the wood if you are careless, so a hairdryer is the better tool for a first attempt.\n\nOne case where layering is fine: a small patch over a torn area, as a repair, on a board you are going to re-grip properly anyway.",
    stock: "Sheets in standard and coarse, sized to cover any deck we make.",
  },
  {
    q: "How do I clean griptape?",
    a: "Start dry. A stiff brush — a nail brush, a suede brush, an old toothbrush for the corners — and a minute of scrubbing gets most of what is in there out, and on dusty ground that is usually the whole problem. Brush along the board rather than in circles so the dirt travels to the edge instead of moving around.\n\nFor the ground-in stuff there is grip gum: a block of soft rubber that you rub across the sheet, which balls up and lifts dirt out of the grain. A clean pencil eraser does a smaller version of the same job. Neither will recover a sheet whose grain has actually rounded over.\n\nKeep water out of it. A damp cloth over the surface is survivable; soaking the board is not, because the water goes through the bolt holes and the cut edge into the ply and stays there. If the sheet is dirty enough to need washing, it is cheaper to re-grip than to replace a deck.",
    stock: "No cleaning products — a brush you already own does the job.",
  },
  {
    q: "Does griptape really destroy shoes that fast?",
    a: "Yes, and it is the abrasive doing exactly what it is designed to do. The grain that holds your foot in place during an ollie is dragging across the side of your shoe every time you flick, and the ollie itself — dragging the toe up the board — is the single most destructive thing you can do to a shoe. Suede lasts longer than canvas, and a toe cap of any kind lasts longer than neither.\n\nCoarser grain wears shoes faster, so the trade is: the tape that holds your foot best is the tape that costs you most in shoes. A fine grade slows it down, which is why it is the sensible default for someone learning, who is going to be dragging a toe up the board several hundred times a day and is not yet doing anything that needs maximum bite.\n\nWhat does not work is riding on the graphic or leaving a patch ungripped — you lose grip exactly where you need it. Shoe goo on the wear point before it becomes a hole works far better than anything you can do to the board.",
    stock:
      "Our HS780 sheet carries the warning on its own product page. Beginner completes ship on 80AB, the gentlest of the three.",
  },
  {
    q: "My grip is lifting at the nose. What went wrong?",
    a: "Almost always one of three things, and all of them happened during application. The edge was cut with a blunt blade and left ragged, so there was a loose fibre for a shoe to catch. The deck was dusty or oily where the sheet went down, so the adhesive never made full contact. Or the nose and tail — the parts that curve most — were not pressed down hard enough, because a sheet bridging a kick is under tension and wants to spring back.\n\nCaught early, press it back down firmly and it will usually take. A little heat from a hairdryer softens the adhesive and makes that more likely to hold. Once the flap is big enough to get a fingernail under, dirt has been getting in behind it and it is not going to re-bond.\n\nPrevention is in the application: clean deck, sharp blade, and press the kicks down properly with your thumb rather than your palm.",
    stock:
      "Sheets only — a fresh blade from any hardware shop is the other half of the job.",
  },
  {
    q: "Is printed or coloured grip worse than plain black?",
    a: "It depends entirely on how it was printed, and there are three methods with different consequences.\n\nSilk screen lays ink thickly enough that it fills in between the grains, so it measurably costs you grip across whatever it covers. It is fine for a small logo and a bad idea for a full-sheet design. UV printing puts the ink down thin enough that a sheet can be covered completely without the grip suffering, which is why full-coverage graphics are usually UV. Digital printing sidesteps the problem: the design goes on a white backing underneath a transparent abrasive, so it reads as though it is printed on the surface while the grain stays untouched.\n\nSo the process decides it: a silk-screened sheet does lose grip, while a UV or digital one largely keeps it. If a sheet is covered edge to edge in artwork and still bites properly, that tells you which process was used.\n\nDie-cut designs — shapes cut out of the sheet so the deck shows through, in patterns with names of their own like speedstripe, mosaic and barcode — are a separate matter. You lose grip wherever the cut-out is, and the cut edges are extra places for a sheet to start lifting. Both matter most under your back foot.",
    stock:
      "Plain black in both grades, plus printed collaborations and the coloured sheets from the brands we distribute.",
  },
  {
    q: "What is perforated grip, and do I need it?",
    a: "Tape with fine holes punched through the sheet, so that air trapped underneath during application has somewhere to escape instead of forming a bubble. It is an application convenience: it makes no difference to how the sheet grips or how long it lasts.\n\nIt helps most on wide boards and on long sheets, where there is more area for air to get caught under, and it helps a first-timer more than someone who has done it twenty times. If your sheet is not perforated, the technique does the same job: lay it from one end, and press from the centre outwards so the air is always being pushed towards an edge.\n\nA bubble you missed is easily fixed. Prick it at the edge of the bubble with a pin and press the air out towards the hole — poking the middle leaves a visible dimple.",
    stock:
      "We don't currently specify perforation either way on our sheets — assume not and use the technique.",
  },
  {
    q: "Does grip choice actually change how the board rides?",
    a: "Less than deck width and far less than concave, but more than people expect in one specific place: the tail. Everything you do on a skateboard that involves popping starts with a foot finding the tail without looking, and how confidently it locks there is a grip question. That is why people who have skated for years often have strong, seemingly disproportionate opinions about tape.\n\nEverywhere else it can only take away. Grip that is too fine lets your foot creep out of position under load. Grip that is too coarse makes it hard to shift a foot into position at all, which matters more than it sounds if you are still learning where your feet go. Neither makes the board turn, pop or roll differently.\n\nThe practical version: if you never think about your grip, it is correct. It is the only part of a skateboard for which that is a complete test.",
    stock:
      "OS780 as the default and HS780 for people who have decided they want a sharper abrasive that lasts longer.",
  },
];

// ---------------------------------------------------------------------------
// Surfskate Guide — data and copy, ported verbatim from the source spec.
// Cells may carry **bold** / *italic* / [link](href) markers; warn cells and
// the muted `.mut` cells are flagged. Table types are shared across guides
// (lib/guides/types).
//
// Non-breaking spaces (\u00a0) and non-breaking hyphens (\u2011) are kept from
// the source so unit/value pairs and compound words do not wrap.
// ---------------------------------------------------------------------------

import type { GuideFaqItem, TableCol, TableRow } from "lib/guides/types";

// ── Hero ──────────────────────────────────────────────────────────────────

export const SURFSKATE_HERO = {
  eyebrow: "Sphere Skateboards · WeSkate Co. · Guide 07",
  titleLead: "The",
  titleAccent: "Surfskate",
  lede: "One truck on the front of a skateboard turns it into a different machine: the nose gets a steering axis of its own, and you stop pushing and start pumping. This is how that truck works, where the speed comes from when your feet never leave the board, what the numbers on a listing do and do not tell you, and which parts of surfing it will actually teach you.",
  ctaPrimary: { label: "See what we make →", href: "#range" },
  ctaSecondary: {
    label: "Buying guide",
    href: "/guides/skateboard-buying-guide",
  },
};

export const ANCHOR_NAV: { label: string; href: string }[] = [
  { label: "Mechanism", href: "#mech" },
  { label: "Pumping", href: "#pump" },
  { label: "Spring", href: "#spring" },
  { label: "Geometry", href: "#geo" },
  { label: "Wheels", href: "#wheels" },
  { label: "Surfing", href: "#surf" },
  { label: "Range", href: "#range" },
  { label: "FAQ", href: "#faq" },
];

export interface SurfSection {
  kicker: string;
  title: string;
  intro: string;
}

export interface SurfProse {
  title: string;
  text: string;
}

// ── Section 1 — #mech ─────────────────────────────────────────────────────

export const MECH_SECTION: SurfSection = {
  kicker: "Mechanism",
  title: "What the front truck does",
  intro:
    "A standard truck leans on one axis. A surfskate front truck adds a second, and everything else on this page follows from it.",
};

export const MECH_HINT = "Tap a number or a part";

export const MECH_CAPTION =
  "Both plan views have the nose at the top; the side view has the nose to the right. The ghosted axle is the same truck at full swing.";

export interface SurfPart {
  n: number;
  key: "axis" | "arm" | "hanger" | "wheels" | "riser" | "rear";
  title: string;
  body: string;
}

export const SURF_PARTS: SurfPart[] = [
  {
    n: 1,
    key: "axis",
    title: "The second axis",
    body: "A vertical pin, set in the baseplate ahead of the axle and running square to the deck. A standard truck has nothing like it: its hanger can only lean on the kingpin, so the axle stays square to the board no matter what you do. Put a pin here and the axle can point somewhere the deck is not pointing.",
  },
  {
    n: 2,
    key: "arm",
    title: "The swing arm",
    body: "The link between that pin and the axle. Lean the board and the arm swings, carrying the front wheels round with it. Its length sets how far the wheels travel for a given swing, so it does as much to decide the turn as the pivot angle does. It is also the part with a spring or a bushing acting on it.",
  },
  {
    n: 3,
    key: "hanger",
    title: "The hanger and axle",
    body: "Ordinary in itself — the same casting job any truck does, holding an 8\u00a0mm axle and leaning on a kingpin with bushings. What is different is that the whole assembly is hung off the arm rather than bolted to the deck, so it can point where the deck does not.",
  },
  {
    n: 4,
    key: "wheels",
    title: "The front wheels",
    body: "Big and soft, because they are doing the gripping while you load a rail. They also swing inboard as the arm turns, which is why a surfskate sits high: a wheel that travels under the deck needs somewhere to go.",
  },
  {
    n: 5,
    key: "riser",
    title: "The riser",
    body: "A block between the deck and the baseplate, lifting the whole truck away from the wood. On a surfskate it is doing a real job rather than tuning the feel — a 66\u00a0mm wheel on a swinging arm needs the clearance. Ours are 30\u00a0mm of PU.",
  },
  {
    n: 6,
    key: "rear",
    title: "The rear truck",
    body: "A conventional truck, usually run tighter than you would run a skateboard. It is the pivot the board turns around, doing the job a surfboard’s fins do. Loosen it to match the front and the board stops having a stable end to swing against.",
  },
];

export const MECH_PROSE: SurfProse[] = [
  {
    title: "The front steers",
    text: "Lean a surfskate and the nose swings out on its arm while the tail stays close to where it was. The board pivots about the back wheels the way a surfboard pivots about its fins, and the turn is far tighter than the same lean would give you on a skateboard.",
  },
  {
    title: "The rear holds still",
    text: "The back truck is an ordinary truck, usually run tight. That is deliberate. Something has to stay put for the front to swing against, and a surfskate with two loose trucks is a board that goes where it likes.",
  },
  {
    title: "Something pulls it back",
    text: "Left alone the arm would flop. A spring or a urethane bushing holds it at centre and pushes it back there, and which of the two your board uses changes how it rides more than any other single thing. That is the [spring section](#spring).",
  },
];

export const MECH_NOTE =
  "**Front trucks and whole trucks.** Some brands sell the mechanism as an adapter that bolts between your existing truck and the deck, and some sell a complete front truck. Carver, Slide and Curfboard sell trucks; YOW, Smoothstar and Waterborne sell adapters that sit on a reverse\u2011kingpin truck you already own. We do not stock any of them — they are named so the categories have something real attached to them. Ours is a complete truck.";

export const MECH_STOCKED =
  "The **Toucan S6**, sold as a pair: a pivoting front truck and a conventional rear truck with mounting hardware. Bearings and wheels are separate. It is the truck fitted to all three of our surfskate completes.";

// ── Section 2 — #pump ─────────────────────────────────────────────────────

export const PUMP_SECTION: SurfSection = {
  kicker: "Pumping",
  title: "Where the speed comes from",
  intro:
    "A surfskate accelerates on flat ground with both feet on the board. Here is the mechanism, and what it costs you.",
};

export const PUMP_CAPTION =
  "The board is drawn at four points along one stretch of road. The shaded rail is the one carrying your weight.";

export const PUMP_PROSE: SurfProse[] = [
  {
    title: "The short version",
    text: "Turning points the board across the line you are travelling along. Your weight goes into the rail, which is a push at right angles to the board — and because the board is angled, part of that push lands in the direction you want to go.\n\nDo it on one rail, then the other, and each turn adds a little. The board is being levered forward by its own steering, and the energy comes out of your legs rather than out of a push off the tarmac.",
  },
  {
    title: "What it costs",
    text: "Distance. A pumped line is a longer line than a straight one, so you cover less ground per unit of effort than a rider pushing on a cruiser would. Pumping is not a more efficient way to travel.\n\nIt is a more interesting one, and on a surfskate it is the only one that works properly, because the loose front end makes pushing awkward. If your reason for buying a board is getting from A to B, a cruiser will do it with less work.",
  },
];

export const PUMP_NOTE =
  "**Flat ground only goes so far.** Pumping holds a speed and builds it slowly. It does not replace a hill, it does not get you moving from a dead stop without one push, and it stops working the moment you straighten the board out. Anyone selling a surfskate as a device that never needs pushing has left out the first push and every hill they rode down.";

// ── Section 3 — #spring ───────────────────────────────────────────────────

export const SPRING_SECTION: SurfSection = {
  kicker: "Return systems",
  title: "Spring or bushing",
  intro:
    "The single choice that decides how a surfskate feels, and the one most listings are vaguest about.",
};

export const SPRING_CAPTION =
  "Both drawn from above at the same scale, each swung a little off centre with the rest position ghosted.";

export const SPRING_TABLE_COLS: TableCol[] = [
  { name: "Spring", sub: "What we make" },
  { name: "Bushing", sub: "For reference" },
];

export const SPRING_TABLE_ROWS: TableRow[] = [
  {
    label: "What returns it",
    cells: ["A steel coil in compression", "Urethane under twist"],
  },
  {
    label: "Through the turn",
    cells: ["Loose early, then it loads up", "Resistance builds as you lean"],
  },
  {
    label: "Coming back",
    cells: ["A distinct snap", "Settles back progressively"],
  },
  {
    label: "Riding in a straight line",
    cells: [
      { text: "Wanders — it wants to be turning", muted: true },
      "Sits still more willingly",
    ],
  },
  {
    label: "Tuning",
    cells: ["Spring tension, by a bolt", "Swap the bushing for a harder one"],
  },
  {
    label: "Moving parts",
    cells: [{ text: "More — a swivel to service", muted: true }, "Fewer"],
  },
  {
    label: "Weight",
    cells: [{ text: "Heavier", muted: true }, "Lighter"],
  },
  {
    label: "Suits",
    cells: [
      "Surf training, low\u2011speed pumping",
      "A first surfskate, bowls, commuting",
    ],
  },
];

export const SPRING_TABLE_CAPTION =
  "Carver publishes the two archetypes: the spring\u2011returned C7 at 1,225\u00a0g against the bushing\u2011returned CX at 1,134\u00a0g, both on a 25° pivot and a 9″ axle. We do not stock them; they are the clearest published pair to measure the categories against.";

export const SPRING_WATCH = {
  title: "Say this out loud before you buy",
  body: "A spring-loaded surfskate is not the easy first board. It is looser under your front foot, it asks for attention when you are just rolling along, and it will throw a beginner who expects a skateboard. Bushing systems are the gentler introduction. Ours is spring\u2011loaded, and we would rather you knew that than found out in a car park.",
};

export const SPRING_PROSE: SurfProse[] = [
  {
    title: "Tightening the spring",
    text: "Tighter is steadier at speed and duller at walking pace. Looser is surfier and, past a point, a handful. There is no correct setting; there is the setting that matches the speed you actually ride at. Change it a quarter turn at a time and ride between changes.",
  },
  {
    title: "Servicing the swivel",
    text: "A spring pivot is a stack: pivot pin, bush, two thrust bearings and their washers. Strip it once a season, degrease it, grease the bearings and the bush, and put it back. If the washers have gone notchy, replace them; they wear before anything else in the stack does.",
  },
  {
    title: "How tight is the pivot bolt",
    text: "Tight enough that there is no rattle in the pivot, loose enough that the arm swings freely under its own weight. Nobody publishes a torque figure for this and you do not need one; you need to feel for play with the wheels off the ground.",
  },
];

export const SPRING_STOCKED =
  "The **Toucan S6** is a spring\u2011loaded 360° pivot front truck with an adjustable tension system, paired with a conventional rear truck. Its listing says **360° pivot** and **adjustable tension** without saying spring, so a like\u2011for\u2011like comparison with another brand takes a second look.";

// ── Section 4 — #geo ──────────────────────────────────────────────────────

export const GEO_SECTION: SurfSection = {
  kicker: "Geometry",
  title: "Length, wheelbase and rocker",
  intro: "Listings lead on deck length. It is the number that tells you least.",
};

export const GEO_CAPTION =
  "Both boards are 32″. Among 24 surfskates measured at exactly that length, published wheelbases ran from 14.5″ to 22.9″ — an eight\u2011inch spread inside one nominal size.";

export const GEO_PROSE: SurfProse[] = [
  {
    title: "Wheelbase is the number that rides",
    text: "The distance between the two sets of truck bolts is what sets how sharply the board comes round, how much effort a pump takes and how settled it feels at speed. Length only tells you how much nose and tail are hanging off the ends.\n\nShort turns tighter and pumps quicker; long is steadier and needs a longer, slower arc to load up. Neither is better, and a short wheelbase on a spring truck is a busy board.",
  },
  {
    title: "And it still does not decide everything",
    text: "The truck mechanism, the tension you have set, the deck shape, the wheels and your own weight all sit on top of it. Two boards with the same wheelbase and different front trucks are not the same board, which is why a wheelbase chart cannot be read as a ride chart.\n\nUse it the way you would use a shoe size: it narrows the field and it does not tell you how anything fits.",
  },
];

export const GEO_BANDS: SurfProse[] = [
  {
    title: "Under 16″",
    text: "Very short. Turns almost under you, pumps with small inputs, wants your full attention riding straight. Closest to a shortboard.",
  },
  {
    title: "16–17.5″",
    text: "Short. Quick and lively, still manageable. **Both our boards sit here.**",
  },
  {
    title: "17.5–19″",
    text: "The thick of the market. A middle that suits most riders and most uses.",
  },
  {
    title: "19″ and over",
    text: "Long. Drawn-out turns, more stable at speed, more work to get a pump going. Taller riders and longboard-style carving.",
  },
];

export const GEO_BANDS_CAPTION =
  "Bands drawn from 183 published surfskates: median wheelbase 17.6″, middle half between 16.75″ and 20″.";

export const GEO_PROSE_2: SurfProse[] = [
  {
    title: "Rocker",
    text: "The deck curves up toward the nose and tail with the middle sitting lower. It locks your feet in without needing deep concave, and it drops your weight closer to the axles, which counts on a board already sitting high on its riser.",
  },
  {
    title: "Width",
    text: "Surfskate decks run wide — ours are 9.5″ and 10″ against about 8″ for a street deck. You are standing across the board and driving into a rail, so you want the leverage. Nobody is trying to flip it.",
  },
  {
    title: "Outline",
    text: "Fish, squash, round, pin or twin. It changes how much platform your back foot has and how the tail releases out of a turn, and it changes all of that less than the wheelbase does. The five are drawn below.",
  },
];

export const GEO_SUB = {
  title: "Outlines, and what they change",
  intro:
    "Surfskate decks are cut from surfboard outlines, so the vocabulary comes from surfboards. Here is what each word means, measured off real boards rather than drawn from memory.",
};

export const GEO_OUTLINE_COLS: TableCol[] = [
  { name: "What it changes", sub: "" },
  { name: "Boards cut this way", sub: "Ours first where we make one" },
];

export const GEO_OUTLINE_ROWS: TableRow[] = [
  {
    label: "Fish",
    cells: [
      "The notch is the only feature in this table that no other outline has — and it is four\u2011fifths of an inch deep on a 31.5″ board, which is shallower than the name leads you to expect. It takes a bite out of the back foot’s platform and leaves two points to push against.",
      "**Sphere Fishtail 31″** (9.5″ wide, 17″ WB), in blue and yellow. The outline drawn above is YOW’s Pipe 32″ (18.5″ WB). Also Carver CI Fishbeard 29.25″ (15.5″ WB), Carver Swallow 29.5″, Carver Aipa Sting 30.75″, YOW Coxos 31″",
    ],
  },
  {
    label: "Squash",
    cells: [
      "Squared off with the corners rounded, and the default across the market. Plenty of tail area with a defined corner to push against. Carver puts squash tails on the boards it recommends for hard turns and slides.",
      "**Sphere Coral 32″** (10″ wide, 16.5″ WB). The outline drawn above is YOW’s Snapper 32.5″. Also Carver Firefly 30.25″ (16.5″ WB), Carver CI\u00a0Happy 30.75″, Carver Kai\u00a0Lenny Lava 31″ (17″ WB)",
    ],
  },
  {
    label: "Round",
    cells: [
      "The corners taken off, so the tail lets go more smoothly and bites less on the way out of a carve. This is the one outline in the table that measurably is what it says: 31 to 67\u00a0mm narrower than the squash and the pin the whole way down the last five inches, and the most nose\u2011to\u2011tail symmetric of the five into the bargain. Also the shortest deck here at 29.6″. The gentlest to ride and the least precise.",
      "**YOW Hossegor 29″** (17″ WB) is the one drawn above; we make nothing cut this way. Also Carver Lost Quiver\u00a0Killer 32″ (18″ WB, a round pin)",
    ],
  },
  {
    label: "Pin",
    cells: [
      "Carver points its pintails at long drawn-out lines and open-road pumping rather than tight carving. On this deck the name is doing most of the work: measured against the Snapper’s squash, the Mundaka’s tail stays within 21\u00a0mm of it the whole way down, and it is the most nose\u2011to\u2011tail asymmetric of the five. Expect the calmer ride from its 16.5″ wheelbase rather than from the outline.",
      "**YOW Mundaka 32″** is the one drawn above; we make nothing cut this way. Also Carver CI Black\u00a0Beauty 31.75″ (17.75″ WB), Carver Haedron nº3 30″ and nº6 33″",
    ],
  },
  {
    label: "Egg / twin",
    cells: [
      "The idea is that nose and tail are near enough identical, so the board rides the same either way round and is the one most likely to be ridden switch. Measured, the Chiba only half earns it: its ends differ by about 20\u00a0mm on average — closer than the squash or the pin, further apart than the round tail. It is the widest deck of the five.",
      "**YOW Chiba 30″** (18″ WB) is the one drawn above; we make nothing cut this way. Also Carver Lost Beanbag, Carver Mini\u00a0Simms 27″",
    ],
  },
];

export const GEO_PROSE_3: SurfProse[] = [
  {
    title: "The one that is not cosmetic",
    text: "Whether the tail kicks up. A flat tail is a platform; a kicked tail lets you lift the nose, pivot on the spot and hop a kerb. On a board sitting on 66\u00a0mm wheels and a 30\u00a0mm riser, that is the difference between stepping off at a kerb and riding over it.\n\nYOW puts a kick on most of its decks. Carver varies it by model and says so in the description. Check it before you buy: it is the shape question that changes what the board can do rather than how it looks.",
  },
  {
    title: "What the names do not tell you",
    text: "Carver names decks after the surfboards they are cut from, so the CI Fishbeard is a Channel Islands fish and the Aipa Sting is an Aipa. YOW names them after waves — Pipe, Teahupoo, Hossegor. Neither convention says anything about the geometry.\n\nRead the outline and the wheelbase. A board named after a heavy reef break can be a mild 17″ cruiser, and a board named after nothing in particular can be a 15″ carver that will not sit still.",
  },
];

export const GEO_NOTE =
  "**Keep it in proportion.** The tail is somewhere you stand rather than something you pop, so outline is a smaller lever on a surfskate than it is on a skateboard. Two boards with the same wheelbase and different tails ride more alike than two boards with the same tail and wheelbases two inches apart. The measurements above sharpen that: the squash and the pin are the same tail within 21\u00a0mm, and only the round is doing something a rider would feel. Choose the wheelbase first, then choose the outline you want to look at.";

export const GEO_STOCKED =
  "Three completes, all on 7\u2011ply Canadian maple with rocker and OS780 transparent griptape. The **Coral** is 10″ × 32″ on a 16.5″ wheelbase and is cut to the squash outline above; the two **Fishtails** are 9.5″ × 31″ on 17″ and are cut to the fish. Decks are not sold on their own.";

// ── Section 5 — #wheels ───────────────────────────────────────────────────

export const WHEELS_SECTION: SurfSection = {
  kicker: "Wheels and height",
  title: "Big, soft, and up on a block",
  intro:
    "A surfskate wheel has a different job from a street wheel, and the riser under the truck is a consequence rather than a style choice.",
};

export const WHEELS_TABLE_COLS: TableCol[] = [
  { name: "Street wheel", sub: "For comparison" },
  { name: "Surfskate wheel", sub: "What we make" },
];

export const WHEELS_TABLE_ROWS: TableRow[] = [
  { label: "Diameter", cells: ["51–55\u00a0mm", "**66\u00a0mm**"] },
  { label: "Width", cells: ["33\u00a0mm", "**50\u00a0mm**"] },
  { label: "Durometer", cells: ["100A", "**82A**"] },
  {
    label: "Core",
    cells: [{ text: "Not stated", muted: true }, "Centre\u2011set"],
  },
  {
    label: "Bearing",
    cells: [
      {
        text: "608, 8 × 22 × 7\u00a0mm — the same in both",
        span: 2,
      },
    ],
  },
  {
    label: "Wants",
    cells: ["Slide, pop, park floor", "Grip, roll, broken tarmac"],
  },
];

export const WHEELS_PROSE: SurfProse[] = [
  {
    title: "Why soft",
    text: "82A deforms around grit instead of stopping dead on it, which is most of why a surfskate is usable on an Indian road and a 100A street setup is not. It also grips, which matters when you are loading a rail hard enough to accelerate.",
  },
  {
    title: "Why wide",
    text: "50\u00a0mm of wheel puts a lot of urethane on the road. That is grip under load and it is drag when you are just rolling, which is the trade a surfskate makes on purpose: it is a board built to turn.",
  },
  {
    title: "Why the riser",
    text: "A 66\u00a0mm wheel is 13\u00a0mm taller than a street wheel, and the front one swings in under the deck as the arm turns. Without height it finds the deck mid-carve and stops the board dead. Ours run a 30\u00a0mm PU riser.",
  },
];

export const WHEELS_NOTE =
  "**Bolting a surfskate truck onto a street deck rarely works.** A popsicle deck has no wheel wells and little clearance, so a 66\u00a0mm wheel on a swinging arm will bite. If you are converting a board you need risers and longer bolts, and you should check the clearance by hand at full lock before you ride it. Our own truck listing says it fits street and cruiser decks, which is true of the bolt pattern and quiet about the clearance.";

export const WHEELS_STOCKED =
  "**Toucan Surfskate Wheels**, 66 × 50\u00a0mm, 82A high rebound, centre\u2011set, sold without bearings. The same wheels are fitted to all three completes.";

// ── Section 6 — #surf ─────────────────────────────────────────────────────

export const SURF_SECTION: SurfSection = {
  kicker: "Surf training",
  title: "What actually transfers",
  intro:
    "Every surfskate in the world is sold on this claim. Some of it is true, a useful amount of it is not, and one part of it works against you.",
};

export interface SurfMove {
  name: string;
  verdict: "positive" | "negative";
  verdictLabel: string;
  body: string;
}

export const SURF_MOVES: SurfMove[] = [
  {
    name: "Rail to rail",
    verdict: "positive",
    verdictLabel: "Transfers",
    body: "Rolling your weight from heel edge to toe edge and back, on a rhythm, is the same movement on both. It is also the one a surfskate drills hardest, because the board gives you no speed at all unless you do it.\n\nWhat the water adds is that the wave decides the timing. On tarmac you set it yourself, which is easier and is also the gap you will feel on your first session back.",
  },
  {
    name: "Compress and extend",
    verdict: "positive",
    verdictLabel: "Transfers",
    body: "Sinking into a turn and standing up out of it is how a surfer generates speed on a wave face, and it is how a surfskate generates speed on flat ground. Same joints, same order, same timing against the turn.\n\nThis is the strongest single carry\u2011over on the list, and the one to be deliberate about while you practise.",
  },
  {
    name: "Front-foot drive",
    verdict: "positive",
    verdictLabel: "Transfers",
    body: "Both machines steer from the front foot. A surfskate exaggerates it — the nose is on its own axis and responds to pressure a surfboard would ignore — so the habit of driving from the front foot rather than steering from the back gets built quickly.",
  },
  {
    name: "Committing to a line",
    verdict: "positive",
    verdictLabel: "Transfers",
    body: "Choosing where you are going before you get there, and then going there, is a decision-making habit rather than a physical one. It is trainable on land and it is the part of surfing that separates people who can turn from people who can surf.",
  },
  {
    name: "Quiet arms",
    verdict: "negative",
    verdictLabel: "It can teach the opposite",
    body: "A surfskate turns on much less input than a surfboard, and it will turn from your arms and shoulders alone. That works on tarmac and fails in water, where a turn has to start low and the arms are mostly for balance.\n\nPractise starting every turn from the ankles and hips. If your shoulders are leading, you are building a habit you will have to unlearn.",
  },
  {
    name: "Paddling and fitness",
    verdict: "negative",
    verdictLabel: "No transfer",
    body: "Shoulder endurance, paddle technique and the ability to be in the right place when a wave arrives are the bulk of what a surf session actually costs you, and none of them happen on a board with wheels.\n\nSwim, or paddle. A surfskate will not buy you a single extra wave.",
  },
  {
    name: "The pop-up",
    verdict: "negative",
    verdictLabel: "No transfer",
    body: "Going from lying down to standing, in one movement, on a moving surface. There is no version of this on a surfskate, where you start on your feet.",
  },
  {
    name: "Reading the water",
    verdict: "negative",
    verdictLabel: "No transfer",
    body: "Wave selection, where to sit, what the tide is doing, which way a wave will break. This is most of what separates a good surfer from a fit one and it is learned only by being in the sea.",
  },
];

export const SURF_NOTE =
  "**The habit it can build.** A surfskate turns on far less input than a surfboard does, and it will happily turn from your arms and shoulders alone. Do that for a season and you arrive in the water throwing your upper body into turns that should start at the hips. If you take one thing from this section: keep the arms quiet and start the turn low.";

export const SURF_PROSE: SurfProse[] = [
  {
    title: "Who it helps most",
    text: "Someone who surfs occasionally and wants the movement to stay familiar between trips. A week of surfing a year and a surfskate in between is a different proposition from a week of surfing a year and nothing.\n\nIt also helps a beginner surfer understand what a rail is for, on dry land, at a speed they choose, without a wave arriving.",
  },
  {
    title: "Who it helps least",
    text: "Somebody who surfs several times a week already. The movements are there; the limiting factor is water time, wave count and paddling fitness, none of which a board on tarmac touches.\n\nAnd anyone buying it purely as training, who does not like riding it. The transfer comes from hours, and you will not put in hours on a board you find annoying.",
  },
];

export const SURF_STOCKED =
  "A spring\u2011loaded front truck, which is the surf\u2011training side of the [spring and bushing split](#spring) rather than the commuting side. That is the right choice for this section and the harder choice for a first board.";

// ── Section 7 — #range ────────────────────────────────────────────────────

export const RANGE_SECTION: SurfSection = {
  kicker: "The range",
  title: "What we make",
  intro:
    "Three completes on one truck and one wheel. The differences between them are size and shape.",
};

export const RANGE_TABLE_COLS: TableCol[] = [
  { name: "Coral", sub: "32″" },
  { name: "Blue Fishtail", sub: "31″" },
  { name: "Yellow Fishtail", sub: "31″" },
];

export const RANGE_TABLE_ROWS: TableRow[] = [
  {
    label: "Deck",
    cells: ["10″ × 32″", "9.5″ × 31″", "9.5″ × 31″"],
  },
  {
    label: "Wheelbase",
    cells: ["**16.5″**", "17″", "17″"],
  },
  {
    label: "Outline",
    cells: ["Squash, squared tail", "Fish, swallowtail", "Fish, swallowtail"],
  },
  {
    label: "Construction",
    cells: [{ text: "7\u2011ply Canadian maple, rocker", span: 3 }],
  },
  {
    label: "Griptape",
    cells: [{ text: "OS780 transparent", span: 3 }],
  },
  {
    label: "Trucks",
    cells: [
      {
        text: "Toucan S6 — spring\u2011loaded 360° pivot front, conventional rear",
        span: 3,
      },
    ],
  },
  {
    label: "Wheels",
    cells: [{ text: "66 × 50\u00a0mm, 82A high rebound", span: 3 }],
  },
  {
    label: "Bearings",
    cells: [{ text: "ABEC\u00a07, chrome steel", span: 3 }],
  },
  {
    label: "Riser",
    cells: [{ text: "30\u00a0mm PU", span: 3 }],
  },
];

export const RANGE_PROSE: SurfProse[] = [
  {
    title: "Coral, 32″",
    text: "The widest platform and the shortest wheelbase of the three, which makes it the quickest to come round and the busiest under your front foot. The one to take if the surf-training side is why you are here.",
  },
  {
    title: "Fishtails, 31″",
    text: "Half an inch more wheelbase on a slightly narrower deck. A touch calmer and a touch easier to ride in a straight line, which on a spring truck is worth more than half an inch sounds like.",
  },
  {
    title: "Buying the parts",
    text: "The S6 trucks and the wheels are sold separately if you are building onto a deck you already have. Bearings are not in either box, and you need eight. Check your deck's clearance before you commit.",
  },
];

export const RANGE_STOCKED =
  "All three completes ride the same truck, wheel and bearing. Choose on wheelbase and on which tail you want to look at — nothing else between them changes how the board rides. The store shows what is actually in stock.";

// ── Section 8 — #faq ──────────────────────────────────────────────────────

export const FAQ_SECTION = {
  kicker: "FAQ",
  title: "Still deciding?",
  intro:
    "The questions that come in about surfskates, answered for any brand's board first.",
};

export const SURF_FAQ: GuideFaqItem[] = [
  {
    q: "Should a surfskate be my first board?",
    a: "Only if the surf-like turning is the reason you want a board at all. A surfskate does one thing brilliantly and several ordinary things badly: it is awkward to push, it is not built for tricks, and the loose front end is unsettling until you have spent a few hours on it. If you want to learn to skateboard, learn on a skateboard.\n\nIf you already surf, or you know that carving is the part you want, it is a fine first board and you will enjoy it more than you would a popsicle.",
    stock:
      "Our surfskates are spring\u2011loaded, which is the less forgiving of the two systems. If you want a first board that is simply easy, our beginner completes are the better answer and cost less.",
  },
  {
    q: "Can I do tricks on it?",
    a: "You can ollie one, badly. The board is heavy, the front truck swings under you the moment the wheels leave the ground, the wheels are soft and the tail on a rockered deck has a different feel from a popsicle. None of that is what the machine is for.\n\nBowls and banks are a different question — plenty of people ride surfskates in transition and enjoy it, though a bushing system suits that better than a spring.",
  },
  {
    q: "Will it teach me to surf?",
    a: "It will teach you parts of surfing. Rail-to-rail timing, driving from the front foot, compressing into a turn and extending out of it, and committing to a line before you reach it all carry over. Paddling, wave selection, the pop-up, duck diving and reading conditions do not, and no board on land can give you those.\n\nIt can also teach you a bad habit, because it turns from the shoulders far more readily than a surfboard does. Keep the arms quiet.",
    stock:
      "The surf-training section above has the full list of what does and does not transfer.",
  },
  {
    q: "What does the 360° on the truck mean?",
    a: "It describes the pivot rather than the wheels: the arm is carried on a bearing that can rotate right round, instead of being limited to a slot. What it does not tell you is how far the arm actually swings in use, which is the number that decides how tight the board turns, and almost nobody publishes that.\n\nFor scale, Carver publishes 25° of pivot for both its systems. A number quoted in degrees of travel and a number quoting the bearing are different measurements, so do not read 360 against 25 as fourteen times the turn.",
    stock:
      "The S6's listing says 360° pivot and adjustable tension. It does not yet state the swing angle, or that the return is a spring.",
  },
  {
    q: "Do I need special bearings or wheels?",
    a: "Bearings, no. Every surfskate wheel takes the same 608 as every skateboard wheel, eight to a board. Wheels, effectively yes — a hard street wheel on a surfskate grips badly under the load a carve puts on it, and the whole point of the board is that load.",
    // The source links this to /guides/bearing-guide, which does not exist in
    // this project. Rendered as plain text rather than a dead link.
    stock:
      "One surfskate wheel, 66 × 50\u00a0mm at 82A, and the same two bearings we sell for skateboards. The bearing guide covers the rest.",
  },
  {
    q: "How often does the front truck need servicing?",
    a: "Check the pivot bolt for play every few weeks, the way you would check your axle nuts. Strip and grease the swivel once a season, or sooner if it has been through water. A dry or notchy pivot feels like a slight catch at the top of each turn, and left alone it wears the thrust washers.\n\nA rear truck is a rear truck and needs nothing a skateboard truck does not.",
  },
  {
    q: "Is it any good on Indian roads?",
    a: "Better than a street setup, which is the low bar. 66\u00a0mm at 82A rolls over the grit and the patched tar that stops a 100A wheel dead, and the high ride height keeps the deck clear of what a low board catches.\n\nBroken surfaces still interrupt a pumping rhythm, so a smooth stretch — a car park, a promenade, a quiet service road early in the morning — pays for itself. It is the same advice as for a cruiser, and we do not make a cruiser yet.",
    stock:
      "82A surfskate wheels are the softest thing in our range. The [wheel guide](/guides/wheel-guide) has the full durometer picture.",
  },
];

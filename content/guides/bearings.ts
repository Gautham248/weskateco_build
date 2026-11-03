// Single source of truth for the Bearing Guide page copy and data.
// Ported verbatim from the source JSON specification.

export interface AnatomyPart {
  key: string;
  number: number;
  title: string;
  body: string;
}

export interface AnatomyBlock {
  type: "anatomy";
  figure: string;
  hint: string;
  defaultPart: string;
  parts: AnatomyPart[];
}

export interface CaptionBlock {
  type: "caption";
  text: string;
}

export interface NoteBlock {
  type: "note";
  text: string;
}

export interface StockedBlock {
  type: "stocked";
  label: string;
  text: string;
}

export interface DefinitionItem {
  term: string;
  termNote: string;
  body: string;
}

export interface DefinitionsBlock {
  type: "definitions";
  items: DefinitionItem[];
}

export interface ColumnItem {
  heading: string;
  paragraphs: string[];
}

export interface ColumnsBlock {
  type: "columns";
  count: number;
  items: ColumnItem[];
}

export interface FigureBlock {
  type: "figure";
  figure: string;
  caption: string;
}

export interface ImageBlock {
  type: "image";
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
  note?: string;
}

export interface AxleStackToggle {
  mode: "with" | "without";
  label: string;
}

export interface AxleStackBlock {
  type: "axleStack";
  figure: string;
  hint: string;
  defaultMode: "with" | "without";
  toggle: AxleStackToggle[];
  captions: {
    with: string;
    without: string;
  };
}

export interface SubheadBlock {
  type: "subhead";
  kicker?: string;
  title: string;
  intro: string;
}

export interface TableColumn {
  title: string;
  subtitle: string;
}

export interface TableCell {
  text: string;
  muted?: boolean;
}

export interface TableRow {
  header: string;
  cells: TableCell[];
}

export interface TableBlock {
  type: "table";
  cornerLabelScreenReaderOnly: string | null;
  columns: TableColumn[];
  rows: TableRow[];
}

export interface CrosslinkCta {
  label: string;
  href: string;
}

export interface CrosslinkBlock {
  type: "crosslink";
  text: string;
  cta: CrosslinkCta;
}

export interface ToolItem {
  title: string;
  body: string;
}

export interface ToolsBlock {
  type: "tools";
  items: ToolItem[];
}

export interface StepperStep {
  n: number;
  figure: string;
  title: string;
  body: string[];
  watchOut: string;
}

export interface StepperBlock {
  type: "stepper";
  steps: StepperStep[];
  prevLabel: string;
  nextLabel: string;
  watchOutLabel: string;
  stepLabelPattern: string;
}

export interface DiagnosisSymptom {
  n: number;
  symptom: string;
  verdictTone: "ok" | "bad";
  verdict: string;
  body: string[];
}

export interface DiagnosisBlock {
  type: "diagnosis";
  symptoms: DiagnosisSymptom[];
  symptomLabelPattern: string;
}

export interface FaqItem {
  question: string;
  answer: string[];
  stocked: {
    label: string;
    text: string;
  };
}

export interface FaqBlock {
  type: "faq";
  items: FaqItem[];
}

export type BearingGuideBlock =
  | AnatomyBlock
  | CaptionBlock
  | NoteBlock
  | StockedBlock
  | DefinitionsBlock
  | ColumnsBlock
  | FigureBlock
  | ImageBlock
  | AxleStackBlock
  | SubheadBlock
  | TableBlock
  | CrosslinkBlock
  | ToolsBlock
  | StepperBlock
  | DiagnosisBlock
  | FaqBlock;

export interface SectionHead {
  kicker: string;
  title: string;
  intro: string;
}

export interface BearingGuideSection {
  id: string;
  head: SectionHead;
  blocks: BearingGuideBlock[];
}

export interface JumpLink {
  label: string;
  anchor: string;
}

export interface HeroCta {
  label: string;
  href: string;
  kind: string;
  emphasis: string;
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterColumn {
  heading: string;
  links: FooterLink[];
}

export interface BearingGuideContent {
  _readme?: string;
  meta: {
    documentTitle: string;
    guideNumberEyebrow: string;
  };
  topbar: {
    mark: string;
    jumpLinks: JumpLink[];
  };
  hero: {
    eyebrow: string;
    titleLines: string[];
    titleNote?: string;
    lede: string;
    ctas: HeroCta[];
  };
  sections: BearingGuideSection[];
  footer: {
    columns: FooterColumn[];
    note: string;
  };
}

export const BEARING_GUIDE_CONTENT: BearingGuideContent = {
  _readme:
    'Single source of truth for the Bearing Guide page copy and data. Inline markup is markdown-lite: **bold**, *italic*. NBSP (U+00A0) and non-breaking hyphen (U+2011) are deliberate: keep them. Block "figure"/"image" values refer to files in assets/. href values starting with "/" are site-internal paths on weskateco.vercel.app: verify each exists in the repo.',
  meta: {
    documentTitle: "WeSkate Bearing Guide",
    guideNumberEyebrow: "Sphere Skateboards · WeSkate Co. · Guide 06",
  },
  topbar: {
    mark: "WeSkate Co. / Bearing Guide",
    jumpLinks: [
      {
        label: "Parts",
        anchor: "parts",
      },
      {
        label: "ABEC",
        anchor: "abec",
      },
      {
        label: "Materials",
        anchor: "mat",
      },
      {
        label: "Shields",
        anchor: "seals",
      },
      {
        label: "Spacers",
        anchor: "stack",
      },
      {
        label: "Cleaning",
        anchor: "clean",
      },
      {
        label: "Wear",
        anchor: "wear",
      },
      {
        label: "Range",
        anchor: "range",
      },
      {
        label: "FAQ",
        anchor: "faq",
      },
    ],
  },
  hero: {
    eyebrow: "Sphere Skateboards · WeSkate Co. · Guide 06",
    titleLines: ["The", "Bearings"],
    titleNote: "Second line is the emphasised word in the source",
    lede: "Eight steel rings, the cheapest part of the board, and the one people upgrade first and look after last. This is what is inside one, why the number printed on nearly every box measures something a skateboard never does, and the ten minutes that will do more for your roll than anything you can buy.",
    ctas: [
      {
        label: "Go straight to cleaning",
        href: "#clean",
        kind: "anchor",
        emphasis: "primary",
      },
      {
        label: "Buying guide",
        href: "/guides/skateboard-buying-guide",
        kind: "internal-link",
        emphasis: "secondary",
      },
    ],
  },
  sections: [
    {
      id: "parts",
      head: {
        kicker: "Anatomy",
        title: "What is inside one",
        intro:
          "Six parts, none of them complicated, and every argument about bearings is an argument about one of the six.",
      },
      blocks: [
        {
          type: "anatomy",
          figure: "bearing-anatomy",
          hint: "Tap a number or a part",
          defaultPart: "race-out",
          parts: [
            {
              key: "race-out",
              number: 1,
              title: "Outer race",
              body: "The ring that presses into the wheel. It does not turn against the wheel — it turns with it, and the groove cut into its inner face is the track the balls run in. That groove is curved rather than flat, which is what stops a ball walking sideways when you lean the board.",
            },
            {
              key: "race-in",
              number: 2,
              title: "Inner race",
              body: "Sits on the axle and is held still by the axle nut. The whole mechanism is the gap between this ring and the outer one, about two and a half millimetres of it, and everything that goes wrong with a bearing goes wrong in there.",
            },
            {
              key: "balls",
              number: 3,
              title: "Balls",
              body: "Seven of them in a 608, each 4.762 mm across. Steel as standard; ceramic on the bearings that cost more, where they are harder, lighter and rust‑proof. They touch the races over an area smaller than a full stop, which is why what those surfaces are made of matters so much.",
            },
            {
              key: "cage",
              number: 4,
              title: "Retainer",
              body: "The cage that keeps the balls evenly spaced so they never touch each other. Nylon runs quieter and drags less; steel takes more abuse but can score a ball if it gets bent. Every bearing we sell uses a nylon cage. It is also the part that falls out and gets lost when you clean a bearing carelessly.",
            },
            {
              key: "shield",
              number: 5,
              title: "Shield",
              body: "The cover over the gap between the races. Metal, rubber or a labyrinth — each is a different answer to the same trade between keeping dirt out and letting the bearing spin. Ours are rubber, which prise out cleanly and are the easiest kind to service. Whether a bearing survives a monsoon is settled here, and it is also what you have to get off before you can clean anything.",
            },
            {
              key: "lube",
              number: 6,
              title: "Lubricant",
              body: "The oil or grease the balls run in. Oil is faster and needs replacing; grease lasts far longer and drags until it beds in. Ours ship with a racing oil, which is the fast end of that trade and the end with a service interval. A bearing running dry destroys its own raceways within a session, which is why the last step of any clean is putting the oil back.",
            },
          ],
        },
        {
          type: "caption",
          text: "Drawn to scale from the 608 dimensions. The face view has half its shield taken off so the inside shows.",
        },
        {
          type: "definitions",
          items: [
            {
              term: "608",
              termNote: "The size",
              body: "8 mm bore, 22 mm outside, 7 mm wide. Every skateboard bearing sold is this size, which is why any bearing fits any wheel on any truck, and why 608s also turn up in fidget spinners, printers and washing machines. **You need eight** — two in each wheel.",
            },
            {
              term: "7 balls",
              termNote: "Inside a 608",
              body: "Each one 4.762 mm across, running on a 15 mm pitch circle. Seven contact points carry your landing, and each of those contacts is smaller than a full stop on this page.",
            },
            {
              term: "The races",
              termNote: "Where the wear happens",
              body: "The two rings the balls run between. A bearing almost never fails because a ball broke. It fails because the raceways pitted — from rust, or from grit that got past the shield and was rolled into the steel.",
            },
          ],
        },
      ],
    },
    {
      id: "abec",
      head: {
        kicker: "The rating",
        title: "What ABEC measures",
        intro:
          "A published engineering standard that measures something precisely. What it measures is how accurately the races are turned, and a skateboard never asks that question.",
      },
      blocks: [
        {
          type: "columns",
          count: 2,
          items: [
            {
              heading: "What it is",
              paragraphs: [
                "The Annular Bearing Engineering Committee, part of the American Bearing Manufacturers Association, sets tolerance classes for ball bearings: **1, 3, 5, 7 and 9**, tightest at 9. The grades control how accurately the races are turned — their diameters, their widths, and how far the running surface wobbles off true as the bearing spins, which is called runout.",
                "A factory that certifies ABEC 9 has held its races to one and a half thousandths of a millimetre. That is a hard thing to do and it costs money to do it.",
              ],
            },
            {
              heading: "What it leaves out",
              paragraphs: [
                "The standard says nothing about load handling, ball precision, the steel, its hardness, how well the raceways are polished, noise, vibration, or the lubricant. It says nothing about impact from a landing or side load from a turn, which between them are how skateboards break bearings.",
                "So two bearings can carry the same ABEC number with a different steel, a different cage, a different closure and a different oil, and ride nothing alike.",
              ],
            },
          ],
        },
        {
          type: "figure",
          figure: "abec-speed-vs-tolerance",
          caption:
            "Two scales, each drawn true. The speed figures are from Bones Bearings, who put a skate wheel’s realistic maximum at about 4,700 rpm with most skating under 2,000. The runout tolerances are the published ABEC figures for a bore between 1 and 18 mm.",
        },
        {
          type: "note",
          text: "**ABEC’s grades earn their money in a spindle turning twenty thousand times a minute**, where a race a few micrometres off true starts to matter. A skate wheel never gets near that, and at skate speeds the difference between the grades is smaller than the film of oil sitting on top of it. Whether the bearing is clean, what is closing the gap at its edge, and what is in there for lubricant will each change your roll more than moving from ABEC 3 to ABEC 9.",
        },
        {
          type: "stocked",
          label: "What we stock",
          text: "The steel and ceramic sets are built to a claimed **ABEC 7**, and Toucan Black Pro to **ABEC 9**. Each number tells you the races were turned to that tolerance class. Neither tells you the bearing rolls faster under a skateboard, which is why the range table further down gives you the steel, the hardness, the cage, the closure and the oil as well.",
        },
        {
          type: "crosslink",
          text: "If a number on a box is the thing you are trying to judge, the wheel guide makes the same argument about durometer — where the number does mean something, and where the second number nobody quotes matters more.",
          cta: {
            label: "Wheel guide",
            href: "/guides/wheel-guide",
          },
        },
      ],
    },
    {
      id: "mat",
      head: {
        kicker: "Materials",
        title: "What a bearing is made of",
        intro:
          "Two bearings can both be 608s, both claim ABEC 7 and both be sold as ceramic, and still be different objects at every point that decides how long they last.",
      },
      blocks: [
        {
          type: "columns",
          count: 3,
          items: [
            {
              heading: "The races",
              paragraphs: [
                "**Chrome steel** is the default across the market — 52100 in the American designation, GCr15 in the Chinese one, and the same alloy either way. It runs **60–64 HRC**, carries load better than anything at its price, takes a polish that lasts, and it rusts.",
                "**Stainless** is the alternative. Around **58–60 HRC** and roughly four‑fifths of chrome steel’s load rating, it resists corrosion through the whole thickness of the ring rather than at the surface, and it costs considerably more. Common in bearings made for wet industries, uncommon on skateboards.",
                "**Coatings** are the middle path: black oxide and similar treatments give chrome steel some resistance to rust. They are a surface, so they can be worn through.",
              ],
            },
            {
              heading: "The balls",
              paragraphs: [
                "Steel as standard. **Ceramic** on a skate bearing means **silicon nitride**, which is harder than steel, around 60% lighter, and cannot rust. Bones prints the full specification on its ceramic lines — *grade 5, silicon nitride, hot isostatically pressed* — and each part of that is a claim you can check.",
                "The **grade** is the ball’s tolerance in millionths of an inch, so grade 5 is rounder and smoother than grade 25. **Hot isostatic pressing** is how the ceramic is densified before it is ground.",
                "Count matters too. A standard 608 carries **seven balls**; some lines run **six larger ones** instead, which puts more material at each contact and fewer contacts round the race.",
              ],
            },
            {
              heading: "The cage and the oil",
              paragraphs: [
                "A **nylon** crown is what good skate bearings use, and the brands that care say so — Bones calls it a high‑speed nylon ball retainer. It is lighter, quieter, drags less and springs back when it is knocked. **Steel** cages survive more abuse and can score a ball if they bend.",
                "For lubricant the choice is a light **oil**, which is quick and has a service interval, or a **grease**, which lasts far longer and drags until it beds in. Bones ships its bearings in Speed Cream, a racing oil, and most skate bearings sold anywhere are oiled rather than greased.",
              ],
            },
          ],
        },
        {
          type: "subhead",
          title: "What the money actually changes",
          intro:
            "Bones is the useful ruler here, because they publish more about their bearings than anyone else does and their range is a ladder you can read. We do not stock them; the point is what each step up the ladder buys.",
          kicker: "The market",
        },
        {
          type: "table",
          cornerLabelScreenReaderOnly: "What changes",
          columns: [
            {
              title: "What changes",
              subtitle: "Going up a range",
            },
            {
              title: "What it buys",
              subtitle: "And what it does not",
            },
          ],
          rows: [
            {
              header: "The steel",
              cells: [
                {
                  text: "A higher grade of steel and a finer surface finish on the raceways — the step from **Reds to Super Reds**",
                },
                {
                  text: "A smoother, harder running surface that pits later. The commonest upgrade and the one you feel least on day one",
                },
              ],
            },
            {
              header: "The process",
              cells: [
                {
                  text: "Where and how tightly it is made — **Reds** are made in China, **Bones Swiss** in Switzerland",
                },
                {
                  text: "Consistency: every bearing in the pack behaves like the others. What the top of the market is actually selling",
                },
              ],
            },
            {
              header: "The balls",
              cells: [
                {
                  text: "Silicon nitride instead of steel — **Ceramic Reds**, **Ceramic Super Reds**, **Swiss Ceramics**",
                },
                {
                  text: "Balls that cannot rust, weigh less and run a little cooler. The races stay steel on every one of them",
                },
              ],
            },
            {
              header: "The closure",
              cells: [
                {
                  text: "A labyrinth instead of a plain shield — **Bones Swiss Labyrinth**",
                },
                {
                  text: "Dirt has to turn corners to get in, with nothing touching and nothing dragging. The best answer to the trade in the section above",
                },
              ],
            },
            {
              header: "The ball count",
              cells: [
                {
                  text: "Six larger balls instead of seven — **Big Balls Reds**, **Super Swiss 6**",
                },
                {
                  text: "More material at each contact. A different distribution of load rather than a straight improvement",
                },
              ],
            },
            {
              header: "The rating",
              cells: [
                {
                  text: "Bones refuses ABEC entirely and publishes its own **Skate Rated** criteria instead",
                },
                {
                  text: "A brand telling you it designed for impact and side load rather than for spindle speed. It is a claim, and it is at least a claim about skateboarding",
                },
              ],
            },
          ],
        },
        {
          type: "note",
          text: "Everyone else sits on the same ladder with fewer rungs published. **Spitfire Cheapshots** and **Bones Reds** are the entry benchmark. **Bronson G2 and G3**, **Spitfire Burners** and **Independent GP‑R** occupy the middle with better steel and better finishing. Above that you are paying for process control and for closures. What almost none of them print is the race hardness, the ball grade or the cage material, which is the information this page keeps telling you to ask for.",
        },
        {
          type: "columns",
          count: 2,
          items: [
            {
              heading: "What ceramic buys, and what it does not",
              paragraphs: [
                "Harder, lighter, rounder balls that cannot rust, and a little less friction with them. Bones goes further and claims the hardness works on the races as well: because silicon nitride is so much harder than the steel it runs against, grit that gets in is pressed into the ball’s path and the ball re‑polishes the raceway rather than being pitted by it. That is their claim rather than a measured figure, and it is a plausible one.",
                "What ceramic does not do is make a bearing weatherproof. **Every ceramic bearing sold for skating is a hybrid** — ceramic balls in steel races — because full‑ceramic races chip under the impacts skateboarding puts through them. The races are the surfaces that end a bearing’s life, and on a ceramic bearing they are still steel.",
                "Nor will it rescue a dirty bearing. A clean steel set beats a neglected ceramic one by a margin nothing on a spec sheet can close.",
              ],
            },
            {
              heading: "Five things to ask for",
              paragraphs: [
                "Race material *and* its hardness in HRC, because two bearings can both say chrome steel and differ by several points, and the harder raceway is the one that pits later. Ball material, and the grade number if it is ceramic. Cage material. Closure type. And whether it is oiled or greased.",
                "Almost nobody publishes all five. Bones publishes most of them, which is why their range is the one to read against even if you never buy a set. A box carrying an ABEC number and nothing else has told you the least it could.",
              ],
            },
          ],
        },
        {
          type: "stocked",
          label: "What we stock",
          text: "Toucan Steel and Toucan Ceramic, both 608, both sold in sets of eight, both on chrome steel races at 58–60 HRC with nylon cages, rubber shields and a racing oil, both claimed ABEC 7. The two are identical apart from the balls, so the ceramic set buys exactly what the column above describes and nothing more. Toucan Black Pro runs silicon nitride balls on blackened chrome steel through‑hardened to 61–64 HRC, and the range table further down sets all three side by side.",
        },
      ],
    },
    {
      id: "seals",
      head: {
        kicker: "The edge",
        title: "Shields and seals",
        intro:
          "The part that decides how long the bearing lasts, and the one almost nobody asks about.",
      },
      blocks: [
        {
          type: "note",
          text: "A bearing has to be closed at both faces, and there is no way to close it that costs nothing. Seal it tightly and you have added friction. Leave it open and you have let the road in. The three answers below are the three positions on that trade, and which one a bearing uses tells you more about how it will age than any grade printed on the box.",
        },
        {
          type: "figure",
          figure: "closures",
          caption:
            "All three drawn from the same 608 geometry and at the same magnification, so the gaps are comparable.",
        },
        {
          type: "columns",
          count: 3,
          items: [
            {
              heading: "Metal shield",
              paragraphs: [
                "A steel disc held in a groove in the outer race, stopping just short of the inner one. It never touches, so it never drags, and the gap it leaves is a road for dust. Cheap, tough, and on many bearings it prises out with a pin so you can clean underneath.",
              ],
            },
            {
              heading: "Rubber seal",
              paragraphs: [
                "The same disc with a rubber lip that presses on the inner race. Almost nothing gets past it and you can feel the drag if you spin the bearing in your fingers. The lip usually pops out cleanly, which makes these the easiest to service.",
              ],
            },
            {
              heading: "Labyrinth",
              paragraphs: [
                "The closure drops into a groove turned into the race, so dirt has to turn corners to get in and nothing touches anything. It is the best answer for a skateboard and the most expensive to make, which is why it appears on the bearings that cost the most.",
              ],
            },
          ],
        },
        {
          type: "subhead",
          title: "One side or two",
          intro:
            "Some bearings ship closed on one face only, with the inner face left open.",
        },
        {
          type: "note",
          text: "Fitted correctly the open face points inward, at the spacer, where it is sheltered by the wheel core on one side and the other bearing on the other. You lose a little protection and gain a little roll, and you gain a lot of convenience, because one shield to prise off instead of two halves the work of every clean. On a wheel that spends its life on wet or sandy ground the closed face should be the one facing out, so check which way round they went in.",
        },
        {
          type: "stocked",
          label: "What we stock",
          text: "Every bearing in the range is closed with **rubber**: a rubber shield on the steel and ceramic sets, and a rubber seal on Toucan Black Pro. That is the middle column above: more drag than a metal shield, far less gets past it, and it prises out cleanly — so the cleaning walkthrough below applies directly to what we sell, warning about solvent and all. All three are closed on **one face only** — Toucan Black Pro is a 1RS bearing, which means exactly that — so fit them with the shield facing out and the open face pointing in at the spacer, as described above.",
        },
      ],
    },
    {
      id: "stack",
      head: {
        kicker: "The stack",
        title: "Spacers and speed washers",
        intro:
          "Two parts that cost almost nothing, that most setups leave out, and that decide whether the axle nut is tightening your wheel or crushing your bearings.",
      },
      blocks: [
        {
          type: "image",
          src: "wheel-cutaway.webp",
          width: 920,
          height: 674,
          alt: "A skateboard wheel and truck cut through the axle, showing the axle nut, a bearing pressed into each side of the wheel, the hollow core between them and the axle passing through it",
          caption:
            "A wheel cut through its axle: the nut at the left, a bearing pressed into each face, and the wheel’s hollow core between them with the axle running through it. **There is nothing bridging the two inner races** — which is what most setups look like, and what the drawing below calls the second case. Rendered rather than photographed.",
          note: "Illustration is rendered artwork with a white background",
        },
        {
          type: "axleStack",
          figure: "axle-stack",
          hint: "Watch where the nut’s grip has to go",
          defaultMode: "with",
          toggle: [
            {
              mode: "with",
              label: "With a spacer",
            },
            {
              mode: "without",
              label: "Without one",
            },
          ],
          captions: {
            with: "The nut pulls washer, inner race, spacer, inner race and washer into one solid column against the hanger. Nothing of that load reaches the balls, so you can tighten the nut properly and the wheel still spins.",
            without:
              "With the spacer gone the same force has nowhere straight to go. It detours through the balls of one bearing, along the wheel core and back through the other, and the circled contacts are taking a squeeze they were never designed for. Tighten the nut and the wheel slows down.",
          },
        },
        {
          type: "columns",
          count: 2,
          items: [
            {
              heading: "The spacer",
              paragraphs: [
                "A short metal tube on the axle between the two bearings, bridging their inner races. With it fitted, tightening the axle nut squeezes a rigid column of steel and the balls carry none of it. Without it, the only path that force has is in through one inner race, across the balls, along the wheel core and back through the other bearing — so the tighter you do up the nut, the harder the balls are pressed into their grooves, and the wheel slows down.",
                "This is why a wheel can spin beautifully in your hand and badly on the board. Nothing is wrong with the bearing.",
              ],
            },
            {
              heading: "The speed washers",
              paragraphs: [
                "Thin discs that sit between the bearing and the hanger at one end, and between the bearing and the nut at the other. They give both a flat, hard face to bear against instead of letting the nut bite into the bearing’s inner race or letting the race rub on the truck. They also keep the two from seizing to each other.",
                "They are the cheapest part on a skateboard and the one most often missing.",
              ],
            },
          ],
        },
        {
          type: "note",
          text: "**How tight is the nut?** Do it up until the wheel stops moving side to side on the axle, then back it off until the wheel spins freely and there is the faintest trace of play. On a truck with a nyloc nut you should still see a thread or two past the nylon. A nut done up hard against the wheel is the single most common reason a new setup feels slow, and no bearing can fix it.",
        },
        {
          type: "stocked",
          label: "What we stock",
          text: "The Toucan Steel and Toucan Ceramic sets do not include spacers. Our completes ship with deck, trucks, wheels, griptape, bearings and hardware, with no spacers on that list, so assume they are not fitted either. The one exception is **Toucan Black Pro**, which comes with eight bearings and eight spacers. Speed washers normally come with a set of trucks — you want eight of each for a board, and they are the cheapest upgrade on this page.",
        },
      ],
    },
    {
      id: "clean",
      head: {
        kicker: "Maintenance",
        title: "Cleaning them",
        intro:
          "Half an hour, twice a year, and more often if you ride through water. It will do more for your roll than any bearing you can buy.",
      },
      blocks: [
        {
          type: "tools",
          items: [
            {
              title: "A solvent",
              body: "High‑purity isopropyl alcohol, acetone, or carburettor cleaner. Citrus cleaners work and leave a slight residue. The alcohol sold in chemists is mostly water and will not do it.",
            },
            {
              title: "A jar with a lid",
              body: "Anything that seals and that you are willing to give up to solvent. Shaking is what gets the grit out of the raceway.",
            },
            {
              title: "A pin",
              body: "A safety pin, a bradawl, a thin blade — for lifting the shields. Sharp enough to get under the edge, blunt enough not to gouge it.",
            },
            {
              title: "Bearing oil",
              body: "A light oil made for bearings. Chain lube is too thick to reach the raceway, and WD‑40 is a water dispersant that will wash out what little is in there.",
            },
          ],
        },
        {
          type: "stepper",
          steps: [
            {
              figure: "clean-01-wheels",
              title: "Take the wheels off",
              body: [
                "A 13 mm socket or the wrench on a skate tool. Undo all eight nuts, keep the speed washers — there are two per wheel and they are easy to lose in grass.",
                "Lay the four wheels out in the order they came off if you want to keep the wear even when they go back.",
              ],
              watchOut:
                "The nuts are the only thing holding the wheels on. Take them off over a cloth, on a table, and you will still be riding the same eight washers in a year.",
              n: 1,
            },
            {
              figure: "clean-02-out",
              title: "Get the bearings out",
              body: [
                "Hook the edge of a bearing over the end of the truck axle, then lever the wheel sideways. The axle catches the inner race and walks the bearing out of its seat. Turn the wheel round and do the other one.",
                "Sixteen pieces come off a board: eight bearings and eight washers. Keep them together.",
              ],
              watchOut:
                "Lever against the inner race, and take it slowly. Yanking the wheel can bend a shield, and a bent shield never seals properly again.",
              n: 2,
            },
            {
              figure: "clean-03-shield",
              title: "Take the shields off",
              body: [
                "Slide the point of a pin under the **inner** edge of the shield, close to the bore, and lift. Rubber seals pop out whole. Metal shields held by a C‑clip need the clip easing out first with the pin’s tip in the gap.",
                "If a bearing is closed on one face only, the open face is the one that was pointing inward.",
              ],
              watchOut:
                "Prise from the inside edge, never the outside. The outer edge is what holds the shield in its groove, and once you have deformed it the shield will not sit flat again.",
              n: 3,
            },
            {
              figure: "clean-04-soak",
              title: "Soak and shake",
              body: [
                "Drop the bearings in a jar with enough solvent to cover them, put the lid on and shake hard for a good half minute. Leave them ten minutes, then shake again. The shaking is what does the work — soaking alone loosens the grease but leaves the grit sitting in the raceway.",
                "Pour the dirty solvent off, put in a little fresh, and shake once more. You will see how much came out.",
              ],
              watchOut:
                "Metal shields can go in the jar. Rubber ones must not: solvent makes them swell and go soft. Wash those in warm soapy water instead.",
              n: 4,
            },
            {
              figure: "clean-05-dry",
              title: "Dry them completely",
              body: [
                "Compressed air is quickest. Otherwise spread them on a cloth and leave them until no solvent smell is left. Spin each one with a finger while it dries so the last of it comes out of the raceway.",
                "Do not spin a dry bearing at speed with an air line. It runs with nothing between the balls and the races, which is exactly the thing this whole job exists to prevent.",
              ],
              watchOut:
                "Any solvent left inside will thin the oil you are about to add. Give them longer than you think they need.",
              n: 5,
            },
            {
              figure: "clean-06-oil",
              title: "Put the oil back",
              body: [
                "Two drops of bearing oil per bearing, straight into the raceway, then spin it in your fingers so it spreads all the way round. Ceramic bearings take one drop.",
                "More is not better. Too much oil drags and collects dust, and the extra will be flung out in the first few minutes anyway.",
              ],
              watchOut:
                "Never oil a bearing you have not cleaned. Fresh oil on top of old grit makes a grinding paste and puts the grit straight back into the raceway.",
              n: 6,
            },
            {
              figure: "clean-07-reshield",
              title: "Put the shields back",
              body: [
                "Dry, oiled, then closed, in that order. Sit the shield flat in its groove with the printed side facing out and press it down with a thumb all the way round until the outer edge drops in. A rubber seal goes back by hand. A metal shield needs its C‑clip pushed back into the groove behind it, and the pin does that too.",
                "Spin it once it is closed. A shield that is fouling sounds wrong straight away — scratchy, or slower than it was open.",
              ],
              watchOut:
                "A shield that is only half in comes out on the first rough landing, and everything you just cleaned goes straight back in. If one will not sit flat it is bent: ride that face open rather than ride a shield that does not seal.",
              n: 7,
            },
            {
              figure: "clean-08-back",
              title: "Press them back in",
              body: [
                "Set a bearing on the truck axle, sit the wheel on top of it and push straight down until it seats. The axle keeps it square. Turn the wheel over and do the second one.",
                "Washer, wheel, washer, nut — and do the nut up until the side‑to‑side play just disappears, then back off a fraction.",
              ],
              watchOut:
                "Press square. A bearing driven in at an angle deforms its outer race against the wheel seat, and that damage does not come out.",
              n: 8,
            },
          ],
          prevLabel: "Back",
          nextLabel: "Next",
          watchOutLabel: "Watch out",
          stepLabelPattern: "Step {n} of {total}",
        },
        {
          type: "note",
          text: "**Rubber shields never meet solvent.** It makes them swell and go soft, and a deformed shield lets in everything it was there to keep out. Warm water and a little soap, then dry them. Metal shields can go in the jar with everything else.",
        },
      ],
    },
    {
      id: "wear",
      head: {
        kicker: "Diagnosis",
        title: "What it is telling you",
        intro:
          "Most bearings people throw away are dirty. Some are finished. Two of the symptoms below are not bearing problems at all.",
      },
      blocks: [
        {
          type: "diagnosis",
          symptoms: [
            {
              symptom: "Gritty, and slowing down",
              verdictTone: "ok",
              verdict: "Clean it",
              body: [
                "The commonest state a bearing is in, and the one people mistake for wear. Grit that got past the shield is sitting in the raceway, rolling between the ball and the steel every revolution. It feels rough through the deck and sounds like sand.",
                "Caught early, a clean puts it back to new. Left alone, that same grit is pressed into the raceways until the surface is pitted, and then it is finished.",
              ],
              n: 1,
            },
            {
              symptom: "Screeching or squealing",
              verdictTone: "ok",
              verdict: "Clean it, then oil it",
              body: [
                "A dry bearing. The oil has been flushed out — by rain, by a pressure wash, or by someone spraying water dispersant into it — and the balls are running on bare steel.",
                "Stop riding it. This is the one symptom that is doing damage while you listen to it, and every minute is wearing the raceway.",
              ],
              n: 2,
            },
            {
              symptom: "Orange dust, or brown streaks",
              verdictTone: "bad",
              verdict: "Replace it",
              body: [
                "Rust on the races. Water got in and stayed in. The orange comes out with solvent and the surface it came off does not come back — where the rust was there are now pits, and the ball drops into each one as it passes.",
                "You can clean it and ride it and it will be rough for the rest of its life. In wet climates this is what ends most bearings, and chrome steel races — which is what nearly every skate bearing runs, ours included — have nothing in them to stop it. Drying them out is the only defence.",
              ],
              n: 3,
            },
            {
              symptom: "A click once per revolution",
              verdictTone: "bad",
              verdict: "Replace it",
              body: [
                "One ball, or one spot on a race, is damaged. A regular tick at exactly the same point each turn means the fault is turning with the bearing rather than sitting in it.",
                "Usually a hard landing, occasionally a retainer that bent and scored a ball. Cleaning will not touch it.",
              ],
              n: 4,
            },
            {
              symptom: "Spins fine off the board, binds on it",
              verdictTone: "ok",
              verdict: "Not the bearing",
              body: [
                "The axle nut is clamping it. Without a spacer the nut has nothing rigid to tighten against, so its force runs through the balls and presses them into their grooves.",
                "Back the nut off until a trace of side‑to‑side play appears, or fit spacers and tighten it properly. Either fixes it, and a new bearing would not.",
              ],
              n: 5,
            },
            {
              symptom: "Spins for less time than the others",
              verdictTone: "ok",
              verdict: "Probably nothing",
              body: [
                "Spin time is a poor test. It is dominated by the weight of the wheel, how much oil is in the bearing and how the nut is set, and a fresh bearing packed with grease will spin for less time than a worn one running thin oil.",
                "Judge by sound and feel under your feet. A bearing that is quiet and smooth is doing its job however long it free‑spins on a bench.",
              ],
              n: 6,
            },
          ],
          symptomLabelPattern: "Symptom {n}",
        },
      ],
    },
    {
      id: "range",
      head: {
        kicker: "What we stock",
        title: "The range",
        intro:
          "Three bearing sets, and the ones fitted to beginner completes and surfskates, which you cannot buy on their own.",
      },
      blocks: [
        {
          type: "table",
          cornerLabelScreenReaderOnly: null,
          columns: [
            {
              title: "Steel",
              subtitle: "Toucan Steel · standard line",
            },
            {
              title: "Ceramic",
              subtitle: "Toucan Ceramic · standard line",
            },
            {
              title: "Black Pro",
              subtitle: "Toucan Black Pro · pro line",
            },
          ],
          rows: [
            {
              header: "Balls",
              cells: [
                {
                  text: "Steel",
                },
                {
                  text: "Ceramic",
                },
                {
                  text: "Silicon nitride, blackened",
                },
              ],
            },
            {
              header: "Races",
              cells: [
                {
                  text: "Chrome steel",
                },
                {
                  text: "Chrome steel",
                },
                {
                  text: "Chrome steel, blackened",
                },
              ],
            },
            {
              header: "Race hardness",
              cells: [
                {
                  text: "58–60 HRC",
                },
                {
                  text: "58–60 HRC",
                },
                {
                  text: "**61–64 HRC**",
                },
              ],
            },
            {
              header: "Heat treatment",
              cells: [
                {
                  text: "Not published",
                  muted: true,
                },
                {
                  text: "Not published",
                  muted: true,
                },
                {
                  text: "Through‑hardened",
                },
              ],
            },
            {
              header: "Cage",
              cells: [
                {
                  text: "Nylon",
                },
                {
                  text: "Nylon",
                },
                {
                  text: "Nylon — PA66",
                },
              ],
            },
            {
              header: "Closure",
              cells: [
                {
                  text: "Rubber shield, one face",
                },
                {
                  text: "Rubber shield, one face",
                },
                {
                  text: "Rubber seal, one face (1RS)",
                },
              ],
            },
            {
              header: "Lubricant",
              cells: [
                {
                  text: "Racing oil",
                },
                {
                  text: "Racing oil",
                },
                {
                  text: "Racing oil",
                },
              ],
            },
            {
              header: "Claimed rating",
              cells: [
                {
                  text: "ABEC 7",
                },
                {
                  text: "ABEC 7",
                },
                {
                  text: "ABEC 9",
                },
              ],
            },
            {
              header: "Size",
              cells: [
                {
                  text: "608",
                },
                {
                  text: "608",
                },
                {
                  text: "608",
                },
              ],
            },
            {
              header: "In the pack",
              cells: [
                {
                  text: "8 bearings",
                },
                {
                  text: "8 bearings",
                },
                {
                  text: "8 bearings",
                },
              ],
            },
            {
              header: "Spacers in the box",
              cells: [
                {
                  text: "No",
                  muted: true,
                },
                {
                  text: "No",
                  muted: true,
                },
                {
                  text: "**Yes, 8**",
                },
              ],
            },
            {
              header: "Best for",
              cells: [
                {
                  text: "Everything, if you clean them",
                },
                {
                  text: "A longer interval between cleans",
                },
                {
                  text: "Hard impacts, and the wettest riding",
                },
              ],
            },
          ],
        },
        {
          type: "columns",
          count: 2,
          items: [
            {
              heading: "What the pro line changes",
              paragraphs: [
                "All three run chrome steel races, so the pro line’s gains are in what is done to that steel. **61–64 HRC** is several points harder than the standard line, and hardness is what resists the pitting that ends a raceway. **Through‑hardened** means the whole ring sits at that hardness rather than a hard skin over a softer core, so it stays hard as the surface wears into it.",
                "The blackening is the third change and the one that matters most in a wet city. Black oxide is a conversion treatment that gives bare chrome steel some resistance to rust, which is the thing the standard line has none of. It is a surface, so it can be worn through and it is no substitute for drying a bearing out — but between three bearings that all run the same family of steel, it is the only one with anything standing between the raceway and the weather.",
              ],
            },
            {
              heading: "Which of the three",
              paragraphs: [
                "**Steel** for almost everyone. Chrome steel races, a nylon cage, rubber shields and a clean every few months will outlast most people’s interest in the question.",
                "**Ceramic** for balls that cannot rust, a little less friction, and a longer stretch between services. It does not make the bearing weatherproof; nothing in the standard line is.",
                "**Black Pro** if you are landing on your bearings — stairs, drops, transition — or riding through a monsoon. It is the hardest of the three and the only one with a corrosion treatment on the races. It is also the only set that **comes with spacers**, which is the part of this page most people skip and the part that decides whether a wheel still spins once the nut is done up.",
              ],
            },
          ],
        },
        {
          type: "note",
          text: "**Every bearing on this page is a 608**, so any of them fits any wheel we sell, any wheel anybody sells, and the surfskate as well as the skateboard. Bearings are the one part of a skateboard where the sizing question has no answer to get wrong.",
        },
        {
          type: "stocked",
          label: "Also in the range",
          text: "Beginner completes and our surfskates ship with their own bearings fitted, and those are not sold separately. All three sets above are made by Toucan Distribution, who make our trucks.",
        },
        {
          type: "crosslink",
          text: "Bearings and wheels are the first upgrade on a complete and the cheapest. Trucks come after, and the deck last.",
          cta: {
            label: "Bearings in the store",
            href: "/store/bearings",
          },
        },
      ],
    },
    {
      id: "faq",
      head: {
        kicker: "Common questions",
        title: "Still deciding?",
        intro:
          "Straight answers about bearings. What we happen to stock is at the end of each one.",
      },
      blocks: [
        {
          type: "faq",
          items: [
            {
              question: "Will better bearings make me faster?",
              answer: [
                "Less than you expect, and the comparison people make is usually the wrong one. Set a dirty bearing against a clean one and the difference is enormous. Set a clean cheap bearing against a clean expensive one and you will struggle to feel it on flat ground.",
                "What actually slows a skateboard down, in order: the urethane of the wheel flexing under your weight, the surface you are on, and then everything inside the bearing. That order does not change no matter what you spend.",
              ],
              stocked: {
                label: "What we stock",
                text: "Three sets, and the cheapest one plus a jar of solvent beats the dearest one left alone.",
              },
            },
            {
              question: "How often should I clean them?",
              answer: [
                "When they sound different or feel slower, which for most people is twice a year. Ride through a puddle and the clock resets that day — water sitting inside a bearing will put rust on the raceways within a week, and rust does not come off, it comes out as pits.",
                "Skateparks are dusty and dust is abrasive, so a park rider cleans more often than someone cruising on tarmac.",
              ],
              stocked: {
                label: "What we stock",
                text: "Chrome steel races across the standard line, which is what almost every skate bearing runs and which rusts if you leave it wet. All three sets run an oil rather than a grease, the fast end of that trade and the end that needs replacing.",
              },
            },
            {
              question: "Are ceramic bearings worth the money?",
              answer: [
                "For the reason on the box, no. The ceramic ball is a small part of the friction in a skate bearing, so the speed claim will not survive a side‑by‑side test with a well‑maintained steel set.",
                "Whether it is worth it in our range comes down to a narrower question than usual, because our steel and ceramic sets are identical apart from the balls — same chrome steel races at the same hardness, same cage, same shields, same oil. You are buying balls that are harder, lighter and cannot rust, and nothing else.",
                "Which is worth having, and is smaller than the marketing. The races those balls run in are the surfaces that end a bearing’s life, and they are chrome steel on both, so neither set is weatherproof. If you were hoping ceramic would let you stop drying your bearings out, it will not.",
              ],
              stocked: {
                label: "What we stock",
                text: "Both on the same races. The ceramic set goes longer between services; the steel set is the better buy for most people. If wet riding is the problem you are solving, Toucan Black Pro is the one with a corrosion treatment on the raceways.",
              },
            },
            {
              question: "Do I need bearing spacers?",
              answer: [
                "You need them more than you need better bearings. Without a spacer the axle nut has nothing rigid to clamp against, so its force travels through the balls, and a wheel that spun freely in your hand binds once it is bolted on. People blame the bearing and buy a new one.",
                "You can get away without them if you keep the nut loose enough to leave a trace of play, which is how most people ride. Fit spacers and you can do the nut up properly, which is safer and quieter, and the wheel still spins.",
              ],
              stocked: {
                label: "What we stock",
                text: "Toucan Black Pro ships with eight bearings and eight spacers in the box. Our completes and the two standard bearing sets do not, so assume they are not fitted. They are cheap and they go in from the outside without any special tool.",
              },
            },
            {
              question: "What is the number on the box, ABEC 7 or ABEC 9?",
              answer: [
                "It is the tolerance class the races were turned to, on a scale set for industrial bearings. A higher number means a rounder, truer race, measured in single micrometres, and holding that tolerance is hard to do. What the scale assumes is a speed a skate wheel never reaches. What it leaves out is the steel, the closure, the cage and the oil.",
                "Treat it as evidence that the factory can hold a tolerance, then go and find out what the bearing is closed with and what is inside it.",
              ],
              stocked: {
                label: "What we stock",
                text: "ABEC 7 on the steel and ceramic sets and ABEC 9 on Toucan Black Pro, all printed on their product pages. The figure above shows what the step between those two classes actually measures.",
              },
            },
            {
              question: "Can I put WD-40 in them?",
              answer: [
                "You can, and it will feel quick for about a week. It is a water dispersant and a solvent before it is a lubricant, so what it mostly does is thin and flush the oil that was in there. After it evaporates the bearing is running dry, and a dry bearing wears its raceways fast.",
                "If you have already done it, treat the bearing as due for a proper clean: strip it, wash the WD‑40 out with isopropyl alcohol or acetone, dry it, and oil it.",
              ],
              stocked: {
                label: "What we stock",
                text: "Every set ships pre‑lubricated with a racing oil. We do not sell the oil on its own yet, and any light oil sold for bearings will do when you service them.",
              },
            },
            {
              question:
                "One wheel spins much less than the others. Is that bearing dead?",
              answer: [
                "Probably not. Check three things in this order, because two of them are free. Undo the axle nut a quarter turn and spin it again, because an overtightened nut is the usual answer. Then take the wheel off and spin the bearings on the axle, because a bearing that spins freely off the board and badly on it is being clamped, and the fix is a spacer or a looser nut. Only then is it the bearing.",
                "A wheel spinning longer than its neighbours is also not proof of anything, because the wheel itself carries most of the difference. You are comparing wheels more than bearings.",
              ],
              stocked: {
                label: "What we stock",
                text: "The spacer and washer section above has the drawing of what is happening when a nut is doing the clamping.",
              },
            },
            {
              question: "Are skateboard and surfskate bearings different?",
              answer: [
                "Not in size. Both use 608s, eight to a board, so any skate bearing fits a surfskate wheel. A surfskate wheel is bigger and softer and turns more slowly for a given speed, which if anything is an easier life for the bearing than street skating is.",
                "Surfskates do spend their lives on roads instead of in parks, so they see more water and more grit, which puts the closure and the cleaning interval further up the list.",
              ],
              stocked: {
                label: "What we stock",
                text: "Our surfskates ship with their own bearings, which are not sold separately. When they wear out, any of our three sets fits the surfskate wheels exactly as it fits a skateboard wheel.",
              },
            },
          ],
        },
      ],
    },
  ],
  footer: {
    columns: [
      {
        heading: "Keep reading",
        links: [
          {
            label: "Skateboard buying guide",
            href: "/guides/skateboard-buying-guide",
          },
          {
            label: "Deck guide",
            href: "/guides/deck-guide",
          },
          {
            label: "Truck guide",
            href: "/guides/truck-guide",
          },
          {
            label: "Wheel guide",
            href: "/guides/wheel-guide",
          },
          {
            label: "Griptape guide",
            href: "/guides/griptape-guide",
          },
          {
            label: "Surfskate guide",
            href: "/guides/surfskate-guide",
          },
        ],
      },
      {
        heading: "Shop",
        links: [
          {
            label: "Bearings",
            href: "/store/bearings",
          },
          {
            label: "Wheels",
            href: "/store/wheels",
          },
          {
            label: "Completes",
            href: "/store/skateboard-completes",
          },
        ],
      },
      {
        heading: "More",
        links: [
          {
            label: "WeSkate Co.",
            href: "/",
          },
          {
            label: "Build your own setup",
            href: "/configurator",
          },
        ],
      },
    ],
    note: "The 608 dimensions, the ABEC tolerance classes, the revolutions‑per‑minute figures, the steel hardness bands and the ball grade system are industry standards and published sources rather than our own measurements; the drawings are made from those dimensions. Other brands’ specifications are quoted from their own published material and are named so you can judge a range against something, including ours. Availability varies and the store shows what is actually in stock. ©2026 WeSkate Co.",
  },
};

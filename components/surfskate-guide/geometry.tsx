import { renderRich } from "components/guides/rich";
import {
  Container,
  FigCaption,
  FigCard,
  GuideTable,
  Note,
  ProseCols,
  Section,
  SectionHeader,
} from "components/guides/ui";
import {
  GEO_BANDS,
  GEO_BANDS_CAPTION,
  GEO_CAPTION,
  GEO_NOTE,
  GEO_OUTLINE_COLS,
  GEO_OUTLINE_ROWS,
  GEO_PROSE,
  GEO_PROSE_2,
  GEO_PROSE_3,
  GEO_SECTION,
  GEO_STOCKED,
  GEO_SUB,
} from "lib/surfskate-guide/data";
import { GEO_FIGURE, OUTLINE_FIGURE } from "lib/surfskate-guide/figures";
import { Stocked, SurfFigure } from "./bits";

const CLASH = { fontFamily: "'Clash Display', sans-serif" };

export default function GeometrySection() {
  return (
    <Section id="geo" bg="muted">
      <Container>
        <SectionHeader
          kicker={GEO_SECTION.kicker}
          title={GEO_SECTION.title}
          intro={GEO_SECTION.intro}
        />

        <FigCard tone="plain">
          <figure>
            <SurfFigure html={GEO_FIGURE} />
            <FigCaption>{GEO_CAPTION}</FigCaption>
          </figure>
        </FigCard>

        <ProseCols items={GEO_PROSE} tone="plain" />

        {/* Wheelbase bands */}
        <div className="rounded-[16px] border border-neutral-200 bg-white px-5 md:px-6">
          {GEO_BANDS.map((band) => (
            <div
              key={band.title}
              className="grid grid-cols-1 gap-2 border-b border-neutral-100 py-4 last:border-b-0 sm:grid-cols-[130px_1fr] sm:gap-6"
            >
              <p
                className="text-base font-bold uppercase tracking-[-1%] text-black"
                style={CLASH}
              >
                {band.title}
              </p>
              <p className="text-sm md:text-base text-black font-[400] leading-[160%]">
                {renderRich(band.text)}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs md:text-sm text-neutral-500 leading-[160%]">
          {GEO_BANDS_CAPTION}
        </p>

        <ProseCols items={GEO_PROSE_2} columns={3} tone="plain" />

        {/* Sub-head: Outlines */}
        <div className="flex max-w-3xl flex-col gap-3 border-t border-neutral-200 pt-6 md:gap-4 md:pt-8">
          <h3
            className="text-xl md:text-[32px] font-bold tracking-[-1%] uppercase leading-none text-black"
            style={CLASH}
          >
            {GEO_SUB.title}
          </h3>
          <p className="text-sm md:text-xl text-black font-[400] leading-[140%]">
            {renderRich(GEO_SUB.intro)}
          </p>
        </div>

        <FigCard tone="plain">
          <SurfFigure html={OUTLINE_FIGURE} />
        </FigCard>

        <GuideTable
          srLabel="Outline"
          cols={GEO_OUTLINE_COLS}
          rows={GEO_OUTLINE_ROWS}
          cue
          fade="muted"
        />

        <ProseCols items={GEO_PROSE_3} tone="plain" />

        <Note text={GEO_NOTE} />

        <Stocked text={GEO_STOCKED} />
      </Container>
    </Section>
  );
}

import {
  Container,
  FigCaption,
  FigCard,
  GuideTable,
  ProseCols,
  Section,
  SectionHeader,
} from "components/guides/ui";
import {
  SPRING_CAPTION,
  SPRING_PROSE,
  SPRING_SECTION,
  SPRING_STOCKED,
  SPRING_TABLE_CAPTION,
  SPRING_TABLE_COLS,
  SPRING_TABLE_ROWS,
  SPRING_WATCH,
} from "lib/surfskate-guide/data";
import { SPRING_FIGURE } from "lib/surfskate-guide/figures";
import { Stocked, SurfFigure, Watch } from "./bits";

export default function SpringSection() {
  return (
    <Section id="spring">
      <Container>
        <SectionHeader
          kicker={SPRING_SECTION.kicker}
          title={SPRING_SECTION.title}
          intro={SPRING_SECTION.intro}
        />

        <FigCard tone="muted">
          <figure>
            <SurfFigure html={SPRING_FIGURE} />
            <FigCaption>{SPRING_CAPTION}</FigCaption>
          </figure>
        </FigCard>

        <GuideTable
          srLabel="Attribute"
          cols={SPRING_TABLE_COLS}
          rows={SPRING_TABLE_ROWS}
          cue
        />
        <p className="mt-3 max-w-4xl text-xs md:text-sm text-neutral-500 leading-[160%]">
          {SPRING_TABLE_CAPTION}
        </p>

        <Watch title={SPRING_WATCH.title} body={SPRING_WATCH.body} />

        <ProseCols items={SPRING_PROSE} columns={3} tone="muted" />

        <Stocked text={SPRING_STOCKED} />
      </Container>
    </Section>
  );
}

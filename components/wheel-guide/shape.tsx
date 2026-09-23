import classicImg from "components/icons/wheel_guide/wheel-shape-classic.png";
import { SectionHeader, Container, Section } from "components/guides/ui";
import conicalImg from "components/icons/wheel_guide/wheel-shape-conical.png";
import radialImg from "components/icons/wheel_guide/wheel-shape-radial.png";
import {
  SHAPE_CAPTION,
  SHAPE_EXTRA,
  SHAPE_INTRO,
  SHAPE_OPENING,
  SHAPES,
} from "lib/wheel-guide/data";
import type { ShapeProfile } from "lib/wheel-guide/data";
import Image from "next/image";

// Each diagram shows both views: square on to the riding surface (left) and
// cut through the axle (right), contact patch highlighted in both.
const SHAPE_IMAGES: Record<ShapeProfile["id"], typeof classicImg> = {
  classic: classicImg,
  conical: conicalImg,
  radial: radialImg,
};

const SHAPE_ALT: Record<ShapeProfile["id"], string> = {
  classic:
    "Classic wheel diagram: square-on view with a narrow contact patch, and the wheel cut through the axle showing rounded shoulders",
  conical:
    "Conical wheel diagram: square-on view with a wide contact patch, and the wheel cut through the axle showing straight-cut shoulders",
  radial:
    "Radial wheel diagram: square-on view with a wide contact patch, and the wheel cut through the axle showing a scooped-in sidewall",
};

export default function ShapeSection() {
  return (
    <Section id="shape" bg="muted">
      <Container>
        {/* Header */}
        <SectionHeader kicker="04 — Shape" title="Shape" intro={SHAPE_INTRO} />

        <p className="text-sm md:text-lg text-black font-[400] leading-[150%] max-w-4xl">
          {SHAPE_OPENING}
        </p>

        {/* Three profiles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {SHAPES.map((profile) => (
            <div
              key={profile.id}
              className="bg-white rounded-[16px] p-5 md:p-6 flex flex-col gap-4"
            >
              <Image
                src={SHAPE_IMAGES[profile.id]!}
                alt={SHAPE_ALT[profile.id]!}
                className="w-full h-auto"
              />
              <h3
                className="text-lg md:text-[24px] font-bold tracking-[-1%] uppercase leading-none"
                style={{ fontFamily: "'Clash Display', sans-serif" }}
              >
                {profile.name}
              </h3>
              <p className="text-sm md:text-base text-black font-[400] leading-[150%]">
                {profile.text}
              </p>
            </div>
          ))}
        </div>

        <p className="text-xs md:text-sm text-neutral-600 leading-[160%] max-w-4xl">
          {SHAPE_CAPTION}
        </p>

        {/* Extra blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {SHAPE_EXTRA.map((block) => (
            <div
              key={block.title}
              className="bg-white border border-neutral-100 rounded-[16px] p-5 md:p-6 flex flex-col gap-3"
            >
              <h3
                className="text-base md:text-xl font-bold tracking-[-1%] uppercase leading-none"
                style={{ fontFamily: "'Clash Display', sans-serif" }}
              >
                {block.title}
              </h3>
              <p className="text-sm md:text-base text-black font-[400] leading-[150%]">
                {block.text}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

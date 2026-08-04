import mission1 from "components/icons/skatepark/mission1.png";
import mission2 from "components/icons/skatepark/mission2.png";
import mission3 from "components/icons/skatepark/mission3.png";
import mission4 from "components/icons/skatepark/mission4.png";
import Image from "next/image";

const MISSIONS = [
  {
    id: "mission1",
    src: mission1,
    alt: "Skatepark concrete design",
    aspect: "aspect-[754/581]",
    widthClass: "w-[300px] sm:w-[500px] md:w-[754px]",
  },
  {
    id: "mission2",
    src: mission2,
    alt: "Ramp construction and skating",
    aspect: "aspect-[361/342]",
    widthClass: "w-[180px] sm:w-[280px] md:w-[361px]",
  },
  {
    id: "mission3",
    src: mission3,
    alt: "Design office workspace",
    aspect: "aspect-[594/457]",
    widthClass: "w-[240px] sm:w-[400px] md:w-[594px]",
  },
  {
    id: "mission4",
    src: mission4,
    alt: "Skatepark project build",
    aspect: "aspect-[501/385]",
    widthClass: "w-[220px] sm:w-[340px] md:w-[501px]",
  },
];

export default function OurMissionSection() {
  return (
    <section className="w-full bg-white text-black py-10 md:py-20 overflow-hidden">
      {/* Header Block aligned to standard max-width container */}
      <div className="mx-auto max-w-(--breakpoint-2xl) px-4 lg:px-15 mb-8 md:mb-12">
        <div className="flex flex-col gap-4 max-w-[600px]">
          <h2
            className="text-[24px] md:text-[45px] font-bold tracking-[-1%] text-black uppercase leading-none"
            style={{ fontFamily: "'Clash Display', sans-serif" }}
          >
            OUR MISSION
          </h2>
          <p
            className="text-sm md:text-lg leading-[120%] text-black font-[400]"
            style={{ fontFamily: "'Clash Display', sans-serif" }}
          >
            To foster the growth of skateboarding by designing and constructing
            spaces that inspire creativity, inclusivity, and community engagement.
          </p>
        </div>
      </div>

      {/* Horizontal Scroll Container - Unconstrained on the right to scroll out past padding */}
      <div className="w-full overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex gap-[16px] items-start min-w-max px-4 lg:px-15 2xl:px-[calc((100vw-1536px)/2+3.75rem)] pb-4 pr-4">
          {MISSIONS.map((item) => (
            <div
              key={item.id}
              className={`relative shrink-0 ${item.widthClass} ${item.aspect} rounded-[8px] overflow-hidden bg-neutral-100`}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 80vw, 50vw"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

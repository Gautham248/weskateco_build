import j1 from "components/icons/school/journey_1.svg";
import j2 from "components/icons/school/journey_2.svg";
import j3 from "components/icons/school/journey_3.svg";
import j4 from "components/icons/school/journey_4.svg";
import j5 from "components/icons/school/journey_5.svg";
import j6 from "components/icons/school/journey_6.svg";
import Image from "next/image";

const STAGES = [
  {
    stage: "Foundation",
    title: "Foundation",
    icon: j1,
  },
  {
    stage: "Stage 02",
    title: "Skill Development",
    icon: j2,
  },
  {
    stage: "Stage 03",
    title: "Competition",
    icon: j3,
  },
  {
    stage: "Stage 04",
    title: "High performance",
    icon: j4,
  },
  {
    stage: "Stage 05",
    title: "International Immersion",
    icon: j5,
  },
  {
    stage: "Stage 06",
    title: "Olympic Pathway",
    icon: j6,
  },
];

export default function JourneySection() {
  return (
    <section className="w-full bg-white py-12 md:py-[120px]">
      <div className="mx-auto w-full max-w-(--breakpoint-2xl) px-4 lg:px-15">
        {/* Header */}
        <h2
          className="text-[clamp(28px,4.5vw,60px)] font-bold tracking-tight uppercase text-black text-center mb-8 md:mb-14 select-none"
          style={{ fontFamily: "'Clash Display', sans-serif" }}
        >
          THE JOURNEY
        </h2>

        {/* 6 Stage Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 items-stretch">
          {STAGES.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#F4F4F6] rounded-[8px] p-6 flex flex-col justify-between h-full min-h-[205px]"
            >
              {/* Stage Top Tag */}
              <span
                className="text-xs md:text-sm text-black font-medium leading-[100%] tracking-[-1%]"
                style={{ fontFamily: "'Clash Display', sans-serif" }}
              >
                {item.stage}
              </span>

              {/* Icon */}
              <div className="my-auto flex items-center justify-left py-6">
                <Image
                  src={item.icon}
                  alt={item.title}
                  width={64}
                  height={64}
                  className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 object-contain"
                />
              </div>

              {/* Stage Title */}
              <h3
                className="text-sm md:text-lg font-medium text-black leading-[100%] tracking-[-1%]"
                style={{ fontFamily: "'Clash Display', sans-serif" }}
              >
                {item.title}
              </h3>
            </div>
          ))}
        </div>

        {/* Bottom Description */}
        <div className="mt-10 md:mt-14 max-w-3xl mx-auto text-center">
          <p
            className="text-xs sm:text-sm md:text-base text-black font-normal leading-[120%] tracking-[0%]"
            style={{ fontFamily: "'Clash Display', sans-serif" }}
          >
            Every student begins with the fundamentals. Those who demonstrate passion and commitment can continue progressing through increasingly advanced stages, creating a genuine pathway from school programs to competitive skateboarding
          </p>
        </div>
      </div>
    </section>
  );
}

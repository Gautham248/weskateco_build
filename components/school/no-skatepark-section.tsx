import sp1 from "components/icons/school/skatepark_1.png";
import sp2 from "components/icons/school/skatepark_2.png";
import sp3 from "components/icons/school/skatepark_3.png";
import sp4 from "components/icons/school/skatepark_4.png";
import Image from "next/image";

const PLACES = [
  {
    title: "Basketball Court",
    image: sp1,
  },
  {
    title: "School Playground",
    image: sp2,
  },
  {
    title: "Assembly Area",
    image: sp3,
  },
  {
    title: "Concrete Surface",
    image: sp4,
  },
];

export default function NoSkateparkSection() {
  return (
    <section className="w-full bg-[#F4F4F6] py-12 md:py-[120px]">
      <div className="mx-auto w-full max-w-(--breakpoint-2xl) px-4 lg:px-15 flex flex-col gap-8 md:gap-12">
        {/* Section Heading */}
        <h2
          className="text-[clamp(28px,4.5vw,60px)] font-bold tracking-tight uppercase text-black select-none"
          style={{ fontFamily: "'Clash Display', sans-serif" }}
        >
          NO SKATEPARK? NO PROBLEM.
        </h2>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 md:gap-5">
          {PLACES.map((item, idx) => (
            <div
              key={idx}
              className="relative w-full aspect-[405/487] rounded-[4px] overflow-hidden bg-neutral-200 shadow-xs"
            >
              {/* Image */}
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover rounded-[4px]"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                priority={idx < 2}
              />

              {/* Bottom Black Info Overlay Box: height 78px, pl-30px, pr-10px, py-10px, gap-10px */}
              <div className="absolute bottom-0 inset-x-0 max-h-[64px] bg-black text-white flex items-center px-[30px] py-[24px] gap-[10px]">
                <h3
                  className="text-base md:text-base font-medium text-white tracking-[-1%] leading-none uppercase"
                  style={{ fontFamily: "'Clash Display', sans-serif" }}
                >
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Centered Description Paragraph */}
        <div className="max-w-6xl mx-auto text-center">
          <p
            className="text-sm md:text-xl text-black font-normal leading-[130%] tracking-[0%]"
            style={{ fontFamily: "'Clash Display', sans-serif" }}
          >
            Our curriculum is designed to operate on any flat, hard surface. Schools can begin immediately without investing in permanent infrastructure. Portable ramps can be introduced as the program grows.
          </p>
        </div>
      </div>
    </section>
  );
}

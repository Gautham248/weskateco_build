import b1 from "components/icons/school/beyond_1.png";
import b2 from "components/icons/school/beyond_2.png";
import b3 from "components/icons/school/beyond_3.png";
import b4 from "components/icons/school/beyond_4.png";
import Image from "next/image";

const PROGRAMS = [
  {
    title: "Summer Camps",
    image: b1,
  },
  {
    title: "After School Programs",
    image: b2,
  },
  {
    title: "Workshops",
    image: b3,
  },
  {
    title: "Performance Coaching",
    image: b4,
  },
];

export default function BeyondClassesSection() {
  return (
    <section className="w-full bg-[#F4F4F6] py-12 md:py-[120px]">
      <div className="mx-auto w-full max-w-(--breakpoint-2xl) px-4 lg:px-15 flex flex-col gap-8 md:gap-12">
        {/* Section Heading */}
        <h2
          className="text-[clamp(28px,4.5vw,60px)] font-bold tracking-tight uppercase text-black select-none"
          style={{ fontFamily: "'Clash Display', sans-serif" }}
        >
          BEYOND WEEKLY CLASSES
        </h2>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 md:gap-5">
          {PROGRAMS.map((item, idx) => (
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

              {/* Bottom Black Info Overlay Box */}
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
      </div>
    </section>
  );
}

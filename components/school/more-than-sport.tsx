import more1 from "components/icons/school/more_1.png";
import more2 from "components/icons/school/more_2.png";
import more3 from "components/icons/school/more_3.png";
import more4 from "components/icons/school/more_4.png";
import more5 from "components/icons/school/more_5.jpg";
import Image from "next/image";

const cards = [
  {
    image: more1,
    title: "Sharpens Focus",
    description: "Structured practice improves concentration.",
  },
  {
    image: more2,
    title: "Balance & Coordination",
    description: "Develops motor skills and body awareness.",
  },
  {
    image: more3,
    title: "Problem Solving",
    description: "Students learn through experimentation and persistence.",
  },
  {
    image: more4,
    title: "Creates Healthy Habits",
    description: "Physical activity with creativity and self-expression.",
  },
  {
    image: more5,
    title: "Builds Resilience",
    description: "Overcoming challenges builds confidence and character.",
  },
];

export default function MoreThanSportSection() {
  return (
    <section className="relative w-full bg-white py-12 md:pt-[60px] md:pb-[120px] overflow-hidden">
      {/* Header Container aligned with container grid */}
      <div className="mx-auto w-full max-w-(--breakpoint-2xl) px-4 lg:px-15 mb-6 md:mb-10">
        <h2
          className="text-[clamp(28px,4.5vw,60px)] font-bold tracking-tight uppercase text-black select-none"
          style={{ fontFamily: "'Clash Display', sans-serif" }}
        >
          MORE THAN JUST A SPORT
        </h2>
      </div>

      {/* Horizontal Scroll Container - Unconstrained on the right to scroll out past padding */}
      <div className="w-full overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden py-2">
        <div className="flex gap-5 sm:gap-6 items-start min-w-max px-4 lg:px-15 2xl:px-[calc((100vw-1536px)/2+3.75rem)] pb-4 pr-4">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className="w-[280px] sm:w-[340px] md:w-[380px] lg:w-[424px] max-w-[424px] shrink-0 snap-start flex flex-col gap-4"
            >
              {/* Square Image Box (1:1 aspect ratio, max width 424px), rounded-[8px] */}
              <div className="relative w-full aspect-square rounded-[8px] overflow-hidden shadow-sm bg-neutral-100">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-cover rounded-[8px]"
                  sizes="(max-width: 768px) 80vw, 424px"
                  priority={idx < 2}
                />
              </div>

              {/* Text Card Box with fixed uniform height & single-line title */}
              <div className="bg-black text-white p-5 sm:p-6 rounded-[8px] flex flex-col justify-center gap-2 h-[124px] shrink-0">
                <h3
                  className="text-base md:text-xl font-bold uppercase tracking-tight text-white leading-none whitespace-nowrap overflow-hidden text-ellipsis"
                  style={{ fontFamily: "'Clash Display', sans-serif" }}
                >
                  {card.title}
                </h3>
                <p
                  className="text-xs sm:text-sm text-white font-[400] leading-relaxed"
                  style={{ fontFamily: "'Clash Display', sans-serif" }}
                >
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

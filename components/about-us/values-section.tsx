import fireImg from "components/icons/about_us/about_us_values_fire.jpg";
import Image from "next/image";

const VALUES = [
  {
    title: "Ride it first",
    body: "Everything we make is tested on our own setups through Indian summers and monsoons. Every park is ridden by our team before handover. If it doesn't ride right, it isn't finished.",
  },
  {
    title: "No gatekeeping",
    body: "First day on a board or first contest run: same park, same session, same respect.",
  },
  {
    title: "Skate what you've got",
    body: "Broken tar, long monsoons, one park for a whole city. We skate it anyway, and we'll run a session anywhere that's skateable.",
  },
  {
    title: "Credit the scene",
    body: "We name the riders, filmers and artists behind our work. We back the crews who came before us and the ones skating with us now.",
  },
];

export default function ValuesSection() {
  return (
    <section className="w-full bg-white pb-16 md:pb-24">
      <div className="mx-auto w-full max-w-(--breakpoint-2xl) px-4 lg:px-15">
        <svg width="0" height="0" aria-hidden className="absolute">
          <defs>
            <clipPath id="aboutValuesCard" clipPathUnits="objectBoundingBox">
              <path d="M 0 0.058 A 0.030 0.058 0 0 1 0.030 0 L 0.718 0 A 0.030 0.058 0 0 1 0.748 0.058 L 0.668 0.942 A 0.030 0.058 0 0 1 0.638 1 L 0.030 1 A 0.030 0.058 0 0 1 0 0.942 Z" />
            </clipPath>
            <clipPath id="aboutValuesPhoto" clipPathUnits="objectBoundingBox">
              <path d="M 0.779 0.058 A 0.030 0.058 0 0 1 0.809 0 L 0.970 0 A 0.030 0.058 0 0 1 1 0.058 L 1 0.942 A 0.030 0.058 0 0 1 0.970 1 L 0.728 1 A 0.030 0.058 0 0 1 0.698 0.942 Z" />
            </clipPath>
          </defs>
        </svg>

        <div className="flex flex-col gap-6 md:relative md:block md:aspect-[1459/553] md:gap-0">
          <div className="md:absolute md:inset-0 md:[clip-path:url(#aboutValuesCard)]">
            <div className="flex h-full w-full flex-col justify-between rounded-[24px] bg-gradient-to-br from-[#4a4a4a] to-[#151515] p-6 md:w-[74.8%] md:rounded-none md:py-[48px] md:pr-10 md:pl-[83px]">
              {VALUES.map((value) => (
                <div key={value.title}>
                  <h3
                    className="text-lg font-bold uppercase tracking-tight text-white md:text-xl"
                    style={{ fontFamily: "'Clash Display', sans-serif" }}
                  >
                    {value.title}
                  </h3>
                  <p
                    className="mt-1 max-w-[600px] text-sm leading-[140%] text-white/70 md:text-base"
                    style={{ fontFamily: "'Clash Display', sans-serif" }}
                  >
                    {value.body}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="md:absolute md:inset-0 md:[clip-path:url(#aboutValuesPhoto)]">
            <div className="relative min-h-[320px] w-full overflow-hidden rounded-[24px] md:absolute md:top-0 md:right-0 md:h-full md:min-h-0 md:w-[33.2%] md:rounded-none">
              <Image
                src={fireImg}
                alt="Skateboarder mid-air over a ramp lit by fire at night"
                fill
                sizes="(max-width: 768px) 100vw, 440px"
                className="object-cover object-[50%_42%]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

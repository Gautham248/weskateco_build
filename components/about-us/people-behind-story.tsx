function TimelineArrow() {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      aria-hidden
      className="h-auto w-14 md:w-20 text-black"
    >
      <path
        d="M12 8 58 54 36 68 100 108"
        stroke="currentColor"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M74 106 102 109 92 82"
        stroke="currentColor"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function PeopleBehindStory() {
  return (
    <section className="w-full bg-white py-12 md:py-20">
      <div className="mx-auto w-full max-w-(--breakpoint-2xl) px-4 lg:px-15 flex flex-col gap-16 md:gap-24">
        <div className="flex justify-start">
          <p
            className="max-w-4xl text-base md:text-xl lg:text-2xl font-medium text-black leading-[135%] tracking-[-0.01em]"
            style={{ fontFamily: "'Clash Display', sans-serif" }}
          >
            Our founder, <span className="font-bold">Anish Christopher</span>{" "}
            aka <span className="font-bold">Kevin</span>, came up in that scene.
            He started skating in Bengaluru in 2012 with the Holystoked crew,
            was coaching kids within a few years, and started building DIY
            skateparks before moving into professionally building world standard
            skateparks. He also appears in the Netflix film Skater Girl.
          </p>
        </div>

        <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-2 md:gap-16">
          <div className="flex flex-col gap-4">
            <TimelineArrow />
            <h3
              className="text-2xl font-semibold tracking-[-0.01em] text-black md:text-4xl"
              style={{ fontFamily: "'Clash Display', sans-serif" }}
            >
              In December
            </h3>
            <span
              className="text-[clamp(72px,14vw,220px)] font-bold leading-[0.82] tracking-[-0.03em] text-black"
              style={{ fontFamily: "'Clash Display', sans-serif" }}
            >
              2024
            </span>
          </div>

          <p
            className="max-w-xl text-base font-medium leading-[135%] tracking-[-0.01em] text-black md:mt-40 md:text-xl lg:text-2xl"
            style={{ fontFamily: "'Clash Display', sans-serif" }}
          >
            <span className="font-bold">Kevin</span> founded{" "}
            <span className="font-bold">Toucan Distribution</span> in Bengaluru
            with <span className="font-bold">Jerin Luke</span> and{" "}
            <span className="font-bold">Arun Karottu</span>. The first stockroom
            was the spare bedroom in his apartment.
          </p>
        </div>
      </div>
    </section>
  );
}

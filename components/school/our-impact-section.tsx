const STATS = [
  {
    title: "Students Trained",
    value: "1000+",
  },
  {
    title: "Schools Supplied",
    value: "250+",
  },
  {
    title: "Skateparks Built",
    value: "35+",
  },
];

export default function OurImpactSection() {
  return (
    <section className="w-full bg-white py-12 md:py-[120px]">
      <div className="mx-auto w-full max-w-(--breakpoint-2xl) px-4 lg:px-15 flex flex-col items-start md:items-center gap-6 md:gap-14">
        {/* Section Heading */}
        <h2
          className="text-[clamp(28px,4.5vw,60px)] font-bold tracking-tight uppercase text-black text-left md:text-center w-full select-none"
          style={{ fontFamily: "'Clash Display', sans-serif" }}
        >
          OUR IMPACT
        </h2>

        {/* 3 Impact Cards Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-5">
          {STATS.map((item, idx) => (
            <div
              key={idx}
              className="bg-black text-white rounded-[8px] p-6 sm:p-8 lg:p-10 flex flex-col justify-between aspect-[360/227] md:aspect-[547/456] shadow-sm"
            >
              {/* Title */}
              <h3
                className="text-left text-[20px] md:text-[28px] font-medium text-white tracking-[-1%]"
                style={{ fontFamily: "'Clash Display', sans-serif" }}
              >
                {item.title}
              </h3>

              {/* Stat Number Value */}
              <span
                className="text-right self-end w-full text-[80px] md:text-[96px] font-bold text-white tracking-tight leading-[70%]"
                style={{ fontFamily: "'Clash Display', sans-serif" }}
              >
                {item.value}
              </span>
            </div>
          ))}
        </div>

        {/* Subtitle Paragraph below cards */}
        <div className="max-w-md w-full text-left md:text-center">
          <p
            className="text-sm md:text-base text-black font-normal leading-[18px] md:leading-relaxed"
            style={{ fontFamily: "'Clash Display', sans-serif" }}
          >
            Preparing athletes for international competition across Thailand, Indonesia and Japan.
          </p>
        </div>
      </div>
    </section>
  );
}

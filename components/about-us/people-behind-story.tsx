export default function PeopleBehindStory() {
  return (
    <section className="w-full bg-white pt-4 pb-12 md:pt-6 md:pb-20">
      <div className="mx-auto w-full max-w-(--breakpoint-2xl) px-4 lg:px-15">
        <div
          className="relative mx-auto w-[68%]"
          style={{ containerType: "inline-size" }}
        >
          <div className="md:pt-[5.2cqi]">
            <div className="md:flex md:items-start">
              {/* Heading: display face/weight matching "THE PEOPLE BEHIND", tight lines, 2024 indented */}
              <div
                className="relative shrink-0 text-[10cqi] leading-[0.95] font-bold tracking-[-0.02em] text-black md:text-[5.5cqi]"
                style={{ fontFamily: '"Clash Display", sans-serif' }}
              >
                <span className="block whitespace-nowrap md:absolute md:bottom-full md:left-0">
                  In December
                </span>
                <span className="block whitespace-nowrap md:ml-[1.5cqi]">
                  2024
                </span>
              </div>

              {/* Paragraph: same type as the founder paragraph, sitting directly right of "2024" */}
              <p
                className="mt-5 w-full text-[16px] leading-[1.4] text-black md:mt-0 md:ml-6 md:w-[60cqi] md:shrink-0 md:text-[18px]"
                style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
              >
                <span className="font-bold">Kevin</span> founded{" "}
                <span className="font-bold">Toucan Distribution</span> in
                Bengaluru with <span className="font-bold">Jerin Luke</span> and{" "}
                <span className="font-bold">Arun Karottu</span>. The first
                stockroom was the spare bedroom in his apartment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

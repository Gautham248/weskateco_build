export default function OneLastTrySection() {
  return (
    <section className="w-full bg-white pt-12 pb-16 md:pt-16 md:pb-12">
      <div className="mx-auto w-full max-w-(--breakpoint-2xl) px-4 lg:px-15">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:gap-8">
          <h2
            className="bg-gradient-to-br from-[#3a3a3a] to-[#1a1a1a] bg-clip-text text-right text-[clamp(44px,8vw,120px)] font-black uppercase leading-[0.8] tracking-[-0.03em] text-transparent select-none md:ml-[4%]"
            style={{ fontFamily: "'Clash Display', sans-serif" }}
          >
            ONE
            <br />
            LAST
            <br />
            TRY
          </h2>

          <p
            className="max-w-[520px] shrink-0 text-base font-semibold leading-[135%] tracking-[-0.01em] text-black md:text-2xl"
            style={{ fontFamily: "'Clash Display', sans-serif" }}
          >
            Our motto.
            <br />
            The light is going,
            <br />
            your legs are done,
            <br />
            and you go again.
            <br />
            It&apos;s the first lesson at the Academy,
            <br />
            and it&apos;s often the try that lands.
          </p>
        </div>
      </div>
    </section>
  );
}

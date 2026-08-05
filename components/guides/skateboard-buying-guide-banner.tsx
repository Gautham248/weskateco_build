import skateboardGuideBanner from "components/icons/skateboard_guide/skateboard_guide_banner.png";
import Image from "next/image";

export default function SkateboardBuyingGuideHeroBanner() {
  return (
    <section className="relative h-screen w-full overflow-hidden -mt-[72px]">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={skateboardGuideBanner}
          alt="Skateboard Buying Guide background"
          fill
          className="object-cover object-[30%_center] md:object-center"
          priority
        />
      </div>
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(0deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), linear-gradient(310.04deg, rgba(0, 0, 0, 0.45) 15%, rgba(0, 0, 0, 0) 55%)",
        }}
      />

      {/* Content Overlay */}
      <div className="relative z-10 mx-auto h-full max-w-(--breakpoint-2xl) px-4 lg:px-15 flex flex-col justify-end pb-12 md:pb-20 lg:pb-24">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 lg:gap-16 w-full">
          {/* Left: Heading */}
          <div className="flex flex-col">
            <h1
              className="text-[clamp(32px,6.5vw,100px)] leading-[clamp(32px,6.5vw,100px)] font-bold text-white tracking-[-1%] uppercase select-none"
              style={{ fontFamily: "'Clash Display', sans-serif" }}
            >
              SKATEBOARD
              <br />
              BUYING GUIDE
            </h1>
          </div>

          {/* Right: Paragraph Block */}
          <div className="max-w-xl flex flex-col items-start gap-4">
            <h2
              className="text-xl md:text-[32px] font-bold text-white leading-[100%]"
              style={{ fontFamily: "'Clash Display', sans-serif" }}
            >
              New to skateboarding? Not sure what to buy?
            </h2>
            <p
              className="text-sm md:text-[22px] text-white/90 leading-[100%] font-[400]"
              style={{ fontFamily: "'Clash Display', sans-serif" }}
            >
              This guide will help you choose the right skateboard - whether
              you&apos;re a beginner, upgrading your setup, or buying for
              someone else. Let&apos;s break it down in simple terms, no jargon,
              no fluff.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

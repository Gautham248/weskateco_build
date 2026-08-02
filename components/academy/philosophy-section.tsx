import academy1 from "components/icons/academy/academy1.png";
import academy2 from "components/icons/academy/academy2.png";
import academy3 from "components/icons/academy/academy3.png";
import academy4 from "components/icons/academy/academy4.png";
import academy5 from "components/icons/academy/academy5.png";
import academy6 from "components/icons/academy/academy6.png";
import Image from "next/image";

export default function PhilosophySection() {
  return (
    <section className="w-full bg-white text-black py-16 md:py-24 overflow-hidden">
      <div className="mx-auto max-w-(--breakpoint-2xl) px-4 lg:px-15">
        {/* Main 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-6 items-start">
          {/* ================= COLUMN 1 (Left: Col-span-3 fit to academy1 width) ================= */}
          <div className="lg:col-span-3 flex flex-col gap-6 w-full max-w-[402px]">
            {/* Header Block with text extending into next column space */}
            <div className="flex flex-col gap-5 lg:w-[180%] lg:max-w-[472px] z-10">
              <h2
                className="text-[24px] md:text-[45px] font-bold tracking-[-1%] text-black uppercase leading-none"
                style={{ fontFamily: "'Clash Display', sans-serif" }}
              >
                OUR PHILOSOPHY
              </h2>
              <div
                className="text-xs sm:text-base leading-[120%] text-black"
                style={{ fontFamily: "'Clash Display', sans-serif" }}
              >
                <p className="font-medium">
                  Skateboarding isn&apos;t just a sport—it&apos;s a battle.
                </p>
                <p className="font-[400]">
                  It&apos;ll wreck your body, mess with your head, and test your
                  grit every damn day. If you want to go all the way, you&apos;ve
                  got to be strong, sharp, and ready to eat pavement more times
                  than you can count.
                </p>
              </div>
            </div>

            {/* Image 1: academy1 */}
            <div className="relative w-full aspect-[402/484] rounded-lg overflow-hidden bg-neutral-100">
              <Image
                src={academy1}
                alt="Skater jump"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 25vw"
              />
            </div>
          </div>

          {/* ================= COLUMN 2 (Right: Col-span-9 with 2 Rows) ================= */}
          <div className="lg:col-span-9 flex flex-col gap-6 lg:gap-6 lg:pt-[64px]">
            {/* ROW 1: Images 2, 3, & 4 aligned to bottom of the row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-6 items-end">
              {/* Image 2 */}
              <div className="relative w-full aspect-[401/356] rounded-lg overflow-hidden bg-neutral-100">
                <Image
                  src={academy2}
                  alt="Academy group session"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
              </div>

              {/* Image 3 */}
              <div className="relative w-full aspect-[424/525] rounded-lg overflow-hidden bg-neutral-100">
                <Image
                  src={academy3}
                  alt="Ramp skateboarding"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
              </div>

              {/* Image 4 (decreased size) */}
              <div className="relative w-[85%] max-w-[310px] aspect-[357/425] rounded-lg overflow-hidden bg-neutral-100 self-end">
                <Image
                  src={academy4}
                  alt="Kid bowl skating"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 20vw"
                />
              </div>
            </div>

            {/* ROW 2: Images 5, 6 & Secondary text block */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 lg:gap-6 items-start">
              {/* Image 5 (cols 1-7) */}
              <div className="sm:col-span-5 relative w-full aspect-[540/510] rounded-lg overflow-hidden bg-neutral-100">
                <Image
                  src={academy5}
                  alt="Group photo with coach"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
              </div>

              {/* Image 6 + Secondary Text (cols 8-12) */}
              <div className="sm:col-span-5 flex flex-col gap-6">
                {/* Image 6 (decreased size) */}
                <div className="relative w-[85%] max-w-[320px] aspect-[402/288] rounded-lg overflow-hidden bg-neutral-100">
                  <Image
                    src={academy6}
                    alt="Skater dropping in"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                </div>

                {/* Secondary Text Block */}
                <div
                  className="flex flex-col gap-4 text-xs sm:text-base leading-[120%] text-black"
                  style={{ fontFamily: "'Clash Display', sans-serif" }}
                >
                  <div className="w-[414px]">
                    <span className="font-semibold">New to the game?</span> We&apos;ve
                    got your back. We teach you how to control your board—and how to
                    hit the ground without wrecking yourself. Safety isn&apos;t
                    soft. It&apos;s smart.
                  </div>

                  <div className="w-[414px]">
                    <span className="font-semibold">Already ripping?</span> We go all
                    in. Training plans that cover your diet, strength, stamina, and
                    style—built to push limits and hit long-term goals. No fluff.
                    Just progress.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
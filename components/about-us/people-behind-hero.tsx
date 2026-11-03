import peopleImg1 from "components/icons/about_us/about_us_people_1.jpg";
import peopleImg2 from "components/icons/about_us/about_us_people_2.jpg";
import peopleImg3 from "components/icons/about_us/about_us_people_3.jpg";
import Image from "next/image";

export default function PeopleBehindHero() {
  return (
    <section className="w-full bg-white py-12 md:py-20">
      <div className="mx-auto w-full max-w-(--breakpoint-2xl) px-4 lg:px-15">
        <div
          className="mx-auto flex w-[68%] flex-col gap-6 select-none sm:gap-10"
          style={{ fontFamily: '"Clash Display", sans-serif' }}
        >
          <p className="max-w-[340px] text-lg font-bold leading-[100%] tracking-[-0.01em] text-black md:text-2xl">
            We are a community driven by grit, built on persistence, and united
            by skateboarding.
          </p>

          <div
            className="relative aspect-[1.28] w-full"
            style={{ containerType: "inline-size" }}
          >
            {/* WE' / RE stacked at top-left with the outlined quote glyph after WE */}
            <div className="absolute top-[2%] left-[2%] z-30 w-[32%]">
              <div className="flex w-full items-start">
                <svg
                  viewBox="0 0 342.591 132"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-auto"
                  style={{ width: "84.5%" }}
                >
                  <path
                    d="M82.5427 132.002H27.5799L0 0.012207H41.3699L52.4018 67.189L55.9478 96.9359H58.5088L63.8278 67.189L81.5577 0.012207H137.309L153.462 67.189L158.19 96.9359H160.751L164.691 67.189L177.102 0.012207H217.684L187.543 132.002H132.581L118.791 75.463L110.123 34.0931H107.562L98.3027 75.463L82.5427 132.002Z"
                    fill="#0b0b0b"
                  />
                  <path
                    d="M342.591 132.002H225.376V0.012207H342.591V33.3051H262.412V49.065H339.636V82.1609H262.412V98.7089H342.591V132.002Z"
                    fill="#0b0b0b"
                  />
                </svg>
                <div
                  className="flex items-start self-start"
                  style={{ width: "12.8%", marginLeft: "2%" }}
                >
                  <svg
                    viewBox="350.454 1.26 55.004 81.87"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-auto w-full"
                  >
                    <path
                      d="M405.458 1.26465V48.3271C405.458 60.2127 401.947 68.8452 395.594 74.5264C389.217 80.2293 379.781 83.1348 367.586 83.1348H352.575V58.2969H366.173C369.049 58.2968 371.544 57.8961 373.272 56.2812C375.017 54.6494 375.671 52.0764 375.671 48.5625V44.0137H350.454V1.26465H405.458Z"
                      stroke="#0b0b0b"
                      strokeWidth="3"
                    />
                  </svg>
                </div>
              </div>

              <div className="mt-[2%] w-full">
                <svg
                  viewBox="412.719 0 162.034 83.2547"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-auto"
                  style={{ marginLeft: "6.8%", width: "77.7%" }}
                >
                  <path
                    d="M436.08 83.2547H412.719V0H461.304C483.299 0 494.855 9.1953 494.855 25.4734C494.855 38.6451 488.269 46.4735 472.364 48.4617V49.7043C480.938 51.941 483.671 56.0416 486.778 62.3789L497.092 83.2547H470.127L460.186 62.8759C457.204 56.6629 454.719 54.9232 445.648 54.9232H436.08V83.2547ZM436.08 21.0001V37.5267H461.056C467.89 37.5267 470.375 36.2841 470.375 29.2013C470.375 22.6155 467.89 21.0001 461.056 21.0001H436.08Z"
                    fill="#0b0b0b"
                  />
                  <path
                    d="M574.753 83.2547H500.817V0H574.753V21.0001H524.178V30.9409H572.889V51.8167H524.178V62.2546H574.753V83.2547Z"
                    fill="#0b0b0b"
                  />
                </svg>
              </div>
            </div>

            {/* THE / PEOPLE right of tile C and under tile A; BEHIND below, left-aligned with tile C */}
            <div className="absolute top-[44%] left-[34%] z-30 text-[16cqi] leading-[0.8] font-bold tracking-[-0.02em] text-black uppercase">
              THE
            </div>
            <div className="absolute top-[61%] left-[34%] z-30 text-[16cqi] leading-[0.8] font-bold tracking-[-0.02em] whitespace-nowrap text-black uppercase">
              PEOPLE
            </div>
            <div className="absolute top-[78%] left-[2%] z-30 text-[16cqi] leading-[0.8] font-bold tracking-[-0.02em] whitespace-nowrap text-black uppercase">
              BEHIND
            </div>

            {/* Three image tiles */}
            <div className="absolute top-0 left-[34%] z-20 aspect-square w-[30%] overflow-hidden rounded-lg bg-[#cfd1d0] shadow-sm">
              <Image
                src={peopleImg1}
                alt="WeSkateCo community member"
                fill
                sizes="(max-width: 768px) 20vw, 320px"
                className="object-cover"
              />
            </div>
            <div className="absolute top-[15%] left-[66%] z-20 aspect-square w-[30%] overflow-hidden rounded-lg bg-[#cfd1d0] shadow-sm">
              <Image
                src={peopleImg2}
                alt="Skateboarder riding a ramp at dusk"
                fill
                sizes="(max-width: 768px) 20vw, 320px"
                className="object-cover"
              />
            </div>
            <div className="absolute top-[29%] left-[2%] z-20 aspect-square w-[30%] overflow-hidden rounded-lg bg-[#cfd1d0] shadow-sm">
              <Image
                src={peopleImg3}
                alt="WeSkateCo community member holding a skateboard"
                fill
                sizes="(max-width: 768px) 20vw, 320px"
                className="object-cover object-top"
              />
            </div>
          </div>
        </div>

        <p
          className="mx-auto mt-8 w-[68%] text-[16px] leading-[1.4] text-black md:mt-10 md:text-[18px]"
          style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
        >
          Our founder, <span className="font-bold">Anish Christopher</span> aka{" "}
          <span className="font-bold">Kevin</span>, came up in that scene. He
          started skating in Bengaluru in 2012 with the Holystoked crew, was
          coaching kids within a few years, and started building DIY skateparks
          before moving into professionally building world standard skateparks.
          He also appears in the Netflix film Skater Girl.
        </p>
      </div>
    </section>
  );
}

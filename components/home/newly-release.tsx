import NewlyReleaseContent from "./newly-release-content";

export default function NewlyRelease() {
  return (
    <section className="h-auto md:h-screen w-full bg-white pt-10 md:pt-[120px] pb-10 md:mb-[100px]">
      <div className="mx-auto max-w-(--breakpoint-2xl) px-4 h-auto md:h-full flex flex-col">
        <h2
          className="text-[clamp(1.5rem,5vw,3.75rem)] font-black tracking-tight text-black dark:text-white uppercase"
          style={{ fontFamily: "'Clash Display', sans-serif", letterSpacing: "-0.01em" }}
        >
          NEWLY RELEASED
        </h2>
        <div className="mt-4 md:mt-10 h-auto aspect-[10/16] max-h-[560px] md:h-full md:aspect-auto md:flex-1 md:max-h-none">
          <div
            className="w-full h-full rounded-[16px] p-[2px]"
            style={{
              background: "linear-gradient(127.97deg, #3C3C3C 6.87%, #999999 71.92%)",
            }}
          >
            <div
              className="w-full h-full rounded-[16px] overflow-hidden relative flex items-center justify-center"
              style={{
                background: "linear-gradient(262.47deg, #141414 13.74%, #393939 98.84%)",
              }}
            >
              <NewlyReleaseContent />
              {/* Mobile SVG */}
              <svg width="324" height="530" viewBox="0 0 324 530" fill="none" xmlns="http://www.w3.org/2000/svg" className="md:hidden w-[fit-content] h-[80%] absolute bottom-0 right-[-32px] pointer-events-none">
                <path d="M1 529.465V334.685C1 150.396 150.396 1.00001 334.684 1.00001" stroke="url(#paint0_linear_3294_13647)" strokeWidth="2" />
                <defs>
                  <linearGradient id="paint0_linear_3294_13647" x1="64.0088" y1="124.017" x2="334.684" y2="265.233" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#3C3C3C" />
                    <stop offset="1" stop-color="#999999" />
                  </linearGradient>
                </defs>
              </svg>
              {/* Desktop SVG */}
              <svg width="1082" height="716" viewBox="0 0 1082 716" fill="none" xmlns="http://www.w3.org/2000/svg" className="hidden md:block w-[fit-content] h-[80%] absolute top-0 right-0 pointer-events-none">
                <path d="M1 -0.267578C1 394.54 321.055 714.596 715.863 714.596H1081.29" stroke="url(#paint0_linear_3254_912)" strokeWidth="2" />
                <defs>
                  <linearGradient id="paint0_linear_3254_912" x1="16.194" y1="98.9013" x2="539.496" y2="715.994" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#3C3C3C" />
                    <stop offset="1" stopColor="#999999" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

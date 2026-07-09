import NewlyReleaseContent from "./newly-release-content";

export default function NewlyRelease() {
  return (
    <section className="h-screen w-full bg-white pt-[120px] mb-[100px] pb-[20px]">
      <div className="mx-auto max-w-(--breakpoint-2xl) px-6 h-full flex flex-col">
        <h2
          className="text-[#000000] uppercase"
          style={{
            fontFamily: "'Clash Display', sans-serif",
            fontWeight: 700,
            fontSize: "60px",
            lineHeight: "51px",
            letterSpacing: "-1%",
          }}
        >
          NEWLY RELEASED
        </h2>
        <div className="mt-10 flex-1">
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
              <svg width="1082" height="716" viewBox="0 0 1082 716" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[fit-content] h-[80%] absolute top-0 right-0 pointer-events-none">
                <path d="M1 -0.267578C1 394.54 321.055 714.596 715.863 714.596H1081.29" stroke="url(#paint0_linear_3254_912)" strokeWidth="2"/>
                <defs>
                  <linearGradient id="paint0_linear_3254_912" x1="16.194" y1="98.9013" x2="539.496" y2="715.994" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#3C3C3C"/>
                    <stop offset="1" stopColor="#999999"/>
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

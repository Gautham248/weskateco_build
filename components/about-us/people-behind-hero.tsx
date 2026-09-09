export default function PeopleBehindHero() {
  return (
    <div
      className="w-full max-w-3xl mx-auto flex flex-col gap-6 sm:gap-10 select-none"
      style={{ fontFamily: '"Clash Display", sans-serif' }}
    >
      <p className="ml-[4.8%] max-w-[280px] text-lg md:text-2xl font-bold text-black leading-[100%] tracking-[-1%]">
        We are a community driven by grit, built on persistence, and united by
        skateboarding.
      </p>

      <div
        className="relative w-full aspect-square bg-white overflow-hidden"
        style={{ containerType: "inline-size" }}
      >
        <div className="absolute top-[3%] left-[4.8%] w-[29.5%] z-30">
          <div className="flex items-start w-full">
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
                className="w-full h-auto"
              >
                <path
                  d="M405.458 1.26465V48.3271C405.458 60.2127 401.947 68.8452 395.594 74.5264C389.217 80.2293 379.781 83.1348 367.586 83.1348H352.575V58.2969H366.173C369.049 58.2968 371.544 57.8961 373.272 56.2812C375.017 54.6494 375.671 52.0764 375.671 48.5625V44.0137H350.454V1.26465H405.458Z"
                  stroke="#0b0b0b"
                  strokeWidth="3"
                />
              </svg>
            </div>
          </div>

          <div className="mt-1 sm:mt-1.5 w-full">
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

        <div className="absolute top-[32%] left-[35.8%] z-30 leading-none tracking-[-1%] text-black font-black text-[14.5cqi] uppercase">
          THE
        </div>
        <div className="absolute top-[43.3%] left-[35.8%] z-30 leading-none tracking-[-1%] text-black font-black text-[14.5cqi] uppercase whitespace-nowrap">
          PEOPLE
        </div>
        <div className="absolute top-[55.2%] left-[4.8%] z-30 leading-none tracking-[-1%] text-black font-black text-[14.5cqi] uppercase whitespace-nowrap">
          BEHIND
        </div>

        <div className="absolute top-[26.5%] left-[4.8%] w-[29.5%] aspect-square z-20 rounded-lg bg-[#cfd1d0] overflow-hidden shadow-sm" />
        <div className="absolute top-[3%] left-[35.8%] w-[29.5%] aspect-square z-20 rounded-lg bg-[#cfd1d0] overflow-hidden shadow-sm" />
        <div className="absolute top-[14.3%] right-[3.8%] w-[29.5%] aspect-square z-20 rounded-lg bg-[#cfd1d0] overflow-hidden shadow-sm" />
        <div className="absolute top-[68.5%] left-[4.8%] w-[29.5%] aspect-square z-20 rounded-lg bg-[#cfd1d0] overflow-hidden shadow-sm" />
        <div className="absolute top-[56.8%] right-[3.8%] w-[29.5%] aspect-square z-20 rounded-lg bg-[#cfd1d0] overflow-hidden shadow-sm" />
      </div>
    </div>
  );
}

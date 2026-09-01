import coachesImg from "components/icons/school/coaches.png";
import Image from "next/image";

function GreenArrowIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 6.92096H12.6378M6.81888 12.8419L12.6378 6.92096L6.81888 1"
        stroke="#1D6A2B"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const SAFETY_FEATURES = [
  { id: "coaches", label: "Accredited Coaches" },
  { id: "safety-verified", label: "Child Safety Verified" },
  { id: "first-aid", label: "First Aid Trained" },
  { id: "safety-protocols", label: "Standard Safety Protocols" },
  { id: "equipment", label: "Equipment Included" },
  { id: "supervision", label: "Continuous Supervision" },
  { id: "progress-reports", label: "Progress Reports" },
];

export default function SafeStructuredSection() {
  return (
    <section className="w-full bg-[#F4F4F6] py-12 md:py-[120px]">
      <div className="mx-auto w-full max-w-(--breakpoint-2xl) px-4 lg:px-15 flex flex-col gap-8 md:gap-12">
        {/* Section Heading */}
        <h2
          className="text-[clamp(28px,4.5vw,60px)] font-bold tracking-tight uppercase text-black select-none"
          style={{ fontFamily: "'Clash Display', sans-serif" }}
        >
          SAFE. STRUCTURED. SCHOOL READY.
        </h2>

        {/* Main Grid: Left Image + Right Feature List */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-28 items-start">
          {/* Left Column: Coaches Image */}
          <div className="lg:col-span-6 w-full">
            <div className="relative w-full aspect-[580/420] rounded-md overflow-hidden shadow-sm bg-neutral-200">
              <Image
                src={coachesImg}
                alt="Coaches conducting skateboarding lesson"
                fill
                className="object-cover rounded-md"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
          </div>

          {/* Right Column: Feature List */}
          <div className="lg:col-span-6 flex flex-col gap-5 md:gap-6">
            {SAFETY_FEATURES.map((item, idx) => {
              const isActive = idx === 0;
              return (
                <div
                  key={item.id}
                  className="flex items-center text-left transition-colors group w-fit"
                >
                  {/* Arrow Circle Badge */}
                  <div
                    className={`transition-all duration-300 ease-out flex items-center justify-center shrink-0 rounded-full bg-[#CCFF02] ${
                      isActive
                        ? "w-8 h-8 opacity-100 scale-100 mr-3 md:mr-4"
                        : "w-0 h-8 opacity-0 scale-75 mr-0 overflow-hidden"
                    }`}
                  >
                    <GreenArrowIcon />
                  </div>

                  {/* Feature Label */}
                  <span
                    className={`text-xl md:text-[32px] leading-[120%] tracking-[-2%] transition-colors ${
                      isActive
                        ? "text-black font-medium"
                        : "text-[#9E9E9E] hover:text-neutral-700 font-medium"
                    }`}
                    style={{ fontFamily: "'Clash Display', sans-serif" }}
                  >
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

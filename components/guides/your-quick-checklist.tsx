"use client";

function GreenCheckIcon() {
  return (
    <svg
      width="12"
      height="9"
      viewBox="0 0 18 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17 1L6 12L1 7"
        stroke="#1D6A2B"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const CHECKLIST_ITEMS = [
  {
    id: 1,
    text: "First-time skater? Get a beginner complete",
  },
  {
    id: 2,
    text: 'Buying for a kid? Stick to 7.25"–7.5" deck width',
  },
  {
    id: 3,
    text: "Unsure about size? Use your shoe size as a guide",
  },
  {
    id: 4,
    text: 'Buying for yourself? 7.75"–8.0" fits most adults',
  },
];

export default function YourQuickChecklistSection() {
  return (
    <section className="w-full bg-[#F7F7F9] text-black py-12 md:py-16 overflow-hidden">
      <div className="mx-auto max-w-(--breakpoint-2xl) px-4 lg:px-15 flex flex-col gap-8 md:gap-12">
        {/* Title */}
        <h2
          className="text-2xl md:text-[36px] font-bold tracking-[-1%] text-black uppercase leading-none"
          style={{ fontFamily: "'Clash Display', sans-serif" }}
        >
          YOUR QUICK CHECKLIST
        </h2>

        {/* 2-Column Grid of Checklist Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-8 md:gap-x-20 items-center">
          {CHECKLIST_ITEMS.map((item) => (
            <div key={item.id} className="flex items-center gap-3.5 md:gap-4">
              <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-[#CCFF02] flex items-center justify-center shrink-0">
                <GreenCheckIcon />
              </div>
              <span className="text-sm md:text-xl text-black font-normal leading-[140%]">
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

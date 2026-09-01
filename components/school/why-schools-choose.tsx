function SkateIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.50519 18.9347C7.15437 18.7165 7.74452 18.3516 8.22978 17.8684L17.8668 8.23135C18.2891 7.80437 18.6205 7.29615 18.8407 6.73744C19.061 6.17872 19.1656 5.58113 19.1482 4.98082C19.1309 4.38052 18.9919 3.78997 18.7398 3.24491C18.4876 2.69985 18.1275 2.21162 17.6812 1.80975C17.4989 1.63083 17.2743 1.50102 17.0283 1.43245C16.7823 1.36387 16.5229 1.35877 16.2744 1.41761C16.0259 1.47645 15.7963 1.59732 15.6072 1.76893C15.418 1.94055 15.2755 2.1573 15.1928 2.39894C15.0173 3.1553 14.6483 3.85309 14.122 4.42397L4.42275 14.1232C3.85182 14.6497 3.15389 15.0188 2.39738 15.1943C2.13524 15.2867 1.90319 15.4487 1.7261 15.6629C1.549 15.8772 1.43355 16.1355 1.39212 16.4104C1.35068 16.6852 1.38482 16.9661 1.49088 17.223C1.59694 17.48 1.77091 17.7032 1.99416 17.8687C2.5715 18.4499 3.30009 18.8579 4.09736 19.0463C4.89464 19.2347 5.72875 19.196 6.50519 18.9347Z"
        fill="#EE2A7B"
      />
      <path
        d="M20.1222 10.576C19.934 10.3891 19.7044 10.249 19.4521 10.1672C19.1997 10.0854 18.9316 10.0641 18.6695 10.1051L19.2047 9.56984C19.9389 8.83088 20.389 7.85673 20.4759 6.81871C20.5628 5.78069 20.2809 4.74526 19.6798 3.89453C19.8855 4.73371 19.875 5.61136 19.6493 6.44538C19.4236 7.2794 18.9899 8.04253 18.389 8.66337L8.70662 18.3458C8.14781 18.9029 7.46784 19.3233 6.71975 19.5743C5.81479 19.8795 4.84166 19.9209 3.91406 19.6936C4.47685 20.0933 5.1262 20.3541 5.80906 20.4548C6.49192 20.5555 7.18892 20.4933 7.84313 20.2732C8.49231 20.055 9.08246 19.6901 9.56772 19.2069L10.0995 18.6751C10.0453 19.0288 10.1043 19.3907 10.2679 19.7089C10.4316 20.0272 10.6917 20.2856 11.0109 20.4472C11.3302 20.6089 11.6924 20.6655 12.0458 20.6091C12.3992 20.5527 12.7257 20.386 12.9788 20.133C13.2319 19.8799 13.3985 19.5534 13.4549 19.2C13.5114 18.8466 13.4547 18.4844 13.293 18.1651C13.1314 17.8459 12.873 17.5858 12.5547 17.4221C12.2365 17.2585 11.8747 17.1995 11.5209 17.2537L17.2481 11.5268C17.2052 11.8134 17.2364 12.1062 17.3387 12.3773C17.4411 12.6484 17.6112 12.8887 17.8328 13.0754C18.0544 13.2621 18.3202 13.3888 18.6047 13.4436C18.8893 13.4984 19.1831 13.4794 19.4582 13.3884C19.7333 13.2974 19.9805 13.1374 20.1762 12.9237C20.3719 12.71 20.5096 12.4497 20.5762 12.1677C20.6427 11.8857 20.6359 11.5913 20.5564 11.3127C20.4769 11.034 20.3276 10.7804 20.1222 10.576Z"
        fill="#EE2A7B"
      />
    </svg>
  );
}

const REASONS = [
  {
    id: "curriculum",
    title: "Complete Curriculum",
    description: "Age-appropriate lesson plans.",
  },
  {
    id: "equipment",
    title: "Equipment Included",
    description: "Boards, helmets and safety gear provided.",
  },
  {
    id: "infrastructure",
    title: "Infrastructure Support",
    description: "Portable ramps or permanent skateparks.",
  },
  {
    id: "coaches",
    title: "Certified Coaches",
    description: "Experienced, accredited and first-aid trained.",
  },
  {
    id: "tracking",
    title: "Progress Tracking",
    description: "Structured assessment for every student.",
  },
  {
    id: "partner",
    title: "One Trusted Partner",
    description: "Academy, gear & skateparks—one ecosystem.",
  },
];

export default function WhySchoolsChooseSection() {
  return (
    <section className="w-full bg-[#F4F4F6] py-12 md:py-[120px]">
      <div className="mx-auto w-full max-w-(--breakpoint-2xl) px-4 lg:px-15">
        {/* Section Heading */}
        <h2
          className="text-[clamp(28px,4.5vw,60px)] font-bold tracking-tight uppercase text-black mb-8 md:mb-12 select-none"
          style={{ fontFamily: "'Clash Display', sans-serif" }}
        >
          WHY SCHOOLS CHOOSE WESKATE CO
        </h2>

        {/* 6 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 lg:gap-6">
          {REASONS.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-[16px] p-6 lg:p-8 flex flex-col justify-between shadow-xs gap-8"
            >
              {/* Pink Icon Circle Badge */}
              <div className="w-10 h-10 rounded-full bg-[#F4F4F4] flex items-center justify-center shrink-0">
                <SkateIcon />
              </div>

              {/* Card Title & Description */}
              <div className="flex flex-col gap-2">
                <h3
                  className="text-xl md:text-[28px] font-medium text-black leading-[100%] tracking-[-1%]"
                  style={{ fontFamily: "'Clash Display', sans-serif" }}
                >
                  {item.title}
                </h3>
                <p
                  className="text-sm md:text-lg text-black font-normal leading-[100%]"
                  style={{ fontFamily: "'Clash Display', sans-serif" }}
                >
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

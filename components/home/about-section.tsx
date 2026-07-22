"use client";

import aboutImg from "components/icons/about.png";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry) {
          setIsInView(entry.isIntersecting);
        }
      },
      { threshold: 0.1 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-auto aspect-square md:h-screen md:aspect-auto w-full overflow-hidden bg-black select-none"
    >
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={aboutImg}
          alt="About Background"
          fill
          className="object-cover object-[43.5%_center] md:object-center"
          priority
        />
        {/* Dark overlay to ensure text readability against the background */}
        <div className="absolute inset-0 bg-black/40" />

        {/* SVG Drawing Animation Overlay */}
        <svg
          viewBox="0 0 1082 716"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`absolute top-0 left-[20%] right-0 w-[80%] h-[75%] overflow-visible pointer-events-none z-10 ${isInView ? "animate-path" : ""
            }`}
          preserveAspectRatio="none"
        >
          <style>{`
            #drawing-path {
              /* 2000 is a safe estimate above the actual path length */
              stroke-dasharray: 2000;
              stroke-dashoffset: 2000;
            }

            .animate-path #drawing-path {
              animation: drawLine 2.5s ease-out forwards;
            }

            @keyframes drawLine {
              to {
                stroke-dashoffset: 0;
              }
            }
          `}</style>

          <path
            id="drawing-path"
            d="M1 -0.267578C1 394.54 321.055 714.596 715.863 714.596H1082"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
          />

          <defs>
            <linearGradient
              id="paint0_linear_3254_912"
              x1="16.194"
              y1="98.9013"
              x2="539.496"
              y2="715.994"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#3C3C3C" />
              <stop offset="1" stopColor="#999999" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 mx-auto max-w-(--breakpoint-2xl) px-4 lg:px-15 h-full md:h-auto md:absolute md:bottom-0 md:left-0 md:right-0 flex flex-row items-end md:items-center justify-between pb-8 pt-12 md:py-24">
        {/* Left Side: Description Text */}
        <div className="max-w-[45%] mb-0 md:max-w-md md:w-5/12">
          <h2
            className="md:hidden font-normal leading-tight tracking-tight text-[#d4ff00] text-xs sm:text-xs text-balance"
            style={{ fontFamily: "'Clash Display', sans-serif" }}
          >
            We are a community driven by grit, built on persistence, and united
            by skateboarding.
          </h2>
          <h2
            className="hidden md:block font-bold leading-tight tracking-tight text-[#d4ff00] lg:fluid-text-3xl text-4xl"
            style={{ fontFamily: "'Clash Display', sans-serif" }}
          >
            We are a community driven by grit, built on persistence, and united
            by skateboarding.
          </h2>
        </div>

        {/* Right Side: Large Title & CTA Button Container */}
        <div className="relative flex flex-col items-end w-[50%] md:w-7/12">
          <div className="relative inline-block tracking-tighter select-none w-full max-w-[575px]">
            {/* SVG replacing WE'RE text */}
            <svg
              width="575"
              height="132"
              viewBox="0 0 575 132"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-auto"
            >
              <path
                d="M405.458 1.26465V48.3271C405.458 60.2127 401.947 68.8452 395.594 74.5264C389.217 80.2293 379.781 83.1348 367.586 83.1348H352.575V58.2969H366.173C369.049 58.2968 371.544 57.8961 373.272 56.2812C375.017 54.6494 375.671 52.0764 375.671 48.5625V44.0137H350.454V1.26465H405.458Z"
                stroke="#CCFF02"
                strokeWidth="2.5"
              />
              <path
                d="M436.08 83.2547H412.719V0H461.304C483.299 0 494.855 9.1953 494.855 25.4734C494.855 38.6451 488.269 46.4735 472.364 48.4617V49.7043C480.938 51.941 483.671 56.0416 486.778 62.3789L497.092 83.2547H470.127L460.186 62.8759C457.204 56.6629 454.719 54.9232 445.648 54.9232H436.08V83.2547ZM436.08 21.0001V37.5267H461.056C467.89 37.5267 470.375 36.2841 470.375 29.2013C470.375 22.6155 467.89 21.0001 461.056 21.0001H436.08Z"
                fill="#CCFF02"
              />
              <path
                d="M574.753 83.2547H500.817V0H574.753V21.0001H524.178V30.9409H572.889V51.8167H524.178V62.2546H574.753V83.2547Z"
                fill="#CCFF02"
              />
              <path
                d="M82.5427 132.002H27.5799L0 0.012207H41.3699L52.4018 67.189L55.9478 96.9359H58.5088L63.8278 67.189L81.5577 0.012207H137.309L153.462 67.189L158.19 96.9359H160.751L164.691 67.189L177.102 0.012207H217.684L187.543 132.002H132.581L118.791 75.463L110.123 34.0931H107.562L98.3027 75.463L82.5427 132.002Z"
                fill="#CCFF02"
              />
              <path
                d="M342.591 132.002H225.376V0.012207H342.591V33.3051H262.412V49.065H339.636V82.1609H262.412V98.7089H342.591V132.002Z"
                fill="#CCFF02"
              />
            </svg>

            {/* CTA Button positioned inside the SVG empty space under 'RE */}
            <div className="absolute left-[60.9%] right-0 bottom-[-2%] z-20 h-[30%]">
              <Link
                href="/about"
                className="group flex items-center justify-between rounded-full bg-black border border-neutral-900 px-3 md:px-5 text-[6px] sm:text-[clamp(0.5rem,0.8vw,0.875rem)] md:text-[clamp(0.625rem,1vw,1rem)] font-bold tracking-widest text-[#d4ff00] uppercase transition-all duration-300 hover:bg-neutral-950 hover:border-neutral-800 w-full h-full"
              >
                <span className="truncate">CTA BUTTON</span>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="animate-nudge-x w-[1.1vw] h-[1.1vw] min-w-[10px] min-h-[10px] shrink-0"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

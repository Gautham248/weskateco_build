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
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative h-auto aspect-square md:h-screen md:aspect-auto w-full overflow-hidden bg-black select-none">
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
            <linearGradient id="paint0_linear_3254_912" x1="16.194" y1="98.9013" x2="539.496" y2="715.994" gradientUnits="userSpaceOnUse">
              <stop stopColor="#3C3C3C" />
              <stop offset="1" stopColor="#999999" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 mx-auto flex h-full flex-row items-end justify-between pl-4 pr-5 md:px-4 pb-8 pt-12 md:px-6 md:py-24 lg:px-12">

        {/* Left Side: Description Text */}
        <div className="max-w-[45%] mb-0 md:max-w-md md:w-5/12">
          <h2 className="font-bold leading-tight tracking-tight text-[#d4ff00] font-sans fluid-text-xl sm:fluid-text-2xl lg:fluid-text-3xl text-balance">
            We are a community driven by grit, built on persistence, and united by skateboarding.
          </h2>
        </div>

        {/* Right Side: Large Title & CTA Button Container */}
        <div className="relative flex flex-col items-end md:w-7/12">
          <div className="relative inline-flex items-start tracking-tighter select-none">

            <h1 className="flex items-start text-[clamp(3rem,15vw,15rem)] font-black uppercase text-[#d4ff00] sm:text-[clamp(3rem,14vw,14rem)] lg:text-[clamp(3rem,11vw,11rem)] leading-[0.8] font-sans">
              {/* WE */}
              <span className="leading-[0.8]">WE</span>

              {/* Wrapper container for the Apostrophe + RE to establish the exact button width bounds */}
              <span className="relative inline-flex items-start">

                {/* Custom Apostrophe Frame */}
                <span className="inline-flex items-center justify-center w-[0.36em] h-[0.6em] mr-[-0.03em] ml-[-0.03em] translate-y-[0.05em] shrink-0 mt-[-0.02em]">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 130" width="100%" height="100%">
                    <path
                      d="M 15,10 
              L 85,10 
              L 85,85 
              A 35,35 0 0,1 50,120 
              L 15,120 
              L 15,90 
              L 45,90 
              L 45,70 
              L 15,70 
              Z"
                      fill="none"
                      stroke="#d4ff00"
                      strokeWidth="11"
                      strokeLinejoin="miter"
                      strokeLinecap="square"
                    />
                  </svg>
                </span>

                {/* 'RE' */}
                <span className="text-[0.60em] font-black leading-[0.8] mt-[0.04em] translate-y-[0.04em]">
                  RE
                </span>

                {/* CTA Button anchored strictly inside the width of the Apostrophe + RE area */}
                <div className="absolute left-0 right-0 bottom-[-0.05em] z-20 translate-y-[100%]">
                  <Link
                    href="/about"
                    className="!w-[fit-content] group flex items-center justify-between rounded-full bg-black border border-neutral-900 p-1 md:px-3 md:py-1.5 text-[clamp(0.625rem,1.75vw,1.25rem)] sm:text-[clamp(0.625rem,0.8vw,0.875rem)] md:text-[clamp(0.625rem,1vw,1rem)] font-bold tracking-widest text-[#d4ff00] uppercase transition-all duration-300 hover:bg-neutral-950 hover:border-neutral-800 w-full"
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

              </span>
            </h1>

          </div>
        </div>
      </div>
    </section>
  );
}
"use client";

import blueFull from "components/icons/blue_skateboard_full.png";
import blueWheels from "components/icons/blue_skateboard_wheels.png";
import yellowFull from "components/icons/yellow_skateboard_full.png";
import yellowWheels from "components/icons/yellow_skateboard_wheels.png";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const slides = [
  {
    full: yellowFull,
    wheels: yellowWheels,
    title: "BEGINNER SKATEBOARD SPHERE",
    subtitle: "LOGO COMPLETE",
    price: "₹ 8499",
    oldPrice: "₹ 10999",
    heightClass: "h-[160%]"
  },
  {
    full: blueFull,
    wheels: blueWheels,
    title: "BUDDY & CARE 66",
    subtitle: "STREET SERIES",
    price: "₹ 8499",
    oldPrice: "₹ 10999",
    heightClass: "h-[170%]"
  },
];

export default function NewlyReleaseContent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const slideIndexRef = useRef(slideIndex);
  const isTransitioning = useRef(false);
  const maxSlide = slides.length - 1;

  useEffect(() => {
    slideIndexRef.current = slideIndex;
  }, [slideIndex]);

  const handleNext = () => {
    if (isTransitioning.current) return;
    isTransitioning.current = true;
    setSlideIndex((prev) => (prev >= maxSlide ? 0 : prev + 1));
    setTimeout(() => {
      isTransitioning.current = false;
    }, 800);
  };

  const handlePrev = () => {
    if (isTransitioning.current) return;
    isTransitioning.current = true;
    setSlideIndex((prev) => (prev <= 0 ? maxSlide : prev - 1));
    setTimeout(() => {
      isTransitioning.current = false;
    }, 800);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < 20) return;
      e.preventDefault();
      if (e.deltaY > 0) {
        setSlideIndex((prev) => (prev >= maxSlide ? 0 : prev + 1));
      } else {
        setSlideIndex((prev) => (prev <= 0 ? maxSlide : prev - 1));
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, [maxSlide]);

  return (
    <div ref={containerRef} className="w-full h-full flex items-center justify-center select-none">

      {/* ================= DESKTOP VIEW ================= */}
      <div
        className="hidden md:flex w-full h-full items-center justify-center gap-8 px-12"
        onClick={handleNext}
      >
        {/* Left: 3D Flipping Product Card & Details */}
        <div className="flex-1 flex items-center justify-center [perspective:1200px] z-1">
          <div className="relative w-full max-w-[344px] aspect-[103/156] [transform-style:preserve-3d]">
            {slides.map((slide, idx) => {
              const isActive = idx === slideIndex;
              return (
                <div
                  key={idx}
                  className="absolute inset-0 flex flex-col gap-4 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: isActive
                      ? "rotateY(0deg) scale(1) translateX(0px)"
                      : idx < slideIndex
                        ? "rotateY(-180deg) scale(0.85) translateX(-100px)"
                        : "rotateY(180deg) scale(0.85) translateX(100px)",
                    opacity: isActive ? 1 : 0,
                    pointerEvents: isActive ? "auto" : "none",
                  }}
                >
                  <div className="relative w-full aspect-[3/4] bg-[#e3e3e3] rounded-[16px] overflow-hidden">
                    <Image
                      src={slide.wheels}
                      alt={`skateboard wheels ${idx}`}
                      fill
                      className="object-cover"
                      sizes="414px"
                    />
                  </div>

                  <div className="w-full text-black pt-4 flex flex-col justify-center bg-white rounded-[16px] p-4">
                    <h3 className="text-xs md:text-sm font-medium tracking-tight text-black uppercase leading-tight" style={{ fontFamily: "Archivo" }}>
                      {slide.title}
                    </h3>
                    <h2 className="text-xs md:text-sm font-medium tracking-tight text-black uppercase mt-0.5 leading-tight" style={{ fontFamily: "Archivo" }}>
                      {slide.subtitle}
                    </h2>
                    <div className="flex items-center gap-2 mt-3 text-xs md:text-sm font-normal">
                      <span className="text-black">{slide.price}</span>
                      <span className="line-through text-red-500 scale-95 origin-left">{slide.oldPrice}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Enlarged Full Skateboard */}
        <div className="flex-1 flex items-center justify-center overflow-hidden h-full relative z-1">
          <div className={`relative w-[600px] top-40 origin-top transition-[height] duration-500 ${slides[slideIndex]?.heightClass || "h-[160%]"}`}>
            {slides.map((slide, idx) => {
              const isActive = idx === slideIndex;
              const isPast = idx < slideIndex;

              let translateY = "120%";
              if (isActive) translateY = "12.5%";
              else if (isPast) translateY = "-120%";

              return (
                <div
                  key={idx}
                  className="absolute inset-0 transition-all duration-800 ease-[cubic-bezier(0.25,1,0.5,1)]"
                  style={{ transform: `translateY(${translateY})` }}
                >
                  <Image
                    src={slide.full}
                    alt={`skateboard ${idx}`}
                    fill
                    className="object-contain object-top"
                    sizes="600px"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ================= MOBILE VIEW (Transparent over your existing BG) ================= */}
      <div className="flex md:hidden relative w-full h-[80%] max-w-[360px] aspect-[10/16] p-6">
        <div className="relative w-full h-full flex items-center justify-between z-10">

          {/* Left Side: Skateboard Presentation */}
          <div className="w-[80%] h-full relative flex items-center justify-center">
            {slides.map((slide, idx) => {
              const isActive = idx === slideIndex;
              return (
                <div
                  key={idx}
                  className="absolute inset-0 transition-all duration-500 ease-out flex items-center justify-center"
                  style={{
                    opacity: isActive ? 1 : 0,
                    transform: isActive ? "translateY(0) scale(1)" : "translateY(20px) scale(0.95)",
                    pointerEvents: isActive ? "auto" : "none"
                  }}
                >
                  <div className="relative w-full h-[95%]">
                    <Image
                      src={slide.full}
                      alt={slide.title}
                      fill
                      className="object-contain"
                      priority={idx === 0}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Side: Typography Info */}
          <div className="w-[50%] flex flex-col justify-center text-white gap-4 select-text">
            {slides.map((slide, idx) => {
              const isActive = idx === slideIndex;
              return (
                <div
                  key={idx}
                  className={`flex flex-col gap-32 transition-all duration-500 absolute right-0 left-[50%] pl-2 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
                >
                  <h3 className="text-[10px] font-medium tracking-wide uppercase leading-snug font-sans text-neutral-200">
                    {slide.title} <br /> {slide.subtitle}
                  </h3>

                  <div className="flex items-center gap-2 text-[10px] font-medium mt-2">
                    <span className="text-white">{slide.price}</span>
                    <span className="line-through text-neutral-500 text-[10px] font-medium">
                      {slide.oldPrice}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Carousel UI Actions */}
        <button
          onClick={(e) => { e.stopPropagation(); handlePrev(); }}
          className="absolute left-1 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 border border-neutral-700/30 flex items-center justify-center text-white backdrop-blur-sm active:scale-90 transition-transform z-20"
        >
          <svg 
            width="14" 
            height="14" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="w-3.5 h-3.5"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); handleNext(); }}
          className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 border border-neutral-700/30 flex items-center justify-center text-white backdrop-blur-sm active:scale-90 transition-transform z-20"
        >
          <svg 
            width="14" 
            height="14" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="w-3.5 h-3.5"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>

    </div>
  );
}
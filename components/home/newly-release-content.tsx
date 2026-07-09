"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import yellowFull from "components/icons/yellow_skateboard_full.png";
import yellowWheels from "components/icons/yellow_skateboard_wheels.png";
import blueFull from "components/icons/blue_skateboard_full.png";
import blueWheels from "components/icons/blue_skateboard_wheels.png";

const slides = [
  {
    full: yellowFull,
    wheels: yellowWheels,
    title: "BEGINNER SKATEBOARD SPHERE",
    subtitle: "LOGO COMPLETE",
    price: "₹ 8450",
    oldPrice: "₹ 10500",
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

  // Keep the ref in sync with state
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
    <div
      ref={containerRef}
      className="w-full h-full flex items-center justify-center gap-8 px-12 select-none"
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
                {/* Image Container */}
                <div className="relative w-full aspect-[3/4] bg-[#e3e3e3] rounded-[16px] overflow-hidden">
                  <Image
                    src={slide.wheels}
                    alt={`skateboard wheels ${idx}`}
                    fill
                    className="object-cover"
                    sizes="414px"
                  />
                </div>

                {/* Product Info */}
                <div className="w-full text-black pt-4 flex flex-col justify-center bg-white rounded-[16px] p-4">
                  <h3 className="text-xs md:text-sm font-bold tracking-tight text-black uppercase leading-tight" style={{ fontFamily: "Archivo" }}>
                    {slide.title}
                  </h3>
                  <h2 className="text-xs md:text-sm font-bold tracking-tight text-black uppercase mt-0.5 leading-tight" style={{ fontFamily: "Archivo" }}>
                    {slide.subtitle}
                  </h2>
                  <div className="flex items-center gap-2 mt-3 text-xs md:text-sm font-medium">
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
            // let opacity = 0;

            if (isActive) {
              translateY = "12.5%";
              // opacity = 1;
            } else if (isPast) {
              translateY = "-120%";
              // opacity = 0;
            }

            return (
              <div
                key={idx}
                className="absolute inset-0 transition-all duration-800 ease-[cubic-bezier(0.25,1,0.5,1)]"
                style={{
                  transform: `translateY(${translateY})`,
                  // opacity: opacity,
                }}
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
  );
}
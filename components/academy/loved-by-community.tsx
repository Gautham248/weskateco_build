"use client";

import gabriellaImg from "components/icons/academy/gabriella.png";
import milanImg from "components/icons/academy/milan.png";
import Image from "next/image";
import { useState } from "react";

const TESTIMONIALS = [
  {
    id: "milan",
    name: "MILAN, 26 Y/O",
    shortName: "MILAN",
    role: "Skateboard Coach",
    image: milanImg,
    quote:
      "I am loving the sessions so far! I feel like there is enough freedom to let us try some stuff and figure things out but also a structured curriculum that has us on a solid path of progress. The main takeaway for me is the amount of fun I am having in the sessions and the community that is built which is very friendly and wholesome.",
  },
  {
    id: "gabriella",
    name: "GABRIELLA, 24 Y/O",
    shortName: "GABRIELLA",
    role: "Skateboard Coach",
    image: gabriellaImg,
    quote:
      "I think this is the best thing I signed up for in years. I have been watching skating videos since a long time and always wanted to try skateboarding and this is a great start to it. The team is the best, extremely helpful and caring. The whole community setup is very good, people are nice, kids are fun. Always have a go...",
  },
];

export default function LovedByCommunity() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? TESTIMONIALS.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === TESTIMONIALS.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <section className="w-full bg-[#F6F6F6] text-black py-10 md:py-24 overflow-hidden">
      <div className="mx-auto max-w-(--breakpoint-2xl) px-4 lg:px-15">
        {/* Main 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-stretch">
          {/* ================= COLUMN 1: Title & Navigation Controls ================= */}
          <div className="lg:col-span-4 flex flex-col justify-between pt-0 md:pt-25">
            <div className="flex flex-col gap-4 max-w-sm">
              <h2
                className="text-2xl md:text-[45px] font-bold tracking-[-1%] text-black uppercase leading-[110%]"
                style={{ fontFamily: "'Clash Display', sans-serif" }}
              >
                LOVED BY OUR<br />COMMUNITY
              </h2>
              <p
                className="text-sm sm:text-base text-black leading-[110%] font-[400]"
                style={{ fontFamily: "'Clash Display', sans-serif" }}
              >
                Hear what our skaters and parents have to say about their WeSkate
                journey.
              </p>
            </div>

            {/* Carousel Arrow Buttons (Desktop) */}
            <div className="hidden lg:flex items-center gap-3 pt-8 lg:pt-0">
              <button
                onClick={handlePrev}
                aria-label="Previous slide"
                className="w-12 h-12 border border-neutral-200 rounded-full flex items-center justify-center bg-white hover:bg-[#CCFF02] transition-colors cursor-pointer"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.0942 12H5.90576" stroke="#1D6A2B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 5.90625L5.90576 12.0005L12 18.0947" stroke="#1D6A2B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <button
                onClick={handleNext}
                aria-label="Next slide"
                className="w-12 h-12 border border-neutral-200 rounded-full flex items-center justify-center bg-white hover:bg-[#CCFF02] transition-colors cursor-pointer"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5.90576 12H18.0942" stroke="#1D6A2B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 5.90625L18.0942 12.0005L12 18.0947" stroke="#1D6A2B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>

          {/* ================= COLUMN 2: Sliding Track (Image Card + Quote Card) ================= */}
          <div className="lg:col-span-8 overflow-hidden rounded-2xl">
            <div
              className="flex transition-transform duration-500 ease-in-out w-full"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {TESTIMONIALS.map((item) => (
                <div
                  key={item.id}
                  className="w-full flex-shrink-0 grid grid-cols-1 md:grid-cols-2 gap-3.5 items-stretch"
                >
                  {/* Image Card Container */}
                  <div className="relative w-full aspect-[497/615] rounded-[16px] overflow-hidden bg-neutral-200">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      priority
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />

                    {/* Dark overlay banner on image */}
                    <div className="absolute inset-x-3 bottom-3 p-4 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-between text-white">
                      <div className="flex flex-col gap-0.5">
                        <span
                          className="font-bold text-sm sm:text-base tracking-wide uppercase"
                          style={{ fontFamily: "'Clash Display', sans-serif" }}
                        >
                          {item.name}
                        </span>
                        <span
                          className="text-xs text-white"
                        >
                          {item.role}
                        </span>
                      </div>

                      {/* Instagram Icon */}
                      <svg width="28" height="28" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="1" y="1" width="32.2466" height="32.2466" rx="7" stroke="white" strokeWidth="2" />
                        <circle cx="17.1204" cy="17.1229" r="5.14388" stroke="white" strokeWidth="2" />
                        <circle cx="26.1262" cy="8.23215" r="1" fill="white" stroke="white" strokeWidth="1.1977" />
                      </svg>
                    </div>
                  </div>

                  {/* Text Container Card */}
                  <div className="bg-white rounded-[16px] p-6 md:p-10 gap-6 md:gap-4 flex flex-col justify-between border border-neutral-100">
                    <div>
                      <svg
                        className="w-10 h-10 md:w-16 md:h-16"
                        viewBox="0 0 69 69"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M20.4 0H26.7V13.2H20.7C16.8 13.2 14.7 14.1 14.7 19.5V26.7H26.4V68.1H0V19.8C0 6.6 7.5 0 20.4 0ZM61.8 0H68.1V13.2H62.1C57.9 13.2 56.1 14.1 56.1 19.5V26.7H67.8V68.1H41.4V19.8C41.4 6.6 48.9 0 61.8 0Z"
                          fill="#20212A"
                        />
                      </svg>
                    </div>
                    <p
                      className="text-sm md:text-base text-[#4F4F4F] leading-[140%] font-[400]"
                    >
                      {item.quote}
                    </p>

                    {/* Author Name */}
                    <div
                      className="font-bold text-sm sm:text-base text-black uppercase tracking-wide"
                      style={{ fontFamily: "'Clash Display', sans-serif" }}
                    >
                      {item.shortName}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Carousel Arrow Buttons (Mobile) */}
          <div className="flex lg:hidden items-center gap-3 pt-2">
            <button
              onClick={handlePrev}
              aria-label="Previous slide"
              className="w-12 h-12 border border-neutral-200 rounded-full flex items-center justify-center bg-white hover:bg-[#CCFF02] transition-colors cursor-pointer"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.0942 12H5.90576" stroke="#1D6A2B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 5.90625L5.90576 12.0005L12 18.0947" stroke="#1D6A2B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <button
              onClick={handleNext}
              aria-label="Next slide"
              className="w-12 h-12 border border-neutral-200 rounded-full flex items-center justify-center bg-white hover:bg-[#CCFF02] transition-colors cursor-pointer"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.90576 12H18.0942" stroke="#1D6A2B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 5.90625L18.0942 12.0005L12 18.0947" stroke="#1D6A2B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

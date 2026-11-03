"use client";

import coachesImg from "components/icons/school/coaches.png";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

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

type SafetyFeature = {
  id: string;
  label: string;
  /**
   * Optional per-feature photo. `null` falls back to coachesImg, so the field
   * can stay unset until a matching photo exists rather than reusing an
   * unrelated image.
   */
  image?: typeof coachesImg;
};

const SAFETY_FEATURES: SafetyFeature[] = [
  { id: "coaches", label: "Accredited Coaches" },
  { id: "safety-verified", label: "Child Safety Verified" },
  { id: "first-aid", label: "First Aid Trained" },
  { id: "safety-protocols", label: "Standard Safety Protocols" },
  { id: "equipment", label: "Equipment Included" },
  { id: "supervision", label: "Continuous Supervision" },
  { id: "progress-reports", label: "Progress Reports" },
];

const ADVANCE_MS = 5000;

export default function SafeStructuredSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  // Holds a long-lived ref so the interval can be restarted (and paused)
  // without depending on state, avoiding a timer teardown on every render.
  const pausedRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const count = SAFETY_FEATURES.length;

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    if (reducedMotion) return;
    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % count);
    }, ADVANCE_MS);
  }, [clearTimer, count, reducedMotion]);

  // Honour the OS-level motion preference.
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(query.matches);

    const onChange = (event: MediaQueryListEvent) =>
      setReducedMotion(event.matches);

    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  // (Re)start the auto-advance whenever the motion preference changes.
  useEffect(() => {
    startTimer();
    return clearTimer;
  }, [startTimer, clearTimer]);

  // Hover / focus pauses the auto-advance (focus is tracked on the list, and
  // hover on the photo, per requirement).
  const pause = useCallback(() => {
    pausedRef.current = true;
    clearTimer();
  }, [clearTimer]);

  const resume = useCallback(() => {
    pausedRef.current = false;
    startTimer();
  }, [startTimer]);

  const select = useCallback(
    (index: number) => {
      setActiveIndex(index);
      // A click restarts the 5s window; if paused, the timer stays cleared so
      // resuming still yields a full interval.
      if (!pausedRef.current) {
        startTimer();
      }
    },
    [startTimer],
  );

  const active = SAFETY_FEATURES[activeIndex] ?? SAFETY_FEATURES[0]!;
  const activeImage = active.image ?? coachesImg;

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
          {/* Left Column: Active Feature Image (hover pauses auto-advance) */}
          <div
            className="md:col-span-6 w-full"
            onMouseEnter={pause}
            onMouseLeave={resume}
          >
            <div className="relative w-full aspect-[580/420] rounded-md overflow-hidden shadow-sm bg-neutral-200">
              <Image
                key={active.id}
                src={activeImage}
                alt="Coach with students wearing helmets and protective pads"
                fill
                className="object-cover rounded-md"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />

              {/* Progress bar pinned to the bottom edge of the photo. The
                  fill animates 0 -> 100% over the 5s interval; remounting it
                  via `key` restarts the animation on every index change. */}
              <div
                className="absolute inset-x-0 bottom-0 z-10 h-1 bg-white/40"
                aria-hidden="true"
              >
                {!reducedMotion ? (
                  <div
                    key={activeIndex}
                    className="h-full w-0 bg-black"
                    style={{ animation: "safe-progress 5s linear forwards" }}
                  />
                ) : null}
              </div>

              {/* Keyframes live in a scoped <style> so the progress fill needs
                  no per-frame JS. */}
              {!reducedMotion ? (
                <style>{`@keyframes safe-progress { from { width: 0%; } to { width: 100%; } }`}</style>
              ) : null}
            </div>
          </div>

          {/* Right Column: Feature List */}
          <div
            className="md:col-span-6 flex flex-col gap-5 md:gap-6"
            onMouseEnter={pause}
            onMouseLeave={resume}
            onFocus={pause}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) {
                resume();
              }
            }}
          >
            {SAFETY_FEATURES.map((item, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-current={isActive ? "true" : undefined}
                  onClick={() => select(idx)}
                  className="flex items-center text-left transition-colors group w-fit cursor-pointer rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1D6A2B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F4F4F6]"
                >
                  {/* Arrow Circle Badge */}
                  <span
                    className={`transition-all duration-300 ease-out flex items-center justify-center shrink-0 rounded-full bg-[#CCFF02] ${
                      isActive
                        ? "w-8 h-8 opacity-100 scale-100 mr-3 md:mr-4"
                        : "w-0 h-8 opacity-0 scale-75 mr-0 overflow-hidden"
                    }`}
                  >
                    <GreenArrowIcon />
                  </span>

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
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

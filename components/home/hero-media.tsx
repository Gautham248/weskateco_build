"use client";

import clsx from "clsx";
import { HERO_DEFAULT_SECONDS, nextHeroIndex } from "lib/catalog/hero";
import type { HeroSlide } from "lib/catalog/hero";
import { useEffect, useRef, useState } from "react";

/**
 * The hero rotator. Rendered as plain <img>/<video> rather than next/image on
 * purpose: an admin-pasted image URL from a host outside next.config.ts's
 * remotePatterns would make next/image throw and take the whole homepage with it,
 * and pasted links are the point of the admin tab.
 */
export function HeroMedia({ slides }: { slides: HeroSlide[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTabHidden, setIsTabHidden] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const appliedInitialMotionRef = useRef(false);

  const active = slides[activeIndex];
  const seconds = active?.seconds ?? HERO_DEFAULT_SECONDS;
  const canRotate = slides.length > 1;
  const isRotating = canRotate && !isPaused && !isTabHidden;

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReducedMotion(query.matches);

    apply();
    query.addEventListener("change", apply);

    return () => query.removeEventListener("change", apply);
  }, []);

  // Reduced motion starts the hero paused rather than preventing rotation
  // outright, so the control below can still start it. Applied once, so it never
  // overrides a choice the visitor has already made.
  useEffect(() => {
    if (!reducedMotion || appliedInitialMotionRef.current) {
      return;
    }

    appliedInitialMotionRef.current = true;
    setIsPaused(true);
  }, [reducedMotion]);

  // A backgrounded tab must not keep advancing: it would race through several
  // slides the moment it came back.
  useEffect(() => {
    const onVisibilityChange = () => setIsTabHidden(document.hidden);

    onVisibilityChange();
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () =>
      document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  useEffect(() => {
    if (!isRotating) {
      return;
    }

    const timer = setTimeout(() => {
      setActiveIndex((index) => nextHeroIndex(index, slides.length));
    }, seconds * 1000);

    return () => clearTimeout(timer);
  }, [isRotating, seconds, slides.length, activeIndex]);

  // Only the visible video plays; the rest are paused so slides do not stream in
  // the background. play() can still be refused under data saver, which is fine -
  // the poster or first frame simply stays put.
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) {
        return;
      }

      if (index === activeIndex && isRotating) {
        void video.play().catch(() => undefined);
      } else {
        video.pause();
      }
    });
  }, [activeIndex, isRotating, slides.length]);

  return (
    <section className="relative -mt-[72px] h-screen w-full overflow-hidden">
      {slides.map((slide, index) => {
        const isActive = index === activeIndex;

        return (
          <div
            key={slide.id}
            aria-hidden={!isActive}
            className={clsx(
              "absolute inset-0",
              !reducedMotion && "transition-opacity duration-700 ease-out",
              isActive ? "opacity-100" : "opacity-0",
            )}
          >
            {slide.kind === "video" ? (
              <video
                ref={(element) => {
                  videoRefs.current[index] = element;
                }}
                src={slide.url}
                poster={slide.posterUrl ?? undefined}
                muted
                loop
                playsInline
                preload="metadata"
                className="h-full w-full object-cover"
              />
            ) : (
              <img
                src={slide.url}
                alt={slide.altText ?? ""}
                fetchPriority={index === 0 ? "high" : undefined}
                decoding="async"
                className="h-full w-full object-cover"
              />
            )}
          </div>
        );
      })}

      <div className="absolute inset-0 bg-black/40" />

      {canRotate ? (
        <button
          type="button"
          onClick={() => setIsPaused((paused) => !paused)}
          aria-pressed={isPaused}
          aria-label={
            isPaused ? "Play the hero rotation" : "Pause the hero rotation"
          }
          className="absolute right-6 bottom-6 z-10 cursor-pointer rounded-full border border-white/40 bg-black/50 px-4 py-2 text-xs font-bold tracking-wider text-white uppercase transition-colors hover:bg-black/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          {isPaused ? "Play" : "Pause"}
        </button>
      ) : null}
    </section>
  );
}

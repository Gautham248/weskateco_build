"use client";

import clsx from "clsx";
import { HERO_DEFAULT_SECONDS, nextHeroIndex } from "lib/catalog/hero";
import type { HeroSlide } from "lib/catalog/hero";
import { useEffect, useState } from "react";

/**
 * The hero rotator. Rendered as plain <img>/<video> rather than next/image on
 * purpose: an admin-pasted image URL from a host outside next.config.ts's
 * remotePatterns would make next/image throw and take the whole homepage with it,
 * and pasted links are the point of the admin tab.
 *
 * Motion comes from looping GIFs served as image slides, so there is no
 * play/pause control: a GIF cannot be paused by script, and the visitor-facing
 * button that used to sit here did not pause one anyway. A video slide still
 * renders - it just shows its poster or first frame until the rotation moves on.
 */
export function HeroMedia({ slides }: { slides: HeroSlide[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTabHidden, setIsTabHidden] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const active = slides[activeIndex];
  const seconds = active?.seconds ?? HERO_DEFAULT_SECONDS;
  const isRotating = slides.length > 1 && !isTabHidden;

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReducedMotion(query.matches);

    apply();
    query.addEventListener("change", apply);

    return () => query.removeEventListener("change", apply);
  }, []);

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
    </section>
  );
}

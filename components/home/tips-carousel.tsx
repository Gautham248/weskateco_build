"use client";

import arrow from "components/icons/arrow.svg";
import fbGlyph from "components/icons/fb.svg";
import instaGlyph from "components/icons/insta.svg";
import ytGlyph from "components/icons/yt.svg";
import {
  socialPostActionLabel,
  SOCIAL_PLATFORM_LABELS,
  type SocialPostCard,
} from "lib/catalog/social-posts";
import { useEffect, useRef, useState } from "react";

/**
 * Real brand icons, where they exist in components/icons.
 *
 * Only three platforms ship one. Rather than approximate the others — a
 * hand-drawn version of someone else's logo looks wrong and raises licensing
 * questions the project does not need — the card falls back to the platform
 * name in words, which reads as deliberate rather than missing.
 */
const PLATFORM_GLYPHS: Partial<
  Record<SocialPostCard["platform"], { src: { src: string } }>
> = {
  instagram: { src: instaGlyph },
  facebook: { src: fbGlyph },
  youtube: { src: ytGlyph },
};

/**
 * The community strip's carousel.
 *
 * Kept separate from `TipsSection` because this part needs interactivity (the
 * scroll-snap track and the arrow controls) while the section around it is a
 * server component that reads the posts from the database.
 */

/**
 * A plain `<img>`, not `next/image`.
 *
 * This field is free text: the admin accepts any https URL, and the optimiser
 * only accepts hosts listed in next.config.ts. `next/image` *throws* on an
 * unconfigured host, which turned a bad URL in one card into a 500 on the
 * homepage and on every store page. A plain img that degrades on load error
 * cannot take a page down, and duplicating the remotePatterns list here to
 * branch between the two renderers would only create a second thing to keep in
 * step with next.config.ts.
 */
function PostImage({
  src,
  alt,
  onError,
}: {
  src: string;
  alt: string;
  onError: () => void;
}) {
  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={onError}
      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
    />
  );
}

export default function TipsCarousel({
  posts,
  variant = "default",
}: {
  posts: SocialPostCard[];
  variant?: "default" | "page";
}) {
  // Default to the middle card, but clamp rather than assume five: a strip with
  // one or two posts must still start on a card that exists.
  const [activeIndex, setActiveIndex] = useState(() =>
    Math.min(2, posts.length - 1),
  );
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const trackPadding = "var(--track-padding)";

  /**
   * Ids whose image failed to load. Kept in state rather than skipped up front
   * because the only reliable way to know a URL is a dead end or a web page is to
   * ask the browser for it.
   */
  const [brokenImages, setBrokenImages] = useState<Set<string>>(
    () => new Set(),
  );

  // Smoothly center the active card in the viewport
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const activeChild = container.children[activeIndex] as HTMLElement;
    if (activeChild) {
      const containerRect = container.getBoundingClientRect();
      const childRect = activeChild.getBoundingClientRect();

      // Calculate the exact distance needed to place the card center-stage
      const scrollOffset =
        childRect.left -
        containerRect.left -
        containerRect.width / 2 +
        childRect.width / 2;

      container.scrollBy({
        left: scrollOffset,
        behavior: "smooth",
      });
    }
  }, [activeIndex, posts.length]);

  const handlePrev = () => {
    setActiveIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => Math.min(posts.length - 1, prev + 1));
  };

  return (
    <section className="tips-section min-h-full w-full bg-white pt-15 pb-5 md:py-[88px] overflow-hidden">
      <div>
        <style
          dangerouslySetInnerHTML={{
            __html: `
          .tips-section {
            --track-padding: 1rem;
          }
          @media (min-width: 1024px) {
            .tips-section {
              --track-padding: max(3.75rem, calc((100vw - 1536px) / 2 + 3.75rem));
            }
          }
          div::-webkit-scrollbar {
            display: none !important;
          }
        `,
          }}
        />

        {/* Header with Navigation Controls */}
        <div className="flex justify-between items-end mb-5 md:mb-10 mx-auto max-w-(--breakpoint-2xl) px-4 lg:px-15">
          {variant === "page" ? (
            <h2
              className="text-[clamp(1.5rem,5vw,2.8125rem)] leading-[clamp(1.5rem,5vw,2.8125rem)] font-black tracking-tight text-black dark:text-white uppercase"
              style={{
                fontFamily: "'Clash Display', sans-serif",
                letterSpacing: "-0.01em",
              }}
            >
              stay connected
              <br />
              anywhere!
            </h2>
          ) : (
            <h2
              className="text-[clamp(1.25rem,4vw,2.5rem)] font-black leading-[120%] tracking-tight text-black dark:text-white sm:text-[clamp(1.5rem,3vw,2.5rem)] lg:text-[clamp(1.75rem,2.5vw,2.5rem)] uppercase"
              style={{
                fontFamily: "'Clash Display', sans-serif",
                letterSpacing: "-0.01em",
              }}
            >
              Tips to stay connected
              <br />
              Anywhere!
            </h2>
          )}
          <div className="flex gap-3 pb-2 hidden md:flex">
            <button
              aria-label="Previous post"
              onClick={handlePrev}
              disabled={activeIndex === 0}
              className="w-[36px] md:w-full p-3 border border-neutral-200 rounded-full hover:bg-[#CCFF02] transition-colors cursor-pointer disabled:opacity-40 disabled:hover:bg-transparent"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18.0942 12H5.90576"
                  stroke="#1D6A2B"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 5.90625L5.90576 12.0005L12 18.0947"
                  stroke="#1D6A2B"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              aria-label="Next post"
              onClick={handleNext}
              disabled={activeIndex === posts.length - 1}
              className="w-[36px] md:w-full p-3 border border-neutral-200 rounded-full hover:bg-[#CCFF02] transition-colors cursor-pointer disabled:opacity-40 disabled:hover:bg-transparent"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.90576 12H18.0942"
                  stroke="#1D6A2B"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 5.90625L18.0942 12.0005L12 18.0947"
                  stroke="#1D6A2B"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Horizontal Scroll Row */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scrollbar-none scroll-smooth select-none snap-x snap-mandatory"
          style={{
            paddingLeft: trackPadding,
            paddingRight: trackPadding,
            msOverflowStyle: "none",
            scrollbarWidth: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {posts.map((post, index) => (
            <div
              key={post.id}
              className="group relative pt-14 cursor-pointer overflow-hidden flex-shrink-0 w-[80vw] sm:w-[55vw] md:w-[calc(40%-12px)] lg:w-[calc(25%-12px)] snap-center"
              onMouseEnter={() => setActiveIndex(index)}
              onTouchStart={() => setActiveIndex(index)}
            >
              {/* Entire Wrapper (Image Box + View Button Stack) - Moves Up Together */}
              <div
                className={`w-full flex flex-col transition-transform duration-300 ease-out -translate-y-14 ${activeIndex === index ? "" : "md:translate-y-0 md:group-hover:-translate-y-14"}`}
              >
                {/* Image Container Frame */}
                <div
                  className={`relative w-full aspect-[3/3.8] overflow-hidden shadow-sm flex-shrink-0 rounded-md`}
                >
                  {/* An image URL that will not load — a post link pasted into
                      the image field, a deleted upload, a dead CDN link — shows
                      the placeholder below instead of breaking the page. */}
                  {brokenImages.has(post.id) ? (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-neutral-100 text-neutral-400 dark:bg-neutral-900 dark:text-neutral-600">
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        aria-hidden="true"
                      >
                        <rect x="2" y="2" width="20" height="20" rx="5" />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                      </svg>
                      <span className="text-[10px] font-semibold tracking-wider uppercase">
                        Image unavailable
                      </span>
                    </div>
                  ) : (
                    <PostImage
                      src={post.imageUrl}
                      alt={post.altText ?? `Social post ${index + 1}`}
                      onError={() =>
                        setBrokenImages((previous) =>
                          new Set(previous).add(post.id),
                        )
                      }
                    />
                  )}

                  {/* Platform badge */}
                  <div className="absolute bottom-4 left-4 right-4 bg-black/30 backdrop-blur-md rounded-md p-3 flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2 text-white">
                      {(() => {
                        const glyph = PLATFORM_GLYPHS[post.platform];

                        return glyph ? (
                          <img
                            src={glyph.src.src}
                            alt=""
                            aria-hidden="true"
                            className="h-[18px] w-[18px] shrink-0"
                          />
                        ) : (
                          <span
                            className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border border-white/70 text-[10px] font-bold leading-none"
                            aria-hidden="true"
                          >
                            {SOCIAL_PLATFORM_LABELS[post.platform].charAt(0)}
                          </span>
                        );
                      })()}
                    </div>
                    <span
                      className="truncate text-white font-bold text-xs uppercase tracking-wider"
                      style={{ fontFamily: "'Clash Display', sans-serif" }}
                    >
                      {SOCIAL_PLATFORM_LABELS[post.platform]}
                    </span>
                  </div>
                </div>

                {/* Action button (Reveals right at the bottom edge boundary) */}
                <div
                  className={`w-full h-14 pt-3 flex-shrink-0 transition-opacity duration-300 opacity-100 ${activeIndex === index ? "md:opacity-100" : "md:opacity-0 md:group-hover:opacity-100"}`}
                >
                  {/*
                    Was a <button> with no handler, so it did nothing at all.
                    A real link to the post's permalink when one is stored; a
                    post staged without a link renders inert rather than
                    linking nowhere.
                  */}
                  {post.permalink ? (
                    <a
                      href={post.permalink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full h-full bg-black text-white font-bold text-xs uppercase tracking-wide flex items-center justify-between px-4 hover:bg-neutral-900 transition-colors rounded-md`}
                    >
                      <span>{socialPostActionLabel(post)}</span>
                      <div className="bg-white text-black rounded-full p-1">
                        <img
                          src={arrow.src || arrow}
                          className="w-3.5 h-3.5"
                          alt=""
                          aria-hidden="true"
                        />
                      </div>
                    </a>
                  ) : (
                    <span
                      aria-disabled="true"
                      className={`w-full h-full bg-black text-white font-bold text-xs uppercase tracking-wide flex items-center justify-between px-4 rounded-md opacity-60`}
                    >
                      <span>{socialPostActionLabel(post)}</span>
                      <div className="bg-white text-black rounded-full p-1">
                        <img
                          src={arrow.src || arrow}
                          className="w-3.5 h-3.5"
                          alt=""
                          aria-hidden="true"
                        />
                      </div>
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

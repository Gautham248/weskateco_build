"use client";

import Image from "next/image";
import { useState, useRef } from "react";

export function Gallery({
  images,
}: {
  images: { src: string; altText: string }[];
}) {
  const [loadingStates, setLoadingStates] = useState<Record<number, boolean>>({
    0: true,
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
  });

  const handleImageLoad = (index: number) => {
    setLoadingStates((prev) => ({ ...prev, [index]: false }));
  };

  if (images.length === 0) return null;

  const hasMoreThanOne = images.length > 1;

  // Chunk images into blocks of 3
  const blocks: { src: string; altText: string }[][] = [];
  for (let i = 0; i < images.length; i += 3) {
    blocks.push(images.slice(i, i + 3));
  }

  const renderSpinner = () => (
    <div className="absolute inset-0 flex items-center justify-center z-10 bg-[#e5e5e5] dark:bg-neutral-900">
      <svg className="animate-spin h-8 w-8 text-neutral-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>
  );

  const progressBarRef = useRef<HTMLDivElement>(null);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const scrollLeft = target.scrollLeft;
    const maxScroll = target.scrollWidth - target.clientWidth;
    if (maxScroll > 0 && progressBarRef.current) {
      const progress = Math.max(0, Math.min(1, scrollLeft / maxScroll));
      const translateX = progress * (images.length - 1) * 100;
      progressBarRef.current.style.transform = `translateX(${translateX}%)`;
    }
  };

  return (
    <div className="relative w-full overflow-hidden group">
      {/* Mobile/Tablet Gallery (Horizontal Scroll) */}
      <div
        onScroll={handleScroll}
        className="flex lg:hidden w-full overflow-x-auto snap-x snap-mandatory scrollbar-none gap-0 aspect-[393/451]"
      >
        {images.map((image, idx) => (
          <div
            key={idx}
            className="relative w-full h-full snap-start snap-always shrink-0 bg-neutral-100 dark:bg-neutral-900 overflow-hidden"
          >
            {loadingStates[idx] && renderSpinner()}
            <Image
              className="h-full w-full object-contain"
              fill
              sizes="100vw"
              alt={image.altText || "Product image"}
              src={image.src}
              priority={idx === 0}
              onLoad={() => handleImageLoad(idx)}
            />
          </div>
        ))}

        {/* Mobile Progress Bar */}
        {images.length > 1 && (
          <div className="absolute bottom-0 left-0 w-full h-[5px] bg-transparent dark:bg-neutral-800 z-30">
            <div
              ref={progressBarRef}
              className="h-full bg-black dark:bg-white transition-transform duration-75"
              style={{
                width: `${100 / images.length}%`,
                transform: "translateX(0%)",
              }}
            />
          </div>
        )}
      </div>

      {/* Desktop Gallery (Vertical Overlapping Sticky Blocks) */}
      <div
        className={`hidden lg:flex flex-col w-full overflow-y-auto snap-y snap-mandatory scrollbar-none gap-0 ${hasMoreThanOne ? "aspect-[1162/897]" : "aspect-[581/897]"
          }`}
      >
        {blocks.map((block, blockIdx) => {
          const blockHasMoreThanOne = block.length > 1;
          const baseIdx = blockIdx * 3;

          return (
            <div
              key={blockIdx}
              style={{ zIndex: (blockIdx + 1) * 10 }}
              className={`w-full sticky top-0 snap-start snap-always shrink-0 ${blockHasMoreThanOne ? "grid grid-cols-2 gap-0 aspect-[1162/897]" : "max-w-[581px] mx-auto aspect-[581/897]"
                }`}
            >
              {/* Left Column: Image 1 */}
              <div className="relative w-full aspect-[581/897] bg-[#e5e5e5] dark:bg-neutral-900 overflow-hidden">
                {loadingStates[baseIdx] && renderSpinner()}
                <Image
                  className="h-full w-full object-contain"
                  fill
                  sizes="(min-width: 1024px) 35vw, 100vw"
                  alt={block[0]?.altText || "Product image"}
                  src={block[0]?.src || ""}
                  priority={blockIdx === 0}
                  onLoad={() => handleImageLoad(baseIdx)}
                />
              </div>

              {/* Right Column: Stacked Images */}
              {blockHasMoreThanOne && (
                <div className="flex flex-col gap-0 justify-between">
                  {block[1] && (
                    <div className="relative w-full aspect-[581/448.5] bg-[#e5e5e5] dark:bg-neutral-900 overflow-hidden">
                      {loadingStates[baseIdx + 1] && renderSpinner()}
                      <Image
                        className="h-full w-full object-cover"
                        fill
                        sizes="(min-width: 1024px) 35vw, 100vw"
                        alt={block[1].altText || "Product image"}
                        src={block[1].src}
                        onLoad={() => handleImageLoad(baseIdx + 1)}
                      />
                    </div>
                  )}
                  {block[2] && (
                    <div className="relative w-full aspect-[581/448.5] bg-[#e5e5e5] dark:bg-neutral-900 overflow-hidden">
                      {loadingStates[baseIdx + 2] && renderSpinner()}
                      <Image
                        className="h-full w-full object-cover"
                        fill
                        sizes="(min-width: 1024px) 35vw, 100vw"
                        alt={block[2].altText || "Product image"}
                        src={block[2].src}
                        onLoad={() => handleImageLoad(baseIdx + 2)}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

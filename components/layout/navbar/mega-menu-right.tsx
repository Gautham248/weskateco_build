"use client";

import shopImg1 from "components/icons/shop_image_1.png";
import shopImg2 from "components/icons/shop_image_2.png";
import Image from "next/image";
import { useState } from "react";
import MegaMenuSubItems, { hasSubItems } from "./mega-menu-sub-items";

export default function MegaMenuRight({
  activeCategory,
  onCollapse,
}: {
  activeCategory: string | null;
  onCollapse?: () => void;
}) {
  const showPanel = hasSubItems(activeCategory);
  const [lastCategory, setLastCategory] = useState<string | null>(null);

  if (
    activeCategory &&
    hasSubItems(activeCategory) &&
    activeCategory !== lastCategory
  ) {
    setLastCategory(activeCategory);
  }

  return (
    <div className="flex flex-1 min-h-[451px]">
      {/* Sub-items Slide Panel */}
      <div
        className="overflow-hidden transition-all duration-700 ease-in-out"
        style={{
          maxWidth: showPanel ? "500px" : "0",
          opacity: showPanel ? 1 : 0,
          marginRight: showPanel ? "12px" : "0",
        }}
      >
        <MegaMenuSubItems category={lastCategory} />
      </div>

      {/* Main Content Grid Container */}
      <div
        className="flex flex-1 bg-white dark:bg-neutral-900 rounded-xl p-2.5 gap-2.5"
        onMouseEnter={onCollapse}
      >
        {/* Left Image Component */}
        <div
          className={`relative flex-shrink-0 h-full rounded-lg overflow-hidden transition-all duration-700 ease-in-out ${
            showPanel ? "w-[65%]" : "w-[55%]"
          }`}
        >
          <Image src={shopImg1} alt="" fill className="object-cover" priority />
        </div>

        {/* Right Composite Component */}
        <div
          className="relative flex-1 h-full rounded-lg overflow-hidden flex bg-white dark:bg-neutral-900 transition-all duration-700 ease-in-out"
          style={{
            paddingRight: showPanel ? "0px" : "43px",
          }}
        >
          {/* Main Image Layer */}
          <div className="relative flex-1 h-full rounded-lg overflow-hidden bg-black">
            {/* Single Image Component with smooth transition-transform on state change */}
            <div
              className="absolute inset-0 transition-transform duration-700 ease-in-out"
              style={{
                transform: showPanel ? "scale(1)" : "scale(1.1)",
                transformOrigin: "top",
                willChange: "transform",
              }}
            >
              <Image
                src={shopImg2}
                alt=""
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Horizontal Text Overlay */}
            <div
              className={`absolute bottom-6 left-6 z-10 max-w-[85%] transition-all duration-700 ease-in-out ${
                showPanel
                  ? "opacity-0 pointer-events-none xl:opacity-100 xl:pointer-events-auto translate-y-0"
                  : "opacity-0 translate-y-4 pointer-events-none"
              }`}
            >
              <h3
                className="text-white font-[700] text-xs xl:text-[0.95rem] 2xl:text-[1.25rem] uppercase leading-tight tracking-wide drop-shadow-md"
                style={{ fontFamily: "'Clash Display', sans-serif" }}
              >
                Newly <br /> Released
              </h3>
            </div>
          </div>

          {/* Vertical Sidebar Text Overlay */}
          <div
            className="absolute top-0 bottom-0 right-0 w-[33px] flex items-center justify-center transition-all duration-700 ease-in-out"
            style={{
              opacity: showPanel ? 0 : 1,
              visibility: showPanel ? "hidden" : "visible",
            }}
          >
            <span
              className="text-black dark:text-white font-[700] text-[clamp(2rem,5vw,3rem)] tracking-[-0.01em] uppercase whitespace-nowrap select-none px-2"
              style={{
                transform: "rotate(-90deg)",
                transformOrigin: "center",
                fontFamily: "'Clash Display', sans-serif",
              }}
            >
              Newly Released
            </span>
          </div>

          {/* Floating Action Button */}
          <button
            className={`absolute cursor-pointer bottom-6 z-10 w-11 h-11 bg-white dark:bg-neutral-800 rounded-full flex items-center justify-center shadow-lg transition-all duration-700 hover:scale-105 active:scale-95 ${
              showPanel ? "right-6" : "right-16"
            }`}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="!text-black dark:!text-white translate-x-[0.5px]"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

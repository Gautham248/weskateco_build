"use client";

import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { getLocalizedPath } from "lib/i18n";
import { useTranslation } from "lib/i18n/TranslationProvider";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import MegaMenuLeft from "./mega-menu-left";
import MegaMenuRight from "./mega-menu-right";

export default function NavLinks({
  onDropdownChange,
}: {
  onDropdownChange?: (isOpen: boolean) => void;
}) {
  const { t, locale } = useTranslation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const menuRef = useRef<HTMLLIElement>(null);

  const [isGuidesOpen, setIsGuidesOpen] = useState(false);
  const guidesRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        setActiveCategory(null);
      }
      if (guidesRef.current && !guidesRef.current.contains(event.target as Node)) {
        setIsGuidesOpen(false);
      }
    }
    if (isDropdownOpen || isGuidesOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen, isGuidesOpen]);

  useEffect(() => {
    onDropdownChange?.(isDropdownOpen);
  }, [isDropdownOpen, onDropdownChange]);

  return (
    <>
      {isDropdownOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop z-40"
          onClick={() => {
            setIsDropdownOpen(false);
            setActiveCategory(null);
          }}
        />
      )}
      <ul className="hidden items-center gap-2 lg:gap-8 text-[clamp(0.875rem,2vw,1.125rem)] font-medium tracking-wide md:flex whitespace-nowrap z-50">
        {/* STORE */}
        <li ref={menuRef}>
          <button
            className="flex items-center gap-1 uppercase cursor-pointer"
            aria-expanded={isDropdownOpen}
            onMouseEnter={() => {
              setIsDropdownOpen(true);
              setIsGuidesOpen(false);
            }}
          >
            STORE
            <ChevronDownIcon
              className={`h-2.5 w-2.5 md:h-2.5 md:w-2.5 xl:h-3 xl:w-3 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          <div
            className={`absolute left-6 right-6 lg:left-12 lg:right-12 z-50 shadow-lg top-full mt-5 ${isDropdownOpen
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
              } transition-opacity duration-300`}
            style={{ height: "471px" }}
            onMouseLeave={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              // Only close if mouse exited below or to the sides (not exiting towards top/navbar)
              if (e.clientY >= rect.top + 5) {
                setIsDropdownOpen(false);
                setActiveCategory(null);
              }
            }}
          >
            <div className="flex h-full gap-3">
              <MegaMenuLeft
                activeCategory={activeCategory}
                onCategoryHover={setActiveCategory}
                onLinkClick={() => setIsDropdownOpen(false)}
              />
              <MegaMenuRight
                activeCategory={activeCategory}
                onCollapse={() => setActiveCategory(null)}
              />
            </div>
          </div>
        </li>

        {/* GUIDES DROPDOWN */}
        <li
          ref={guidesRef}
          className="relative py-2"
          onMouseEnter={() => {
            setIsGuidesOpen(true);
            setIsDropdownOpen(false);
            setActiveCategory(null);
          }}
          onMouseLeave={() => setIsGuidesOpen(false)}
        >
          <button
            onClick={() => {
              setIsGuidesOpen(!isGuidesOpen);
              if (!isGuidesOpen) {
                setIsDropdownOpen(false);
                setActiveCategory(null);
              }
            }}
            className="flex items-center gap-1 uppercase cursor-pointer"
          >
            GUIDES
            <ChevronDownIcon
              className={`h-2.5 w-2.5 md:h-2.5 md:w-2.5 xl:h-3 xl:w-3 transition-transform duration-200 ${isGuidesOpen ? "rotate-180" : ""
                }`}
            />
          </button>

          <div
            className={`absolute left-0 top-full pt-1.5 w-64 z-50 transition-all duration-200 ${isGuidesOpen
                ? "opacity-100 scale-100 pointer-events-auto"
                : "opacity-0 scale-95 pointer-events-none"
              }`}
          >
            <div className="rounded-md bg-white text-black shadow-xl border border-neutral-100 py-2">
              <Link
                href={getLocalizedPath(
                  "/guides/skateboard-buying-guide",
                  locale
                )}
                onClick={() => setIsGuidesOpen(false)}
                className="block px-4 py-2.5 text-xs lg:text-sm font-semibold !text-black hover:bg-neutral-100 hover:text-black transition-colors uppercase"
                style={{ fontFamily: "'Clash Display', sans-serif" }}
              >
                Skateboard Buying Guide
              </Link>
              <Link
                href={getLocalizedPath("/guides/wheels-guide", locale)}
                onClick={() => setIsGuidesOpen(false)}
                className="block px-4 py-2.5 text-xs lg:text-sm font-semibold !text-black hover:bg-neutral-100 hover:text-black transition-colors uppercase"
                style={{ fontFamily: "'Clash Display', sans-serif" }}
              >
                Wheels Guide
              </Link>
            </div>
          </div>
        </li>

        {/* WESKATE ACADEMY */}
        <li
          className={isDropdownOpen ? "opacity-50" : ""}
          onMouseEnter={() => {
            setIsDropdownOpen(false);
            setIsGuidesOpen(false);
            setActiveCategory(null);
          }}
        >
          <Link href={getLocalizedPath("/academy", locale)}>
            WESKATE ACADEMY
          </Link>
        </li>
        {/* SKATEPARKS */}
        <li
          className={isDropdownOpen ? "opacity-50" : ""}
          onMouseEnter={() => {
            setIsDropdownOpen(false);
            setIsGuidesOpen(false);
            setActiveCategory(null);
          }}
        >
          <Link href={getLocalizedPath("/skateparks", locale)}>SKATEPARKS</Link>
        </li>
      </ul>
    </>
  );
}

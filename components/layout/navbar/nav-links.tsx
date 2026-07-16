"use client";

import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { getLocalizedPath } from "lib/i18n";
import { useTranslation } from "lib/i18n/TranslationProvider";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import MegaMenuLeft from "./mega-menu-left";
import MegaMenuRight from "./mega-menu-right";

export default function NavLinks({ onDropdownChange }: { onDropdownChange?: (isOpen: boolean) => void }) {
  const { t, locale } = useTranslation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const menuRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        setActiveCategory(null);
      }
    }
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "";
    };
  }, [isDropdownOpen]);

  useEffect(() => {
    onDropdownChange?.(isDropdownOpen);
  }, [isDropdownOpen, onDropdownChange]);

  return (
    <>
      {isDropdownOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => {
            setIsDropdownOpen(false);
            setActiveCategory(null);
          }}
        />
      )}
      <ul className="hidden items-center gap-2 lg:gap-8 text-[clamp(0.875rem,2vw,1.125rem)] font-medium tracking-wide md:flex whitespace-nowrap z-50">      {/* STORE */}
        <li ref={menuRef}>
          <button
            className="flex items-center gap-1 uppercase cursor-pointer"
            aria-expanded={isDropdownOpen}
            onMouseEnter={() => setIsDropdownOpen(true)}
          >
            STORE
            <ChevronDownIcon className={`h-2.5 w-2.5 md:h-2.5 md:w-2.5 xl:h-3 xl:w-3 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
          </button>

          <div
            className={`absolute left-6 right-6 z-50 shadow-lg top-full mt-5 ${isDropdownOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
              } transition-opacity duration-300`}
            style={{ height: "471px" }}
          >
            <div className="flex h-full gap-3">
              <MegaMenuLeft activeCategory={activeCategory} onCategoryHover={setActiveCategory} onLinkClick={() => setIsDropdownOpen(false)} />
              <MegaMenuRight activeCategory={activeCategory} />
            </div>
          </div>
        </li>

        {/* GUIDES */}
        <li className={isDropdownOpen ? 'opacity-50' : ''}>
          <Link href={getLocalizedPath("/guides", locale)}>
            GUIDES
          </Link>
        </li>

        {/* WESKATE ACADEMY */}
        <li className={isDropdownOpen ? 'opacity-50' : ''}>
          <Link href={getLocalizedPath("/academy", locale)}>
            WESKATE ACADEMY
          </Link>
        </li>

        {/* SKATEPARKS */}
        <li className={isDropdownOpen ? 'opacity-50' : ''}>
          <Link href={getLocalizedPath("/skateparks", locale)}>
            SKATEPARKS
          </Link>
        </li>
      </ul>
    </>
  );
}
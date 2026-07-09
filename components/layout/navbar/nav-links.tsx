"use client";

import Link from "next/link";
import { useTranslation } from "lib/i18n/TranslationProvider";
import { getLocalizedPath } from "lib/i18n";
import { useState, useRef, useEffect } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import MegaMenuLeft from "./mega-menu-left";
import MegaMenuRight from "./mega-menu-right";

export default function NavLinks() {
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
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <ul className="hidden items-center gap-8 text-lg font-medium tracking-wide md:flex">
      {/* STORE */}
      <li ref={menuRef}>
        <button
          className="flex items-center gap-1 uppercase cursor-pointer"
          aria-expanded={isDropdownOpen}
          onMouseEnter={() => setIsDropdownOpen(true)}
        >
          STORE
          <ChevronDownIcon className={`h-3 w-3 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
        </button>

        <div
          className={`absolute left-1/2 -translate-x-1/2 z-50 shadow-lg top-full mt-5 ${
            isDropdownOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          } transition-opacity duration-300`}
          style={{ maxWidth: "1680px", width: "min(87.5vw, 1680px)", height: "471px" }}
        >
          <div className="flex h-full gap-3">
            <MegaMenuLeft activeCategory={activeCategory} onCategoryHover={setActiveCategory} onLinkClick={() => setIsDropdownOpen(false)} />
            <MegaMenuRight activeCategory={activeCategory} />
          </div>
        </div>
      </li>

      {/* GUIDES */}
      <li>
        <Link href={getLocalizedPath("/guides", locale)}>
          GUIDES
        </Link>
      </li>

      {/* WESKATE ACADEMY */}
      <li>
        <Link href={getLocalizedPath("/academy", locale)}>
          WESKATE ACADEMY
        </Link>
      </li>

      {/* SKATEPARKS */}
      <li>
        <Link href={getLocalizedPath("/skateparks", locale)}>
          SKATEPARKS
        </Link>
      </li>
    </ul>
  );
}
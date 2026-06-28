"use client";

import Link from "next/link";
import { useTranslation } from "lib/i18n/TranslationProvider";
import { getLocalizedPath } from "lib/i18n";
import { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

export default function NavLinks() {
  const { t, locale } = useTranslation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const shopSubLinks = [
    { title: t("nav.skateboards"), href: "/search/skateboards" },
    { title: t("nav.surfskates"), href: "/search/surfskates" },
    { title: t("nav.apparel"), href: "/search/apparel-1" },
    { title: t("nav.protective_gear"), href: "/search/protection-gears" },
  ];

  return (
    <ul className="hidden gap-6 text-sm font-medium md:flex md:items-center">
      {/* Shop Dropdown */}
      <li
        className="relative"
        onMouseEnter={() => setIsDropdownOpen(true)}
        onMouseLeave={() => setIsDropdownOpen(false)}
      >
        <button
          className="flex items-center gap-1 text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-neutral-300"
          aria-expanded={isDropdownOpen}
        >
          {t("nav.shop")}
          <ChevronDownIcon className={`h-3 w-3 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
        </button>

        {isDropdownOpen && (
          <div className="absolute top-full left-0 z-50 mt-2 w-48 rounded-xl border border-neutral-100 bg-white p-2 shadow-lg dark:border-neutral-800 dark:bg-neutral-900 animate-fadeIn">
            {shopSubLinks.map((link) => (
              <Link
                key={link.title}
                href={getLocalizedPath(link.href, locale)}
                className="block rounded-lg px-4 py-2 text-sm text-neutral-500 hover:bg-neutral-50 hover:text-black dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
                onClick={() => setIsDropdownOpen(false)}
              >
                {link.title}
              </Link>
            ))}
          </div>
        )}
      </li>

      {/* Brands */}
      <li>
        <Link
          href={getLocalizedPath("/search", locale)}
          className="text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-neutral-300"
        >
          {t("nav.brands")}
        </Link>
      </li>

      {/* Configurator */}
      <li>
        <Link
          href={getLocalizedPath("/configurator", locale)}
          className="text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-neutral-300"
        >
          {t("configurator.title")}
        </Link>
      </li>

      {/* Academy */}
      <li>
        <Link
          href={getLocalizedPath("/academy", locale)}
          className="text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-neutral-300"
        >
          {t("nav.academy")}
        </Link>
      </li>

      {/* Skateparks */}
      <li>
        <Link
          href={getLocalizedPath("/skateparks", locale)}
          className="text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-neutral-300"
        >
          {t("nav.skateparks")}
        </Link>
      </li>
    </ul>
  );
}

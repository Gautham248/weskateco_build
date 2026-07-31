"use client";

import { getLocalizedPath } from "lib/i18n";
import { useTranslation } from "lib/i18n/TranslationProvider";
import Link from "next/link";

interface LinkItem {
  title: string;
  href: string;
  id: string;
}

export default function MegaMenuLeft({
  activeCategory,
  onCategoryHover,
  onLinkClick,
}: {
  activeCategory: string | null;
  onCategoryHover: (id: string | null) => void;
  onLinkClick: () => void;
}) {
  const { t, locale } = useTranslation();

  const links: LinkItem[] = [
    {
      title: t("nav.skateboards"),
      href: "/store/skateboards",
      id: "skateboards",
    },
    { title: t("nav.surfskates"), href: "/store/surfskates", id: "surfskates" },
    { title: t("nav.apparel"), href: "/store/apparel-1", id: "apparel" },
    {
      title: t("nav.protective_gear"),
      href: "/store/protection-gears",
      id: "protective_gear",
    },
    { title: t("nav.brands"), href: "/store", id: "brands" },
  ];

  return (
    <div className="w-[290px] shrink-0 bg-white dark:bg-neutral-900 rounded-xl p-10">
      <div className="flex flex-col gap-7">
        {links.map((link) => (
          <Link
            key={link.id}
            href={getLocalizedPath(link.href, locale)}
            className={`block text-[20px] font-semibold hover:text-black dark:hover:text-white ${activeCategory === null || activeCategory === link.href ? "!text-black dark:!text-white !font-bold" : "!text-[#717171] dark:!text-neutral-400"}`}
            style={{
              fontFamily: "'Clash Display', sans-serif",
              letterSpacing: "0em",
            }}
            onClick={onLinkClick}
            onMouseEnter={() => onCategoryHover(link.href)}
          >
            <span
              className="inline-flex flex-col after:content-[attr(data-text)] after:font-bold after:h-0 after:invisible after:overflow-hidden select-none"
              data-text={link.title.toUpperCase()}
            >
              {link.title.toUpperCase()}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

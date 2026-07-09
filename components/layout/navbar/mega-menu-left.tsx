"use client";

import Link from "next/link";
import { getLocalizedPath } from "lib/i18n";
import { useTranslation } from "lib/i18n/TranslationProvider";

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
    { title: t("nav.skateboards"), href: "/search/skateboards", id: "skateboards" },
    { title: t("nav.surfskates"), href: "/search/surfskates", id: "surfskates" },
    { title: t("nav.apparel"), href: "/search/apparel-1", id: "apparel" },
    { title: t("nav.protective_gear"), href: "/search/protection-gears", id: "protective_gear" },
    { title: t("nav.brands"), href: "/search", id: "brands" },
  ];

  return (
    <div className="w-auto bg-white dark:bg-neutral-900 rounded-xl p-10">
      <div className="flex flex-col gap-7">
        {links.map((link) => (
          <Link
            key={link.id}
            href={getLocalizedPath(link.href, locale)}
            className={`block text-xl font-semibold hover:text-black dark:hover:text-white ${activeCategory === null || activeCategory === link.href ? "!text-black dark:!text-white" : "!text-[#717171] dark:!text-neutral-400"}`}
            style={{ fontFamily: "'Clash Display', sans-serif", letterSpacing: "0em" }}
            onClick={onLinkClick}
            onMouseEnter={() => onCategoryHover(link.href)}
          >
            {link.title.toUpperCase()}
          </Link>
        ))}
      </div>
    </div>
  );
}

"use client";

import { Dialog, Transition } from "@headlessui/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Fragment, useEffect, useState } from "react";

import {
  Bars3Icon,
  ChevronDownIcon,
  ChevronUpIcon,
  MinusIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { getLocalizedPath } from "lib/i18n";
import { useTranslation } from "lib/i18n/TranslationProvider";
import { WeskatecoIcon } from "./index";

// Import bottom images
import shopImg1 from "components/icons/shop_image_1.png";
import shopImg2 from "components/icons/shop_image_2.png";

const CATEGORY_PREFIXES = [
  { match: "skateboards", prefix: "skateboard" },
  { match: "surfskates", prefix: "surfskate" },
] as const;

const ITEM_SLUGS: Record<string, (prefix: string) => string> = {
  completes: (p) => `${p}-completes`,
  decks: (p) => (p === "skateboard" ? "decks" : `${p}-decks`),
  trucks: (p) => `${p}-trucks`,
  wheels: (p) => `${p}-wheels`,
  accessories: (p) => `${p}-accessories`,
};

function getStorePath(parentCategoryUrl: string, itemLower: string): string {
  const category = CATEGORY_PREFIXES.find((c) =>
    parentCategoryUrl.includes(c.match)
  );
  const slugFn = category && ITEM_SLUGS[itemLower];
  const slug = slugFn ? slugFn(category.prefix) : itemLower;
  return `/store/${slug}`;
}

export default function MobileMenu() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { t, locale } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  // Accordion states
  const [isStoreExpanded, setIsStoreExpanded] = useState(true);
  const [isGuidesExpanded, setIsGuidesExpanded] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const openMobileMenu = () => setIsOpen(true);
  const closeMobileMenu = () => setIsOpen(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname, searchParams]);

  const toggleCategory = (category: string) => {
    if (expandedCategory === category) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(category);
    }
  };

  const storeCategories = [
    { name: "Skateboards", key: "skateboards", href: "/store/skateboards" },
    { name: "Surfskate", key: "surfskates", href: "/store/surfskates" },
    { name: "Apparel", key: "apparel", href: "/store/apparel-1" },
    {
      name: "Protective Gear",
      key: "protective_gear",
      href: "/store/protection-gears",
    },
    { name: "Brands", key: "brands", href: "/store" },
  ];

  const subItems: Record<string, string[]> = {
    Skateboards: ["Completes", "Decks", "Wheels", "Trucks", "Accessories"],
    Surfskate: ["Completes", "Decks", "Wheels", "Trucks", "Accessories"],
    Apparel: [],
    "Protective Gear": [],
    Brands: [],
  };

  const getSubItemHref = (
    parentCategoryUrl: string,
    subItemName: string,
  ): string => {
    const itemLower = subItemName.toLowerCase();
    const path = getStorePath(parentCategoryUrl, itemLower);
    return getLocalizedPath(path, locale);
  };

  return (
    <>
      <button
        onClick={openMobileMenu}
        aria-label="Open mobile menu"
        className="flex h-7 w-7 items-center justify-center rounded-md transition-colors md:hidden text-current"
      >
        <Bars3Icon className="h-6 w-6" />
      </button>
      <Transition show={isOpen}>
        <Dialog onClose={closeMobileMenu} className="relative z-50">
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="opacity-0 backdrop-blur-none"
            enterTo="opacity-100 backdrop-blur-[.5px]"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="opacity-100 backdrop-blur-[.5px]"
            leaveTo="opacity-0 backdrop-blur-none"
          >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="translate-x-[-100%]"
            enterTo="translate-x-0"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-[-100%]"
          >
            <Dialog.Panel className="fixed inset-0 flex h-full w-full flex-col bg-white pb-6 dark:bg-black text-black dark:text-white">
              {/* Header */}
              <div className="flex items-center justify-between h-[72px] px-4 border-b border-neutral-200 dark:border-neutral-800">
                <button
                  className="flex h-11 w-11 items-center justify-start text-black dark:text-white"
                  onClick={closeMobileMenu}
                  aria-label="Close mobile menu"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
                <div className="flex-1 flex justify-center text-black dark:text-white">
                  <WeskatecoIcon color="currentColor" />
                </div>
                <div className="w-11" />
              </div>

              {/* Scrollable Body */}
              <div
                className="flex-1 overflow-y-auto px-4 py-4"
                style={{ fontFamily: "'Clash Display', sans-serif" }}
              >
                {/* STORE Accordion */}
                <div className="border-b border-neutral-100 dark:border-neutral-900 py-3">
                  <button
                    onClick={() => setIsStoreExpanded(!isStoreExpanded)}
                    className="flex w-full items-center justify-between font-bold text-[clamp(0.938rem,2.5vw,1.125rem)] tracking-wider uppercase text-black dark:text-white"
                  >
                    <span style={{ fontFamily: "'Clash Display', sans-serif" }}>
                      STORE
                    </span>
                    {isStoreExpanded ? (
                      <ChevronUpIcon className="h-4 w-4 stroke-[2.5]" />
                    ) : (
                      <ChevronDownIcon className="h-4 w-4 stroke-[2.5]" />
                    )}
                  </button>

                  {isStoreExpanded && (
                    <div className="mt-4 flex flex-col pl-1">
                      {storeCategories.map((category) => {
                        const items = subItems[category.name] || [];
                        const isExpanded = expandedCategory === category.name;
                        const hasSub = items.length > 0;
                        return (
                          <div
                            key={category.name}
                            className="border-b border-neutral-100 dark:border-neutral-900/60 py-3 last:border-0"
                            style={{ fontFamily: "Archivo, sans-serif" }}
                          >
                            <div
                              onClick={() =>
                                hasSub
                                  ? toggleCategory(category.name)
                                  : undefined
                              }
                              className="flex w-full items-center justify-between font-medium text-[clamp(0.875rem,2vw,1rem)] text-neutral-800 dark:text-neutral-200 cursor-pointer"
                            >
                              {hasSub ? (
                                <span>{category.name}</span>
                              ) : (
                                <Link
                                  href={getLocalizedPath(category.href, locale)}
                                  onClick={closeMobileMenu}
                                  className="w-full text-left"
                                >
                                  {category.name}
                                </Link>
                              )}
                              {hasSub && (
                                <button
                                  aria-label="Toggle Section"
                                  className="p-1"
                                >
                                  {isExpanded ? (
                                    <MinusIcon className="h-4 w-4 text-neutral-500" />
                                  ) : (
                                    <PlusIcon className="h-4 w-4 text-neutral-500" />
                                  )}
                                </button>
                              )}
                            </div>

                            {isExpanded && hasSub && (
                              <div className="flex flex-wrap gap-2 mt-3 mb-1">
                                {items.map((subItem) => (
                                  <Link
                                    key={subItem}
                                    href={getSubItemHref(
                                      category.href,
                                      subItem,
                                    )}
                                    onClick={closeMobileMenu}
                                    className="bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-semibold px-3 py-1.5 rounded-[6px] transition-colors active:bg-black active:text-white dark:active:bg-white dark:active:text-black"
                                  >
                                    {subItem}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* GUIDES Accordion */}
                <div className="border-b border-neutral-100 dark:border-neutral-900 py-3">
                  <button
                    onClick={() => setIsGuidesExpanded(!isGuidesExpanded)}
                    className="flex w-full items-center justify-between font-bold text-[clamp(0.938rem,2.5vw,1.125rem)] tracking-wider uppercase text-black dark:text-white"
                  >
                    <span style={{ fontFamily: "'Clash Display', sans-serif" }}>
                      GUIDES
                    </span>
                    {isGuidesExpanded ? (
                      <ChevronUpIcon className="h-4 w-4 stroke-[2.5]" />
                    ) : (
                      <ChevronDownIcon className="h-4 w-4 stroke-[2.5]" />
                    )}
                  </button>

                  {isGuidesExpanded && (
                    <div className="mt-3 flex flex-col gap-2 pl-1"
                      style={{ fontFamily: "Archivo, sans-serif" }}
                    >
                      <Link
                        href={getLocalizedPath(
                          "/guides/skateboard-buying-guide",
                          locale
                        )}
                        onClick={closeMobileMenu}
                        className="text-neutral-800 dark:text-neutral-200 text-sm font-medium py-1.5 hover:text-black dark:hover:text-white"
                      >
                        Skateboard Buying Guide
                      </Link>
                      <Link
                        href={getLocalizedPath("/guides/wheels-guide", locale)}
                        onClick={closeMobileMenu}
                        className="text-neutral-800 dark:text-neutral-200 text-sm font-medium py-1.5 hover:text-black dark:hover:text-white"
                      >
                        Wheels Guide
                      </Link>
                    </div>
                  )}
                </div>

                {/* ACADEMY Link */}
                <div className="border-b border-neutral-100 dark:border-neutral-900 py-4">
                  <Link
                    href={getLocalizedPath("/academy", locale)}
                    onClick={closeMobileMenu}
                    className="block font-bold text-[clamp(0.938rem,2.5vw,1.125rem)] tracking-wider uppercase text-black dark:text-white"
                    style={{ fontFamily: "'Clash Display', sans-serif" }}
                  >
                    WESKATE ACADEMY
                  </Link>
                </div>

                {/* SKATEPARKS Link */}
                <div className="border-b border-neutral-100 dark:border-neutral-900 py-4">
                  <Link
                    href={getLocalizedPath("/skateparks", locale)}
                    onClick={closeMobileMenu}
                    className="block font-bold text-[clamp(0.938rem,2.5vw,1.125rem)] tracking-wider uppercase text-black dark:text-white"
                    style={{ fontFamily: "'Clash Display', sans-serif" }}
                  >
                    SKATEPARKS
                  </Link>
                </div>
              </div>

              {/* Bottom Promo Images Section (Fixed at bottom) */}
              <div className="pl-4 pt-4 pb-2 dark:border-neutral-900 bg-white dark:bg-black">
                <div className="flex overflow-x-auto gap-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {/* Shop Image 1 (Skateboarder in air) */}
                  <Link
                    href={getLocalizedPath("/search", locale)}
                    onClick={closeMobileMenu}
                    className="relative w-[50vw] shrink-0 aspect-[1.1] rounded-sm overflow-hidden bg-neutral-100 dark:bg-neutral-900 group"
                  >
                    <Image
                      src={shopImg1}
                      alt="Shop Skateboards"
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 60vw, 33vw"
                    />
                  </Link>

                  {/* Shop Image 2 (Newly Released) */}
                  <Link
                    href={getLocalizedPath("/search?sort=latest", locale)}
                    onClick={closeMobileMenu}
                    className="relative w-[50vw] shrink-0 aspect-[1.1] rounded-sm overflow-hidden bg-neutral-100 dark:bg-neutral-900 group"
                  >
                    <Image
                      src={shopImg2}
                      alt="Newly Released"
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 60vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-black/10 transition-opacity duration-300 group-hover:bg-black/20" />
                    <div
                      className="absolute bottom-3 left-3 z-10 text-white font-extrabold fluid-text-sm uppercase leading-tight tracking-wider"
                      style={{ fontFamily: "'Clash Display', sans-serif" }}
                    >
                      Newly
                      <br />
                      Released
                    </div>
                  </Link>
                  <div className="w-4 shrink-0" />
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
}

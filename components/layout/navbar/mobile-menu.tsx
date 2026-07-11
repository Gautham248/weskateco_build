"use client";

import { Dialog, Transition } from "@headlessui/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Fragment, useEffect, useState } from "react";

import { Bars3Icon, ChevronDownIcon, ChevronUpIcon, MinusIcon, PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { getLocalizedPath } from "lib/i18n";
import { useTranslation } from "lib/i18n/TranslationProvider";
import { WeskatecoIcon } from "./index";

// Import bottom images
import shopImg1 from "components/icons/shop_image_1.png";
import shopImg2 from "components/icons/shop_image_2.png";

export default function MobileMenu() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { t, locale } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  // Accordion states
  const [isStoreExpanded, setIsStoreExpanded] = useState(false);
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
    { name: "Protective Gear", key: "protective_gear", href: "/store/protection-gears" },
    { name: "Brands", key: "brands", href: "/store" },
  ];

  const subItems: Record<string, string[]> = {
    Skateboards: ["Completes", "Decks", "Wheels", "Trucks", "Accessories"],
    Surfskate: ["Completes", "Decks", "Wheels", "Trucks", "Accessories"],
    Apparel: [],
    "Protective Gear": [],
    Brands: []
  };

  const getSubItemHref = (parentCategoryUrl: string, subItemName: string): string => {
    const itemLower = subItemName.toLowerCase();
    let path = `/store/${itemLower}`;

    if (parentCategoryUrl.includes("skateboards")) {
      if (itemLower === "completes") path = `/store/skateboard-completes`;
      else if (itemLower === "decks") path = `/store/decks`;
      else if (itemLower === "trucks") path = `/store/skateboard-trucks`;
      else if (itemLower === "wheels") path = `/store/skateboard-wheels`;
      else if (itemLower === "accessories") path = `/store/skateboard-accessories`;
    } else if (parentCategoryUrl.includes("surfskates")) {
      if (itemLower === "completes") path = `/store/surfskate-completes`;
      else if (itemLower === "decks") path = `/store/surfskate-decks`;
      else if (itemLower === "trucks") path = `/store/surfskate-trucks`;
      else if (itemLower === "wheels") path = `/store/surfskate-wheels`;
      else if (itemLower === "accessories") path = `/store/surfskate-accessories`;
    }

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
              <div className="flex items-center justify-between h-[72px] px-6 border-b border-neutral-200 dark:border-neutral-800">
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
              <div className="flex-1 overflow-y-auto px-6 py-6">
                {/* STORE Accordion */}
                <div className="border-b border-neutral-100 dark:border-neutral-900 py-3">
                  <button
                    onClick={() => setIsStoreExpanded(!isStoreExpanded)}
                    className="flex w-full items-center justify-between font-bold text-[17px] tracking-wider uppercase text-black dark:text-white"
                  >
                    <span>STORE</span>
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
                          <div key={category.name} className="border-b border-neutral-100 dark:border-neutral-900/60 py-3 last:border-0">
                            <div
                              onClick={() => hasSub ? toggleCategory(category.name) : undefined}
                              className="flex w-full items-center justify-between font-medium text-[16px] text-neutral-800 dark:text-neutral-200 cursor-pointer"
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
                                <button aria-label="Toggle Section" className="p-1">
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
                                    href={getSubItemHref(category.href, subItem)}
                                    onClick={closeMobileMenu}
                                    className="bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-semibold px-3 py-1.5 rounded-[6px] transition-colors"
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

                {/* GUIDES Link */}
                <div className="border-b border-neutral-100 dark:border-neutral-900 py-4">
                  <Link
                    href={getLocalizedPath("/guides", locale)}
                    onClick={closeMobileMenu}
                    className="block font-bold text-[17px] tracking-wider uppercase text-black dark:text-white"
                  >
                    GUIDES
                  </Link>
                </div>

                {/* ACADEMY Link */}
                <div className="border-b border-neutral-100 dark:border-neutral-900 py-4">
                  <Link
                    href={getLocalizedPath("/academy", locale)}
                    onClick={closeMobileMenu}
                    className="block font-bold text-[17px] tracking-wider uppercase text-black dark:text-white"
                  >
                    WESKATE ACADEMY
                  </Link>
                </div>

                {/* SKATEPARKS Link */}
                <div className="border-b border-neutral-100 dark:border-neutral-900 py-4">
                  <Link
                    href={getLocalizedPath("/skateparks", locale)}
                    onClick={closeMobileMenu}
                    className="block font-bold text-[17px] tracking-wider uppercase text-black dark:text-white"
                  >
                    SKATEPARKS
                  </Link>
                </div>
              </div>

              {/* Bottom Promo Images Section (Fixed at bottom) */}
              <div className="pl-6 pt-4 pb-2 dark:border-neutral-900 bg-white dark:bg-black">
                <div className="grid grid-cols-2 gap-1">
                  {/* Shop Image 1 (Skateboarder in air) */}
                  <Link
                    href={getLocalizedPath("/search", locale)}
                    onClick={closeMobileMenu}
                    className="relative aspect-[1.1] w-full rounded-sm overflow-hidden bg-neutral-100 dark:bg-neutral-900 group"
                  >
                    <Image
                      src={shopImg1}
                      alt="Shop Skateboards"
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />
                  </Link>

                  {/* Shop Image 2 (Newly Released) */}
                  <Link
                    href={getLocalizedPath("/search?sort=latest", locale)}
                    onClick={closeMobileMenu}
                    className="relative aspect-[1.1] w-full rounded-sm overflow-hidden bg-neutral-100 dark:bg-neutral-900 group"
                  >
                    <Image
                      src={shopImg2}
                      alt="Newly Released"
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-black/10 transition-opacity duration-300 group-hover:bg-black/20" />
                    <div
                      className="absolute bottom-3 left-3 z-10 text-white font-extrabold text-[12px] uppercase leading-tight tracking-wider"
                      style={{ fontFamily: "'Archivo', sans-serif" }}
                    >
                      Newly<br />Released
                    </div>
                  </Link>
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
}

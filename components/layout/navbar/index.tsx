"use client";

import CartModal from "components/cart/modal";
import Link from "next/link";
import { Suspense, useState } from "react";
import MobileMenu from "./mobile-menu";
import NavLinks from "./nav-links";
import { useNavbarScroll } from "./navbar-scroll";
import Search, { SearchSkeleton } from "./search";

const { SITE_NAME } = process.env;

export function Navbar({ locale }: { locale?: string }) {
  const scrolled = useNavbarScroll();
  const [isStoreOpen, setIsStoreOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <nav
      className="mx-auto max-w-(--breakpoint-2xl) relative z-50"
      style={{ fontFamily: "Archivo, sans-serif" }}
    >
      {/* Top Header Row */}
      <div className="flex items-center justify-between h-[72px] px-4 lg:px-15 relative z-50 gap-4 lg:gap-8">
        {/* Left: Mobile hamburger + Logo */}
        <div className="flex-1 md:flex-initial flex items-center justify-start gap-4 z-50">
          <div className="md:hidden">
            <Suspense fallback={null}>
              <MobileMenu />
            </Suspense>
          </div>
          <Link href="/" className="flex items-center">
            <img
              src="/icons/weskate-logo.png"
              alt="WeSkate Co"
              className={`h-9 w-auto md:h-12 ${scrolled ? "invert" : ""}`}
            />
          </Link>
        </div>

        {/* Desktop Center: Nav Links OR Desktop Inline Search Bar */}
        {isSearchOpen ? (
          <div className="hidden md:flex flex-1 justify-center max-w-2xl lg:max-w-3xl mx-2 md:mx-6 z-50">
            <Suspense fallback={<SearchSkeleton />}>
              <Search
                isOpen={isSearchOpen}
                onOpenChange={setIsSearchOpen}
                scrolled={scrolled}
              />
            </Suspense>
          </div>
        ) : (
          <div className="hidden md:flex justify-center flex-shrink-0">
            <NavLinks onDropdownChange={setIsStoreOpen} />
          </div>
        )}

        {/* Right: Search trigger, Cart, User */}
        <div
          className={`flex-1 md:flex-initial flex items-center justify-end gap-3 md:gap-6 xl:gap-11 z-50 transition-opacity duration-300 ${isStoreOpen ? "opacity-50" : "opacity-100"}`}
        >
          <div className={isSearchOpen ? "hidden" : "block"}>
            <Suspense fallback={<SearchSkeleton />}>
              <Search
                isOpen={false}
                onOpenChange={setIsSearchOpen}
                scrolled={scrolled}
              />
            </Suspense>
          </div>
          <Suspense fallback={null}>
            <CartModal />
          </Suspense>
          <Link
            href="/account"
            aria-label="Account"
            className="h-7 w-7 flex items-center justify-center rounded-md transition-colors flex-shrink-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke={scrolled ? "black" : "white"}
              className="h-5 w-5 md:h-7 md:w-7"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
          </Link>
        </div>
      </div>

      {/* Mobile Search Bar Row (renders directly below top row when search is active) */}
      {isSearchOpen && (
        <div className="md:hidden w-full px-4 pb-3 pt-0 z-50">
          <Suspense fallback={<SearchSkeleton />}>
            <Search
              isOpen={true}
              onOpenChange={setIsSearchOpen}
              scrolled={scrolled}
            />
          </Suspense>
        </div>
      )}
    </nav>
  );
}

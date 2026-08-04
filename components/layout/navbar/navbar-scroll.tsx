"use client";

import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

const HERO_PATHS = [
  "/",
  "/en",
  "/hi",
  "/academy",
  "/en/academy",
  "/hi/academy",
  "/skateparks",
  "/en/skateparks",
  "/hi/skateparks",
];

const NavbarScrollContext = createContext<boolean>(false);

export function useNavbarScroll() {
  return useContext(NavbarScrollContext);
}

export function NavbarScrollWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHeroPage =
    HERO_PATHS.includes(pathname) ||
    pathname.endsWith("/academy") ||
    pathname.endsWith("/skateparks");
  const [scrolled, setScrolled] = useState(!isHeroPage);

  useEffect(() => {
    if (!isHeroPage) {
      setScrolled(true);
      return;
    }
    const onScroll = () => {
      setScrolled(window.scrollY >= window.innerHeight - 80);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHeroPage]);

  return (
    <NavbarScrollContext.Provider value={scrolled}>
      <div
        data-scrolled={scrolled}
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
          scrolled
            ? "bg-white border-b border-neutral-200 text-black"
            : "bg-transparent text-white"
        }`}
      >
        {children}
      </div>
    </NavbarScrollContext.Provider>
  );
}

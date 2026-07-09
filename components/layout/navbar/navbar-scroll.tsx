"use client";

import { useEffect, useState, createContext, useContext } from "react";
import { usePathname } from "next/navigation";

const HOME_PATHS = ["/", "/en", "/hi"];

const NavbarScrollContext = createContext<boolean>(false);

export function useNavbarScroll() {
  return useContext(NavbarScrollContext);
}

export function NavbarScrollWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHomePage = HOME_PATHS.includes(pathname);
  const [scrolled, setScrolled] = useState(!isHomePage);

  useEffect(() => {
    if (!isHomePage) return;
    const onScroll = () => {
      setScrolled(window.scrollY >= window.innerHeight - 80);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHomePage]);

  return (
    <NavbarScrollContext.Provider value={scrolled}>
      <div
        data-scrolled={scrolled}
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
          scrolled
            ? "bg-white border-b border-neutral-200 dark:bg-neutral-900 dark:border-neutral-700"
            : "bg-transparent"
        }`}
      >
        {children}
      </div>
    </NavbarScrollContext.Provider>
  );
}
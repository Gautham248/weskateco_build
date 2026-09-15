"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/admin/products", label: "Products" },
  { href: "/admin/settings", label: "Settings" },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Admin sections" className="space-y-1">
      {NAV_ITEMS.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={clsx(
              "block rounded-[8px] border px-3 py-2 text-sm font-medium transition-all duration-200",
              isActive
                ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                : "border-transparent bg-neutral-100 text-neutral-800 hover:bg-neutral-200 dark:bg-neutral-900/35 dark:text-neutral-200 dark:hover:bg-neutral-800",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

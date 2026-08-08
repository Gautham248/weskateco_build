"use client";

import Link from "next/link";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface ConfiguratorHeaderProps {
  title: string;
  totalAmount: number;
  currencyCode: string;
  locale: string;
}

export function ConfiguratorHeader({
  title,
  totalAmount,
  currencyCode,
  locale,
}: ConfiguratorHeaderProps) {
  const formattedPrice =
    totalAmount > 0
      ? new Intl.NumberFormat(locale === "hi" ? "hi-IN" : "en-US", {
          style: "currency",
          currency: currencyCode,
        }).format(totalAmount)
      : `${currencyCode === "INR" ? "₹" : "$"}${totalAmount.toFixed(2)}`;

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-4 md:px-8 dark:border-neutral-800 dark:bg-neutral-950">
      {/* Close button */}
      <Link
        href="/store"
        aria-label="Exit configurator"
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-black dark:border-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-900 dark:hover:text-white"
      >
        <XMarkIcon className="h-6 w-6" />
      </Link>

      {/* Title */}
      <h1
        className="text-center text-xl font-bold uppercase tracking-wide md:text-2xl"
        style={{ fontFamily: "'Clash Display', sans-serif" }}
      >
        {title}
      </h1>

      {/* Running Total */}
      <div className="text-right">
        <span className="text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          Total:
        </span>{" "}
        <span className="text-base font-bold text-black md:text-lg dark:text-white">
          {formattedPrice}
        </span>
      </div>
    </header>
  );
}

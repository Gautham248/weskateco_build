"use client";

import { useState } from "react";
import Prose from "components/prose";

interface ProductTabsProps {
  descriptionHtml?: string;
  description?: string;
  metafields: {
    key: string;
    value: string;
    namespace: string;
    type: string;
  }[];
}

export default function ProductTabs({
  descriptionHtml,
  description,
  metafields,
}: ProductTabsProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="mt-12 w-full border-t border-neutral-200 pt-8 dark:border-neutral-800">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-4 text-left font-bold text-black dark:text-white uppercase tracking-wider text-[16px]"
        style={{ fontFamily: "'Clash Display', sans-serif" }}
      >
        <span>Product Description</span>
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform duration-200 ${isOpen ? "" : "rotate-180"}`}
        >
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </button>

      {isOpen && (
        <div className="pt-4 pb-6 animate-fadeIn">
          {descriptionHtml ? (
            <Prose
              className="text-[14px] leading-relaxed text-black dark:text-neutral-300"
              html={descriptionHtml}
            />
          ) : (
            <p className="text-[14px] leading-relaxed text-black dark:text-neutral-300">
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

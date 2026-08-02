"use client";

import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Form from "next/form";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

interface SearchProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  scrolled?: boolean;
}

export default function Search({
  isOpen = false,
  onOpenChange,
  scrolled = false,
}: SearchProps) {
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    function handleClickOutside(event: Event) {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      // Do not close if click was inside any search container
      if (target.closest?.("[data-search-container]")) {
        return;
      }

      onOpenChange?.(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onOpenChange?.(false);
      }
    }

    if (isOpen) {
      const timer = setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside);
        document.addEventListener("keydown", handleKeyDown);
      }, 50);

      return () => {
        clearTimeout(timer);
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("touchstart", handleClickOutside);
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isOpen, onOpenChange]);

  const handleClose = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    onOpenChange?.(false);
  };

  const iconColorClass = scrolled ? "text-black" : "text-white";

  if (!isOpen) {
    return (
      <button
        onClick={() => onOpenChange?.(true)}
        aria-label="Search"
        data-search-container
        className={`flex items-center justify-center rounded-md transition-colors h-5 w-5 md:h-7 md:w-7 cursor-pointer hover:opacity-75 flex-shrink-0 ${iconColorClass}`}
      >
        <MagnifyingGlassIcon
          className={`h-5 md:h-7 w-auto ${iconColorClass}`}
        />
      </button>
    );
  }

  return (
    <div
      ref={containerRef}
      data-search-container
      className="w-full flex items-center justify-center"
    >
      <Form
        action="/store"
        className={`flex items-center w-full rounded-xl px-4 py-2 h-10 md:h-11 transition-all gap-2.5 ${
          scrolled
            ? "bg-[#EDEDED] border border-transparent"
            : "bg-transparent border border-white/30"
        }`}
      >
        <button
          type="submit"
          aria-label="Submit search"
          className={`hover:opacity-70 transition-opacity cursor-pointer flex items-center justify-center flex-shrink-0 ${iconColorClass}`}
        >
          <MagnifyingGlassIcon className={`h-5 w-5 ${iconColorClass}`} />
        </button>

        <input
          key={searchParams?.get("q")}
          ref={inputRef}
          type="text"
          name="q"
          placeholder="Type to search"
          autoComplete="off"
          defaultValue={searchParams?.get("q") || ""}
          className={`flex-1 !bg-transparent border-none outline-none text-sm md:text-base font-normal min-w-0 ${
            scrolled
              ? "text-black placeholder:text-[#ACACAC]"
              : "text-white placeholder:text-white/60"
          }`}
        />

        <button
          type="button"
          onClick={handleClose}
          aria-label="Close search"
          className={`hover:opacity-70 transition-opacity cursor-pointer flex items-center justify-center flex-shrink-0 ${iconColorClass}`}
        >
          <XMarkIcon className={`h-5 w-5 ${iconColorClass}`} />
        </button>
      </Form>
    </div>
  );
}

export function SearchSkeleton() {
  return <div className="h-7 w-7 rounded-md" />;
}

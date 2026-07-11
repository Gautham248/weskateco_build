"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Form from "next/form";
import { useSearchParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";

export default function Search() {
  const searchParams = useSearchParams();
  const [expanded, setExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (expanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [expanded]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setExpanded(false);
      }
    }
    if (expanded) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [expanded]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setExpanded(!expanded)}
        aria-label="Search"
        className="flex h-5 w-5 items-center justify-center rounded-md transition-colors md:hidden"
      >
        <MagnifyingGlassIcon className="h-5" />
      </button>
      {expanded && (
        <div className="absolute top-full -right-17 mt-2 md:hidden">
          <Form action="/store" className="flex items-center">
            <input
              key={searchParams?.get("q")}
              ref={inputRef}
              type="text"
              name="q"
              placeholder="Search..."
              autoComplete="off"
              defaultValue={searchParams?.get("q") || ""}
              onBlur={() => setExpanded(false)}
              className="w-[180px] rounded-lg border bg-white px-3 py-2 text-sm text-black placeholder:text-neutral-500 outline-none dark:border-neutral-700 dark:bg-transparent dark:text-white dark:placeholder:text-neutral-400"
            />
          </Form>
        </div>
      )}
      {expanded ? (
        <Form action="/store" className="hidden md:flex items-center">
          <input
            key={searchParams?.get("q")}
            ref={inputRef}
            type="text"
            name="q"
            placeholder="Search..."
            autoComplete="off"
            defaultValue={searchParams?.get("q") || ""}
            onBlur={() => setExpanded(false)}
            className="w-[180px] rounded-lg border bg-white px-3 py-2 text-sm text-black placeholder:text-neutral-500 outline-none md:w-[320px] dark:border-neutral-700 dark:bg-transparent dark:text-white dark:placeholder:text-neutral-400"
          />
        </Form>
      ) : (
        <button
          onClick={() => setExpanded(true)}
          aria-label="Search"
          className="hidden md:flex md:h-7 md:w-7 items-center justify-center rounded-md transition-colors"
        >
          <MagnifyingGlassIcon className="h-7" />
        </button>
      )}
    </div>
  );
}

export function SearchSkeleton() {
  return (
    <div className="h-11 w-11 rounded-md border" />
  );
}
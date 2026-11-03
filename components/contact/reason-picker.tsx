"use client";

import { useState, useRef, useEffect, useCallback, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { REASONS } from "lib/contact/routes";

// ---------------------------------------------------------------------------
// reason-picker.tsx — custom reason selector
//
// Mobile: full-screen bottom-sheet modal (Headless UI Dialog)
// Desktop: absolutely positioned dropdown below the trigger
// ---------------------------------------------------------------------------

interface ReasonPickerProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  describedBy?: string;
}

export default function ReasonPicker({
  value,
  onChange,
  error,
  describedBy,
}: ReasonPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Detect screen size
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Close desktop dropdown on outside click
  useEffect(() => {
    if (isMobile || !isOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isMobile, isOpen]);

  // Close desktop dropdown on Escape
  useEffect(() => {
    if (isMobile || !isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isMobile, isOpen]);

  const handleSelect = useCallback(
    (val: string) => {
      onChange(val);
      setIsOpen(false);
      triggerRef.current?.focus();
    },
    [onChange],
  );

  // Find the label for the current value
  const selectedLabel = (() => {
    for (const group of REASONS) {
      for (const opt of group.options) {
        if (opt.value === value) return opt.label;
      }
    }
    return null;
  })();

  const triggerClasses = [
    "flex w-full items-center justify-between rounded-md border bg-white px-3 py-2.5 text-sm text-left transition-colors focus:border-black focus:ring-1 focus:ring-black focus:outline-none",
    error
      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
      : "border-neutral-300",
  ].join(" ");

  // ── Shared option list renderer ─────────────────────────────────────
  const renderOptions = (onPick: (val: string) => void) => (
    <div className="overflow-y-auto max-h-[70vh] md:max-h-80">
      {REASONS.map((group) => (
        <div key={group.group}>
          <div className="sticky top-0 bg-neutral-100 px-4 py-2 text-xs font-bold uppercase tracking-wider text-neutral-500">
            {group.group}
          </div>
          {group.options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onPick(opt.value)}
                className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                  isSelected
                    ? "bg-black text-white"
                    : "text-black hover:bg-neutral-50 active:bg-neutral-100"
                }`}
              >
                <span className="flex items-center justify-between gap-2">
                  <span>{opt.label}</span>
                  {isSelected && (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="shrink-0"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );

  return (
    <>
      {/* ── Trigger button ────────────────────────────────────────── */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(true)}
        className={triggerClasses}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-describedby={describedBy}
        aria-invalid={!!error}
      >
        <span className={selectedLabel ? "text-black" : "text-neutral-400"}>
          {selectedLabel ?? "Select a reason\u2026"}
        </span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="shrink-0 text-neutral-400"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* ── Mobile: bottom-sheet modal ───────────────────────────── */}
      {isMobile && (
        <Transition appear show={isOpen} as={Fragment}>
          <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black/40" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-hidden">
              <div className="absolute inset-0 overflow-hidden">
                <div className="fixed inset-x-0 bottom-0 flex max-h-full">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="translate-y-full"
                    enterTo="translate-y-0"
                    leave="ease-in duration-200"
                    leaveFrom="translate-y-0"
                    leaveTo="translate-y-full"
                  >
                    <Dialog.Panel className="w-full transform rounded-t-2xl bg-white shadow-xl transition-all">
                      {/* Handle bar */}
                      <div className="flex justify-center pt-3 pb-1">
                        <div className="h-1 w-10 rounded-full bg-neutral-300" />
                      </div>

                      {/* Header */}
                      <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3">
                        <Dialog.Title
                          className="text-base font-bold"
                          style={{ fontFamily: "'Clash Display', sans-serif" }}
                        >
                          Reason for contacting us
                        </Dialog.Title>
                        <button
                          type="button"
                          onClick={() => setIsOpen(false)}
                          className="rounded-full p-1 text-neutral-400 hover:text-black transition-colors"
                          aria-label="Close"
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>
                      </div>

                      {/* Options */}
                      {renderOptions(handleSelect)}
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </div>
          </Dialog>
        </Transition>
      )}

      {/* ── Desktop: dropdown ─────────────────────────────────────── */}
      {!isMobile && isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-40 mt-1 w-full rounded-md border border-neutral-200 bg-white shadow-lg"
        >
          {renderOptions(handleSelect)}
        </div>
      )}
    </>
  );
}

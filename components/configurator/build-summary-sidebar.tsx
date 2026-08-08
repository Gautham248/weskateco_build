"use client";

import Image from "next/image";
import clsx from "clsx";
import type { ConfiguratorState, ConfiguratorItem } from "lib/configurator/types";

interface StepSlot {
  id: number;
  category: keyof ConfiguratorState;
  title: string;
  item: ConfiguratorItem | null;
  isRequired: boolean;
}

interface BuildSummarySidebarProps {
  state: ConfiguratorState;
  currentStepId: number;
  onSelectStep: (stepId: number) => void;
  onAddToCart: () => void;
  isAddingToCart?: boolean;
  /** Whether a board type has been selected — gates slot navigation */
  boardTypeSelected: boolean;
  /** Called when user clicks a slot before selecting a board type */
  onNeedsBoardType?: () => void;
}

// Line art SVG place-holder icons for unselected components
function SlotIcon({ category }: { category: keyof ConfiguratorState }) {
  switch (category) {
    case "deck":
      return (
        <svg className="h-10 w-10 text-neutral-400" viewBox="0 0 48 48" fill="none" stroke="currentColor">
          <rect x="16" y="6" width="16" height="36" rx="8" strokeWidth="2" />
          <circle cx="20" cy="12" r="1.5" fill="currentColor" />
          <circle cx="28" cy="12" r="1.5" fill="currentColor" />
          <circle cx="20" cy="36" r="1.5" fill="currentColor" />
          <circle cx="28" cy="36" r="1.5" fill="currentColor" />
        </svg>
      );
    case "trucks":
      return (
        <svg className="h-10 w-10 text-neutral-400" viewBox="0 0 48 48" fill="none" stroke="currentColor">
          <path d="M6 24H42" strokeWidth="2.5" strokeLinecap="round" />
          <rect x="18" y="16" width="12" height="16" rx="2" strokeWidth="2" />
          <circle cx="6" cy="24" r="3" strokeWidth="2" />
          <circle cx="42" cy="24" r="3" strokeWidth="2" />
        </svg>
      );
    case "wheels":
      return (
        <svg className="h-10 w-10 text-neutral-400" viewBox="0 0 48 48" fill="none" stroke="currentColor">
          <circle cx="24" cy="24" r="18" strokeWidth="2.5" />
          <circle cx="24" cy="24" r="8" strokeWidth="2" />
        </svg>
      );
    case "bearings":
      return (
        <svg className="h-10 w-10 text-neutral-400" viewBox="0 0 48 48" fill="none" stroke="currentColor">
          <circle cx="24" cy="24" r="18" strokeWidth="2" />
          <circle cx="24" cy="24" r="10" strokeWidth="2" />
          <circle cx="24" cy="10" r="2.5" fill="currentColor" />
          <circle cx="24" cy="38" r="2.5" fill="currentColor" />
          <circle cx="10" cy="24" r="2.5" fill="currentColor" />
          <circle cx="38" cy="24" r="2.5" fill="currentColor" />
        </svg>
      );
    case "griptape":
      return (
        <svg className="h-10 w-10 text-neutral-400" viewBox="0 0 48 48" fill="none" stroke="currentColor">
          <rect x="12" y="6" width="24" height="36" rx="3" strokeWidth="2" strokeDasharray="3 3" />
        </svg>
      );
    default:
      return (
        <svg className="h-10 w-10 text-neutral-400" viewBox="0 0 48 48" fill="none" stroke="currentColor">
          <path d="M12 24H36M24 12V36" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
  }
}

export function BuildSummarySidebar({
  state,
  currentStepId,
  onSelectStep,
  onAddToCart,
  isAddingToCart = false,
  boardTypeSelected,
  onNeedsBoardType,
}: BuildSummarySidebarProps) {
  const slots: StepSlot[] = [
    { id: 2, category: "deck", title: "DECKS", item: state.deck, isRequired: true },
    { id: 3, category: "trucks", title: "TRUCKS", item: state.trucks, isRequired: true },
    { id: 4, category: "wheels", title: "WHEELS", item: state.wheels, isRequired: true },
    { id: 5, category: "bearings", title: "BEARINGS", item: state.bearings, isRequired: true },
    { id: 6, category: "griptape", title: "GRIPTAPE", item: state.griptape, isRequired: true },
  ];

  // Complete if all required components are chosen
  const isComplete = slots.every((s) => !s.isRequired || s.item !== null);

  return (
    <aside className="flex h-full w-full flex-col rounded-xl border border-neutral-200 bg-white p-5 md:w-72 lg:w-80 dark:border-neutral-800 dark:bg-neutral-950">
      {/* Sticky Add to Cart button */}
      <button
        onClick={onAddToCart}
        disabled={!isComplete || isAddingToCart}
        className={clsx(
          "w-full py-4 text-center text-sm font-bold uppercase tracking-wider transition-all duration-200 rounded-lg",
          isComplete
            ? "bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
            : "bg-neutral-200 text-neutral-400 cursor-not-allowed dark:bg-neutral-800 dark:text-neutral-600",
        )}
      >
        {isAddingToCart ? "Adding..." : "ADD TO CART"}
      </button>

      {/* Step slots list */}
      <div className="flex-1 overflow-y-auto pr-1 mt-6 flex flex-col space-y-4">
        {slots.map((slot) => {
          const isActive = currentStepId === slot.id;
          const item = slot.item;
          const locked = !boardTypeSelected;

          return (
            <button
              key={slot.id}
              onClick={() => {
                if (locked) {
                  onNeedsBoardType?.();
                } else {
                  onSelectStep(slot.id);
                }
              }}
              title={locked ? "Select a riding style first" : undefined}
              className={clsx(
                "group flex w-full flex-col items-center rounded-lg border p-4 text-left transition-all duration-200",
                isActive
                  ? "border-sky-500 bg-sky-50/40 ring-1 ring-sky-500 dark:border-sky-400 dark:bg-sky-950/20"
                  : locked
                    ? "border-neutral-200 opacity-40 cursor-not-allowed dark:border-neutral-800"
                    : "border-neutral-200 hover:border-neutral-300 cursor-pointer dark:border-neutral-800 dark:hover:border-neutral-700",
              )}
            >
              {item ? (
                // Selected item state
                <div className="flex w-full flex-col items-center text-center">
                  {item.productImage && (
                    <div className="relative mb-2 h-24 w-24 flex-shrink-0">
                      <Image
                        src={item.productImage}
                        alt={item.productTitle}
                        fill
                        className="object-contain"
                        sizes="96px"
                      />
                    </div>
                  )}
                  {item.brand && (
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                      {item.brand}
                    </span>
                  )}
                  <h3 className="line-clamp-2 text-xs font-bold text-neutral-900 dark:text-white">
                    {item.productTitle}
                  </h3>
                  <span className="mt-1 text-xs font-semibold text-neutral-600 dark:text-neutral-300">
                    {item.price.currencyCode === "INR" ? "₹" : "$"}
                    {parseFloat(item.price.amount).toFixed(2)}
                  </span>
                </div>
              ) : (
                // Unselected step slot state
                <div className="flex flex-col items-center py-4 text-center">
                  <SlotIcon category={slot.category} />
                  <span className="mt-2 text-xs font-extrabold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
                    + {slot.title}
                  </span>
                  {locked && (
                    <span className="mt-1 text-[9px] text-neutral-400 dark:text-neutral-600">
                      Select riding style first
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </aside>
  );
}

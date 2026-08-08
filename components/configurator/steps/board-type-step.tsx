"use client";

import { useTranslation } from "lib/i18n/TranslationProvider";
import type { BoardType } from "lib/configurator/types";
import {
  isBoardTypeAvailable,
  getBoardTypeUnavailableMessage,
} from "lib/configurator/engine";
import clsx from "clsx";

interface BoardTypeStepProps {
  boardTypes: BoardType[];
  selectedBoardType: BoardType | null;
  onSelect: (boardType: BoardType) => void;
}

const boardTypeIcons: Record<BoardType, string> = {
  Skateboard: "🛹",
  Surfskate: "🏄",
  Longboard: "🛣️",
  "Old School": "🎨",
  Cruiser: "🚀",
};

const boardTypeDescriptions: Record<BoardType, string> = {
  Skateboard: "Street, park & technical tricks",
  Surfskate: "Surf-style carving on land",
  Longboard: "Cruising, downhill & carving",
  "Old School": "Classic shapes & pool/bowl riding",
  Cruiser: "Relaxed city & campus cruising",
};

export function BoardTypeStep({
  boardTypes,
  selectedBoardType,
  onSelect,
}: BoardTypeStepProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center py-6">
      {/* Hero heading */}
      <div className="mb-10 text-center">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500">
          Step 1
        </p>
        <h1
          className="text-4xl font-black uppercase tracking-tight text-black dark:text-white"
          style={{ fontFamily: "'Clash Display', sans-serif" }}
        >
          What are you riding?
        </h1>
        <p className="mt-3 max-w-md text-sm text-neutral-500 dark:text-neutral-400">
          Choose your riding style to get started. We'll show you the
          components that are perfectly matched to your build.
        </p>
      </div>

      {/* Board type cards */}
      <div className="grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {boardTypes.map((boardType) => {
          const available = isBoardTypeAvailable(boardType);
          const unavailableMsg = !available
            ? getBoardTypeUnavailableMessage(boardType)
            : undefined;
          const isSelected = selectedBoardType === boardType;
          const translationKey = `configurator.board_type.${boardType.toLowerCase().replace(" ", "_")}`;

          return (
            <button
              key={boardType}
              onClick={() => available && onSelect(boardType)}
              disabled={!available}
              aria-pressed={isSelected}
              className={clsx(
                "group relative flex flex-col items-center rounded-2xl border-2 px-6 py-8 text-center transition-all duration-200",
                isSelected
                  ? "border-black bg-black text-white shadow-xl dark:border-white dark:bg-white dark:text-black"
                  : available
                    ? "cursor-pointer border-neutral-200 bg-white hover:border-neutral-900 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-white"
                    : "cursor-not-allowed border-neutral-200 bg-neutral-50 opacity-50 dark:border-neutral-800 dark:bg-neutral-900",
              )}
            >
              {/* Checkmark for selected */}
              {isSelected && (
                <div className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-white dark:bg-black">
                  <svg
                    className="h-4 w-4 text-black dark:text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}

              {/* Icon */}
              <span
                className={clsx(
                  "mb-4 text-5xl transition-transform duration-200",
                  available && !isSelected && "group-hover:scale-110",
                )}
              >
                {boardTypeIcons[boardType]}
              </span>

              {/* Name */}
              <h3
                className={clsx(
                  "mb-2 text-lg font-black uppercase tracking-tight",
                  isSelected ? "text-white dark:text-black" : "text-black dark:text-white",
                )}
                style={{ fontFamily: "'Clash Display', sans-serif" }}
              >
                {t(translationKey) !== translationKey ? t(translationKey) : boardType}
              </h3>

              {/* Description */}
              <p
                className={clsx(
                  "text-xs leading-relaxed",
                  isSelected
                    ? "text-neutral-300 dark:text-neutral-700"
                    : "text-neutral-500 dark:text-neutral-400",
                )}
              >
                {boardTypeDescriptions[boardType]}
              </p>

              {/* Unavailable badge */}
              {!available && (
                <span className="mt-4 inline-block rounded-full bg-amber-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  Coming Soon
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

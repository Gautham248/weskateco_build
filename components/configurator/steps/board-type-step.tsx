"use client";

import { useTranslation } from "lib/i18n/TranslationProvider";
import type { BoardType } from "lib/configurator/types";
import {
  isBoardTypeAvailable,
  getBoardTypeUnavailableMessage,
} from "lib/configurator/engine";

interface BoardTypeStepProps {
  boardTypes: BoardType[];
  selectedBoardType: BoardType | null;
  onSelect: (boardType: BoardType) => void;
}

const boardTypeIcons: Record<BoardType, string> = {
  Skateboard: "🛹",
  Surfskate: "🏄",
  Longboard: "🛹",
  "Old School": "🎨",
  Cruiser: "🚀",
};

const boardTypeDescriptions: Record<BoardType, string> = {
  Skateboard: "Street, park, and technical tricks",
  Surfskate: "Surf-style carving on land",
  Longboard: "Cruising, downhill, and carving",
  "Old School": "Classic shapes and pool/bowl riding",
  Cruiser: "Relaxed city cruising",
};

export function BoardTypeStep({
  boardTypes,
  selectedBoardType,
  onSelect,
}: BoardTypeStepProps) {
  const { t } = useTranslation();

  return (
    <div>
      <h2 className="mb-6 text-xl font-semibold text-neutral-800 dark:text-neutral-200">
        {t("configurator.step1")}
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {boardTypes.map((boardType) => {
          const available = isBoardTypeAvailable(boardType);
          const unavailableMsg = !available
            ? getBoardTypeUnavailableMessage(boardType)
            : undefined;
          const isSelected = selectedBoardType === boardType;

          // Translation key for board type name
          const translationKey = `configurator.board_type.${boardType.toLowerCase().replace(" ", "_")}`;

          return (
            <button
              key={boardType}
              onClick={() => available && onSelect(boardType)}
              disabled={!available}
              className={`
                relative flex flex-col items-center rounded-xl border-2 p-6 text-center transition-all
                ${
                  isSelected
                    ? "border-blue-600 bg-blue-50 dark:border-blue-400 dark:bg-blue-950"
                    : available
                      ? "border-neutral-200 bg-white hover:border-blue-300 hover:shadow-md dark:border-neutral-700 dark:bg-neutral-900 dark:hover:border-blue-600"
                      : "cursor-not-allowed border-neutral-200 bg-neutral-100 opacity-50 dark:border-neutral-800 dark:bg-neutral-900"
                }
              `}
            >
              {/* Icon */}
              <span className="mb-3 text-4xl">{boardTypeIcons[boardType]}</span>

              {/* Name */}
              <h3 className="mb-1 text-lg font-bold text-neutral-900 dark:text-white">
                {t(translationKey) !== translationKey
                  ? t(translationKey)
                  : boardType}
              </h3>

              {/* Description */}
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                {boardTypeDescriptions[boardType]}
              </p>

              {/* Unavailable badge */}
              {!available && (
                <span className="mt-3 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                  {unavailableMsg}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

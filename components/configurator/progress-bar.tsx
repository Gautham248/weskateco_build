"use client";

import { useTranslation } from "lib/i18n/TranslationProvider";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  steps: Array<{
    id: number;
    translationKey: string;
    category: string;
  }>;
}

export function ProgressBar({
  currentStep,
  totalSteps,
  steps,
}: ProgressBarProps) {
  const { t } = useTranslation();
  const percentage = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="mb-8">
      {/* Step counter */}
      <div className="mb-2 flex items-center justify-between text-sm text-neutral-500 dark:text-neutral-400">
        <span>
          {t("common.step") || "Step"} {currentStep} / {totalSteps}
        </span>
        <span>{percentage}%</span>
      </div>

      {/* Progress track */}
      <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
        <div
          className="h-full rounded-full bg-blue-600 transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Current step name */}
      {steps[currentStep - 1] && (
        <p className="mt-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">
          {t(steps[currentStep - 1]!.translationKey)}
        </p>
      )}
    </div>
  );
}

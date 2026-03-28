"use client";

import { useState, useMemo, useCallback } from "react";
import { useTranslation } from "lib/i18n/TranslationProvider";
import { buildConfiguratorItems } from "lib/configurator/mock-data";
import {
  getCompatibleDecks,
  getCompatibleTrucks,
  getCompatibleWheels,
  getCompatibleBearings,
  getCompatibleGriptape,
  getConfiguratorSteps,
  calculateBuildTotal,
} from "lib/configurator/engine";
import type {
  BoardType,
  ConfiguratorItem,
  ConfiguratorState,
} from "lib/configurator/types";
import type { Product } from "lib/shopify/types";
import { BoardTypeStep } from "./steps/board-type-step";
import { ProductSelectionStep } from "./steps/product-selection-step";
import { ReviewStep } from "./steps/review-step";
import { ProgressBar } from "./progress-bar";

const BOARD_TYPES: BoardType[] = [
  "Skateboard",
  "Surfskate",
  "Longboard",
  "Old School",
  "Cruiser",
];

interface WizardProps {
  products: Product[];
  locale: string;
}

export function ConfiguratorWizard({ products, locale }: WizardProps) {
  const { t } = useTranslation();

  // Build configurator items from products + mock data
  const catalog = useMemo(() => buildConfiguratorItems(products), [products]);

  // Wizard state
  const [currentStep, setCurrentStep] = useState(1);
  const [state, setState] = useState<ConfiguratorState>({
    boardType: null,
    deck: null,
    trucks: null,
    wheels: null,
    bearings: null,
    griptape: null,
    risers: null,
    hardware: null,
  });

  // Determine which steps to show
  const steps = useMemo(
    () => getConfiguratorSteps(catalog.risers.length > 0, catalog.hardware.length > 0),
    [catalog]
  );

  // Get active (non-skipped) steps
  const activeSteps = useMemo(() => steps.filter((s) => !s.skip), [steps]);
  const totalSteps = activeSteps.length;
  const currentActiveIndex = activeSteps.findIndex((s) => s.id === currentStep);

  // Navigation
  const goToNextStep = useCallback(() => {
    const currentIdx = activeSteps.findIndex((s) => s.id === currentStep);
    if (currentIdx < activeSteps.length - 1) {
      setCurrentStep(activeSteps[currentIdx + 1]!.id);
    }
  }, [currentStep, activeSteps]);

  const goToPrevStep = useCallback(() => {
    const currentIdx = activeSteps.findIndex((s) => s.id === currentStep);
    if (currentIdx > 0) {
      setCurrentStep(activeSteps[currentIdx - 1]!.id);
    }
  }, [currentStep, activeSteps]);

  // Selection handlers
  const selectBoardType = useCallback(
    (boardType: BoardType) => {
      setState({
        boardType,
        deck: null,
        trucks: null,
        wheels: null,
        bearings: null,
        griptape: null,
        risers: null,
        hardware: null,
      });
      goToNextStep();
    },
    [goToNextStep]
  );

  const selectItem = useCallback(
    (category: keyof ConfiguratorState, item: ConfiguratorItem) => {
      setState((prev) => {
        const newState = { ...prev, [category]: item };

        // Clear downstream selections when an upstream choice changes
        const categories: (keyof ConfiguratorState)[] = [
          "boardType",
          "deck",
          "trucks",
          "wheels",
          "bearings",
          "griptape",
          "risers",
          "hardware",
        ];
        const changedIndex = categories.indexOf(category);
        for (let i = changedIndex + 1; i < categories.length; i++) {
          const cat = categories[i]!;
          if (cat !== "boardType") {
            (newState as any)[cat] = null;
          }
        }

        return newState;
      });
      goToNextStep();
    },
    [goToNextStep]
  );

  // Calculate running total
  const buildTotal = useMemo(() => calculateBuildTotal(state), [state]);

  // Render current step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BoardTypeStep
            boardTypes={BOARD_TYPES}
            selectedBoardType={state.boardType}
            onSelect={selectBoardType}
          />
        );

      case 2: {
        if (!state.boardType) return null;
        const result = getCompatibleDecks(catalog.decks, state.boardType);
        return (
          <ProductSelectionStep
            title={t("configurator.step2")}
            items={result.compatible}
            incompatibleItems={result.incompatible}
            selectedItem={state.deck}
            onSelect={(item) => selectItem("deck", item)}
            emptyMessage={result.emptyMessage}
            isEmpty={result.empty}
          />
        );
      }

      case 3: {
        if (!state.deck || !state.boardType) return null;
        const result = getCompatibleTrucks(
          catalog.trucks,
          state.deck,
          state.boardType
        );
        return (
          <ProductSelectionStep
            title={t("configurator.step3")}
            items={result.compatible}
            incompatibleItems={result.incompatible}
            selectedItem={state.trucks}
            onSelect={(item) => selectItem("trucks", item)}
            emptyMessage={result.emptyMessage}
            isEmpty={result.empty}
          />
        );
      }

      case 4: {
        if (!state.trucks || !state.boardType) return null;
        const result = getCompatibleWheels(
          catalog.wheels,
          state.trucks,
          state.boardType
        );
        return (
          <ProductSelectionStep
            title={t("configurator.step4")}
            items={result.compatible}
            incompatibleItems={result.incompatible}
            selectedItem={state.wheels}
            onSelect={(item) => selectItem("wheels", item)}
            emptyMessage={result.emptyMessage}
            isEmpty={result.empty}
          />
        );
      }

      case 5: {
        const result = getCompatibleBearings(catalog.bearings);
        return (
          <ProductSelectionStep
            title={t("configurator.step5")}
            items={result.compatible}
            incompatibleItems={result.incompatible}
            selectedItem={state.bearings}
            onSelect={(item) => selectItem("bearings", item)}
            emptyMessage={result.emptyMessage}
            isEmpty={result.empty}
          />
        );
      }

      case 6: {
        if (!state.deck) return null;
        const result = getCompatibleGriptape(catalog.griptape, state.deck);
        return (
          <ProductSelectionStep
            title={t("configurator.step6")}
            items={result.compatible}
            incompatibleItems={result.incompatible}
            selectedItem={state.griptape}
            onSelect={(item) => selectItem("griptape", item)}
            emptyMessage={result.emptyMessage}
            isEmpty={result.empty}
          />
        );
      }

      // Steps 7 (risers) and 8 (hardware) are skipped — no products yet
      // They're filtered out of activeSteps via getConfiguratorSteps()

      case 9:
        return (
          <ReviewStep
            state={state}
            buildTotal={buildTotal}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div>
      {/* Header */}
      <h1 className="mb-2 text-2xl font-bold text-neutral-900 dark:text-white">
        {t("configurator.title")}
      </h1>

      {/* Progress bar */}
      <ProgressBar
        currentStep={currentActiveIndex + 1}
        totalSteps={totalSteps}
        steps={activeSteps}
      />

      {/* Running total */}
      {buildTotal.amount > 0 && (
        <div className="mb-6 text-right text-lg font-semibold text-neutral-700 dark:text-neutral-300">
          {t("configurator.total")}: {buildTotal.currencyCode}{" "}
          {buildTotal.amount.toFixed(2)}
        </div>
      )}

      {/* Step content */}
      <div className="min-h-[400px]">{renderStep()}</div>

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between">
        <div>
          {currentStep > 1 && (
            <button
              onClick={goToPrevStep}
              className="rounded-lg border border-neutral-300 px-6 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-100 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              {t("configurator.back")}
            </button>
          )}
        </div>

        <div>
          {(() => {
            const currentStepConfig = activeSteps.find((s) => s.id === currentStep);
            if (
              currentStepConfig &&
              currentStepConfig.isOptional &&
              currentStep !== 9
            ) {
              return (
                <button
                  onClick={() => {
                    // Clear the current optional selection and move to next step
                    const categoryMap: Record<number, keyof ConfiguratorState> = {
                      7: "risers",
                      8: "hardware",
                    };
                    const category = categoryMap[currentStep];
                    if (category) {
                      setState((prev) => ({ ...prev, [category]: null }));
                    }
                    goToNextStep();
                  }}
                  className="rounded-lg bg-neutral-200 px-6 py-3 text-sm font-medium text-neutral-600 hover:bg-neutral-300 dark:bg-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-600"
                >
                  {t("configurator.skip_step")}
                </button>
              );
            }
            return null;
          })()}
        </div>
      </div>
    </div>
  );
}

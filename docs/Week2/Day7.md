# DAY 7 IMPLEMENTATION — CONFIGURATOR WIZARD UI

## CONTEXT

This is a Next.js 15.6.0-canary.60 App Router project for WeSkate Co (skateboarding brand). On Day 6, we built the configurator engine — pure TypeScript functions that filter compatible products based on board type, deck width, truck size, etc. Today we build the wizard UI that uses that engine.

The project uses bare imports (e.g., `import { getCart } from "lib/shopify"` — no `@/` alias). Follow this convention for all new files.

The project uses Tailwind CSS 4 for styling. Keep the UI functional and clean — no design polish needed. Grey backgrounds, basic cards, clear text. The design team will restyle everything later.

The i18n translation system is in place. Use `useTranslation()` hook from `lib/i18n/TranslationProvider` in all client components for user-facing text. Use `createTranslator(locale)` in server components. Translation keys are defined in `locales/en.json` and `locales/hi.json`.

## KEY ARCHITECTURE

1. **Server component** (`page.tsx`) fetches all products from Shopify, passes them to a client component.
2. **Client component** (`wizard.tsx`) manages the wizard state, calls engine functions to filter products at each step, renders step components.
3. **Step components** are reusable — most steps use the same `ProductSelectionStep` component with different filtered data.
4. **Cart integration** uses the `addConfiguratorBundle` server action from `components/cart/actions.ts`.

## IMPORTANT: Product data flow

The configurator needs ALL products from Shopify to filter client-side. The `getConfiguratorProducts()` function in `lib/shopify/index.ts` already exists (built on Day 2). However, real metafields are not populated yet — we use mock data.

The flow is:

1. Server component calls `getConfiguratorProducts()` → gets Shopify products (without metafields)
2. Passes products to client component
3. Client component calls `buildConfiguratorItems(products)` from `lib/configurator/mock-data` → enriches with mock metafields
4. Engine functions filter the enriched items

When real metafields exist in Shopify later, step 3 changes to read metafields directly from the product data instead of mock data. The engine functions don't change.

---

## FILES TO CREATE

### FILE 1: `app/[locale]/(commerce)/configurator/page.tsx`

The server component page for the configurator route.

```typescript
import { getConfiguratorProducts } from "lib/shopify";
import { ConfiguratorWizard } from "components/configurator/wizard";
import { createTranslator } from "lib/i18n";

export const dynamic = "force-dynamic";

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;
  const t = createTranslator(params.locale);
  return {
    title: t("configurator.title"),
    description: "Build your perfect skateboard setup with the WeSkate configurator.",
  };
}

export default async function ConfiguratorPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;
  let products: any[] = [];

  try {
    products = await getConfiguratorProducts();
  } catch (error) {
    console.error("Failed to fetch configurator products:", error);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <ConfiguratorWizard products={products} locale={params.locale} />
    </div>
  );
}
```

---

### FILE 2: `components/configurator/wizard.tsx`

The main wizard client component that manages state and renders steps.

```typescript
"use client";

import { useState, useMemo, useCallback } from "react";
import { useTranslation } from "lib/i18n/TranslationProvider";
import { buildConfiguratorItems } from "lib/configurator/mock-data";
import {
  isBoardTypeAvailable,
  getBoardTypeUnavailableMessage,
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
      <div className="mt-8 flex justify-between">
        {currentStep > 1 && (
          <button
            onClick={goToPrevStep}
            className="rounded-lg border border-neutral-300 px-6 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-100 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            {t("configurator.back")}
          </button>
        )}
      </div>
    </div>
  );
}
```

---

### FILE 3: `components/configurator/progress-bar.tsx`

Visual progress indicator showing the current step.

```typescript
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

export function ProgressBar({ currentStep, totalSteps, steps }: ProgressBarProps) {
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
```

---

### FILE 4: `components/configurator/steps/board-type-step.tsx`

The first step — selecting a board type. Shows 5 cards.

```typescript
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
                {t(translationKey) !== translationKey ? t(translationKey) : boardType}
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
```

---

### FILE 5: `components/configurator/steps/product-selection-step.tsx`

Reusable step component for selecting a product. Used for decks, trucks, wheels, bearings, griptape.

```typescript
"use client";

import { useTranslation } from "lib/i18n/TranslationProvider";
import type { ConfiguratorItem } from "lib/configurator/types";
import { ConfiguratorProductCard } from "../product-card";

interface ProductSelectionStepProps {
  title: string;
  items: ConfiguratorItem[];
  incompatibleItems?: ConfiguratorItem[];
  selectedItem: ConfiguratorItem | null;
  onSelect: (item: ConfiguratorItem) => void;
  emptyMessage?: string;
  isEmpty: boolean;
}

export function ProductSelectionStep({
  title,
  items,
  incompatibleItems = [],
  selectedItem,
  onSelect,
  emptyMessage,
  isEmpty,
}: ProductSelectionStepProps) {
  const { t } = useTranslation();

  if (isEmpty) {
    return (
      <div>
        <h2 className="mb-6 text-xl font-semibold text-neutral-800 dark:text-neutral-200">
          {title}
        </h2>
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-300 py-16 text-center dark:border-neutral-700">
          <p className="text-lg text-neutral-500 dark:text-neutral-400">
            {emptyMessage || "No products available."}
          </p>
          <p className="mt-2 text-sm text-neutral-400 dark:text-neutral-500">
            {t("configurator.back")} to try a different option.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-2 text-xl font-semibold text-neutral-800 dark:text-neutral-200">
        {title}
      </h2>
      <p className="mb-6 text-sm text-neutral-500 dark:text-neutral-400">
        {items.length} {t("configurator.compatible") || "compatible"} option
        {items.length !== 1 ? "s" : ""}
      </p>

      {/* Compatible items */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => (
          <ConfiguratorProductCard
            key={item.variantId}
            item={item}
            isSelected={selectedItem?.variantId === item.variantId}
            onSelect={() => onSelect(item)}
            isCompatible={true}
          />
        ))}
      </div>

      {/* Incompatible items (shown greyed out) */}
      {incompatibleItems.length > 0 && (
        <div className="mt-8">
          <h3 className="mb-4 text-sm font-medium uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
            {t("configurator.incompatible") || "Not compatible"} ({incompatibleItems.length})
          </h3>
          <div className="grid grid-cols-1 gap-4 opacity-40 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {incompatibleItems.slice(0, 8).map((item) => (
              <ConfiguratorProductCard
                key={item.variantId}
                item={item}
                isSelected={false}
                onSelect={() => {}}
                isCompatible={false}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

---

### FILE 6: `components/configurator/product-card.tsx`

Individual product card for the configurator. Shows image, title, variant, price, and compatibility status.

```typescript
"use client";

import Image from "next/image";
import type { ConfiguratorItem, DeckMeta, TruckMeta, WheelMeta } from "lib/configurator/types";

interface ConfiguratorProductCardProps {
  item: ConfiguratorItem;
  isSelected: boolean;
  onSelect: () => void;
  isCompatible: boolean;
}

function getSubtitle(item: ConfiguratorItem): string {
  const meta = item.meta;
  switch (meta.category) {
    case "deck":
      return `${(meta as DeckMeta).deck_width}" — ${item.variantTitle}`;
    case "truck": {
      const truckMeta = meta as TruckMeta;
      if (truckMeta.truck_hanger_size) {
        return `${truckMeta.truck_hanger_size}" hanger — ${truckMeta.truck_sold_as}`;
      }
      return `${truckMeta.truck_sold_as} — ${truckMeta.truck_type}`;
    }
    case "wheel":
      return `${(meta as WheelMeta).wheel_diameter}mm — ${(meta as WheelMeta).wheel_hardness}`;
    case "bearing":
      return item.variantTitle !== "Default Title" ? item.variantTitle : meta.bearing_type;
    case "griptape":
      return item.variantTitle !== "Default Title" ? item.variantTitle : `${meta.griptape_width}"`;
    default:
      return item.variantTitle;
  }
}

export function ConfiguratorProductCard({
  item,
  isSelected,
  onSelect,
  isCompatible,
}: ConfiguratorProductCardProps) {
  return (
    <button
      onClick={isCompatible ? onSelect : undefined}
      disabled={!isCompatible || !item.availableForSale}
      className={`
        group relative flex flex-col overflow-hidden rounded-xl border-2 text-left transition-all
        ${
          isSelected
            ? "border-blue-600 shadow-lg ring-2 ring-blue-200 dark:border-blue-400 dark:ring-blue-900"
            : isCompatible && item.availableForSale
              ? "border-neutral-200 hover:border-blue-300 hover:shadow-md dark:border-neutral-700 dark:hover:border-blue-600"
              : "cursor-not-allowed border-neutral-200 dark:border-neutral-800"
        }
      `}
    >
      {/* Image */}
      <div className="relative aspect-square w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
        {item.productImage ? (
          <Image
            src={item.productImage}
            alt={item.productTitle}
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl text-neutral-300">
            🛹
          </div>
        )}

        {/* Selected badge */}
        {isSelected && (
          <div className="absolute right-2 top-2 rounded-full bg-blue-600 px-2 py-1 text-xs font-bold text-white">
            ✓
          </div>
        )}

        {/* Out of stock badge */}
        {!item.availableForSale && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="rounded-full bg-white px-3 py-1 text-sm font-medium text-neutral-900">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Brand */}
        {item.brand && (
          <span className="mb-1 text-xs font-medium uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            {item.brand}
          </span>
        )}

        {/* Title */}
        <h3 className="mb-1 text-sm font-semibold text-neutral-900 dark:text-white">
          {item.productTitle}
        </h3>

        {/* Subtitle (variant info) */}
        <p className="mb-2 text-xs text-neutral-500 dark:text-neutral-400">
          {getSubtitle(item)}
        </p>

        {/* Price */}
        <div className="mt-auto">
          <span className="text-base font-bold text-neutral-900 dark:text-white">
            {item.price.currencyCode === "INR" ? "₹" : "$"}
            {parseFloat(item.price.amount).toLocaleString()}
          </span>
        </div>
      </div>
    </button>
  );
}
```

---

### FILE 7: `components/configurator/steps/review-step.tsx`

The final step — shows a summary of all selected components and an "Add to Cart" button.

```typescript
"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslation } from "lib/i18n/TranslationProvider";
import { addConfiguratorBundle } from "components/cart/actions";
import { useCart } from "components/cart/cart-context";
import type { ConfiguratorItem, ConfiguratorState } from "lib/configurator/types";

interface ReviewStepProps {
  state: ConfiguratorState;
  buildTotal: { amount: number; currencyCode: string };
}

function ReviewLineItem({ item, label }: { item: ConfiguratorItem | null; label: string }) {
  if (!item) return null;

  return (
    <div className="flex items-center gap-4 rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-900">
      {/* Image */}
      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800">
        {item.productImage ? (
          <Image
            src={item.productImage}
            alt={item.productTitle}
            fill
            sizes="64px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-2xl">🛹</div>
        )}
      </div>

      {/* Details */}
      <div className="flex-1">
        <span className="text-xs font-medium uppercase tracking-wider text-neutral-400">
          {label}
        </span>
        <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
          {item.productTitle}
        </h4>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          {item.variantTitle !== "Default Title" ? item.variantTitle : ""}
        </p>
      </div>

      {/* Price */}
      <div className="text-right">
        <span className="font-bold text-neutral-900 dark:text-white">
          {item.price.currencyCode === "INR" ? "₹" : "$"}
          {parseFloat(item.price.amount).toLocaleString()}
        </span>
      </div>
    </div>
  );
}

export function ReviewStep({ state, buildTotal }: ReviewStepProps) {
  const { t } = useTranslation();
  const [isAdding, setIsAdding] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    setMessage(null);

    // Collect all selected items
    const items: ConfiguratorItem[] = [
      state.deck,
      state.trucks,
      state.wheels,
      state.bearings,
      state.griptape,
      state.risers,
      state.hardware,
    ].filter(Boolean) as ConfiguratorItem[];

    if (items.length === 0) {
      setMessage("No items selected.");
      setIsAdding(false);
      return;
    }

    // Build the cart line items
    const cartLines = items.map((item) => ({
      merchandiseId: item.variantId,
      quantity: 1,
    }));

    try {
      const result = await addConfiguratorBundle(null, cartLines);
      if (result && typeof result === "string") {
        setMessage(result);
      } else {
        setAdded(true);
        setMessage(null);
      }
    } catch (error) {
      setMessage("Failed to add to cart. Please try again.");
    } finally {
      setIsAdding(false);
    }
  };

  const lineItems: { item: ConfiguratorItem | null; label: string }[] = [
    { item: state.deck, label: t("configurator.step2") },
    { item: state.trucks, label: t("configurator.step3") },
    { item: state.wheels, label: t("configurator.step4") },
    { item: state.bearings, label: t("configurator.step5") },
    { item: state.griptape, label: t("configurator.step6") },
    { item: state.risers, label: t("configurator.step7") },
    { item: state.hardware, label: t("configurator.step8") },
  ];

  return (
    <div>
      <h2 className="mb-6 text-xl font-semibold text-neutral-800 dark:text-neutral-200">
        {t("configurator.step9")}
      </h2>

      {/* Board type badge */}
      {state.boardType && (
        <div className="mb-4">
          <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            {state.boardType} Build
          </span>
        </div>
      )}

      {/* Line items */}
      <div className="mb-6 space-y-3">
        {lineItems.map(
          ({ item, label }) =>
            item && <ReviewLineItem key={label} item={item} label={label} />
        )}
      </div>

      {/* Total */}
      <div className="mb-6 flex items-center justify-between rounded-xl bg-neutral-100 p-6 dark:bg-neutral-800">
        <span className="text-lg font-semibold text-neutral-700 dark:text-neutral-300">
          {t("configurator.total")}
        </span>
        <span className="text-2xl font-bold text-neutral-900 dark:text-white">
          {buildTotal.currencyCode === "INR" ? "₹" : "$"}
          {buildTotal.amount.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      </div>

      {/* Add to cart button */}
      {added ? (
        <div className="rounded-xl bg-green-50 p-6 text-center dark:bg-green-950">
          <p className="text-lg font-semibold text-green-700 dark:text-green-300">
            ✓ Setup added to cart!
          </p>
          <a
            href="/cart"
            className="mt-2 inline-block text-sm text-green-600 underline dark:text-green-400"
          >
            View Cart
          </a>
        </div>
      ) : (
        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className={`
            w-full rounded-xl bg-blue-600 py-4 text-lg font-bold text-white transition-all
            ${isAdding ? "cursor-wait opacity-70" : "hover:bg-blue-700"}
          `}
        >
          {isAdding
            ? t("common.loading")
            : t("configurator.add_to_cart")}
        </button>
      )}

      {/* Error message */}
      {message && (
        <p className="mt-4 text-center text-sm text-red-600 dark:text-red-400">
          {message}
        </p>
      )}
    </div>
  );
}
```

---

### CHANGE 8: Add missing translation key

**Modify file**: `locales/en.json`

Add this key if it doesn't already exist:

```json
"common.step": "Step"
```

**Modify file**: `locales/hi.json`

Add:

```json
"common.step": "चरण"
```

---

## VERIFICATION — MANUAL UI TESTING

After all files are created and `pnpm dev` is running:

### Test 1: Basic page load

1. Navigate to `http://localhost:3000/configurator` (or your port)
2. You should see: "Build Your Setup" heading, progress bar at Step 1, and 5 board type cards
3. **Skateboard** and **Old School** should be clickable (blue border on hover)
4. **Surfskate**, **Longboard**, **Cruiser** should be greyed out with "coming soon" messages

### Test 2: Skateboard flow — full walkthrough

1. Click **Skateboard**
2. Step 2 (Choose Your Deck): You should see multiple deck cards with images, brand names, variant info (e.g., "8.0" — 8 / Regular"), and prices. The compatible count should show (e.g., "45 compatible options")
3. Click any deck (e.g., a Sphere deck at 8.25")
4. Step 3 (Choose Your Trucks): You should see only compatible trucks. For an 8.25" deck, the Double Hollow 5.25" (axle 8.0") and 5.5" (axle 8.25") variants should appear. The 5.0" variant (axle 7.75") should NOT appear as compatible (diff = 0.5" > 0.25" tolerance). Kids trucks should also be filtered out.
5. Click a truck variant
6. Step 4 (Choose Your Wheels): Street/Park wheels should appear (Toucan Tropical Wheels in various sizes)
7. Click wheels
8. Step 5 (Choose Your Bearings): Both Steel and Ceramic bearings should appear
9. Click bearings
10. Step 6 (Choose Your Griptape): All 9" griptapes should appear (since an 8.25" deck < 8.75" max for 9" grip)
11. Click griptape
12. Step 9 (Review): All selected items shown with images, variant details, individual prices, and total
13. Click "Add Complete Setup to Cart"
14. Should show "✓ Setup added to cart!"
15. Open the cart drawer — all items should appear in the cart

### Test 3: Back navigation

1. At any step, click "Back" — should return to previous step with the previous selection preserved
2. Change a selection at an earlier step — all downstream selections should clear (e.g., picking a different deck clears trucks, wheels, etc.)

### Test 4: Old School flow

1. Start over, select **Old School**
2. Should see 1 deck (the special edition old school)
3. Complete the flow — trucks and wheels should filter correctly for this board type

### Test 5: Empty states

1. If at any step no compatible products exist, a "No compatible X found" message should appear with a hint to go back

### Test 6: Hindi

1. Navigate to `http://localhost:3000/hi/configurator`
2. Step titles should show in Hindi (e.g., "अपना सेटअप बनाएं", "बोर्ड प्रकार चुनें")
3. Button labels should show Hindi text
4. Board type names should show Hindi

### Test 7: Mobile

1. Resize browser to 375px width
2. The wizard should be usable — cards stack vertically, buttons are full width, text is readable

### FILES CREATED

- `app/[locale]/(commerce)/configurator/page.tsx`
- `components/configurator/wizard.tsx`
- `components/configurator/progress-bar.tsx`
- `components/configurator/product-card.tsx`
- `components/configurator/steps/board-type-step.tsx`
- `components/configurator/steps/product-selection-step.tsx`
- `components/configurator/steps/review-step.tsx`

### FILES MODIFIED

- `locales/en.json` (add `common.step`)
- `locales/hi.json` (add `common.step`)

List every file created and modified when done.

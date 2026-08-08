"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTranslation } from "lib/i18n/TranslationProvider";
import { buildConfiguratorItems } from "lib/configurator/mock-data";
import {
  getCompatibleDecks,
  getCompatibleTrucks,
  getCompatibleWheels,
  getCompatibleBearings,
  getCompatibleGriptape,
  calculateBuildTotal,
} from "lib/configurator/engine";
import type {
  BoardType,
  ConfiguratorItem,
  ConfiguratorState,
  DeckMeta,
  TruckMeta,
  WheelMeta,
  BearingMeta,
  GriptapeMeta,
} from "lib/configurator/types";
import type { Product } from "lib/shopify/types";

import { ConfiguratorHeader } from "./configurator-header";
import { FilterSidebar, type ConfiguratorFilterGroup } from "./filter-sidebar";
import { BuildSummarySidebar } from "./build-summary-sidebar";
import { BoardTypeStep } from "./steps/board-type-step";
import { ProductSelectionStep } from "./steps/product-selection-step";
import { addConfiguratorBundle } from "components/cart/actions";

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
  const router = useRouter();

  // Catalog built from Shopify products + mock metafield data
  const catalog = useMemo(() => buildConfiguratorItems(products), [products]);

  // ── Wizard state ───────────────────────────────────────────────────────────
  // Step 1 = board type selection. Steps 2-6 = component selection.
  // Step is forced back to 1 whenever boardType is null.
  const [currentStep, setCurrentStep] = useState<number>(1);

  const [compatibilityFilterOn, setCompatibilityFilterOn] =
    useState<boolean>(true);
  const [showOutOfStock, setShowOutOfStock] = useState<boolean>(false);
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >({});
  const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false);

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

  // ── Derived ────────────────────────────────────────────────────────────────
  const buildTotal = useMemo(() => calculateBuildTotal(state), [state]);

  // ── Selection handlers ─────────────────────────────────────────────────────

  const selectBoardType = useCallback((boardType: BoardType) => {
    // Selecting a board type resets the whole build
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
    setSelectedFilters({});
    setCurrentStep(2); // advance to deck selection
  }, []);

  /**
   * Selecting a component item:
   * - Keeps all selections that are still compatible.
   * - Clears downstream selections that depend on this choice.
   * - Does NOT auto-advance step; the user can freely jump slots.
   */
  const selectItem = useCallback(
    (category: keyof ConfiguratorState, item: ConfiguratorItem) => {
      const currentItem = state[category];
      const isAlreadySelected =
        currentItem &&
        typeof currentItem === "object" &&
        "variantId" in currentItem &&
        currentItem.variantId === item.variantId;

      setState((prev) => {
        const newState = { ...prev, [category]: isAlreadySelected ? null : item };

        // Define upstream → downstream order for cascade clearing
        const cascadeOrder: (keyof ConfiguratorState)[] = [
          "deck",
          "trucks",
          "wheels",
          "bearings",
          "griptape",
        ];
        const changedIdx = cascadeOrder.indexOf(category as any);
        if (changedIdx !== -1) {
          for (let i = changedIdx + 1; i < cascadeOrder.length; i++) {
            (newState as any)[cascadeOrder[i]!] = null;
          }
        }
        return newState;
      });

      setSelectedFilters({});

      // Auto-advance to the next step for a smooth flow only if we are selecting
      if (!isAlreadySelected) {
        const nextStepMap: Partial<Record<keyof ConfiguratorState, number>> = {
          deck: 3,
          trucks: 4,
          wheels: 5,
          bearings: 6,
          griptape: 6, // stay on griptape or user can jump via sidebar
        };
        const next = nextStepMap[category];
        if (next) setCurrentStep(next);
      }
    },
    [state],
  );

  // ── Attribute filters (left sidebar) ──────────────────────────────────────

  const handleFilterChange = useCallback((groupId: string, value: string) => {
    setSelectedFilters((prev) => {
      const currentVals = prev[groupId] || [];
      const updatedVals = currentVals.includes(value)
        ? currentVals.filter((v) => v !== value)
        : [...currentVals, value];

      if (updatedVals.length === 0) {
        const next = { ...prev };
        delete next[groupId];
        return next;
      }
      return { ...prev, [groupId]: updatedVals };
    });
  }, []);

  const handleClearAllFilters = useCallback(() => setSelectedFilters({}), []);

  // Apply left-sidebar attribute filters on top of the compatibility result
  const applyAttributeFilters = useCallback(
    (itemList: ConfiguratorItem[]): ConfiguratorItem[] => {
      if (Object.keys(selectedFilters).length === 0) return itemList;
      return itemList.filter((item) =>
        Object.entries(selectedFilters).every(([groupId, values]) => {
          if (!values.length) return true;
          if (groupId === "brand")
            return item.brand !== undefined && values.includes(item.brand);
          const meta = item.meta;
          if (groupId === "deck_width" && meta.category === "deck")
            return values.includes(`${(meta as DeckMeta).deck_width}"`);
          if (groupId === "deck_shape" && meta.category === "deck") {
            // Shape derived from board type: Old School → "Old School", others → "Popsicle"
            const boardType = (meta as DeckMeta).deck_board_type;
            const shape = boardType === "Old School" ? "Old School" : "Popsicle";
            return values.includes(shape);
          }
          if (groupId === "deck_concave" && meta.category === "deck")
            return (
              (meta as DeckMeta).deck_concave !== undefined &&
              values.includes((meta as DeckMeta).deck_concave!)
            );
          if (groupId === "deck_wheel_wells" && meta.category === "deck")
            return (
              (meta as DeckMeta).deck_wheel_wells !== undefined &&
              values.includes((meta as DeckMeta).deck_wheel_wells!)
            );
          if (groupId === "truck_type" && meta.category === "truck")
            return values.includes((meta as TruckMeta).truck_type);
          if (groupId === "axle_width" && meta.category === "truck") {
            const h = (meta as TruckMeta).truck_hanger_size;
            if (h === null) return true; // surfskate trucks — no width filtering
            const axle = Math.round((h + 2.75) * 100) / 100;
            return values.includes(`${axle}"`);
          }
          if (groupId === "wheel_diameter" && meta.category === "wheel")
            return values.includes(
              `${(meta as WheelMeta).wheel_diameter}mm`,
            );
          if (groupId === "wheel_hardness" && meta.category === "wheel")
            return values.includes((meta as WheelMeta).wheel_hardness);
          if (groupId === "wheel_type" && meta.category === "wheel")
            return values.includes((meta as WheelMeta).wheel_type);
          if (groupId === "bearing_type" && meta.category === "bearing")
            return values.includes((meta as BearingMeta).bearing_type);
          if (groupId === "grip_width" && meta.category === "griptape")
            return values.includes(
              `${(meta as GriptapeMeta).griptape_width}"`,
            );
          if (groupId === "grip_type" && meta.category === "griptape")
            return (
              (meta as GriptapeMeta).griptape_type !== undefined &&
              values.includes((meta as GriptapeMeta).griptape_type!)
            );
          return true;
        }),
      );
    },
    [selectedFilters],
  );

  // ── Filter groups for left sidebar (dynamic per step) ────────────────────

  const currentFilterGroups = useMemo<ConfiguratorFilterGroup[]>(() => {
    if (currentStep === 1) return [];

    // Use the full category catalog as the pool for filter group options,
    // ignoring compatibility so the filters always show everything available.
    let pool: ConfiguratorItem[] = [];
    if (currentStep === 2) pool = catalog.decks;
    else if (currentStep === 3) pool = catalog.trucks;
    else if (currentStep === 4) pool = catalog.wheels;
    else if (currentStep === 5) pool = catalog.bearings;
    else if (currentStep === 6) pool = catalog.griptape;

    const groups: ConfiguratorFilterGroup[] = [];

    // Brand
    const brandsMap = new Map<string, number>();
    pool.forEach((i) => {
      if (i.brand) brandsMap.set(i.brand, (brandsMap.get(i.brand) || 0) + 1);
    });
    if (brandsMap.size > 0) {
      groups.push({
        id: "brand",
        label: "Brand",
        options: Array.from(brandsMap.entries()).map(([brand, count]) => ({
          label: brand,
          value: brand,
          count,
        })),
      });
    }

    // Step-specific
    if (currentStep === 2) {
      const widthMap = new Map<string, number>();
      const shapeMap = new Map<string, number>();
      const concaveMap = new Map<string, number>();
      const wellsMap = new Map<string, number>();
      pool.forEach((i) => {
        if (i.meta.category === "deck") {
          const dm = i.meta as DeckMeta;
          const w = `${dm.deck_width}"`;
          widthMap.set(w, (widthMap.get(w) || 0) + 1);
          // Shape derived from board type (we only have Skateboard and Old School in current catalog)
          const shape = dm.deck_board_type === "Old School" ? "Old School" : "Popsicle";
          shapeMap.set(shape, (shapeMap.get(shape) || 0) + 1);
          if (dm.deck_concave) {
            concaveMap.set(dm.deck_concave, (concaveMap.get(dm.deck_concave) || 0) + 1);
          }
          if (dm.deck_wheel_wells) {
            wellsMap.set(dm.deck_wheel_wells, (wellsMap.get(dm.deck_wheel_wells) || 0) + 1);
          }
        }
      });
      if (widthMap.size > 0) {
        groups.push({
          id: "deck_width",
          label: "Deck Width",
          options: Array.from(widthMap.entries()).map(([val, count]) => ({
            label: val,
            value: val,
            count,
          })),
        });
      }
      if (shapeMap.size > 1) {
        // Only show shape filter if there's more than one shape available
        groups.push({
          id: "deck_shape",
          label: "Shape",
          options: Array.from(shapeMap.entries()).map(([val, count]) => ({
            label: val,
            value: val,
            count,
          })),
        });
      }
      if (concaveMap.size > 0) {
        groups.push({
          id: "deck_concave",
          label: "Concave",
          options: Array.from(concaveMap.entries()).map(([val, count]) => ({
            label: val,
            value: val,
            count,
          })),
        });
      }
      if (wellsMap.size > 0) {
        groups.push({
          id: "deck_wheel_wells",
          label: "Wheel Wells",
          options: Array.from(wellsMap.entries()).map(([val, count]) => ({
            label: val,
            value: val,
            count,
          })),
        });
      }
    } else if (currentStep === 3) {
      const typeMap = new Map<string, number>();
      const axleMap = new Map<string, number>();
      pool.forEach((i) => {
        if (i.meta.category === "truck") {
          const tm = i.meta as TruckMeta;
          typeMap.set(tm.truck_type, (typeMap.get(tm.truck_type) || 0) + 1);
          if (tm.truck_hanger_size !== null) {
            // Convert hanger → axle width (hanger + 2.75" offset) — same measurement customers care about
            const axle = Math.round((tm.truck_hanger_size + 2.75) * 100) / 100;
            const key = `${axle}"`;
            axleMap.set(key, (axleMap.get(key) || 0) + 1);
          }
        }
      });
      if (typeMap.size > 0)
        groups.push({
          id: "truck_type",
          label: "Truck Type",
          options: Array.from(typeMap.entries()).map(([val, count]) => ({
            label: val,
            value: val,
            count,
          })),
        });
      if (axleMap.size > 0)
        groups.push({
          id: "axle_width",
          label: "Axle Width",
          options: Array.from(axleMap.entries()).map(([val, count]) => ({
            label: val,
            value: val,
            count,
          })),
        });
    } else if (currentStep === 4) {
      const diamMap = new Map<string, number>();
      const hardMap = new Map<string, number>();
      const typeMap = new Map<string, number>();
      pool.forEach((i) => {
        if (i.meta.category === "wheel") {
          const wm = i.meta as WheelMeta;
          const d = `${wm.wheel_diameter}mm`;
          diamMap.set(d, (diamMap.get(d) || 0) + 1);
          hardMap.set(wm.wheel_hardness, (hardMap.get(wm.wheel_hardness) || 0) + 1);
          typeMap.set(wm.wheel_type, (typeMap.get(wm.wheel_type) || 0) + 1);
        }
      });
      if (diamMap.size > 0)
        groups.push({
          id: "wheel_diameter",
          label: "Wheel Diameter",
          options: Array.from(diamMap.entries()).map(([val, count]) => ({
            label: val,
            value: val,
            count,
          })),
        });
      if (hardMap.size > 0)
        groups.push({
          id: "wheel_hardness",
          label: "Wheel Hardness",
          options: Array.from(hardMap.entries()).map(([val, count]) => ({
            label: val,
            value: val,
            count,
          })),
        });
      if (typeMap.size > 0)
        groups.push({
          id: "wheel_type",
          label: "Wheel Type",
          options: Array.from(typeMap.entries()).map(([val, count]) => ({
            label: val,
            value: val,
            count,
          })),
        });
    } else if (currentStep === 5) {
      const typeMap = new Map<string, number>();
      pool.forEach((i) => {
        if (i.meta.category === "bearing") {
          const bm = i.meta as BearingMeta;
          typeMap.set(bm.bearing_type, (typeMap.get(bm.bearing_type) || 0) + 1);
        }
      });
      if (typeMap.size > 0) {
        groups.push({
          id: "bearing_type",
          label: "Bearing Type",
          options: Array.from(typeMap.entries()).map(([val, count]) => ({
            label: val,
            value: val,
            count,
          })),
        });
      }
    } else if (currentStep === 6) {
      const gripMap = new Map<string, number>();
      const typeMap = new Map<string, number>();
      pool.forEach((i) => {
        if (i.meta.category === "griptape") {
          const gm = i.meta as GriptapeMeta;
          const g = `${gm.griptape_width}"`;
          gripMap.set(g, (gripMap.get(g) || 0) + 1);
          if (gm.griptape_type) {
            typeMap.set(gm.griptape_type, (typeMap.get(gm.griptape_type) || 0) + 1);
          }
        }
      });
      if (gripMap.size > 0)
        groups.push({
          id: "grip_width",
          label: "Griptape Width",
          options: Array.from(gripMap.entries()).map(([val, count]) => ({
            label: val,
            value: val,
            count,
          })),
        });
      if (typeMap.size > 0)
        groups.push({
          id: "grip_type",
          label: "Griptape Type",
          options: Array.from(typeMap.entries()).map(([val, count]) => ({
            label: val,
            value: val,
            count,
          })),
        });
    }

    return groups;
  }, [currentStep, catalog]);

  // ── Add to cart ────────────────────────────────────────────────────────────

  const handleAddToCart = async () => {
    const bundleItems = [
      state.deck,
      state.trucks,
      state.wheels,
      state.bearings,
      state.griptape,
    ]
      .filter((item): item is ConfiguratorItem => item !== null)
      .map((item) => ({ merchandiseId: item.variantId, quantity: 1 }));

    if (!bundleItems.length) return;
    setIsAddingToCart(true);
    try {
      await addConfiguratorBundle(null, bundleItems);
      router.push("/cart");
    } catch (e) {
      toast.error("Failed to add items to cart. Please try again.");
    } finally {
      setIsAddingToCart(false);
    }
  };

  // ── Step navigation guard ──────────────────────────────────────────────────

  const handleSelectStep = useCallback(
    (stepId: number) => {
      if (!state.boardType) {
        // No board type selected → redirect to step 1
        setCurrentStep(1);
        return;
      }
      setSelectedFilters({});
      setCurrentStep(stepId);
    },
    [state.boardType],
  );

  // ── Step titles ────────────────────────────────────────────────────────────

  const stepTitles: Record<number, string> = {
    1: "Select Riding Style",
    2: "Select Deck",
    3: "Select Trucks",
    4: "Select Wheels",
    5: "Select Bearings",
    6: "Select Griptape",
  };

  // ── Main content renderer ──────────────────────────────────────────────────

  const renderStepContent = () => {
    // Step 1 always renders board type selection regardless
    if (currentStep === 1) {
      return (
        <BoardTypeStep
          boardTypes={BOARD_TYPES}
          selectedBoardType={state.boardType}
          onSelect={selectBoardType}
        />
      );
    }

    // All other steps require a board type
    if (!state.boardType) {
      // Soft guard — shouldn't normally happen, but redirect to step 1
      setCurrentStep(1);
      return null;
    }

    switch (currentStep) {
      case 2: {
        // Show ALL decks for the board type.
        // If trucks already selected, mark incompatible decks (bidirectional).
        const result = getCompatibleDecks(
          catalog.decks,
          state.boardType,
          state.trucks, // may be null — engine handles this
          showOutOfStock,
        );
        const compatible = applyAttributeFilters(result.compatible);
        const incompatible = applyAttributeFilters(result.incompatible);
        return (
          <ProductSelectionStep
            title="Select Deck"
            items={compatible}
            incompatibleItems={incompatible}
            selectedItem={state.deck}
            onSelect={(item) => selectItem("deck", item)}
            emptyMessage={result.emptyMessage}
            isEmpty={compatible.length === 0}
            compatibilityFilterOn={compatibilityFilterOn}
            showOutOfStock={showOutOfStock}
          />
        );
      }

      case 3: {
        // Show ALL trucks for this board type.
        // If a deck is selected, also apply width-matching.
        const result = getCompatibleTrucks(
          catalog.trucks,
          state.boardType,
          state.deck, // may be null — engine shows board-type-compatible trucks without width filter
          showOutOfStock,
        );
        const compatible = applyAttributeFilters(result.compatible);
        const incompatible = applyAttributeFilters(result.incompatible);
        return (
          <ProductSelectionStep
            title="Select Trucks"
            items={compatible}
            incompatibleItems={incompatible}
            selectedItem={state.trucks}
            onSelect={(item) => selectItem("trucks", item)}
            emptyMessage={result.emptyMessage}
            isEmpty={compatible.length === 0}
            compatibilityFilterOn={compatibilityFilterOn}
            showOutOfStock={showOutOfStock}
          />
        );
      }

      case 4: {
        const result = getCompatibleWheels(
          catalog.wheels,
          state.boardType,
          state.trucks,
          showOutOfStock,
        );
        const compatible = applyAttributeFilters(result.compatible);
        const incompatible = applyAttributeFilters(result.incompatible);
        return (
          <ProductSelectionStep
            title="Select Wheels"
            items={compatible}
            incompatibleItems={incompatible}
            selectedItem={state.wheels}
            onSelect={(item) => selectItem("wheels", item)}
            emptyMessage={result.emptyMessage}
            isEmpty={compatible.length === 0}
            compatibilityFilterOn={compatibilityFilterOn}
            showOutOfStock={showOutOfStock}
          />
        );
      }

      case 5: {
        const result = getCompatibleBearings(catalog.bearings, showOutOfStock);
        const compatible = applyAttributeFilters(result.compatible);
        const incompatible = applyAttributeFilters(result.incompatible);
        return (
          <ProductSelectionStep
            title="Select Bearings"
            items={compatible}
            incompatibleItems={incompatible}
            selectedItem={state.bearings}
            onSelect={(item) => selectItem("bearings", item)}
            emptyMessage={result.emptyMessage}
            isEmpty={compatible.length === 0}
            compatibilityFilterOn={compatibilityFilterOn}
            showOutOfStock={showOutOfStock}
          />
        );
      }

      case 6: {
        const result = getCompatibleGriptape(
          catalog.griptape,
          state.deck, // may be null — engine shows all griptape without width filtering
          showOutOfStock,
        );
        const compatible = applyAttributeFilters(result.compatible);
        const incompatible = applyAttributeFilters(result.incompatible);
        return (
          <ProductSelectionStep
            title="Select Griptape"
            items={compatible}
            incompatibleItems={incompatible}
            selectedItem={state.griptape}
            onSelect={(item) => selectItem("griptape", item)}
            emptyMessage={result.emptyMessage}
            isEmpty={compatible.length === 0}
            compatibilityFilterOn={compatibilityFilterOn}
            showOutOfStock={showOutOfStock}
          />
        );
      }

      default:
        return null;
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="h-[calc(100vh-72px)] flex flex-col bg-neutral-50 text-black dark:bg-neutral-950 dark:text-white overflow-hidden">
      {/* Top Header Bar */}
      <ConfiguratorHeader
        title={stepTitles[currentStep] || "Board Builder"}
        totalAmount={buildTotal.amount}
        currencyCode={buildTotal.currencyCode}
        locale={locale}
      />

      {/* 3-Panel Workspace */}
      <div className="flex-1 min-h-0 mx-auto flex w-full max-w-[1600px] flex-col gap-6 px-4 py-6 md:flex-row md:px-6 overflow-hidden">
        {/* Left Sidebar: Filters */}
        <div className="w-72 flex-shrink-0 h-full flex flex-col">
          <FilterSidebar
            compatibilityFilterOn={compatibilityFilterOn}
            onToggleCompatibilityFilter={setCompatibilityFilterOn}
            showOutOfStock={showOutOfStock}
            onToggleOutOfStock={setShowOutOfStock}
            filterGroups={currentFilterGroups}
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
            onClearAllFilters={handleClearAllFilters}
          />
        </div>

        {/* Center: Product Grid */}
        <main className="flex-1 min-w-0 h-full overflow-y-auto pr-2">
          {renderStepContent()}
        </main>

        {/* Right Sidebar: Build Summary */}
        <div className="w-80 flex-shrink-0 h-full flex flex-col">
          <BuildSummarySidebar
            state={state}
            currentStepId={currentStep}
            boardTypeSelected={!!state.boardType}
            onSelectStep={handleSelectStep}
            onNeedsBoardType={() => setCurrentStep(1)}
            onAddToCart={handleAddToCart}
            isAddingToCart={isAddingToCart}
          />
        </div>
      </div>
    </div>
  );
}

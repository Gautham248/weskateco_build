import type { Product } from "lib/shopify/types";
import type { ConfiguratorItem } from "./types";
import mockData from "config/mock-configurator-data.json";
import compatRulesJson from "config/compatibility-rules.json";

const compatRules = compatRulesJson as { hanger_to_axle_offset: number };

// Type for the mock data JSON structure
interface MockProductData {
  [key: string]: any;
  deck_board_type?: string;
  deck_width_by_variant?: Record<string, number>;
  truck_type?: string;
  truck_hanger_size_by_variant?: Record<string, number | null>;
  truck_sold_as?: string;
  truck_compatible_board_types?: string;
  wheel_diameter_by_variant?: Record<string, number>;
  wheel_hardness?: string;
  wheel_type?: string;
  wheel_compatible_board_types?: string;
  bearing_type?: string;
  griptape_width?: number;
  griptape_type?: string;
  brand?: string;
}

/**
 * Mock widths are keyed by exact Shopify variant title, but those titles drift
 * (e.g. "7 / Regular" became "7 / Mellow" / "7 / Medium" when concave variants
 * were added). Fall back to the width number embedded in the title so a variant
 * still maps when its key no longer matches, keeping the full 7"–8.875" range
 * of deck widths in the configurator.
 */
function parseDeckWidthFromTitle(title: string): number | undefined {
  const match = title.match(/(\d+(?:\.\d+)?)/);
  if (!match) return undefined;
  const value = Number(match[1]);
  if (!Number.isFinite(value) || value < 6 || value > 10) return undefined;
  return value;
}

/**
 * Same drift problem as deck widths: mock wheel diameters are keyed by exact
 * variant title (e.g. "51"), but Shopify titles carry units and resize over
 * time (e.g. "51mm"). Fall back to the millimetre number in the title so a
 * variant still maps when its key no longer matches.
 */
function parseWheelDiameterFromTitle(title: string): number | undefined {
  const match = title.match(/(\d+(?:\.\d+)?)\s*mm/i);
  if (!match) return undefined;
  const value = Number(match[1]);
  if (!Number.isFinite(value) || value < 40 || value > 120) return undefined;
  return value;
}

/**
 * Truck hangers drift the same way — mock keys like "5.5\"" no longer match
 * live titles like "8.125\"" once the store quotes axle width instead of
 * hanger size. Only variants whose titles are plain hanger sizes fall back to
 * the raw number; anything larger than a hanger (i.e. an axle width) is
 * converted back to a hanger by subtracting the axle offset.
 */
function parseTruckHangerFromTitle(title: string): number | undefined {
  const match = title.match(/(\d+(?:\.\d+)?)\s*"?/);
  if (!match) return undefined;
  const value = Number(match[1]);
  if (!Number.isFinite(value) || value < 3 || value > 12) return undefined;
  if (value > 6.5) {
    const offset = compatRules.hanger_to_axle_offset;
    const hanger = value - offset;
    return hanger > 0 ? Number(hanger.toFixed(2)) : undefined;
  }
  return value;
}

/**
 * Transforms Shopify products into ConfiguratorItems using mock metafield data.
 * Each product variant becomes a separate ConfiguratorItem.
 *
 * When real Shopify metafields are available, replace this function with one that
 * reads metafields directly from the product.metafields array.
 */
export function buildConfiguratorItems(products: Product[]): {
  decks: ConfiguratorItem[];
  trucks: ConfiguratorItem[];
  wheels: ConfiguratorItem[];
  bearings: ConfiguratorItem[];
  griptape: ConfiguratorItem[];
  risers: ConfiguratorItem[];
  hardware: ConfiguratorItem[];
} {
  const decks: ConfiguratorItem[] = [];
  const trucks: ConfiguratorItem[] = [];
  const wheels: ConfiguratorItem[] = [];
  const bearings: ConfiguratorItem[] = [];
  const griptape: ConfiguratorItem[] = [];
  const risers: ConfiguratorItem[] = [];
  const hardware: ConfiguratorItem[] = [];

  for (const product of products) {
    const handle = product.handle;

    // Check each category in mock data
    if (handle in (mockData.decks || {})) {
      const mock = (mockData.decks as Record<string, MockProductData>)[handle]!;
      const widthByVariant = mock.deck_width_by_variant || {};

      for (const variant of product.variants) {
        const width =
          widthByVariant[variant.title] ??
          parseDeckWidthFromTitle(variant.title);

        let concave: string | undefined;
        if (variant.title.toLowerCase().includes("mellow")) {
          concave = "Mellow";
        } else if (variant.title.toLowerCase().includes("medium")) {
          concave = "Medium";
        } else if (variant.title.toLowerCase().includes("steep")) {
          concave = "Steep";
        }

        let wheelWells: string | undefined;
        if (variant.title.toLowerCase().includes("without wheel well")) {
          wheelWells = "No";
        } else if (variant.title.toLowerCase().includes("wheel well")) {
          wheelWells = "Yes";
        }

        decks.push({
          productId: product.id,
          productHandle: handle,
          productTitle: product.title,
          productImage: product.featuredImage?.url,
          brand: mock.brand,
          variantId: variant.id,
          variantTitle: variant.title,
          price: {
            amount: variant.price.amount,
            currencyCode: variant.price.currencyCode,
          },
          availableForSale: variant.availableForSale,
          meta: {
            category: "deck" as const,
            deck_board_type: mock.deck_board_type as any,
            deck_width: width,
            deck_concave: concave,
            deck_wheel_wells: wheelWells,
          },
        });
      }
    }

    if (handle in (mockData.trucks || {})) {
      const mock = (mockData.trucks as Record<string, MockProductData>)[
        handle
      ]!;
      const hangerByVariant = mock.truck_hanger_size_by_variant || {};

      for (const variant of product.variants) {
        const hangerSize =
          hangerByVariant[variant.title] ??
          parseTruckHangerFromTitle(variant.title);

        trucks.push({
          productId: product.id,
          productHandle: handle,
          productTitle: product.title,
          productImage: product.featuredImage?.url,
          brand: mock.brand,
          variantId: variant.id,
          variantTitle: variant.title,
          price: {
            amount: variant.price.amount,
            currencyCode: variant.price.currencyCode,
          },
          availableForSale: variant.availableForSale,
          meta: {
            category: "truck" as const,
            truck_type: mock.truck_type as any,
            truck_hanger_size: hangerSize ?? null,
            truck_sold_as: (mock.truck_sold_as as any) || "Pair",
            truck_compatible_board_types:
              mock.truck_compatible_board_types || "",
          },
        });
      }
    }

    if (handle in (mockData.wheels || {})) {
      const mock = (mockData.wheels as Record<string, MockProductData>)[
        handle
      ]!;
      const diameterByVariant = mock.wheel_diameter_by_variant || {};

      for (const variant of product.variants) {
        const diameter =
          diameterByVariant[variant.title] ??
          parseWheelDiameterFromTitle(variant.title);
        if (diameter === undefined) continue;

        wheels.push({
          productId: product.id,
          productHandle: handle,
          productTitle: product.title,
          productImage: product.featuredImage?.url,
          brand: mock.brand,
          variantId: variant.id,
          variantTitle: variant.title,
          price: {
            amount: variant.price.amount,
            currencyCode: variant.price.currencyCode,
          },
          availableForSale: variant.availableForSale,
          meta: {
            category: "wheel" as const,
            wheel_diameter: diameter,
            wheel_hardness: mock.wheel_hardness || "",
            wheel_type: mock.wheel_type as any,
            wheel_compatible_board_types:
              mock.wheel_compatible_board_types || "",
          },
        });
      }
    }

    if (handle in (mockData.bearings || {})) {
      const mock = (mockData.bearings as Record<string, MockProductData>)[
        handle
      ]!;

      for (const variant of product.variants) {
        bearings.push({
          productId: product.id,
          productHandle: handle,
          productTitle: product.title,
          productImage: product.featuredImage?.url,
          brand: mock.brand,
          variantId: variant.id,
          variantTitle: variant.title,
          price: {
            amount: variant.price.amount,
            currencyCode: variant.price.currencyCode,
          },
          availableForSale: variant.availableForSale,
          meta: {
            category: "bearing" as const,
            bearing_type: (mock.bearing_type as any) || "Steel",
          },
        });
      }
    }

    if (handle in (mockData.griptape || {})) {
      const mock = (mockData.griptape as Record<string, MockProductData>)[
        handle
      ]!;

      for (const variant of product.variants) {
        griptape.push({
          productId: product.id,
          productHandle: handle,
          productTitle: product.title,
          productImage: product.featuredImage?.url,
          brand: mock.brand,
          variantId: variant.id,
          variantTitle: variant.title,
          price: {
            amount: variant.price.amount,
            currencyCode: variant.price.currencyCode,
          },
          availableForSale: variant.availableForSale,
          meta: {
            category: "griptape" as const,
            griptape_width: mock.griptape_width || 9,
            griptape_type: mock.griptape_type,
          },
        });
      }
    }
  }

  return { decks, trucks, wheels, bearings, griptape, risers, hardware };
}

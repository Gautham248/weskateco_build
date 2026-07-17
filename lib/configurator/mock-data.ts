import type { Product } from "lib/shopify/types";
import type { ConfiguratorItem } from "./types";
import mockData from "config/mock-configurator-data.json";

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
        const width = widthByVariant[variant.title];
        if (width === undefined) continue; // skip variants we don't have width data for

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
        const hangerSize = hangerByVariant[variant.title];

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
        const diameter = diameterByVariant[variant.title];
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

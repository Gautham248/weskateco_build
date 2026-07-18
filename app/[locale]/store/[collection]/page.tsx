import { defaultSort, sorting } from "lib/constants";
import { createTranslator } from "lib/i18n";
import {
  getCollection,
  getCollectionProducts,
  getCollections,
} from "lib/shopify";
import { Product } from "lib/shopify/types";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import StoreCollectionClient from "./store-collection-client";

export const dynamicParams = true;

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string; collection: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const collection = await getCollection(params.collection);

  if (!collection) return notFound();

  return {
    title: collection.seo?.title || collection.title,
    description:
      collection.seo?.description ||
      collection.description ||
      `${collection.title} products`,
  };
}

export default async function CategoryPage(props: {
  params: Promise<{ locale: string; collection: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const { sort } = (searchParams || {}) as {
    [key: string]: string;
  };
  const { sortKey, reverse } =
    sorting.find((item) => item.slug === sort) || defaultSort;

  const [collection, collections] = await Promise.all([
    getCollection(params.collection),
    getCollections(),
  ]);

  if (!collection) return notFound();

  // Mapping of subcollection handles to their main category handle
  const SUB_TO_PARENT: Record<string, string> = {
    // Skateboards
    skateboards: "skateboards",
    decks: "skateboards",
    trucks: "skateboards",
    wheels: "skateboards",
    completes: "skateboards",
    accessories: "skateboards",
    "skateboard-completes": "skateboards",
    "skateboard-decks": "skateboards",
    "skateboard-trucks": "skateboards",
    "skateboard-wheels": "skateboards",
    "skateboard-accessories": "skateboards",

    // Surfskates
    surfskates: "surfskates",
    "surfskate-completes": "surfskates",
    "surfskate-decks": "surfskates",
    "surfskate-trucks": "surfskates",
    "surfskate-wheels": "surfskates",
    "surfskate-accessories": "surfskates",

    // Apparel
    "apparel-1": "apparel-1",
    apparel: "apparel-1",

    // Protection Gears
    "protection-gears": "protection-gears",
    "protective-gears": "protection-gears",
    helmets: "protection-gears",
    pads: "protection-gears",
    gloves: "protection-gears",
  };

  const CATEGORY_PREFIXES: Record<string, string> = {
    skateboards: "skateboard",
    surfskates: "surfskate",
    "apparel-1": "apparel",
    "protection-gears": "protection",
  };

  const activeHandle = params.collection;

  // Resolve parent category
  let parentCategory = SUB_TO_PARENT[activeHandle];
  if (!parentCategory && activeHandle) {
    const handleLower = activeHandle.toLowerCase();
    if (handleLower.includes("skateboard")) {
      parentCategory = "skateboards";
    } else if (handleLower.includes("surfskate")) {
      parentCategory = "surfskates";
    } else if (handleLower.includes("apparel")) {
      parentCategory = "apparel-1";
    } else if (
      handleLower.includes("protect") ||
      handleLower.includes("helmet") ||
      handleLower.includes("pad")
    ) {
      parentCategory = "protection-gears";
    }
  }

  let filteredCollections = collections;

  if (parentCategory) {
    const prefix = CATEGORY_PREFIXES[parentCategory];
    if (prefix) {
      filteredCollections = collections.filter((c) =>
        c.title.toLowerCase().startsWith(prefix),
      );
    }
  } else if (activeHandle !== "") {
    // If it's a brand page (not in SUB_TO_PARENT, and not empty), filter to only show brand collections
    filteredCollections = collections.filter((c) => {
      if (c.handle === "") return false;
      return !SUB_TO_PARENT[c.handle];
    });
  }

  const prefix = parentCategory ? CATEGORY_PREFIXES[parentCategory] : null;

  const formattedCollections = filteredCollections
    .filter((c) => {
      const titleLower = c.title.toLowerCase();
      const handleLower = c.handle.toLowerCase();
      // Don't show the global/all-store "All" pill here
      if (c.handle === "") return false;
      // Don't show surfboard full-setups
      if (
        titleLower === "skateboard and surfskate full-setups" ||
        handleLower === "surfboard full-setups"
      )
        return false;
      return true;
    })
    .map((c) => {
      let displayTitle = c.title;
      const isSameAsNav =
        displayTitle.toLowerCase() === activeHandle.toLowerCase() ||
        (prefix && displayTitle.toLowerCase() === prefix + "s");

      if (isSameAsNav) {
        displayTitle = "All";
      } else if (prefix) {
        const regex = new RegExp(`^(${prefix}s?)\\s+`, "i");
        displayTitle = displayTitle.replace(regex, "");
      }
      return {
        handle: c.handle,
        title: displayTitle,
        path: c.path,
      };
    })
    .sort((a, b) => {
      if (a.title === "All") return -1;
      if (b.title === "All") return 1;
      return 0;
    });

  // Collect handles to fetch (including active and all other tabs)
  const handlesToFetch = new Set(formattedCollections.map((c) => c.handle));
  handlesToFetch.add(params.collection);

  const productsByCollection: Record<string, Product[]> = {};
  const collectionsMeta: Record<string, { title: string; description?: string }> = {};

  // Add initial collection metadata
  collectionsMeta[params.collection] = {
    title: collection.title,
    description: collection.description,
  };

  await Promise.all(
    Array.from(handlesToFetch).map(async (handle) => {
      try {
        const [prods, colData] = await Promise.all([
          getCollectionProducts({
            collection: handle,
            sortKey,
            reverse,
          }),
          handle === params.collection ? Promise.resolve(collection) : getCollection(handle),
        ]);
        productsByCollection[handle] = prods;
        if (colData) {
          collectionsMeta[handle] = {
            title: colData.title,
            description: colData.description,
          };
        }
      } catch (e) {
        console.error(`Error prefetching collection ${handle}:`, e);
        productsByCollection[handle] = [];
      }
    })
  );

  const t = createTranslator(params.locale);

  return (
    <StoreCollectionClient
      initialCollectionHandle={params.collection}
      productsByCollection={productsByCollection}
      collections={formattedCollections}
      collectionsMeta={collectionsMeta}
      locale={params.locale}
      noProductsText={t("collection.no_products")}
    />
  );
}

import { getSiteSettings } from "lib/sanity/queries";
import CategoryGrid from "./category-grid";

export default async function CategoryGridWrapper({ locale }: { locale: string }) {
  const settings = await getSiteSettings();
  const sanityCategories = settings?.categoryGrid;

  return <CategoryGrid locale={locale} sanityCategories={sanityCategories} />;
}

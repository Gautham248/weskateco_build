import { getHomeShopNow } from "lib/sanity/queries";
import ShopNow from "./shop-now";

export default async function ShopNowWrapper({ locale }: { locale: string }) {
  const sanityData = await getHomeShopNow();
  const sanityProducts = sanityData?.products;

  return <ShopNow locale={locale} sanityProducts={sanityProducts} />;
}

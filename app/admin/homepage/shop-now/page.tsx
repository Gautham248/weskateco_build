import { requireAuth } from "lib/admin/actions/auth";
import { getHomeShopNow } from "lib/sanity/queries";
import { ShopNowForm } from "./shop-now-form";

export default async function ShopNowPage() {
  await requireAuth();
  const products = await getHomeShopNow();

  return (
    <>
      <div className="admin-topbar">
        <span className="admin-topbar-title">Shop Now Carousel</span>
        <div className="admin-topbar-right">
          <span className="admin-badge admin-badge-success">Sanity Connected</span>
        </div>
      </div>

      <div className="admin-content">
        <div className="admin-page-header">
          <h1>Shop Now Carousel</h1>
          <p>Featured shop products, discount tags, and EMI options.</p>
        </div>

        <ShopNowForm initialProducts={products} />
      </div>
    </>
  );
}

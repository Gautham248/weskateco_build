import { requireAuth } from "lib/admin/actions/auth";
import { searchProducts, getProductsByCollection, getCollections } from "lib/admin/shopify-admin";
import { ProductBrowserClient } from "./product-browser-client";

export default async function ShopifyProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; collection?: string }>;
}) {
  await requireAuth();
  const { q = "", collection = "" } = await searchParams;

  const collections = await getCollections();
  
  let products = [];
  if (collection) {
    products = await getProductsByCollection(collection);
    if (q) {
      const lower = q.toLowerCase();
      products = products.filter(
        (p) => p.title.toLowerCase().includes(lower) || p.handle.toLowerCase().includes(lower)
      );
    }
  } else {
    products = await searchProducts(q);
  }

  return (
    <>
      <div className="admin-topbar">
        <span className="admin-topbar-title">Shopify Products</span>
        <div className="admin-topbar-right">
          <span className="admin-badge admin-badge-success">Shopify Connected</span>
        </div>
      </div>

      <div className="admin-content">
        <div className="admin-page-header">
          <h1>Shopify Products ({products.length})</h1>
          <p>Browse products live from Shopify. Copy handles to use in homepage, hero, and carousel editors.</p>
        </div>

        <ProductBrowserClient
          initialProducts={products}
          collections={collections}
          currentQuery={q}
          currentCollection={collection}
        />
      </div>
    </>
  );
}

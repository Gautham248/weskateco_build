import { requireAuth } from "lib/admin/actions/auth";
import { getCollections } from "lib/admin/shopify-admin";
import { CollectionsBrowserClient } from "./collections-browser-client";

export default async function ShopifyCollectionsPage() {
  await requireAuth();
  const collections = await getCollections();

  return (
    <>
      <div className="admin-topbar">
        <span className="admin-topbar-title">Shopify Collections</span>
        <div className="admin-topbar-right">
          <span className="admin-badge admin-badge-success">Shopify Connected</span>
        </div>
      </div>

      <div className="admin-content">
        <div className="admin-page-header">
          <h1>Shopify Collections ({collections.length})</h1>
          <p>Browse collections live from Shopify. Copy collection handles to link with brand partners and category grids.</p>
        </div>

        <CollectionsBrowserClient initialCollections={collections} />
      </div>
    </>
  );
}

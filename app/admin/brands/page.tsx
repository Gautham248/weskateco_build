import { requireAuth } from "lib/admin/actions/auth";
import { getAuthorisedBrands } from "lib/sanity/queries";
import { BrandsEditorForm } from "./brands-form";

export default async function BrandsPage() {
  await requireAuth();
  const brands = await getAuthorisedBrands();

  return (
    <>
      <div className="admin-topbar">
        <span className="admin-topbar-title">Authorised Brands</span>
        <div className="admin-topbar-right">
          <span className="admin-badge admin-badge-success">Sanity Connected</span>
        </div>
      </div>

      <div className="admin-content">
        <div className="admin-page-header">
          <h1>Authorised Brands</h1>
          <p>Add and manage official brand partners, logo uploads via ImageKit, and Shopify collection links.</p>
        </div>

        <BrandsEditorForm initialBrands={brands} />
      </div>
    </>
  );
}

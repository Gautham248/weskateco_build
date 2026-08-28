import { requireAuth } from "lib/admin/actions/auth";
import { getSiteSettings } from "lib/sanity/queries";
import { CategoryGridForm } from "./category-grid-form";

export default async function CategoriesPage() {
  await requireAuth();
  const settings = await getSiteSettings();
  const tiles = settings?.categoryGrid ?? [
    { title_en: "SKATEBOARDS", title_hi: "स्केटबोर्ड", href: "/store/skateboard-completes" },
    { title_en: "SURFSKATES", title_hi: "सर्फस्केट", href: "/store/surfskate-completes" },
    { title_en: "ACCESSORIES", title_hi: "एक्सेसरीज", href: "/store/accessories" },
  ];

  return (
    <>
      <div className="admin-topbar">
        <span className="admin-topbar-title">Category Grid</span>
        <div className="admin-topbar-right">
          <span className="admin-badge admin-badge-success">Sanity Connected</span>
        </div>
      </div>

      <div className="admin-content">
        <div className="admin-page-header">
          <h1>Category Grid</h1>
          <p>Homepage tiles (Skateboards, Surfskates, Accessories, etc.).</p>
        </div>

        <CategoryGridForm initialTiles={tiles} />
      </div>
    </>
  );
}

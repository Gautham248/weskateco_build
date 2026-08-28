import { requireAuth } from "lib/admin/actions/auth";
import { getNavigation } from "lib/sanity/queries";
import { NavigationEditorForm } from "./nav-editor-form";

export default async function NavigationPage() {
  await requireAuth();
  const navData = await getNavigation();
  const defaultItems = [
    {
      label_en: "STORE",
      label_hi: "स्टोर",
      href: "/store",
      children: [
        { label_en: "Skateboards", label_hi: "स्केटबोर्ड", href: "/store/skateboard-completes" },
        { label_en: "Surfskates", label_hi: "सर्फस्केट", href: "/store/surfskate-completes" },
        { label_en: "Accessories", label_hi: "एक्सेसरीज", href: "/store/accessories" },
        { label_en: "Protective Gear", label_hi: "सुरक्षात्मक गियर", href: "/store/protective-gear" },
        { label_en: "Footwear", label_hi: "जूते", href: "/store/footwear" },
        { label_en: "Apparel", label_hi: "परिधान", href: "/store/apparel" },
      ],
    },
    {
      label_en: "GUIDES",
      label_hi: "गाइड्स",
      href: "/guides",
      children: [
        { label_en: "Skateboarding 101", label_hi: "स्केटबोर्डिंग 101", href: "/guides/skateboard-buying-guide" },
        { label_en: "Maintenance Guide", label_hi: "रखरखाव गाइड", href: "/guides/wheels-guide" },
      ],
    },
    { label_en: "ACADEMY", label_hi: "अकादमी", href: "/academy" },
    { label_en: "SKATEPARKS", label_hi: "स्केटपार्क", href: "/skateparks" },
  ];

  const items = navData?.mainLinks ?? defaultItems;

  return (
    <>
      <div className="admin-topbar">
        <span className="admin-topbar-title">Navigation Editor</span>
        <div className="admin-topbar-right">
          <span className="admin-badge admin-badge-success">Sanity Connected</span>
        </div>
      </div>

      <div className="admin-content">
        <div className="admin-page-header">
          <h1>Navigation Editor</h1>
          <p>Manage header dropdown categories, sub-items, and top-level navigation links.</p>
        </div>

        <NavigationEditorForm initialItems={items} />
      </div>
    </>
  );
}

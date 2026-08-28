import { requireAuth } from "lib/admin/actions/auth";
import { getSiteSettings } from "lib/sanity/queries";
import { HeroEditorForm } from "./hero-form";

export default async function HeroEditorPage() {
  await requireAuth();
  const settings = await getSiteSettings();
  const heroSettings = settings?.heroSettings ?? {
    mediaType: "gif",
    overlayEnabled: false,
    ctaButtons: [
      { label_en: "Shop Skateboards", label_hi: "स्केटबोर्ड खरीदें", href: "/store/skateboard-completes" },
      { label_en: "Shop Surfskates", label_hi: "सर्फस्केट खरीदें", href: "/store/surfskate-completes" },
      { label_en: "Build Your Setup", label_hi: "अपना सेटअप बनाएं", href: "/configurator" },
    ],
  };

  return (
    <>
      <div className="admin-topbar">
        <span className="admin-topbar-title">Hero Banner Editor</span>
        <div className="admin-topbar-right">
          <span className="admin-badge admin-badge-success">Sanity Connected</span>
        </div>
      </div>

      <div className="admin-content">
        <div className="admin-page-header">
          <h1>Hero Banner Editor</h1>
          <p>Configure hero background media (video, GIF, image), overlay toggle, and CTA buttons.</p>
        </div>

        <HeroEditorForm initialSettings={heroSettings} />
      </div>
    </>
  );
}

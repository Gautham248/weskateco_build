import { requireAuth } from "lib/admin/actions/auth";
import { getSiteSettings } from "lib/sanity/queries";
import { SiteSettingsForm } from "./settings-form";

export default async function SettingsPage() {
  await requireAuth();
  const settings = await getSiteSettings();

  return (
    <>
      <div className="admin-topbar">
        <span className="admin-topbar-title">Site Settings</span>
        <div className="admin-topbar-right">
          <span className="admin-badge admin-badge-success">Sanity Connected</span>
        </div>
      </div>

      <div className="admin-content">
        <div className="admin-page-header">
          <h1>Site Settings Editor</h1>
          <p>Global storefront settings, announcement bar, contact email/phone, social links, and footer copy.</p>
        </div>

        <SiteSettingsForm initialSettings={settings ?? {}} />
      </div>
    </>
  );
}

"use client";

import { useState, useTransition } from "react";
import { saveSiteSettingsAction } from "lib/admin/actions/site-settings";
import { SiteSettingsData } from "lib/sanity/queries";

export function SiteSettingsForm({ initialSettings }: { initialSettings: SiteSettingsData }) {
  const [isPending, startTransition] = useTransition();
  const [statusMsg, setStatusMsg] = useState("");

  const [companyName, setCompanyName] = useState(initialSettings.companyName ?? "WeSkate Co");
  const [announcementBarEnabled, setAnnouncementBarEnabled] = useState(initialSettings.announcementBar?.enabled ?? true);
  const [announcementBar_en, setAnnouncementBar_en] = useState(initialSettings.announcementBar?.text_en ?? "FREE SHIPPING ON ALL ORDERS OVER ₹2,999 | MADE IN INDIA");
  const [announcementBar_hi, setAnnouncementBar_hi] = useState(initialSettings.announcementBar?.text_hi ?? "₹2,999 से अधिक के सभी ऑर्डर पर मुफ़्त शिपिंग | भारत में निर्मित");
  const [contactEmail, setContactEmail] = useState(initialSettings.contactEmail ?? "support@weskateco.com");
  const [contactPhone, setContactPhone] = useState(initialSettings.contactPhone ?? "+91 98765 43210");
  const [instagram, setInstagram] = useState(initialSettings.socialLinks?.instagram ?? "https://instagram.com/weskateco");
  const [youtube, setYoutube] = useState(initialSettings.socialLinks?.youtube ?? "https://youtube.com/@weskateco");
  const [facebook, setFacebook] = useState(initialSettings.socialLinks?.facebook ?? "https://facebook.com/weskateco");
  const [twitter, setTwitter] = useState(initialSettings.socialLinks?.twitter ?? "https://twitter.com/weskateco");
  const [footerText_en, setFooterText_en] = useState(initialSettings.footerText_en ?? "© 2026 WeSkate Co. All rights reserved.");
  const [footerText_hi, setFooterText_hi] = useState(initialSettings.footerText_hi ?? "© 2026 WeSkate Co. सर्वाधिकार सुरक्षित।");

  function handleSave() {
    setStatusMsg("");
    startTransition(async () => {
      const res = await saveSiteSettingsAction({
        companyName,
        siteName: companyName,
        announcementBar_en,
        announcementBar_hi,
        announcementBarEnabled,
        contactEmail,
        contactPhone,
        socialLinks: { instagram, youtube, facebook, twitter },
        footerText_en,
        footerText_hi,
      });

      if (res.success) {
        setStatusMsg("🎉 Site settings saved successfully!");
      } else {
        setStatusMsg("❌ Error saving settings.");
      }
    });
  }

  return (
    <div className="admin-card" style={{ maxWidth: 760 }}>
      {statusMsg && (
        <div
          style={{
            padding: "12px 16px",
            borderRadius: "var(--admin-radius-sm)",
            marginBottom: 20,
            fontSize: 13,
            background: statusMsg.startsWith("❌") ? "var(--admin-error-dim)" : "var(--admin-accent-dim)",
            color: statusMsg.startsWith("❌") ? "var(--admin-error)" : "var(--admin-accent)",
            border: `1px solid ${statusMsg.startsWith("❌") ? "rgba(248,113,113,0.3)" : "rgba(45,212,191,0.3)"}`,
          }}
        >
          {statusMsg}
        </div>
      )}

      {/* General */}
      <div className="admin-form-group">
        <label className="admin-form-label">Store / Company Name</label>
        <input
          type="text"
          className="admin-form-input"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />
      </div>

      {/* Announcement Bar */}
      <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid var(--admin-border)" }}>
        <div className="admin-card-title" style={{ marginBottom: 12 }}>Announcement Bar</div>
        <div className="admin-form-group">
          <label className="admin-toggle">
            <input
              type="checkbox"
              checked={announcementBarEnabled}
              onChange={(e) => setAnnouncementBarEnabled(e.target.checked)}
            />
            <div className="admin-toggle-track">
              <div className="admin-toggle-thumb" />
            </div>
            <span style={{ fontSize: 13, fontWeight: 500 }}>Show Announcement Bar</span>
          </label>
        </div>

        {announcementBarEnabled && (
          <div className="admin-form-row">
            <div>
              <label className="admin-form-label">Text (EN)</label>
              <input
                type="text"
                className="admin-form-input"
                value={announcementBar_en}
                onChange={(e) => setAnnouncementBar_en(e.target.value)}
              />
            </div>
            <div>
              <label className="admin-form-label">Text (HI)</label>
              <input
                type="text"
                className="admin-form-input"
                value={announcementBar_hi}
                onChange={(e) => setAnnouncementBar_hi(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      {/* Contact Info */}
      <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid var(--admin-border)" }}>
        <div className="admin-card-title" style={{ marginBottom: 12 }}>Contact Information</div>
        <div className="admin-form-row">
          <div>
            <label className="admin-form-label">Contact Email</label>
            <input
              type="email"
              className="admin-form-input"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="admin-form-label">Contact Phone</label>
            <input
              type="text"
              className="admin-form-input"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid var(--admin-border)" }}>
        <div className="admin-card-title" style={{ marginBottom: 12 }}>Social Media Links</div>
        <div className="admin-form-row">
          <div>
            <label className="admin-form-label">Instagram</label>
            <input
              type="text"
              className="admin-form-input"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
            />
          </div>
          <div>
            <label className="admin-form-label">YouTube</label>
            <input
              type="text"
              className="admin-form-input"
              value={youtube}
              onChange={(e) => setYoutube(e.target.value)}
            />
          </div>
        </div>
        <div className="admin-form-row">
          <div>
            <label className="admin-form-label">Facebook</label>
            <input
              type="text"
              className="admin-form-input"
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
            />
          </div>
          <div>
            <label className="admin-form-label">Twitter</label>
            <input
              type="text"
              className="admin-form-input"
              value={twitter}
              onChange={(e) => setTwitter(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Footer Copy */}
      <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid var(--admin-border)" }}>
        <div className="admin-card-title" style={{ marginBottom: 12 }}>Footer Copyright Text</div>
        <div className="admin-form-row">
          <div>
            <label className="admin-form-label">Footer Text (EN)</label>
            <input
              type="text"
              className="admin-form-input"
              value={footerText_en}
              onChange={(e) => setFooterText_en(e.target.value)}
            />
          </div>
          <div>
            <label className="admin-form-label">Footer Text (HI)</label>
            <input
              type="text"
              className="admin-form-input"
              value={footerText_hi}
              onChange={(e) => setFooterText_hi(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div style={{ marginTop: 28 }}>
        <button
          type="button"
          className="admin-btn admin-btn-primary"
          onClick={handleSave}
          disabled={isPending}
          style={{ padding: "10px 24px", fontSize: 14 }}
        >
          {isPending ? "Saving to Sanity…" : "Save Site Settings"}
        </button>
      </div>
    </div>
  );
}

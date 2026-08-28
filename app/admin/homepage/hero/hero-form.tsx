"use client";

import { useState, useTransition } from "react";
import { saveHeroSettingsAction } from "lib/admin/actions/homepage";
import { uploadMediaAction } from "lib/admin/actions/media";
import { HeroSettingsData } from "lib/sanity/queries";

export function HeroEditorForm({ initialSettings }: { initialSettings: HeroSettingsData }) {
  const [isPending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);
  const [mediaUrl, setMediaUrl] = useState(initialSettings.mediaUrl ?? "");
  const [mediaType, setMediaType] = useState<"image" | "video" | "gif">(initialSettings.mediaType ?? "gif");
  const [overlayEnabled, setOverlayEnabled] = useState(initialSettings.overlayEnabled ?? false);
  const [ctaButtons, setCtaButtons] = useState(initialSettings.ctaButtons ?? []);
  const [statusMsg, setStatusMsg] = useState("");

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setStatusMsg("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "/weskateco/hero");

    const res = await uploadMediaAction(formData);
    setUploading(false);

    if (res.success && res.url) {
      setMediaUrl(res.url);
      setStatusMsg("✅ Media uploaded to ImageKit successfully!");
    } else {
      setStatusMsg(`❌ Upload failed: ${res.error}`);
    }
  }

  function handleSave() {
    setStatusMsg("");
    startTransition(async () => {
      const res = await saveHeroSettingsAction({
        mediaUrl,
        mediaType,
        overlayEnabled,
        ctaButtons,
      });

      if (res.success) {
        setStatusMsg("🎉 Hero Banner saved and live cache revalidated!");
      } else {
        setStatusMsg("❌ Error saving hero settings.");
      }
    });
  }

  function updateCta(index: number, field: string, val: string) {
    const next = [...ctaButtons];
    next[index] = { ...next[index], [field]: val };
    setCtaButtons(next);
  }

  return (
    <div className="admin-card" style={{ maxWidth: 720 }}>
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

      {/* Media Source */}
      <div className="admin-form-group">
        <label className="admin-form-label">Background Media Type</label>
        <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
          {(["gif", "video", "image"] as const).map((type) => (
            <button
              key={type}
              type="button"
              className={`admin-btn ${mediaType === type ? "admin-btn-primary" : "admin-btn-ghost"}`}
              onClick={() => setMediaType(type)}
            >
              {type.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Media Upload / URL */}
      <div className="admin-form-group">
        <label className="admin-form-label">Media File (ImageKit Upload)</label>
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 8 }}>
          <input
            type="file"
            accept="image/*,video/*,.gif"
            onChange={handleFileUpload}
            disabled={uploading}
            style={{ fontSize: 13 }}
          />
          {uploading && <div className="admin-spinner" />}
        </div>
        <input
          type="text"
          className="admin-form-input"
          placeholder="Or paste media URL directly (e.g. https://ik.imagekit.io/...)"
          value={mediaUrl}
          onChange={(e) => setMediaUrl(e.target.value)}
        />
      </div>

      {/* Overlay Toggle */}
      <div className="admin-form-group">
        <label className="admin-toggle">
          <input
            type="checkbox"
            checked={overlayEnabled}
            onChange={(e) => setOverlayEnabled(e.target.checked)}
          />
          <div className="admin-toggle-track">
            <div className="admin-toggle-thumb" />
          </div>
          <span style={{ fontSize: 13, fontWeight: 500 }}>Enable Hero Text Overlay & CTA Buttons</span>
        </label>
      </div>

      {/* CTA Buttons */}
      {overlayEnabled && (
        <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid var(--admin-border)" }}>
          <div className="admin-card-title" style={{ marginBottom: 12 }}>CTA Buttons</div>
          {ctaButtons.map((btn, idx) => (
            <div key={idx} className="admin-form-row" style={{ alignItems: "center" }}>
              <input
                type="text"
                className="admin-form-input"
                placeholder="EN Label (e.g. Shop Skateboards)"
                value={btn.label_en}
                onChange={(e) => updateCta(idx, "label_en", e.target.value)}
              />
              <input
                type="text"
                className="admin-form-input"
                placeholder="HI Label (e.g. स्केटबोर्ड खरीदें)"
                value={btn.label_hi}
                onChange={(e) => updateCta(idx, "label_hi", e.target.value)}
              />
              <input
                type="text"
                className="admin-form-input"
                placeholder="Target URL (e.g. /store/skateboard-completes)"
                value={btn.href}
                onChange={(e) => updateCta(idx, "href", e.target.value)}
              />
            </div>
          ))}
          {ctaButtons.length < 3 && (
            <button
              type="button"
              className="admin-btn admin-btn-ghost admin-btn-sm"
              onClick={() =>
                setCtaButtons([
                  ...ctaButtons,
                  { label_en: "NEW BUTTON", label_hi: "नया बटन", href: "/store" },
                ])
              }
              style={{ marginTop: 8 }}
            >
              + Add CTA Button
            </button>
          )}
        </div>
      )}

      {/* Save Button */}
      <div style={{ marginTop: 28 }}>
        <button
          type="button"
          className="admin-btn admin-btn-primary"
          onClick={handleSave}
          disabled={isPending || uploading}
          style={{ padding: "10px 24px", fontSize: 14 }}
        >
          {isPending ? "Saving to Sanity…" : "Save Hero Settings"}
        </button>
      </div>
    </div>
  );
}

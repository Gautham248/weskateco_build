"use client";

import { useState, useTransition } from "react";
import { saveCategoryGridAction } from "lib/admin/actions/homepage";
import { uploadMediaAction } from "lib/admin/actions/media";

export interface CategoryTile {
  title_en?: string;
  title_hi?: string;
  href?: string;
  imageUrl?: string;
}

export function CategoryGridForm({ initialTiles }: { initialTiles: CategoryTile[] }) {
  const [tiles, setTiles] = useState<CategoryTile[]>(initialTiles);
  const [isPending, startTransition] = useTransition();
  const [statusMsg, setStatusMsg] = useState("");
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);

  function addTile() {
    setTiles([
      ...tiles,
      {
        title_en: "NEW CATEGORY",
        title_hi: "नई श्रेणी",
        href: "/store",
      },
    ]);
  }

  function removeTile(index: number) {
    setTiles(tiles.filter((_, i) => i !== index));
  }

  function updateTile(index: number, field: keyof CategoryTile, value: string) {
    const next = [...tiles];
    next[index] = { ...next[index], [field]: value };
    setTiles(next);
  }

  async function handleImageUpload(index: number, file: File) {
    setUploadingIdx(index);
    setStatusMsg("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "/weskateco/categories");

    const res = await uploadMediaAction(formData);
    setUploadingIdx(null);

    if (res.success && res.url) {
      updateTile(index, "imageUrl", res.url);
      setStatusMsg("✅ Background image uploaded!");
    } else {
      setStatusMsg(`❌ Upload failed: ${res.error}`);
    }
  }

  function handleSave() {
    setStatusMsg("");
    startTransition(async () => {
      const res = await saveCategoryGridAction(tiles);
      if (res.success) {
        setStatusMsg("🎉 Category Grid saved successfully!");
      } else {
        setStatusMsg("❌ Error saving category grid.");
      }
    });
  }

  return (
    <div style={{ maxWidth: 840 }}>
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

      {tiles.map((tile, idx) => (
        <div key={idx} className="admin-card" style={{ marginBottom: 20 }}>
          <div className="admin-card-header">
            <div className="admin-card-title">Category Tile #{idx + 1}</div>
            <button
              type="button"
              className="admin-btn admin-btn-danger admin-btn-sm"
              onClick={() => removeTile(idx)}
            >
              Remove
            </button>
          </div>

          <div className="admin-form-row">
            <div>
              <label className="admin-form-label">Title (EN)</label>
              <input
                type="text"
                className="admin-form-input"
                value={tile.title_en}
                onChange={(e) => updateTile(idx, "title_en", e.target.value)}
              />
            </div>
            <div>
              <label className="admin-form-label">Title (HI)</label>
              <input
                type="text"
                className="admin-form-input"
                value={tile.title_hi}
                onChange={(e) => updateTile(idx, "title_hi", e.target.value)}
              />
            </div>
            <div>
              <label className="admin-form-label">Target URL</label>
              <input
                type="text"
                className="admin-form-input"
                value={tile.href}
                onChange={(e) => updateTile(idx, "href", e.target.value)}
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Background Image (ImageKit)</label>
            <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 8 }}>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleImageUpload(idx, e.target.files[0])}
                style={{ fontSize: 13 }}
              />
              {uploadingIdx === idx && <div className="admin-spinner" />}
            </div>
            <input
              type="text"
              className="admin-form-input"
              placeholder="ImageKit Image URL"
              value={tile.imageUrl ?? ""}
              onChange={(e) => updateTile(idx, "imageUrl", e.target.value)}
            />
          </div>
        </div>
      ))}

      <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
        <button type="button" className="admin-btn admin-btn-ghost" onClick={addTile}>
          + Add Category Tile
        </button>
        <button
          type="button"
          className="admin-btn admin-btn-primary"
          onClick={handleSave}
          disabled={isPending || uploadingIdx !== null}
          style={{ padding: "10px 24px" }}
        >
          {isPending ? "Saving to Sanity…" : "Save Category Grid"}
        </button>
      </div>
    </div>
  );
}

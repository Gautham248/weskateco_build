"use client";

import { useState, useTransition } from "react";
import { saveHomeNewlyReleasedAction } from "lib/admin/actions/homepage";
import { uploadMediaAction } from "lib/admin/actions/media";
import { NewlyReleasedSlideData } from "lib/sanity/queries";

export function NewlyReleasedForm({ initialSlides }: { initialSlides: NewlyReleasedSlideData[] }) {
  const [slides, setSlides] = useState<NewlyReleasedSlideData[]>(initialSlides);
  const [isPending, startTransition] = useTransition();
  const [statusMsg, setStatusMsg] = useState("");
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);

  function addSlide() {
    setSlides([
      ...slides,
      {
        title: "NEW DECK",
        subtitle: "7-PLY CANADIAN MAPLE",
        shopifyProductHandle: "pigeon-og-pro",
        price: "₹4,999",
        oldPrice: "₹5,999",
      },
    ]);
  }

  function removeSlide(index: number) {
    setSlides(slides.filter((_, i) => i !== index));
  }

  function updateSlide(index: number, field: keyof NewlyReleasedSlideData, value: string) {
    const next = [...slides];
    next[index] = { ...next[index], [field]: value };
    setSlides(next);
  }

  async function handleImageUpload(index: number, field: "fullImageUrl" | "wheelsImageUrl", file: File) {
    setUploadingIdx(index);
    setStatusMsg("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "/weskateco/newly-released");

    const res = await uploadMediaAction(formData);
    setUploadingIdx(null);

    if (res.success && res.url) {
      updateSlide(index, field, res.url);
      setStatusMsg("✅ Image uploaded to ImageKit!");
    } else {
      setStatusMsg(`❌ Upload failed: ${res.error}`);
    }
  }

  function handleSave() {
    setStatusMsg("");
    startTransition(async () => {
      const res = await saveHomeNewlyReleasedAction(slides);
      if (res.success) {
        setStatusMsg("🎉 Newly Released slides saved successfully!");
      } else {
        setStatusMsg("❌ Error saving slides.");
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

      {slides.map((slide, idx) => (
        <div key={idx} className="admin-card" style={{ marginBottom: 20 }}>
          <div className="admin-card-header">
            <div className="admin-card-title">Slide #{idx + 1}</div>
            <button
              type="button"
              className="admin-btn admin-btn-danger admin-btn-sm"
              onClick={() => removeSlide(idx)}
            >
              Remove Slide
            </button>
          </div>

          <div className="admin-form-row">
            <div>
              <label className="admin-form-label">Title</label>
              <input
                type="text"
                className="admin-form-input"
                value={slide.title}
                onChange={(e) => updateSlide(idx, "title", e.target.value)}
              />
            </div>
            <div>
              <label className="admin-form-label">Subtitle</label>
              <input
                type="text"
                className="admin-form-input"
                value={slide.subtitle}
                onChange={(e) => updateSlide(idx, "subtitle", e.target.value)}
              />
            </div>
          </div>

          <div className="admin-form-row">
            <div>
              <label className="admin-form-label">Shopify Product Handle</label>
              <input
                type="text"
                className="admin-form-input"
                value={slide.shopifyProductHandle}
                onChange={(e) => updateSlide(idx, "shopifyProductHandle", e.target.value)}
              />
            </div>
            <div>
              <label className="admin-form-label">Price</label>
              <input
                type="text"
                className="admin-form-input"
                value={slide.price ?? ""}
                onChange={(e) => updateSlide(idx, "price", e.target.value)}
              />
            </div>
            <div>
              <label className="admin-form-label">Original Price (Strike)</label>
              <input
                type="text"
                className="admin-form-input"
                value={slide.oldPrice ?? ""}
                onChange={(e) => updateSlide(idx, "oldPrice", e.target.value)}
              />
            </div>
          </div>

          {/* Image Uploads */}
          <div className="admin-form-row">
            <div>
              <label className="admin-form-label">Full Board Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleImageUpload(idx, "fullImageUrl", e.target.files[0])}
                style={{ fontSize: 12, marginBottom: 4 }}
              />
              <input
                type="text"
                className="admin-form-input"
                placeholder="ImageKit URL"
                value={slide.fullImageUrl ?? ""}
                onChange={(e) => updateSlide(idx, "fullImageUrl", e.target.value)}
              />
            </div>
            <div>
              <label className="admin-form-label">Wheels Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleImageUpload(idx, "wheelsImageUrl", e.target.files[0])}
                style={{ fontSize: 12, marginBottom: 4 }}
              />
              <input
                type="text"
                className="admin-form-input"
                placeholder="ImageKit URL"
                value={slide.wheelsImageUrl ?? ""}
                onChange={(e) => updateSlide(idx, "wheelsImageUrl", e.target.value)}
              />
            </div>
          </div>
        </div>
      ))}

      <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
        <button type="button" className="admin-btn admin-btn-ghost" onClick={addSlide}>
          + Add Slide
        </button>
        <button
          type="button"
          className="admin-btn admin-btn-primary"
          onClick={handleSave}
          disabled={isPending || uploadingIdx !== null}
          style={{ padding: "10px 24px" }}
        >
          {isPending ? "Saving to Sanity…" : "Save Carousel"}
        </button>
      </div>
    </div>
  );
}

"use client";

import { useState, useTransition } from "react";
import { createBrandAction, deleteBrandAction } from "lib/admin/actions/content";
import { uploadMediaAction } from "lib/admin/actions/media";
import { AuthorisedBrandData } from "lib/sanity/queries";

export function BrandsEditorForm({ initialBrands }: { initialBrands: AuthorisedBrandData[] }) {
  const [brands, setBrands] = useState<AuthorisedBrandData[]>(initialBrands);
  const [isPending, startTransition] = useTransition();
  const [statusMsg, setStatusMsg] = useState("");
  const [uploading, setUploading] = useState(false);

  // New Brand Form State
  const [name, setName] = useState("");
  const [handle, setHandle] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [description_en, setDescription_en] = useState("");
  const [description_hi, setDescription_hi] = useState("");
  const [shopifyCollectionHandle, setShopifyCollectionHandle] = useState("");

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "/weskateco/brands");

    const res = await uploadMediaAction(formData);
    setUploading(false);

    if (res.success && res.url) {
      setLogoUrl(res.url);
      setStatusMsg("✅ Logo uploaded to ImageKit!");
    } else {
      setStatusMsg(`❌ Upload failed: ${res.error}`);
    }
  }

  function handleCreateBrand(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !handle) {
      setStatusMsg("❌ Name and Handle are required.");
      return;
    }

    setStatusMsg("");
    startTransition(async () => {
      const res = await createBrandAction({
        name,
        handle,
        logoUrl,
        description_en,
        description_hi,
        shopifyCollectionHandle,
      });

      if (res.success) {
        setStatusMsg("🎉 Brand created successfully!");
        setName("");
        setHandle("");
        setLogoUrl("");
        setDescription_en("");
        setDescription_hi("");
        setShopifyCollectionHandle("");
      } else {
        setStatusMsg("❌ Error creating brand.");
      }
    });
  }

  function handleDeleteBrand(id: string) {
    if (!confirm("Are you sure you want to delete this brand?")) return;
    startTransition(async () => {
      const res = await deleteBrandAction(id);
      if (res.success) {
        setBrands(brands.filter((b) => b._id !== id));
        setStatusMsg("🗑️ Brand deleted.");
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

      {/* Add New Brand Form */}
      <div className="admin-card" style={{ marginBottom: 28 }}>
        <div className="admin-card-title" style={{ marginBottom: 16 }}>+ Add New Brand</div>
        <form onSubmit={handleCreateBrand}>
          <div className="admin-form-row">
            <div>
              <label className="admin-form-label">Brand Name *</label>
              <input
                type="text"
                className="admin-form-input"
                required
                placeholder="e.g. Carver"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!handle) setHandle(e.target.value.toLowerCase().replace(/\s+/g, "-"));
                }}
              />
            </div>
            <div>
              <label className="admin-form-label">Brand Handle *</label>
              <input
                type="text"
                className="admin-form-input"
                required
                placeholder="e.g. carver"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
              />
            </div>
            <div>
              <label className="admin-form-label">Shopify Collection Handle</label>
              <input
                type="text"
                className="admin-form-input"
                placeholder="e.g. carver-skateboards"
                value={shopifyCollectionHandle}
                onChange={(e) => setShopifyCollectionHandle(e.target.value)}
              />
            </div>
          </div>

          <div className="admin-form-row">
            <div>
              <label className="admin-form-label">Description (EN)</label>
              <input
                type="text"
                className="admin-form-input"
                placeholder="Short brand overview"
                value={description_en}
                onChange={(e) => setDescription_en(e.target.value)}
              />
            </div>
            <div>
              <label className="admin-form-label">Description (HI)</label>
              <input
                type="text"
                className="admin-form-input"
                placeholder="ब्रांड विवरण"
                value={description_hi}
                onChange={(e) => setDescription_hi(e.target.value)}
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Logo Image (ImageKit)</label>
            <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 8 }}>
              <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ fontSize: 13 }} />
              {uploading && <div className="admin-spinner" />}
            </div>
            <input
              type="text"
              className="admin-form-input"
              placeholder="Or paste Logo ImageKit URL"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="admin-btn admin-btn-primary"
            disabled={isPending || uploading}
            style={{ marginTop: 8 }}
          >
            {isPending ? "Creating…" : "Create Brand"}
          </button>
        </form>
      </div>

      {/* Existing Brands Table */}
      <div className="admin-card">
        <div className="admin-card-title" style={{ marginBottom: 16 }}>Existing Brands ({brands.length})</div>
        {brands.length === 0 ? (
          <div style={{ color: "var(--admin-text-muted)", fontSize: 13 }}>No brands added yet.</div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Brand</th>
                  <th>Shopify Collection</th>
                  <th>Description</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {brands.map((brand) => (
                  <tr key={brand._id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        {brand.logoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={brand.logoUrl}
                            alt={brand.name}
                            style={{ width: 32, height: 32, objectFit: "contain", borderRadius: 4 }}
                          />
                        ) : (
                          <div style={{ width: 32, height: 32, background: "#121212", borderRadius: 4 }} />
                        )}
                        <span style={{ fontWeight: 500 }}>{brand.name}</span>
                      </div>
                    </td>
                    <td>
                      <code>{brand.shopifyCollectionHandle ?? "—"}</code>
                    </td>
                    <td style={{ color: "var(--admin-text-muted)", fontSize: 12 }}>
                      {brand.description_en ?? "—"}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="admin-btn admin-btn-danger admin-btn-sm"
                        onClick={() => handleDeleteBrand(brand._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

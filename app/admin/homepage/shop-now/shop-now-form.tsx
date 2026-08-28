"use client";

import { useState, useTransition } from "react";
import { saveHomeShopNowAction } from "lib/admin/actions/homepage";
import { ShopNowProductData } from "lib/sanity/queries";

export function ShopNowForm({ initialProducts }: { initialProducts: ShopNowProductData[] }) {
  const [products, setProducts] = useState<ShopNowProductData[]>(initialProducts);
  const [isPending, startTransition] = useTransition();
  const [statusMsg, setStatusMsg] = useState("");

  function addProduct() {
    setProducts([
      ...products,
      {
        shopifyProductHandle: "pigeon-og-pro",
        discountBadge: "15% OFF",
        emiBadge: "EMI starts at ₹416/mo",
      },
    ]);
  }

  function removeProduct(index: number) {
    setProducts(products.filter((_, i) => i !== index));
  }

  function updateProduct(index: number, field: keyof ShopNowProductData, value: string) {
    const next = [...products];
    next[index] = { ...next[index], [field]: value };
    setProducts(next);
  }

  function handleSave() {
    setStatusMsg("");
    startTransition(async () => {
      const res = await saveHomeShopNowAction(products);
      if (res.success) {
        setStatusMsg("🎉 Shop Now products saved successfully!");
      } else {
        setStatusMsg("❌ Error saving products.");
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

      {products.map((prod, idx) => (
        <div key={idx} className="admin-card" style={{ marginBottom: 20 }}>
          <div className="admin-card-header">
            <div className="admin-card-title">Featured Product #{idx + 1}</div>
            <button
              type="button"
              className="admin-btn admin-btn-danger admin-btn-sm"
              onClick={() => removeProduct(idx)}
            >
              Remove
            </button>
          </div>

          <div className="admin-form-row">
            <div>
              <label className="admin-form-label">Shopify Product Handle</label>
              <input
                type="text"
                className="admin-form-input"
                value={prod.shopifyProductHandle}
                onChange={(e) => updateProduct(idx, "shopifyProductHandle", e.target.value)}
              />
            </div>
            <div>
              <label className="admin-form-label">Discount Badge (e.g. 15% OFF)</label>
              <input
                type="text"
                className="admin-form-input"
                value={prod.discountBadge ?? ""}
                onChange={(e) => updateProduct(idx, "discountBadge", e.target.value)}
              />
            </div>
            <div>
              <label className="admin-form-label">EMI Badge (e.g. EMI starts at ₹416/mo)</label>
              <input
                type="text"
                className="admin-form-input"
                value={prod.emiBadge ?? ""}
                onChange={(e) => updateProduct(idx, "emiBadge", e.target.value)}
              />
            </div>
          </div>
        </div>
      ))}

      <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
        <button type="button" className="admin-btn admin-btn-ghost" onClick={addProduct}>
          + Add Featured Product
        </button>
        <button
          type="button"
          className="admin-btn admin-btn-primary"
          onClick={handleSave}
          disabled={isPending}
          style={{ padding: "10px 24px" }}
        >
          {isPending ? "Saving to Sanity…" : "Save Shop Now Products"}
        </button>
      </div>
    </div>
  );
}

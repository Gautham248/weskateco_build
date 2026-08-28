"use client";

import { useState } from "react";
import Link from "next/link";
import { AdminProduct, AdminCollection } from "lib/admin/shopify-admin";

export function ProductBrowserClient({
  initialProducts,
  collections,
  currentQuery,
  currentCollection,
}: {
  initialProducts: AdminProduct[];
  collections: AdminCollection[];
  currentQuery: string;
  currentCollection: string;
}) {
  const [copiedHandle, setCopiedHandle] = useState<string | null>(null);

  function copyToClipboard(handle: string) {
    navigator.clipboard.writeText(handle);
    setCopiedHandle(handle);
    setTimeout(() => setCopiedHandle(null), 2000);
  }

  return (
    <div>
      {/* Filters Form */}
      <form method="GET" style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
        <div className="admin-search">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
          <input
            name="q"
            defaultValue={currentQuery}
            placeholder="Search products by title, vendor..."
            autoComplete="off"
            style={{ width: 320 }}
          />
        </div>

        <select
          name="collection"
          defaultValue={currentCollection}
          className="admin-select"
          style={{ width: 220 }}
          onChange={(e) => e.target.form?.submit()}
        >
          <option value="">All Collections</option>
          {collections.map((c) => (
            <option key={c.id} value={c.handle}>
              {c.title}
            </option>
          ))}
        </select>

        <button type="submit" className="admin-btn admin-btn-primary">
          Filter
        </button>
      </form>

      {/* Copy notification */}
      {copiedHandle && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            background: "var(--admin-accent)",
            color: "#0f172a",
            padding: "10px 18px",
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 13,
            zIndex: 999,
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          }}
        >
          Copied handle: <code>{copiedHandle}</code>
        </div>
      )}

      {/* Products Grid */}
      {initialProducts.length === 0 ? (
        <div className="admin-empty">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
            <path
              fillRule="evenodd"
              d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <h3>No products match filter</h3>
          <p>Try searching for a different query or clearing collection filters.</p>
        </div>
      ) : (
        <div className="admin-product-grid">
          {initialProducts.map((product) => (
            <div key={product.id} className="admin-product-card">
              <div className="admin-product-card-image">
                {product.featuredImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={product.featuredImage.url} alt={product.title} />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--admin-text-subtle)",
                      fontSize: 11,
                    }}
                  >
                    No image
                  </div>
                )}
              </div>
              <div className="admin-product-card-body">
                <div className="admin-product-card-title">{product.title}</div>
                <div className="admin-product-card-handle">{product.handle}</div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: 8,
                  }}
                >
                  <span className="admin-product-card-price">
                    ₹{parseFloat(product.priceRange.minVariantPrice.amount).toLocaleString("en-IN")}
                  </span>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button
                      type="button"
                      className="admin-copy-btn"
                      onClick={() => copyToClipboard(product.handle)}
                      title="Copy handle"
                    >
                      <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 10, height: 10 }}>
                        <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                        <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                      </svg>
                      Copy
                    </button>
                    <Link
                      href={`/en/product/${product.handle}`}
                      target="_blank"
                      className="admin-btn admin-btn-ghost admin-btn-sm"
                      title="View product page"
                      style={{ padding: "3px 6px" }}
                    >
                      ↗
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

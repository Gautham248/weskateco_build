import { requireAuth } from "lib/admin/actions/auth";
import Link from "next/link";

const homepageSections = [
  {
    href: "/admin/homepage/hero",
    title: "Hero Banner",
    desc: "Background media (video/image/gif), overlay toggle, CTA buttons",
    status: "Hardcoded",
    statusType: "warning",
  },
  {
    href: "/admin/homepage/newly-released",
    title: "Newly Released Carousel",
    desc: "Slide order, product links, board + wheel images, pricing",
    status: "Hardcoded",
    statusType: "warning",
  },
  {
    href: "/admin/homepage/shop-now",
    title: "Shop Now",
    desc: "Featured product cards, discount badges, EMI labels",
    status: "Static JSON",
    statusType: "warning",
  },
  {
    href: "/admin/homepage/categories",
    title: "Category Grid",
    desc: "Category tiles — title (EN/HI), background image, link",
    status: "Hardcoded",
    statusType: "warning",
  },
];

export default async function HomepageOverview() {
  await requireAuth();

  return (
    <>
      <div className="admin-topbar">
        <span className="admin-topbar-title">Homepage Sections</span>
        <div className="admin-topbar-right">
          <span
            className="admin-badge admin-badge-warning"
          >
            Phase 2: Wiring in progress
          </span>
        </div>
      </div>

      <div className="admin-content">
        <div className="admin-page-header">
          <h1>Homepage Sections</h1>
          <p>
            These sections currently use hardcoded data. They will be connected
            to Sanity in Phase 2, after which edits here will reflect on the live
            site.
          </p>
        </div>

        <div
          style={{
            background: "rgba(244, 165, 73, 0.08)",
            border: "1px solid rgba(244, 165, 73, 0.25)",
            borderRadius: "var(--admin-radius)",
            padding: "14px 18px",
            marginBottom: 24,
            fontSize: 13,
            color: "var(--admin-warning)",
            display: "flex",
            gap: 10,
            alignItems: "flex-start",
          }}
        >
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            style={{ width: 16, height: 16, flexShrink: 0, marginTop: 1 }}
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span>
            <strong>Frontend wiring pending.</strong> All edits made in these panels will only take
            effect after Phase 2 (Sanity data seeding + frontend component
            updates) is complete.
          </span>
        </div>

        <div className="admin-section-grid">
          {homepageSections.map((s) => (
            <Link key={s.href} href={s.href} className="admin-section-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div className="admin-section-card-title">{s.title}</div>
                <span className={`admin-badge admin-badge-${s.statusType}`}>
                  {s.status}
                </span>
              </div>
              <div className="admin-section-card-desc">{s.desc}</div>
              <div className="admin-section-card-meta">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                View Section
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

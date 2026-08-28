import { requireAuth } from "lib/admin/actions/auth";
import { AdminSidebar } from "./components/sidebar";
import "./admin.css";
import { ReactNode } from "react";
import { headers } from "next/headers";

export const metadata = {
  title: "Admin Panel | WeSkate Co",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";

  if (pathname === "/admin/login") {
    return (
      <html lang="en">
        <body>{children}</body>
      </html>
    );
  }

  await requireAuth();

  return (
    <html lang="en">
      <body>
        <div className="admin-root">
          <AdminSidebar />
          <div className="admin-main">{children}</div>
        </div>
      </body>
    </html>
  );
}

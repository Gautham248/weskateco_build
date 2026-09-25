import { AdminShell } from "components/admin/admin-shell";
import { requireAdmin } from "lib/admin/auth";
import type { ReactNode } from "react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await requireAdmin();

  return <AdminShell session={session}>{children}</AdminShell>;
}

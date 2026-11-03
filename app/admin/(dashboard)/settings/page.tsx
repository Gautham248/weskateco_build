import { listAdminUsers } from "lib/admin/queries";
import { SettingsForm } from "components/admin/settings-form";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin settings | WeSkate Co",
  robots: { index: false, follow: false },
};

export default async function AdminSettingsPage() {
  let users: { id: string; username: string; createdAt: string }[] = [];
  let loadError = false;

  try {
    const records = await listAdminUsers();
    users = records.map((record) => ({
      id: record.id,
      username: record.username,
      createdAt: record.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error("Could not list admin users:", error);
    loadError = true;
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-clash text-xl font-bold tracking-widest uppercase">
          Settings
        </h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Manage who can sign in and change product content.
        </p>
      </header>

      {loadError ? (
        <p
          role="alert"
          className="rounded-sm border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
        >
          Could not reach the database, so the account list is unavailable.
        </p>
      ) : null}

      <SettingsForm users={users} />
    </div>
  );
}

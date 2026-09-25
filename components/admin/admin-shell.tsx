import { logoutAction } from "lib/admin/actions";
import type { AdminSession } from "lib/admin/auth";
import Link from "next/link";
import type { ReactNode } from "react";
import { SidebarNav } from "./sidebar-nav";

export function AdminShell({
  session,
  children,
}: {
  session: AdminSession;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="flex shrink-0 flex-col gap-8 border-b border-neutral-200 bg-white px-5 py-6 md:w-64 md:border-r md:border-b-0 dark:border-neutral-800 dark:bg-black">
        <Link
          href="/admin/products"
          className="font-clash text-lg font-bold tracking-widest uppercase"
        >
          WeSkate Admin
        </Link>

        <SidebarNav />

        <div className="mt-auto space-y-3 border-t border-neutral-200 pt-5 dark:border-neutral-800">
          <div className="text-xs text-neutral-500 dark:text-neutral-400">
            Signed in as
            <span className="mt-0.5 block font-semibold text-black dark:text-white">
              {session.username}
            </span>
          </div>

          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full cursor-pointer rounded-sm border border-neutral-300 px-3 py-2 text-xs font-bold tracking-wider uppercase transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-900"
            >
              Sign out
            </button>
          </form>
        </div>
      </aside>

      <main className="min-w-0 flex-1 px-5 py-8 md:px-10 md:py-12">
        {children}
      </main>
    </div>
  );
}

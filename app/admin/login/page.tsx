import { LoginForm } from "components/admin/login-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin sign in | WeSkate Co",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <h1 className="font-clash text-2xl font-bold tracking-widest uppercase">
          WeSkate Admin
        </h1>
        <p className="mt-1 mb-8 text-sm text-neutral-500 dark:text-neutral-400">
          Sign in to manage product content.
        </p>
        <LoginForm />
      </div>
    </main>
  );
}

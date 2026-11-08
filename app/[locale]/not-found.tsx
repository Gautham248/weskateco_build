import Footer from "components/layout/footer";
import Link from "next/link";

// The footer is rendered per page in this app, not by the layout, so the
// not-found page has to include it the way every other page does.
export default function NotFound() {
  return (
    <>
      <main className="mx-auto flex min-h-[50vh] max-w-2xl flex-col items-center justify-center gap-6 px-4 py-24 text-center">
        <p className="text-sm font-semibold tracking-widest uppercase">404</p>
        <h1 className="text-3xl font-bold">We couldn&apos;t find that page</h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          The link may be old, or the page may have moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full bg-[#CCFF02] px-8 py-4 text-base font-semibold text-black transition-all duration-300 hover:scale-105 hover:brightness-95 active:scale-95"
        >
          Back to home
        </Link>
      </main>
      <Footer />
    </>
  );
}

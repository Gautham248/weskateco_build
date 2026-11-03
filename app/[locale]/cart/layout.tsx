import { createTranslator } from "lib/i18n";
import { openGraph, siteShareImage } from "lib/seo/metadata";
import type { Metadata } from "next";
import type { ReactNode } from "react";

// The cart page is a client component, so its metadata lives here. Shoppers'
// carts shouldn't appear in search results; links on the page can still be
// followed.
export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  const title = createTranslator(locale)("cart.title");
  return {
    title,
    robots: { index: false, follow: true },
    openGraph: openGraph(locale, "/cart", {
      title,
      images: siteShareImage(locale),
    }),
  };
}

export default function CartLayout({ children }: { children: ReactNode }) {
  return children;
}

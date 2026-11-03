import type { Metadata } from "next";
import type { ReactNode } from "react";

// The cart page is a client component, so its metadata lives here. Shoppers'
// carts shouldn't appear in search results; links on the page can still be
// followed.
export const metadata: Metadata = {
  title: "Cart",
  robots: { index: false, follow: true },
};

export default function CartLayout({ children }: { children: ReactNode }) {
  return children;
}

import { CartProvider } from "components/cart/cart-context";
import { Navbar } from "components/layout/navbar";
import { NavbarScrollWrapper } from "components/layout/navbar/navbar-scroll";
import { UnsupportedBrowserMessage } from "components/unsupported-browser";
// import { WelcomeToast } from "components/welcome-toast";
import { GeistSans } from "geist/font/sans";
import { GoogleAnalytics, MetaPixel } from "lib/analytics";
import { GoKwikScript } from "lib/gokwik";
import { GoKwikOrderWatcher } from "lib/gokwik/order-watcher";
import { getDictionary } from "lib/i18n";
import { TranslationProvider } from "lib/i18n/TranslationProvider";
import { SITE_NAME } from "lib/seo/metadata";
import { getCart } from "lib/shopify";
import { baseUrl, ensureStartsWith } from "lib/utils";
import { ReactNode } from "react";
import { Toaster } from "sonner";
import "../globals.css";

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  // Pages replace openGraph with their own (see lib/seo/metadata); these
  // apply to any page that doesn't set it
  openGraph: {
    siteName: SITE_NAME,
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    ...(process.env.TWITTER_SITE
      ? { site: ensureStartsWith(process.env.TWITTER_SITE, "@") }
      : {}),
    ...(process.env.TWITTER_CREATOR
      ? { creator: ensureStartsWith(process.env.TWITTER_CREATOR, "@") }
      : {}),
  },
  robots: {
    follow: true,
    index: true,
  },
};

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "hi" }];
}

export default async function RootLayout(props: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;
  const { children } = props;
  const cart = getCart();
  const dictionary = getDictionary(params.locale);

  return (
    <html lang={params.locale} className={`${GeistSans.variable}`}>
      <body className="bg-white text-black selection:bg-teal-300 dark:bg-neutral-900 dark:text-white dark:selection:bg-pink-500 dark:selection:text-white">
        <div className="site-root">
          <CartProvider cartPromise={cart}>
            <GoKwikOrderWatcher />
            <TranslationProvider locale={params.locale} dictionary={dictionary}>
              <NavbarScrollWrapper>
                <Navbar locale={params.locale} />
              </NavbarScrollWrapper>
              <main className="pt-[72px]">
                {children}
                <Toaster position="top-center" offset={56} closeButton />
                {/* <WelcomeToast /> */}
              </main>
            </TranslationProvider>
          </CartProvider>
        </div>
        {/* After the site in the document, so a reader that doesn't apply CSS
            sees the page's own content first; which of the two is shown is
            decided in globals.css, not by order */}
        <UnsupportedBrowserMessage locale={params.locale} />
        <GoKwikScript />
        <GoogleAnalytics />
        <MetaPixel />
      </body>
    </html>
  );
}

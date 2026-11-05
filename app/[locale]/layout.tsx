import { CartProvider } from "components/cart/cart-context";
import { Navbar } from "components/layout/navbar";
import { NavbarScrollWrapper } from "components/layout/navbar/navbar-scroll";
// import { WelcomeToast } from "components/welcome-toast";
import { GeistSans } from "geist/font/sans";
import { Noto_Sans_Devanagari } from "next/font/google";
import { GoogleAnalytics, MetaPixel } from "lib/analytics";
import { GoKwikScript } from "lib/gokwik";
import { GoKwikOrderWatcher } from "lib/gokwik/order-watcher";
import { getDictionary } from "lib/i18n";
import { TranslationProvider } from "lib/i18n/TranslationProvider";
import { getCart } from "lib/shopify";
import { baseUrl } from "lib/utils";
import { ReactNode } from "react";
import { Toaster } from "sonner";
import "../globals.css";

const SITE_NAME = process.env.SITE_NAME || "WeSkate Co";

// Archivo and Clash Display have no Devanagari glyphs, so Hindi text falls
// through to this face (see the font stacks in globals.css). Not preloaded:
// its unicode-range means English pages never download it.
const devanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  variable: "--font-devanagari",
  display: "swap",
  preload: false,
});

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: SITE_NAME!,
    template: `%s | ${SITE_NAME}`,
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
  const cart = getCart(undefined, params.locale);
  const dictionary = getDictionary(params.locale);

  return (
    <html
      lang={params.locale}
      className={`${GeistSans.variable} ${devanagari.variable}`}
    >
      <body className="bg-white text-black selection:bg-teal-300 dark:bg-neutral-900 dark:text-white dark:selection:bg-pink-500 dark:selection:text-white">
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
        <GoKwikScript />
        <GoogleAnalytics />
        <MetaPixel />
      </body>
    </html>
  );
}

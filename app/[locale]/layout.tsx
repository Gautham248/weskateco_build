import { CartProvider } from "components/cart/cart-context";
import { Navbar } from "components/layout/navbar";
import { NavbarScrollWrapper } from "components/layout/navbar/navbar-scroll";
import { WelcomeToast } from "components/welcome-toast";
import { GeistSans } from "geist/font/sans";
import { getCart } from "lib/shopify";
import { ReactNode } from "react";
import { Toaster } from "sonner";
import "./globals.css";
import { baseUrl } from "lib/utils";
import { TranslationProvider } from "lib/i18n/TranslationProvider";
import { getDictionary } from "lib/i18n";
import { GoKwikScript } from "lib/gokwik";

const { SITE_NAME } = process.env;

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
  const cart = getCart();
  const dictionary = getDictionary(params.locale);

  return (
    <html lang={params.locale} className={GeistSans.variable}>
      <link href="https://fontshare.com" rel="stylesheet" />
      <body className="bg-white text-black selection:bg-teal-300 dark:bg-neutral-900 dark:text-white dark:selection:bg-pink-500 dark:selection:text-white">
        <CartProvider cartPromise={cart}>
          <TranslationProvider locale={params.locale} dictionary={dictionary}>
            <NavbarScrollWrapper>
              <Navbar locale={params.locale} />
            </NavbarScrollWrapper>
            <main className="pt-[72px]">
              {children}
              <Toaster closeButton />
              <WelcomeToast />
            </main>
          </TranslationProvider>
        </CartProvider>
        <GoKwikScript />
      </body>
    </html>
  );
}

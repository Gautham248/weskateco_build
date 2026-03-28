# Day 3 — i18n Framework Implementation

Good, that's all I needed. Here's the Day 3 prompt:

---

**Task**: Implement the complete i18n (internationalization) framework for English and Hindi support across the WeSkate Co Next.js storefront.

**Context**: This is a Next.js 15.6.0-canary.60 App Router project forked from Vercel Commerce, connected to a Shopify store. All routes live under `app/[locale]/`. There is already a `proxy.ts` at the project root that handles locale detection but currently redirects (showing `/en/` in the URL bar). We need clean URLs for the default locale (English) and explicit `/hi/` prefix for Hindi. The project uses experimental Next.js canary features.

**Supported locales**: `en` (default), `hi` (Hindi). Both are LTR — no RTL support needed.

---

## CHANGE 1: Update `proxy.ts` (project root)

Replace the entire contents of `proxy.ts` with:

```typescript
import { NextRequest, NextResponse } from "next/server";

const locales = ["en", "hi"];
const defaultLocale = "en";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static assets, API routes, and Next.js internals
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/robots.txt") ||
    pathname.startsWith("/sitemap.xml") ||
    pathname.startsWith("/studio") // Sanity Studio (future)
  ) {
    return NextResponse.next();
  }

  // Check if pathname already has a locale prefix
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    // Extract locale and set header for downstream use
    const locale = pathname.split("/")[1];
    const response = NextResponse.next();
    response.headers.set("x-locale", locale!);
    return response;
  }

  // No locale in path — rewrite (not redirect) to default locale
  // This keeps clean URLs: /products/deck stays as /products/deck in the browser
  // but internally routes to /en/products/deck
  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname}`;
  const response = NextResponse.rewrite(url);
  response.headers.set("x-locale", defaultLocale);
  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
```

**Key change**: `NextResponse.redirect` → `NextResponse.rewrite` for the default locale. This means `/products/deck` stays as `/products/deck` in the browser URL bar but internally routes to `/en/products/deck`. Visiting `/hi/products/deck` explicitly shows the `/hi/` prefix. The `x-locale` header is set on every request for downstream use.

---

### CHANGE 2: Create translation JSON files

**Create file**: `locales/en.json`

```json
{
  "nav.home": "Home",
  "nav.shop": "Shop",
  "nav.skateboards": "Skateboards",
  "nav.surfskates": "Surfskates",
  "nav.apparel": "Apparel",
  "nav.protective_gear": "Protective Gear",
  "nav.academy": "Academy",
  "nav.skateparks": "Skateparks",
  "nav.artists": "Artists",
  "nav.brands": "Brands",
  "nav.team": "Team",
  "nav.community": "Community",
  "nav.buying_guide": "Buying Guide",
  "nav.search": "Search",

  "cart.title": "Your Cart",
  "cart.empty": "Your cart is empty",
  "cart.checkout": "Checkout",
  "cart.subtotal": "Subtotal",
  "cart.taxes": "Taxes",
  "cart.shipping": "Shipping",
  "cart.total": "Total",
  "cart.remove": "Remove",
  "cart.close": "Close cart",
  "cart.open": "Open cart",
  "cart.quantity": "Quantity",
  "cart.increase": "Increase quantity",
  "cart.decrease": "Decrease quantity",

  "product.add_to_cart": "Add To Cart",
  "product.out_of_stock": "Out Of Stock",
  "product.select_option": "Please select an option",
  "product.related": "Related Products",
  "product.description": "Description",
  "product.size_guide": "Size Guide",
  "product.compatibility": "What works with this",
  "product.emi_available": "EMI options available",

  "configurator.title": "Build Your Setup",
  "configurator.step1": "Choose Board Type",
  "configurator.step2": "Choose Your Deck",
  "configurator.step3": "Choose Your Trucks",
  "configurator.step4": "Choose Your Wheels",
  "configurator.step5": "Choose Your Bearings",
  "configurator.step6": "Choose Your Griptape",
  "configurator.step7": "Riser Pads (Optional)",
  "configurator.step8": "Choose Your Hardware",
  "configurator.step9": "Review Your Build",
  "configurator.add_to_cart": "Add Complete Setup to Cart",
  "configurator.total": "Setup Total",
  "configurator.compatible": "Compatible with your selection",
  "configurator.incompatible": "Not compatible",
  "configurator.recommended": "Recommended",
  "configurator.back": "Back",
  "configurator.next": "Next Step",

  "configurator.board_type.skateboard": "Skateboard",
  "configurator.board_type.surfskate": "Surfskate",
  "configurator.board_type.longboard": "Longboard",
  "configurator.board_type.old_school": "Old School",
  "configurator.board_type.cruiser": "Cruiser",

  "academy.title": "WeSkate Academy",
  "academy.book_session": "Book a Session",
  "academy.programmes": "Programmes",
  "academy.instructors": "Instructors",

  "skateparks.title": "WB Skateparks",
  "skateparks.progress": "Construction Progress",
  "skateparks.enquiry": "Get a Quote",
  "skateparks.status.planning": "Planning",
  "skateparks.status.design": "Design",
  "skateparks.status.foundation": "Foundation",
  "skateparks.status.construction": "Construction",
  "skateparks.status.finishing": "Finishing",
  "skateparks.status.complete": "Complete",

  "artists.title": "Artist Collaborations",
  "artists.shop_collection": "Shop the Collection",
  "artists.coming_soon": "Coming Soon",

  "brands.title": "Authorised Brands",
  "brands.official_distributor": "Official Indian Distributor",

  "team.title": "WeSkate Team",
  "team.community_rider": "Community Rider",
  "team.team_rider": "Team Rider",
  "team.ambassador": "Ambassador",

  "ugc.title": "Community Gallery",
  "ugc.share_prompt": "Tag @weskateco on Instagram to get featured",
  "ugc.featured": "Featured",

  "community.title": "Community Stories",
  "community.read_more": "Read Story",

  "forms.name": "Name",
  "forms.email": "Email",
  "forms.phone": "Phone",
  "forms.message": "Message",
  "forms.submit": "Submit",
  "forms.submitting": "Submitting...",
  "forms.success": "Thank you! We will get back to you soon.",
  "forms.error": "Something went wrong. Please try again.",
  "forms.required": "This field is required",

  "search.title": "Search",
  "search.placeholder": "Search for products...",
  "search.no_results": "No results found",
  "search.results_for": "Results for",

  "common.loading": "Loading...",
  "common.error": "Something went wrong",
  "common.back": "Back",
  "common.next": "Next",
  "common.view_all": "View All",
  "common.learn_more": "Learn More",
  "common.share": "Share",
  "common.language": "Language",
  "common.english": "English",
  "common.hindi": "हिन्दी",

  "footer.copyright": "© 2026 WeSkate Co. All rights reserved.",
  "footer.privacy": "Privacy Policy",
  "footer.terms": "Terms of Service",
  "footer.refund": "Refund Policy",
  "footer.shipping": "Shipping Policy",
  "footer.contact": "Contact Us"
}
```

**Create file**: `locales/hi.json`

```json
{
  "nav.home": "होम",
  "nav.shop": "शॉप",
  "nav.skateboards": "स्केटबोर्ड",
  "nav.surfskates": "सर्फस्केट",
  "nav.apparel": "कपड़े",
  "nav.protective_gear": "सुरक्षा गियर",
  "nav.academy": "अकादमी",
  "nav.skateparks": "स्केटपार्क",
  "nav.artists": "कलाकार",
  "nav.brands": "ब्रांड्स",
  "nav.team": "टीम",
  "nav.community": "समुदाय",
  "nav.buying_guide": "खरीदारी गाइड",
  "nav.search": "खोजें",

  "cart.title": "आपकी कार्ट",
  "cart.empty": "आपकी कार्ट खाली है",
  "cart.checkout": "चेकआउट",
  "cart.subtotal": "उप-योग",
  "cart.taxes": "कर",
  "cart.shipping": "शिपिंग",
  "cart.total": "कुल",
  "cart.remove": "हटाएं",
  "cart.close": "कार्ट बंद करें",
  "cart.open": "कार्ट खोलें",
  "cart.quantity": "मात्रा",
  "cart.increase": "मात्रा बढ़ाएं",
  "cart.decrease": "मात्रा घटाएं",

  "product.add_to_cart": "कार्ट में जोड़ें",
  "product.out_of_stock": "स्टॉक में नहीं",
  "product.select_option": "कृपया एक विकल्प चुनें",
  "product.related": "संबंधित उत्पाद",
  "product.description": "विवरण",
  "product.size_guide": "साइज़ गाइड",
  "product.compatibility": "इसके साथ क्या काम करता है",
  "product.emi_available": "EMI विकल्प उपलब्ध",

  "configurator.title": "अपना सेटअप बनाएं",
  "configurator.step1": "बोर्ड प्रकार चुनें",
  "configurator.step2": "अपना डेक चुनें",
  "configurator.step3": "अपने ट्रक चुनें",
  "configurator.step4": "अपने व्हील चुनें",
  "configurator.step5": "अपने बेयरिंग चुनें",
  "configurator.step6": "अपना ग्रिपटेप चुनें",
  "configurator.step7": "राइज़र पैड (वैकल्पिक)",
  "configurator.step8": "अपना हार्डवेयर चुनें",
  "configurator.step9": "अपना बिल्ड रिव्यू करें",
  "configurator.add_to_cart": "पूरा सेटअप कार्ट में जोड़ें",
  "configurator.total": "सेटअप कुल",
  "configurator.compatible": "आपके चयन के अनुकूल",
  "configurator.incompatible": "अनुकूल नहीं",
  "configurator.recommended": "अनुशंसित",
  "configurator.back": "पीछे",
  "configurator.next": "अगला कदम",

  "configurator.board_type.skateboard": "स्केटबोर्ड",
  "configurator.board_type.surfskate": "सर्फस्केट",
  "configurator.board_type.longboard": "लॉन्गबोर्ड",
  "configurator.board_type.old_school": "ओल्ड स्कूल",
  "configurator.board_type.cruiser": "क्रूज़र",

  "academy.title": "वीस्केट अकादमी",
  "academy.book_session": "सत्र बुक करें",
  "academy.programmes": "कार्यक्रम",
  "academy.instructors": "प्रशिक्षक",

  "skateparks.title": "WB स्केटपार्क",
  "skateparks.progress": "निर्माण प्रगति",
  "skateparks.enquiry": "कोटेशन प्राप्त करें",
  "skateparks.status.planning": "योजना",
  "skateparks.status.design": "डिज़ाइन",
  "skateparks.status.foundation": "नींव",
  "skateparks.status.construction": "निर्माण",
  "skateparks.status.finishing": "फिनिशिंग",
  "skateparks.status.complete": "पूर्ण",

  "artists.title": "कलाकार सहयोग",
  "artists.shop_collection": "कलेक्शन खरीदें",
  "artists.coming_soon": "जल्द आ रहा है",

  "brands.title": "अधिकृत ब्रांड्स",
  "brands.official_distributor": "आधिकारिक भारतीय वितरक",

  "team.title": "वीस्केट टीम",
  "team.community_rider": "कम्युनिटी राइडर",
  "team.team_rider": "टीम राइडर",
  "team.ambassador": "एम्बेसडर",

  "ugc.title": "सामुदायिक गैलरी",
  "ugc.share_prompt": "फीचर होने के लिए Instagram पर @weskateco टैग करें",
  "ugc.featured": "फीचर्ड",

  "community.title": "सामुदायिक कहानियां",
  "community.read_more": "कहानी पढ़ें",

  "forms.name": "नाम",
  "forms.email": "ईमेल",
  "forms.phone": "फ़ोन",
  "forms.message": "संदेश",
  "forms.submit": "जमा करें",
  "forms.submitting": "जमा हो रहा है...",
  "forms.success": "धन्यवाद! हम जल्द ही आपसे संपर्क करेंगे।",
  "forms.error": "कुछ गलत हो गया। कृपया पुनः प्रयास करें।",
  "forms.required": "यह फ़ील्ड आवश्यक है",

  "search.title": "खोजें",
  "search.placeholder": "उत्पाद खोजें...",
  "search.no_results": "कोई परिणाम नहीं मिला",
  "search.results_for": "परिणाम",

  "common.loading": "लोड हो रहा है...",
  "common.error": "कुछ गलत हो गया",
  "common.back": "पीछे",
  "common.next": "आगे",
  "common.view_all": "सभी देखें",
  "common.learn_more": "और जानें",
  "common.share": "शेयर करें",
  "common.language": "भाषा",
  "common.english": "English",
  "common.hindi": "हिन्दी",

  "footer.copyright": "© 2026 वीस्केट कंपनी। सर्वाधिकार सुरक्षित।",
  "footer.privacy": "गोपनीयता नीति",
  "footer.terms": "सेवा की शर्तें",
  "footer.refund": "रिफंड नीति",
  "footer.shipping": "शिपिंग नीति",
  "footer.contact": "संपर्क करें"
}
```

---

### CHANGE 3: Create the translation utility

**Create file**: `lib/i18n/index.ts`

```typescript
import en from "@/locales/en.json";
import hi from "@/locales/hi.json";

export const locales = ["en", "hi"] as const;
export const defaultLocale = "en" as const;
export type Locale = (typeof locales)[number];

const dictionaries: Record<string, Record<string, string>> = { en, hi };

/**
 * Get a translated string by key.
 * Falls back to English if the key is missing in the target locale.
 * Falls back to the key itself if missing in all locales.
 */
export function getTranslation(locale: string, key: string): string {
  return dictionaries[locale]?.[key] || dictionaries[defaultLocale]?.[key] || key;
}

/**
 * Create a translator function bound to a specific locale.
 * Use in Server Components:
 *
 *   const t = createTranslator(locale);
 *   return <h1>{t("nav.home")}</h1>;
 */
export function createTranslator(locale: string) {
  return (key: string): string => getTranslation(locale, key);
}

/**
 * Get the full dictionary for a locale.
 * Useful for passing to client-side TranslationProvider.
 */
export function getDictionary(locale: string): Record<string, string> {
  return dictionaries[locale] || dictionaries[defaultLocale]!;
}

/**
 * Get a localized field from a Sanity document.
 * Sanity documents use the pattern: title_en, title_hi
 *
 *   getLocalizedField(doc, "title", "hi") → doc.title_hi || doc.title_en
 */
export function getLocalizedField(
  doc: Record<string, any>,
  field: string,
  locale: string
): string {
  return doc[`${field}_${locale}`] || doc[`${field}_${defaultLocale}`] || doc[field] || "";
}
```

**Create file**: `lib/i18n/TranslationProvider.tsx`

```typescript
"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";

type TranslationContextType = {
  t: (key: string) => string;
  locale: string;
};

const TranslationContext = createContext<TranslationContextType>({
  t: (key: string) => key,
  locale: "en",
});

export function TranslationProvider({
  locale,
  dictionary,
  children,
}: {
  locale: string;
  dictionary: Record<string, string>;
  children: ReactNode;
}) {
  const value = useMemo(() => {
    const t = (key: string) => dictionary[key] || key;
    return { t, locale };
  }, [locale, dictionary]);

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
}

/**
 * Use in Client Components:
 *
 *   const { t, locale } = useTranslation();
 *   return <button>{t("product.add_to_cart")}</button>;
 */
export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error("useTranslation must be used within a TranslationProvider");
  }
  return context;
}
```

---

### CHANGE 4: Create the Language Switcher component

**Create file**: `components/layout/language-switcher.tsx`

```typescript
"use client";

import { usePathname } from "next/navigation";
import { useTranslation } from "@/lib/i18n/TranslationProvider";

const localeNames: Record<string, string> = {
  en: "English",
  hi: "हिन्दी",
};

export function LanguageSwitcher() {
  const pathname = usePathname();
  const { locale: currentLocale } = useTranslation();

  function getLocalizedPath(targetLocale: string): string {
    // Remove current locale prefix if present
    let path = pathname;
    const locales = ["en", "hi"];
    for (const loc of locales) {
      if (path.startsWith(`/${loc}/`)) {
        path = path.substring(loc.length + 1);
        break;
      } else if (path === `/${loc}`) {
        path = "/";
        break;
      }
    }

    // For default locale (en), use clean URL (no prefix)
    if (targetLocale === "en") {
      return path || "/";
    }

    // For other locales, add prefix
    return `/${targetLocale}${path}`;
  }

  const targetLocale = currentLocale === "en" ? "hi" : "en";

  return (
    
      href={getLocalizedPath(targetLocale)}
      className="text-sm text-neutral-500 underline-offset-4 hover:text-black hover:underline dark:text-neutral-400 dark:hover:text-neutral-300"
      aria-label={`Switch to ${localeNames[targetLocale]}`}
    >
      {localeNames[targetLocale]}
    </a>
  );
}
```

---

### CHANGE 5: Wire i18n into the root layout

**Modify file**: `app/[locale]/layout.tsx`

Update the layout to include the `TranslationProvider` wrapping all children, and pass the dictionary for the current locale. Also set the correct `lang` attribute on the `<html>` tag.

Find the current imports section and add:

```typescript
import { TranslationProvider } from "@/lib/i18n/TranslationProvider";
import { getDictionary } from "@/lib/i18n";
```

Find the `RootLayout` component. Make these changes:

1. Get the dictionary for the current locale:

```typescript
const dictionary = getDictionary(params.locale);
```

1. Change `<html lang="en"` to use the dynamic locale:

```typescript
<html lang={params.locale} className={GeistSans.variable}>
```

1. Wrap the content inside `CartProvider` with `TranslationProvider`:

```typescript
<CartProvider cartPromise={cart}>
  <TranslationProvider locale={params.locale} dictionary={dictionary}>
    <Navbar />
    <main>
      {children}
      <Toaster closeButton />
      <WelcomeToast />
    </main>
  </TranslationProvider>
</CartProvider>
```

The full updated layout should look like:

```typescript
import { CartProvider } from "components/cart/cart-context";
import { Navbar } from "components/layout/navbar";
import { WelcomeToast } from "components/welcome-toast";
import { GeistSans } from "geist/font/sans";
import { getCart } from "lib/shopify";
import { ReactNode } from "react";
import { Toaster } from "sonner";
import "./globals.css";
import { baseUrl } from "lib/utils";
import { TranslationProvider } from "@/lib/i18n/TranslationProvider";
import { getDictionary } from "@/lib/i18n";

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
      <body className="bg-neutral-50 text-black selection:bg-teal-300 dark:bg-neutral-900 dark:text-white dark:selection:bg-pink-500 dark:selection:text-white">
        <CartProvider cartPromise={cart}>
          <TranslationProvider locale={params.locale} dictionary={dictionary}>
            <Navbar />
            <main>
              {children}
              <Toaster closeButton />
              <WelcomeToast />
            </main>
          </TranslationProvider>
        </CartProvider>
      </body>
    </html>
  );
}
```

---

### CHANGE 6: Add `@/` path alias if not already configured

Check `tsconfig.json` for a `paths` configuration. If there is no `@/*` alias, add it:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

If there's already a `@/` or similar alias, use whatever alias convention the project already uses for the new imports. Adjust all `@/lib/i18n/...` and `@/locales/...` imports accordingly to match the existing project convention.

If the project uses bare imports like `lib/i18n` without an alias (as seen in the existing codebase with `import { getCart } from "lib/shopify"`), then change all the imports in the new files to match:

- `import en from "locales/en.json"` instead of `import en from "@/locales/en.json"`
- `import { TranslationProvider } from "lib/i18n/TranslationProvider"` instead of `import { TranslationProvider } from "@/lib/i18n/TranslationProvider"`
- And so on for all new imports

**Match the existing import convention used in the rest of the codebase. Do not introduce a new alias pattern.**

---

### VERIFICATION

1. Run `pnpm build` — should compile without errors
2. Run `pnpm dev`
3. Navigate to `localhost:3000` — should render the site normally with English content. The URL should NOT show `/en/` prefix (clean URLs for default locale).
4. Navigate to `localhost:3000/hi/` — should render the same site. The `<html>` tag should have `lang="hi"`.
5. Navigate to `localhost:3000/hi/search` — search page should render in the Hindi context.
6. Navigate back to `localhost:3000/search` — should work as English (no `/en/` prefix).
7. Check that the cart still works correctly (add item, remove item, quantity changes) — the TranslationProvider wrapping must not break the CartProvider.
8. Verify no console errors related to missing context providers or hydration mismatches.

**Note**: At this stage, the existing Vercel Commerce components (Navbar, cart, product pages) still use hardcoded English strings. That is expected. The i18n infrastructure is in place — we will progressively migrate components to use `useTranslation()` / `createTranslator()` as we build each feature. The purpose of Day 3 is to ensure the framework is wired correctly, not to translate every existing component.

### FILES CREATED

- `locales/en.json`
- `locales/hi.json`
- `lib/i18n/index.ts`
- `lib/i18n/TranslationProvider.tsx`
- `components/layout/language-switcher.tsx`

### FILES MODIFIED

- `proxy.ts` (rewrite instead of redirect for default locale, add x-locale header)
- `app/[locale]/layout.tsx` (add TranslationProvider, dynamic lang attribute)

List every file created and modified when done.

---

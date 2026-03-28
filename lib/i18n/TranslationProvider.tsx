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

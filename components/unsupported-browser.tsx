import { createTranslator } from "lib/i18n";

/**
 * Shown instead of the site in browsers below our support floor.
 * Visibility is handled purely in CSS (see "Unsupported-browser fallback" in
 * globals.css), so it works even where our JavaScript can't run.
 */
export function UnsupportedBrowserMessage({ locale }: { locale: string }) {
  const t = createTranslator(locale);

  return (
    <div className="unsupported-browser" data-nosnippet>
      {/* Not an h1: this is in every page's markup, and each page has its own */}
      <h2>{t("unsupported_browser.title")}</h2>
      <p>{t("unsupported_browser.body")}</p>
    </div>
  );
}

import { createTranslator } from "lib/i18n";

/**
 * Shown instead of the site in browsers below our support floor.
 * Visibility is handled purely in CSS (see "Unsupported-browser fallback" in
 * globals.css), so it works even where our JavaScript can't run.
 *
 * The heading is an h2, not an h1: this markup is on every page, hidden by CSS
 * in supported browsers, and each page already has its own h1. An h1 here gave
 * every page two, which crawlers count whether or not the element is visible.
 */
export function UnsupportedBrowserMessage({ locale }: { locale: string }) {
  const t = createTranslator(locale);

  return (
    <div className="unsupported-browser" data-nosnippet>
      <h2>{t("unsupported_browser.title")}</h2>
      <p>{t("unsupported_browser.body")}</p>
    </div>
  );
}

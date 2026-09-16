import { getShopNow } from "lib/catalog/shop-now-feed";
import { getLocalizedPath } from "lib/i18n";
import Link from "next/link";
import ShopNowContent from "./shop-now-content";

export default async function ShopNow({ locale }: { locale: string }) {
  const slides = await getShopNow();

  if (slides.length === 0) {
    return null;
  }

  // Calculates dynamic alignment padding relative to a 1536px max-width container
  const trackPadding = "var(--track-padding)";

  return (
    <section className="shop-now-section w-full overflow-hidden py-15 md:py-30">
      {/* Header aligned dynamically using trackPadding */}
      <div
        className="mb-6 md:mb-10 flex justify-between w-full items-center"
        style={{ paddingLeft: trackPadding, paddingRight: trackPadding }}
      >
        <h2
          className="text-[clamp(1.5rem,5vw,2.8125rem)] leading-[clamp(1.5rem,5vw,2.8125rem)] font-black tracking-tight text-black dark:text-white uppercase"
          style={{
            fontFamily: "'Clash Display', sans-serif",
            letterSpacing: "-0.01em",
          }}
        >
          SHOP NOW
        </h2>
        <Link
          href={getLocalizedPath("/store", locale)}
          className="text-[14px] md:text-[18px] lg:text-[24px] font-bold tracking-[-0.01em] text-black hover:opacity-70 dark:text-white uppercase underline decoration-solid underline-offset-1 skip-ink-auto"
          style={{ fontFamily: "'Clash Display', sans-serif" }}
        >
          VIEW MORE
        </Link>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
          .shop-now-section {
            --track-padding: 1rem;
          }
          @media (min-width: 1024px) {
            .shop-now-section {
              --track-padding: max(3.75rem, calc((100vw - 1536px) / 2 + 3.75rem));
            }
          }
          div::-webkit-scrollbar {
            display: none !important;
          }
        `,
        }}
      />

      <ShopNowContent slides={slides} locale={locale} />
    </section>
  );
}

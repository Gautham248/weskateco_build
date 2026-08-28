import { getSiteSettings } from "lib/sanity/queries";

export async function AnnouncementBar({ locale }: { locale: string }) {
  const settings = await getSiteSettings();

  if (!settings || settings.announcementBarEnabled === false) {
    return null;
  }

  const text =
    locale === "hi"
      ? settings.announcementBar_hi || "₹2,999 से अधिक के सभी ऑर्डर पर मुफ़्त शिपिंग | भारत में निर्मित"
      : settings.announcementBar_en || "FREE SHIPPING ON ALL ORDERS OVER ₹2,999 | MADE IN INDIA";

  return (
    <div className="bg-neutral-900 text-neutral-100 text-xs font-semibold py-2 px-4 text-center tracking-widest uppercase border-b border-neutral-800 z-50 relative">
      <div className="mx-auto max-w-(--breakpoint-2xl) flex items-center justify-center gap-2">
        <span>⚡</span>
        <span>{text}</span>
      </div>
    </div>
  );
}

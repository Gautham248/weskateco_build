"use client";

import fb from "components/icons/fb.svg";
import insta from "components/icons/insta.svg";
import yt from "components/icons/yt.svg";
import type { SocialLinks } from "lib/sanity/types";

/**
 * The footer's social links.
 *
 * These were hardcoded to bare platform URLs — `https://instagram.com`,
 * `https://facebook.com`, `https://youtube.com` — which send people to each
 * platform's own homepage instead of the brand's profile. The real handles live
 * in Sanity under `siteSettings.socialLinks` and are read by the server
 * Footer wrapper.
 *
 * Platforms are rendered in a fixed order rather than iterated, so the icons
 * stay in the layout they have always had regardless of which handles exist.
 */
type SocialKey = "instagram" | "facebook" | "youtube" | "twitter";

const ORDER: SocialKey[] = ["instagram", "facebook", "youtube", "twitter"];

/**
 * Last-resort fallbacks, used only when the CMS has no handle configured.
 *
 * Deliberately the brand's handles rather than the bare platform roots, since
 * the bare-root case is exactly what this component replaced.
 */
const FALLBACKS: Record<SocialKey, string> = {
  instagram: "https://instagram.com/weskateco",
  facebook: "https://facebook.com/weskateco",
  youtube: "https://youtube.com/@weskateco",
  twitter: "https://twitter.com/weskateco",
};

/**
 * X has no icon in components/icons. Rather than hand-draw the logo — an
 * approximation of a real brand mark looks wrong and raises licensing questions
 * — it renders as a text link, which reads as deliberate rather than missing.
 */
const ICONS: Partial<Record<SocialKey, { src: { src: string } }>> = {
  instagram: { src: insta },
  facebook: { src: fb },
  youtube: { src: yt },
};

const NAMES: Record<SocialKey, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  youtube: "YouTube",
  twitter: "X",
};

function resolve(links: SocialLinks, key: SocialKey): string {
  const configured = links[key];
  const trimmed = typeof configured === "string" ? configured.trim() : "";
  return trimmed !== "" ? trimmed : FALLBACKS[key];
}

/** A single link, icon where one exists and text otherwise. */
function SocialLink({
  socialKey,
  href,
  className,
  iconClassName,
}: {
  socialKey: SocialKey;
  href: string;
  className: string;
  iconClassName: string;
}) {
  const icon = ICONS[socialKey];

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={NAMES[socialKey]}
      className={className}
    >
      {icon ? (
        <img
          src={icon.src.src}
          alt=""
          aria-hidden="true"
          className={iconClassName}
        />
      ) : (
        <span className="text-lg font-bold leading-none">
          {NAMES[socialKey]}
        </span>
      )}
    </a>
  );
}

/** Desktop icon row. */
export function FooterSocialLinks({ links }: { links: SocialLinks }) {
  return (
    <div className="flex items-center gap-6 text-white self-end md:self-end">
      {ORDER.map((key) => (
        <SocialLink
          key={key}
          socialKey={key}
          href={resolve(links, key)}
          className="hover:text-neutral-400 transition-colors"
          iconClassName="h-6 w-6"
        />
      ))}
    </div>
  );
}

/** Mobile row. Same links, text-sized icons. */
export function FooterSocialLinksMobile({ links }: { links: SocialLinks }) {
  return (
    <div className="flex md:hidden items-center gap-6 text-white mb-8">
      {ORDER.map((key) => (
        <SocialLink
          key={key}
          socialKey={key}
          href={resolve(links, key)}
          className="hover:text-neutral-400 transition-colors"
          iconClassName="h-5 w-auto"
        />
      ))}
    </div>
  );
}

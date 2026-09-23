import { ANCHOR_NAV } from "lib/griptape-guide/data";

/** Sticky jump-link strip — sticks below the fixed 72px site navbar. */
export default function GripAnchorNav() {
  return (
    <nav
      aria-label="Section navigation"
      className="sticky top-[72px] z-30 w-full bg-white border-b border-neutral-100"
    >
      <div className="mx-auto max-w-(--breakpoint-2xl) px-4 lg:px-15">
        <ul className="flex items-center gap-5 md:gap-8 overflow-x-auto py-4 md:py-5">
          {ANCHOR_NAV.map((item) => (
            <li key={item.href} className="shrink-0">
              <a
                href={item.href}
                className="text-xs md:text-sm font-semibold uppercase tracking-wider text-black hover:text-neutral-500 transition-colors whitespace-nowrap"
                style={{ fontFamily: "'Clash Display', sans-serif" }}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

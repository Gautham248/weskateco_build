"use client";

import { getLocalizedPath } from "lib/i18n";
import { useParams } from "next/navigation";
import { useState } from "react";
import catalog from "scripts/product-catalog-dump.json";

function SkateboardIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 311 311"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M98.8198 208.565C95.2574 208.889 91.6815 208.108 88.5788 206.328C85.4761 204.547 82.9974 201.854 81.4798 198.615C79.9623 195.376 79.4797 191.748 80.0977 188.224C80.7157 184.701 82.4044 181.453 84.9338 178.924C87.4632 176.395 90.7106 174.706 94.234 174.088C97.7573 173.47 101.386 173.952 104.625 175.47C107.864 176.988 110.557 179.466 112.338 182.569C114.118 185.672 114.899 189.248 114.574 192.81C114.205 196.864 112.427 200.66 109.548 203.539C106.67 206.417 102.874 208.195 98.8198 208.565ZM98.0321 181.219C95.9899 181.057 93.9471 181.525 92.1791 182.559C90.4111 183.594 89.0029 185.146 88.1445 187.006C87.2861 188.866 87.0188 190.945 87.3785 192.962C87.7382 194.979 88.7078 196.836 90.1563 198.285C91.6049 199.734 93.4628 200.703 95.4796 201.063C97.4964 201.423 99.5749 201.155 101.435 200.297C103.295 199.438 104.847 198.03 105.882 196.262C106.917 194.494 107.385 192.451 107.222 190.409C107.018 188.044 105.983 185.828 104.301 184.153C102.619 182.477 100.398 181.452 98.0321 181.257V181.219Z"
        fill="currentColor"
      />
      <path
        d="M215.539 208.565C211.976 208.889 208.4 208.108 205.298 206.328C202.195 204.547 199.716 201.854 198.199 198.615C196.681 195.376 196.198 191.748 196.816 188.224C197.434 184.701 199.123 181.453 201.653 178.924C204.182 176.395 207.429 174.706 210.953 174.088C214.476 173.47 218.104 173.952 221.344 175.47C224.583 176.988 227.276 179.466 229.056 182.569C230.837 185.672 231.618 189.248 231.293 192.81C230.924 196.864 229.145 200.66 226.267 203.539C223.389 206.417 219.592 208.195 215.539 208.565ZM214.751 181.219C212.709 181.057 210.666 181.525 208.898 182.559C207.13 183.594 205.722 185.146 204.863 187.006C204.005 188.866 203.738 190.945 204.097 192.962C204.457 194.979 205.427 196.836 206.875 198.285C208.324 199.734 210.182 200.703 212.198 201.063C214.215 201.423 216.294 201.155 218.154 200.297C220.014 199.438 221.566 198.03 222.601 196.262C223.636 194.494 224.103 192.451 223.941 190.409C223.733 188.026 222.682 185.796 220.977 184.118C219.272 182.441 217.024 181.426 214.638 181.257L214.751 181.219Z"
        fill="currentColor"
      />
      <path
        d="M97.1992 196.531C100.12 196.531 102.488 194.163 102.488 191.242C102.488 188.321 100.12 185.953 97.1992 185.953C94.2781 185.953 91.9102 188.321 91.9102 191.242C91.9102 194.163 94.2781 196.531 97.1992 196.531Z"
        fill="currentColor"
      />
      <path
        d="M213.863 196.531C216.784 196.531 219.152 194.163 219.152 191.242C219.152 188.321 216.784 185.953 213.863 185.953C210.942 185.953 208.574 188.321 208.574 191.242C208.574 194.163 210.942 196.531 213.863 196.531Z"
        fill="currentColor"
      />
      <path
        d="M273.206 142.807C272.795 141.56 272.141 140.407 271.281 139.416C270.421 138.424 269.372 137.613 268.196 137.03C267.02 136.447 265.739 136.104 264.429 136.02C263.119 135.937 261.805 136.114 260.564 136.543L238.283 144.045C237.348 144.331 236.396 144.556 235.432 144.721C232.71 145.224 229.948 145.475 227.18 145.471H83.7751C81.0071 145.475 78.2446 145.224 75.5227 144.721C74.559 144.556 73.6068 144.331 72.6719 144.045L50.5029 136.543C48.0623 135.879 45.4602 136.174 43.2302 137.367C41.0002 138.561 39.3113 140.562 38.5101 142.961C37.7088 145.36 37.8558 147.975 38.921 150.269C39.9862 152.563 41.8888 154.363 44.2385 155.299L66.445 162.801C76.29 166.085 86.6008 167.757 96.979 167.752H214.163C224.541 167.757 234.852 166.085 244.697 162.801L266.904 155.299C269.394 154.476 271.456 152.698 272.638 150.356C273.819 148.015 274.024 145.3 273.206 142.807Z"
        fill="currentColor"
      />
    </svg>
  );
}

const navigation =
  "navigation" in catalog ? (catalog as any).navigation : undefined;
const subItemsMap: Record<string, string[]> = {};
if (navigation) {
  const hrefMap: Record<string, string> = {
    SKATEBOARDS: "/store/skateboards",
    SURFSKATES: "/store/surfskates",
    APPAREL: "/store/apparel-1",
    "PROTECTIVE GEARS": "/store/protection-gears",
    BRANDS: "/store",
  };
  for (const cat of navigation.categories) {
    const href = hrefMap[cat.name];
    if (href && cat.items.length > 0) {
      subItemsMap[href] = cat.items;
    }
  }
}

export function hasSubItems(category: string | null): boolean {
  return !!category && category in subItemsMap;
}

export default function MegaMenuSubItems({
  category,
}: {
  category: string | null;
}) {
  const params = useParams();
  const locale = (params?.locale as string) || "en";

  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const items = category ? subItemsMap[category] : undefined;
  if (!items) return null;

  const getSubItemHref = (
    parentCategoryUrl: string,
    subItemName: string,
  ): string => {
    const itemLower = subItemName.toLowerCase();
    let path = `/store/${itemLower}`;

    if (parentCategoryUrl.includes("skateboards")) {
      if (itemLower === "completes") path = `/store/skateboard-completes`;
      else if (itemLower === "decks") path = `/store/decks`;
      else if (itemLower === "trucks") path = `/store/skateboard-trucks`;
      else if (itemLower === "wheels") path = `/store/skateboard-wheels`;
      else if (itemLower === "accessories")
        path = `/store/skateboard-accessories`;
    } else if (parentCategoryUrl.includes("surfskates")) {
      if (itemLower === "completes") path = `/store/surfskate-completes`;
      else if (itemLower === "decks") path = `/store/surfskate-decks`;
      else if (itemLower === "trucks") path = `/store/surfskate-trucks`;
      else if (itemLower === "wheels") path = `/store/surfskate-wheels`;
      else if (itemLower === "accessories")
        path = `/store/surfskate-accessories`;
    }

    return getLocalizedPath(path, locale);
  };

  return (
    <div className="h-full bg-white dark:bg-neutral-900 rounded-xl px-[14px] py-7.5">
      <div className="flex flex-col gap-2">
        {items.map((item) => {
          const isHovered = hoveredItem === item;
          return (
            <a
              key={item}
              href={getSubItemHref(category!, item)}
              className="relative flex h-12 items-center justify-between gap-10 text-[clamp(1.125rem,2vw,1.375rem)] font-medium text-black dark:text-white whitespace-nowrap"
              style={{ fontFamily: "Archivo", letterSpacing: "0em" }}
              onMouseEnter={() => setHoveredItem(item)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {/* Background Layers */}
              <div className="absolute inset-0 rounded-lg overflow-hidden">
                {/* Removed the gap here so the layers butt right up against each other */}
                <div className="flex h-full">
                  {/* Left block (Text Background) */}
                  <div
                    className="flex-1 h-full bg-black dark:bg-white border-r-2 border-white dark:border-neutral-900" // Added thin white boundary
                    style={{
                      transform: isHovered ? "scaleX(1)" : "scaleX(0)",
                      transformOrigin: "left",
                      transition: "transform 0.3s ease-out",
                      clipPath:
                        "polygon(0 0, 100% 0, calc(100% - 12px) 100%, 0 100%)",
                      borderRadius: "8px",
                    }}
                  />
                  {/* Right block (Icon Background) */}
                  <div
                    className="h-full w-16 bg-black dark:bg-white"
                    style={{
                      transform: isHovered ? "scaleX(1)" : "scaleX(0)",
                      transformOrigin: "right",
                      transition: "transform 0.3s ease-out",
                      clipPath: "polygon(12px 0, 100% 0, 100% 100%, 0 100%)",
                      borderRadius: "8px",
                    }}
                  />
                </div>
              </div>

              {/* Foreground Content */}
              <span
                className={`relative z-10 pl-4 transition-colors duration-150 ${isHovered ? "text-white dark:text-black" : "text-black dark:text-white"}`}
              >
                {item}
              </span>

              <div
                className={`relative z-10 pr-4 transition-colors duration-150 ${isHovered ? "text-white dark:text-black" : "text-black dark:text-white"}`}
              >
                <SkateboardIcon />
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}

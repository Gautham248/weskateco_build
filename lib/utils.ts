import { ReadonlyURLSearchParams } from "next/navigation";

export const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export const createUrl = (
  pathname: string,
  params: URLSearchParams | ReadonlyURLSearchParams,
) => {
  const paramsString = params.toString();
  const queryString = `${paramsString.length ? "?" : ""}${paramsString}`;

  return `${pathname}${queryString}`;
};

export const ensureStartsWith = (stringToCheck: string, startsWith: string) =>
  stringToCheck.startsWith(startsWith)
    ? stringToCheck
    : `${startsWith}${stringToCheck}`;

export const validateEnvironmentVariables = () => {
  const requiredEnvironmentVariables = [
    "SHOPIFY_STORE_DOMAIN",
    "SHOPIFY_STOREFRONT_ACCESS_TOKEN",
  ];
  const missingEnvironmentVariables = [] as string[];

  requiredEnvironmentVariables.forEach((envVar) => {
    if (!process.env[envVar]) {
      missingEnvironmentVariables.push(envVar);
    }
  });

  if (missingEnvironmentVariables.length) {
    throw new Error(
      `The following environment variables are missing. Your site will not work without them. Read more: https://vercel.com/docs/integrations/shopify#configure-environment-variables\n\n${missingEnvironmentVariables.join(
        "\n",
      )}\n`,
    );
  }

  if (
    process.env.SHOPIFY_STORE_DOMAIN?.includes("[") ||
    process.env.SHOPIFY_STORE_DOMAIN?.includes("]")
  ) {
    throw new Error(
      "Your `SHOPIFY_STORE_DOMAIN` environment variable includes brackets (ie. `[` and / or `]`). Your site will not work with them there. Please remove them.",
    );
  }
};

/**
 * Format "Deck Artwork by..." paragraph or text into a styled badge.
 * Handles inline nested tags like <em><strong>LEFT</strong></em>, attributes like <p dir="ltr">,
 * and text followed by <br> or additional paragraph content.
 */
export const formatArtworkBadgeHtml = (html: string): string => {
  if (!html) return "";

  return html.replace(
    /Deck\s+Artwork\s+by[\s\u00a0&nbsp;]*((?:<[^>]+>|[^<>\n\r])+?)(?:<br\s*\/?>|<\/p>|\n|(?=<span[^>]*><br)|$)/gi,
    (match, rawArtist) => {
      const trimmedArtist = rawArtist
        .replace(/<[^>]+>/g, "")
        .replace(/&nbsp;|\u00a0/g, " ")
        .trim();
      if (!trimmedArtist) return match;
      const initial = trimmedArtist.charAt(0).toUpperCase();
      return `
        <div class="my-4 flex items-center gap-2 rounded-md bg-[#F4FFCD] dark:bg-lime-950/20 p-2 w-fit">
          <div class="flex h-7 w-7 items-center justify-center rounded-full bg-[#E8FF8D] dark:bg-lime-900 text-sm font-bold text-[#55631F] dark:text-lime-300">
            ${initial}
          </div>
          <span class="text-[14px] font-medium text-[#55631F] dark:text-lime-400">
            Deck Artwork by ${trimmedArtist}
          </span>
        </div>
      `;
    }
  );
};

/**
 * Extract artist name from product description HTML or text.
 */
export const getArtistName = (html: string = "", text: string = ""): string | null => {
  const htmlMatch = html.match(/Deck\s+Artwork\s+by[\s\u00a0&nbsp;]*((?:<[^>]+>|[^<>\n\r])+?)(?:<br\s*\/?>|<\/p>|\n|$)/i);
  if (htmlMatch && htmlMatch[1]) {
    const extracted = htmlMatch[1].replace(/<[^>]+>/g, "").replace(/&nbsp;|\u00a0/g, " ").trim();
    if (extracted) return extracted;
  }
  const textMatch = text.match(/Deck\s+Artwork\s+by\s+(.+)/i);
  if (textMatch && textMatch[1]) {
    return textMatch[1].trim();
  }
  return null;
};


/**
 * A cookie's value from a `document.cookie` string, URL-decoded. A value that
 * isn't valid URL encoding is returned as it is rather than throwing, since
 * any script on the site (or a parent domain) can write cookies.
 */
export function readCookie(
  cookieString: string,
  name: string,
): string | undefined {
  const match = cookieString.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  if (!match?.[1]) return undefined;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return match[1];
  }
}

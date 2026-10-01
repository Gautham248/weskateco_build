/**
 * Shared types for the Sanity-backed content the storefront reads.
 *
 * Kept separate from the fetchers so a client component can import the types
 * without pulling a server module into its bundle.
 */

export type SocialLinks = {
  instagram?: string | null;
  facebook?: string | null;
  youtube?: string | null;
  twitter?: string | null;
};

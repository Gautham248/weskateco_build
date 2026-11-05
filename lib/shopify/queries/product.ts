import productFragment from "../fragments/product";

export const getProductQuery = /* GraphQL */ `
  query getProduct($handle: String!, $language: LanguageCode = EN)
  @inContext(language: $language) {
    product(handle: $handle) {
      ...product
      # Only the product page needs SKUs (for its structured data), so they
      # aren't in the shared fragment that listings fetch
      variants(first: 250) {
        edges {
          node {
            sku
          }
        }
      }
    }
  }
  ${productFragment}
`;

export const getProductsQuery = /* GraphQL */ `
  query getProducts(
    $sortKey: ProductSortKeys
    $reverse: Boolean
    $query: String
    $language: LanguageCode = EN
  ) @inContext(language: $language) {
    products(sortKey: $sortKey, reverse: $reverse, query: $query, first: 100) {
      edges {
        node {
          ...product
        }
      }
    }
  }
  ${productFragment}
`;

/**
 * Cursor-paginated list used only by the admin panel. `getProductsQuery` is
 * hard-capped at `first: 100`, which cannot page through a full catalog, and it
 * pulls 250 variants plus 17 metafields per product - far more than a table row
 * needs.
 */
export const getProductsPageQuery = /* GraphQL */ `
  query getProductsPage(
    $first: Int!
    $after: String
    $sortKey: ProductSortKeys
    $reverse: Boolean
    $query: String
  ) {
    products(
      first: $first
      after: $after
      sortKey: $sortKey
      reverse: $reverse
      query: $query
    ) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          handle
          title
          vendor
          productType
          availableForSale
          updatedAt
          tags
          featuredImage {
            url
            altText
            width
            height
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

export const getProductRecommendationsQuery = /* GraphQL */ `
  query getProductRecommendations($productId: ID!, $language: LanguageCode = EN)
  @inContext(language: $language) {
    productRecommendations(productId: $productId) {
      ...product
    }
  }
  ${productFragment}
`;

// Just what the sitemap needs, paged so catalogs over one page are complete
export const getProductSitemapEntriesQuery = /* GraphQL */ `
  query getProductSitemapEntries($after: String) {
    products(first: 250, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          handle
          updatedAt
          tags
        }
      }
    }
  }
`;

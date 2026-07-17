export const getConfiguratorProductsQuery = /* GraphQL */ `
  query getConfiguratorProducts($first: Int = 100) {
    products(first: $first) {
      edges {
        node {
          id
          title
          handle
          productType
          availableForSale
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }
          featuredImage {
            url
            altText
            width
            height
          }
          images(first: 5) {
            edges {
              node {
                url
                altText
                width
                height
              }
            }
          }
          variants(first: 20) {
            edges {
              node {
                id
                title
                availableForSale
                price {
                  amount
                  currencyCode
                }
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
          metafields(
            identifiers: [
              { namespace: "configurator", key: "deck_width" }
              { namespace: "configurator", key: "deck_board_type" }
              { namespace: "configurator", key: "truck_type" }
              { namespace: "configurator", key: "truck_hanger_size" }
              { namespace: "configurator", key: "truck_max_wheel_diameter" }
              { namespace: "configurator", key: "truck_sold_as" }
              { namespace: "configurator", key: "truck_compatible_board_types" }
              { namespace: "configurator", key: "wheel_diameter" }
              { namespace: "configurator", key: "wheel_hardness" }
              { namespace: "configurator", key: "wheel_type" }
              { namespace: "configurator", key: "wheel_compatible_board_types" }
              { namespace: "configurator", key: "bearing_type" }
              { namespace: "configurator", key: "hardware_length" }
              { namespace: "configurator", key: "hardware_head_type" }
              { namespace: "configurator", key: "griptape_width" }
              { namespace: "configurator", key: "riser_height" }
              { namespace: "configurator", key: "riser_type" }
            ]
          ) {
            key
            value
            namespace
            type
          }
          collections(first: 5) {
            edges {
              node {
                handle
                title
              }
            }
          }
        }
      }
    }
  }
`;

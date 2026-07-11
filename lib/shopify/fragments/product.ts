import imageFragment from "./image";
import seoFragment from "./seo";

const productFragment = /* GraphQL */ `
  fragment product on Product {
    id
    handle
    availableForSale
    title
    description
    descriptionHtml
    vendor
    options {
      id
      name
      values
    }
    priceRange {
      maxVariantPrice {
        amount
        currencyCode
      }
      minVariantPrice {
        amount
        currencyCode
      }
    }
    variants(first: 250) {
      edges {
        node {
          id
          title
          availableForSale
          selectedOptions {
            name
            value
          }
          price {
            amount
            currencyCode
          }
          compareAtPrice {
            amount
            currencyCode
          }
        }
      }
    }
    featuredImage {
      ...image
    }
    images(first: 20) {
      edges {
        node {
          ...image
        }
      }
    }
    seo {
      ...seo
    }
    metafields(identifiers: [
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
    ]) {
      key
      value
      namespace
      type
    }
    collections(first: 1) {
      edges {
        node {
          handle
          title
        }
      }
    }
    tags
    updatedAt
  }
  ${imageFragment}
  ${seoFragment}
`;

export default productFragment;

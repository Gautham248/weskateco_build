import cartFragment from "../fragments/cart";

export const getCartQuery = /* GraphQL */ `
  query getCart($cartId: ID!, $language: LanguageCode = EN)
  @inContext(language: $language) {
    cart(id: $cartId) {
      ...cart
    }
  }
  ${cartFragment}
`;

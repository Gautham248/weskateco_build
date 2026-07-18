const fs = require("fs");

async function dumpProducts() {
  const domain = "https://gumfkb-x7.myshopify.com";
  const token =
    process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN ||
    "fbd019473f0c4aa6d82a713d782f6737";

  const query = `{
    products(first: 100) {
      edges {
        node {
          id
          title
          handle
          productType
          variants(first: 10) {
            edges {
              node {
                id
                title
                price { amount currencyCode }
                availableForSale
                selectedOptions { name value }
              }
            }
          }
          collections(first: 5) {
            edges {
              node { handle title }
            }
          }
        }
      }
    }
  }`;

  try {
    const response = await fetch(domain + "/api/2025-01/graphql.json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token,
      },
      body: JSON.stringify({ query }),
    });

    const d = await response.json();

    if (d.errors) {
      console.error("Shopify API errors:", JSON.stringify(d.errors, null, 2));
      return;
    }

    const products = d.data.products.edges.map((e) => ({
      title: e.node.title,
      handle: e.node.handle,
      type: e.node.productType,
      variants: e.node.variants.edges.map((v) => ({
        title: v.node.title,
        options: v.node.selectedOptions,
        price: v.node.price,
      })),
      collections: e.node.collections.edges.map((c) => c.node.handle),
    }));

    fs.writeFileSync(
      "scripts/product-catalog-dump.json",
      JSON.stringify(products, null, 2),
    );
    console.log(
      `Dumped ${products.length} products to scripts/product-catalog-dump.json`,
    );
  } catch (error) {
    console.error("Error dumping products:", error);
  }
}

dumpProducts();

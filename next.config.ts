export default {
  experimental: {
    ppr: true,
    useCache: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
        pathname: "/s/files/**",
      },
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
        pathname: "/kyfkw6hca/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/terms",
        destination: "/terms-of-service",
        permanent: true,
      },
      // Product pages moved from the singular /product/<handle> to /products/<handle>.
      // Without these, every previously shared or indexed product URL 404s. The
      // unprefixed form is matched too because the proxy rewrites it to the default
      // locale rather than redirecting, so both spellings are live in the wild.
      {
        source: "/product/:handle",
        destination: "/products/:handle",
        permanent: true,
      },
      {
        source: "/:locale(en|hi)/product/:handle",
        destination: "/:locale/products/:handle",
        permanent: true,
      },
    ];
  },
};

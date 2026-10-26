export default {
  experimental: {
    ppr: true,
    useCache: true,
    // Requests whose pathname matches proxy.ts's matcher have their body cloned
    // for the proxy sandbox, and that clone is capped at 10MB by default
    // (next/dist/server/body-streams.js). A truncated multipart body makes
    // request.formData() throw, so /admin/api/upload rejected every video over
    // 10MB with a misleading "Expected a multipart form upload" 400. Keep this
    // at or above MAX_VIDEO_UPLOAD_BYTES in lib/admin/imagekit.ts.
    middlewareClientMaxBodySize: "100mb",
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
      // Redirect singular /guides/wheel-guide to canonical plural /guides/wheels-guide.
      {
        source: "/guides/wheel-guide",
        destination: "/guides/wheels-guide",
        permanent: true,
      },
      {
        source: "/:locale(en|hi)/guides/wheel-guide",
        destination: "/:locale/guides/wheels-guide",
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

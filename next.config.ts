export default {
  experimental: {
    ppr: true,
    useCache: true,
  },
  images: {
    loader: "custom",
    loaderFile: "./lib/image-loader.ts",
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
    ];
  },
};

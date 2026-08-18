import withPWAInit from "@ducanh2912/next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  turbopack: {}, // Empty turbopack config to silence warning
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "qusuvzwycdmnecixzsgc.supabase.co",
        pathname: "/storage/v1/object/public/book-covers/**",
      },
      {
        protocol: "https",
        hostname: "qusuvzwycdmnecixzsgc.supabase.co",
        pathname: "/storage/v1/object/public/author-images/**",
      },
      {
        protocol: "https",
        hostname: "qusuvzwycdmnecixzsgc.supabase.co",
        pathname: "/storage/v1/object/public/collection-covers/**",
      },
      {
        protocol: "https",
        hostname: "qusuvzwycdmnecixzsgc.supabase.co",
        pathname: "/storage/v1/object/public/avatars/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/books/:slug",
        destination: "/book/:slug",
        permanent: true,
      },
      {
        source: "/discover/search",
        destination: "/search",
        permanent: true,
      },
      {
        source: "/dashboard",
        destination: "/me",
        permanent: true,
      },
      {
        source: "/analytics",
        destination: "/me/progress",
        permanent: true,
      },
      {
        source: "/profile",
        destination: "/me/profile",
        permanent: true,
      },
      {
        source: "/notes/:path*",
        destination: "/me/learning/notes/:path*",
        permanent: true,
      },
      {
        source: "/citations",
        destination: "/me/learning/citations",
        permanent: true,
      },
      {
        source: "/academic",
        destination: "/me/learning",
        permanent: true,
      },
      {
        source: "/exam-prep",
        destination: "/me/study/exam-prep",
        permanent: true,
      },
    ];
  },
};

const pwaConfig = withPWAInit({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "google-fonts",
        expiration: {
          maxEntries: 4,
          maxAgeSeconds: 365 * 24 * 60 * 60, // 365 days
        },
      },
    },
    {
      urlPattern: /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "static-font-assets",
        expiration: {
          maxEntries: 4,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
        },
      },
    },
    {
      urlPattern: /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "static-image-assets",
        expiration: {
          maxEntries: 64,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
      },
    },
    {
      urlPattern: /\.(?:js)$/i,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "static-js-assets",
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
      },
    },
    {
      urlPattern: /\.(?:css|less)$/i,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "static-style-assets",
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
      },
    },
    {
      urlPattern: /api\/.*$/i,
      handler: "NetworkFirst",
      options: {
        cacheName: "apis",
        expiration: {
          maxEntries: 16,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
        networkTimeoutSeconds: 10,
      },
    },
    {
      urlPattern: /.*/i,
      handler: "NetworkFirst",
      options: {
        cacheName: "others",
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
        networkTimeoutSeconds: 10,
      },
    },
  ],
});

export default pwaConfig(nextConfig);

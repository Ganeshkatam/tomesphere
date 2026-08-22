/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: [
    "acorn-daily-overture.ngrok-free.dev",
    "*.ngrok-free.dev",
    "*.ngrok-free.app",
    "*.ngrok.io",
    "*.ngrok.app",
  ],
  experimental: {
    serverActions: {
      allowedOrigins: [
        "acorn-daily-overture.ngrok-free.dev",
        "*.ngrok-free.dev",
        "*.ngrok-free.app",
        "*.ngrok.io",
        "*.ngrok.app",
      ],
    },
  },
  turbopack: {}, // Empty turbopack config to silence warning
  onDemandEntries: {
    // Period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 10 * 1000,
    // Number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 1,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "qusuvzwycdmnecixzsgc.supabase.co",
        pathname: "/storage/v1/object/public/**",
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

export default nextConfig;

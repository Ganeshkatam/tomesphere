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

export default nextConfig;

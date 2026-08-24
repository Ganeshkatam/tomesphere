import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://tomesphere.in";
  const currentDate = new Date().toISOString();

  // Public canonical routes for search engines
  const routes = [
    // Home & Discovery
    { path: "", changeFrequency: "daily" as const, priority: 1.0 },
    { path: "/discover", changeFrequency: "daily" as const, priority: 0.9 },
    { path: "/discover/featured", changeFrequency: "daily" as const, priority: 0.9 },
    { path: "/discover/trending", changeFrequency: "daily" as const, priority: 0.9 },
    { path: "/discover/new", changeFrequency: "daily" as const, priority: 0.8 },
    { path: "/discover/authors", changeFrequency: "weekly" as const, priority: 0.8 },
    { path: "/discover/collections", changeFrequency: "weekly" as const, priority: 0.8 },
    { path: "/search", changeFrequency: "daily" as const, priority: 0.8 },

    // Public Information & Company
    { path: "/about", changeFrequency: "monthly" as const, priority: 0.7 },
    { path: "/contact", changeFrequency: "monthly" as const, priority: 0.6 },
    { path: "/support", changeFrequency: "weekly" as const, priority: 0.7 },
    { path: "/security", changeFrequency: "monthly" as const, priority: 0.6 },
    { path: "/report", changeFrequency: "monthly" as const, priority: 0.5 },

    // Legal & Policies
    { path: "/privacy", changeFrequency: "monthly" as const, priority: 0.5 },
    { path: "/terms", changeFrequency: "monthly" as const, priority: 0.5 },
    { path: "/cookies", changeFrequency: "monthly" as const, priority: 0.4 },
    { path: "/sitemap", changeFrequency: "weekly" as const, priority: 0.5 },

    // Authentication Gateways
    { path: "/login", changeFrequency: "monthly" as const, priority: 0.6 },
    { path: "/signup", changeFrequency: "monthly" as const, priority: 0.6 },
    { path: "/forgot-password", changeFrequency: "monthly" as const, priority: 0.4 },
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: currentDate,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}

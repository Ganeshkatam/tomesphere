export const AppRoutes = {
  home: "/",
  me: "/me",
  dashboard: "/me/dashboard",
  discover: "/discover",
  library: "/me/library",
  shelves: "/me/shelves",
} as const;

export type AppRoute = (typeof AppRoutes)[keyof typeof AppRoutes];

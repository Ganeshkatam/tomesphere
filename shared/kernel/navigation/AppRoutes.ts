export const AppRoutes = {
  home: "/",
  me: "/me",
  dashboard: "/me/dashboard",
  discover: "/discover",
  library: "/me/mylibrary",
} as const;

export type AppRoute = (typeof AppRoutes)[keyof typeof AppRoutes];

export const AppRoutes = {
  home: "/",
  me: "/me",
  dashboard: "/dashboard",
  discover: "/discover",
  library: "/me/mylibrary",
  // admin: '/admin',
} as const;

export type AppRoute = (typeof AppRoutes)[keyof typeof AppRoutes];

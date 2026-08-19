export const AppRoutes = {
  home: "/",
  me: "/me",
  discover: "/discover",
  library: "/library",
  // admin: '/admin',
} as const;

export type AppRoute = (typeof AppRoutes)[keyof typeof AppRoutes];

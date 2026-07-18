export const AppRoutes = {
    home: '/home',
    discover: '/discover',
    library: '/library',
    me: '/me',
    // admin: '/admin',
} as const;

export type AppRoute = typeof AppRoutes[keyof typeof AppRoutes];

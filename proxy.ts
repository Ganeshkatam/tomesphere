import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Proxy — Session Security + Route Protection
 *
 * 1. Refreshes Supabase auth tokens on every request (prevents stale sessions).
 * 2. Protects workspace routes — redirects unauthenticated users to /login.
 * 3. Redirects authenticated users away from auth pages to /home.
 * 4. Enforces secure cookie defaults (HttpOnly, Secure, SameSite=Lax).
 */

// Routes that require authentication
const PROTECTED_PREFIXES = [
  "/home",
  "/me",
  "/library",
  "/read",
  "/profile-setup",
  "/support",
];

// Routes that authenticated users should NOT see
const AUTH_ROUTES = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
];

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );
}

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const isProduction = process.env.NODE_ENV === "production";

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
            // Enforce secure cookie defaults
            httpOnly: true,
            secure: isProduction,
            sameSite: "lax",
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: "",
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    },
  );

  // IMPORTANT: Use getUser() not getSession().
  // getUser() validates the token with the Supabase Auth server,
  // while getSession() reads from local storage and could be stale/tampered.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Redirect unauthenticated users away from protected routes
  if (!user && isProtectedRoute(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(url);
  }

  // Check profile completion for authenticated users on protected routes (excluding profile-setup itself)
  if (user && isProtectedRoute(pathname) && !pathname.startsWith("/profile-setup")) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name")
      .eq("id", user.id)
      .single();

    if (!isProfileComplete(profile)) {
      const url = request.nextUrl.clone();
      url.pathname = `/profile-setup/${user.id}`;
      return NextResponse.redirect(url);
    }
  }

  // Redirect authenticated users away from auth pages
  if (user && isAuthRoute(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/home";
    return NextResponse.redirect(url);
  }

  return response;
}

function isProfileComplete(profile: any): boolean {
  if (!profile) return false;
  // Currently checking display_name as the primary completeness indicator
  if (!profile.display_name || profile.display_name.trim() === "") return false;
  
  // Future checks can be added here (e.g. preferences, terms acceptance)
  return true;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|icon.png|manifest.json|sw.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

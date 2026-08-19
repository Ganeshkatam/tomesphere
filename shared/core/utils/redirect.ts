/**
 * Safely parses and validates a redirect URL to prevent Open Redirect vulnerabilities.
 * 
 * Rules:
 * 1. If it's a relative path (starts with / but not //), it's safe.
 * 2. If it's an absolute URL, check if its origin is in the allowed list (usually the app's own origin).
 * 3. Otherwise, return the fallback URL.
 * 
 * @param url - The requested redirect URL (can be relative or absolute)
 * @param fallback - The fallback URL if validation fails (default: "/discover")
 */
export function getSafeRedirectUrl(url: string | null | undefined, fallback: string = "/discover"): string {
  if (!url) return fallback;
  
  // 1. Prevent protocol-relative URLs (e.g. //attacker.com)
  if (url.startsWith("//")) return fallback;
  
  // 2. Allow absolute relative paths
  if (url.startsWith("/")) return url;
  
  // 3. Check absolute URLs
  try {
    const parsed = new URL(url);
    const appOrigin = process.env.NEXT_PUBLIC_APP_URL || (
      typeof window !== "undefined" ? window.location.origin : ""
    );
    
    if (appOrigin && parsed.origin === appOrigin) {
      // It belongs to our app origin, but strip out just the pathname+search for safety
      return parsed.pathname + parsed.search;
    }
  } catch {
    // Invalid URL format
  }
  
  return fallback;
}

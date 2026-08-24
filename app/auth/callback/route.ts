import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const authError = searchParams.get("error_description") || searchParams.get("error");
  const next = searchParams.get("next") ?? "/me";

  // Determine actual public origin (handles ngrok, proxies, custom domains)
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto") || "https";
  const host = forwardedHost || request.headers.get("host") || "localhost:3000";
  const protocol = host.includes("localhost") && !forwardedHost ? "http" : forwardedProto;
  const origin = process.env.NEXT_PUBLIC_APP_URL || `${protocol}://${host}`;

  if (authError) {
    console.error("[OAuth Provider Error]", authError);
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(authError)}`);
  }

  const targetPath = next.startsWith("/") ? next : `/${next}`;
  const redirectResponse = NextResponse.redirect(`${origin}${targetPath}`);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            redirectResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  if (tokenHash) {
    const type = (searchParams.get("type") as any) || "email";
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type,
    });
    if (!error) {
      return redirectResponse;
    }
    console.error("[Token Hash Verification Error]", error);
  } else if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const type = searchParams.get("type");
      if (type === "recovery") {
        const recoveryResponse = NextResponse.redirect(`${origin}/reset-password`);
        redirectResponse.cookies.getAll().forEach((c) => {
          recoveryResponse.cookies.set(c);
        });
        return recoveryResponse;
      }
      return redirectResponse;
    }
    console.error("[OAuth Code Exchange Error]", error);
  }

  // Return to login with error details if exchange failed
  return NextResponse.redirect(`${origin}/login?error=Invalid_or_expired_link`);
}

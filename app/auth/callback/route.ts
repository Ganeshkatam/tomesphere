import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/discover";

  if (code) {
    const redirectResponse = NextResponse.redirect(`${origin}${next}`);

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

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const type = searchParams.get("type");
      if (type === "recovery") {
        const recoveryResponse = NextResponse.redirect(
          `${origin}/reset-password`,
        );
        redirectResponse.cookies.getAll().forEach((c) => {
          recoveryResponse.cookies.set(c);
        });
        return recoveryResponse;
      }
      return redirectResponse;
    }
    console.error("[OAuth Callback Error]", error);
  }

  // Return to login with error details if exchange failed
  return NextResponse.redirect(`${origin}/login?error=Invalid_or_expired_link`);
}

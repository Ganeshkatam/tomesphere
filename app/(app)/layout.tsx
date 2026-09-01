import { AppHeader } from "@/shared/layout";
import { createSupabaseServerClient } from "@/shared/core/database/server";

export default async function ApplicationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const profileResult = user
    ? await supabase
        .from("profiles")
        .select("display_name, avatar_url")
        .eq("id", user.id)
        .single()
    : null;

  const profile = profileResult?.data;

  const appUser = user
    ? {
        name: profile?.display_name || user.user_metadata?.full_name || null,
        email: user.email || null,
        avatarUrl: profile?.avatar_url || null,
      }
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      <AppHeader variant="application" user={appUser} />
      <main className="flex-1 w-full flex flex-col">
        {children}
      </main>
    </div>
  );
}

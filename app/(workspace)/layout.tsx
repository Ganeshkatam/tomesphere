import { AppHeader } from "@/shared/layout";
import { createSupabaseServerClient } from "@/shared/core/database/server";
import { redirect } from "next/navigation";
import { SupabaseAnnouncementReadModel } from "@/modules/announcements/infrastructure/read-models/SupabaseAnnouncementReadModel";
import { GetActiveAnnouncementsQueryHandler } from "@/modules/announcements/application/queries/GetActiveAnnouncements/handler";
import { AnnouncementBanner } from "@/modules/announcements/presentation/components/AnnouncementBanner";
import { AnnouncementEntryCard } from "@/modules/announcements/presentation/components/AnnouncementEntryCard";

export default async function WorkspaceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch profile and active announcements in parallel on the server
  const announcementsRepo = new SupabaseAnnouncementReadModel(supabase);
  const announcementsQuery = new GetActiveAnnouncementsQueryHandler(announcementsRepo);

  const [profileResult, activeAnnouncements] = await Promise.all([
    supabase
      .from("profiles")
      .select("display_name, avatar_url")
      .eq("id", user.id)
      .maybeSingle(),
    announcementsQuery.execute().catch(() => []),
  ]);

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
      <AnnouncementBanner announcements={activeAnnouncements} />
      <AnnouncementEntryCard announcements={activeAnnouncements} />
      <main className="flex-1 w-full flex flex-col">
        {children}
      </main>
    </div>
  );
}

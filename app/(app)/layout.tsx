import { AppHeader } from "@/shared/layout";
import { createSupabaseServerClient } from "@/shared/core/database/server";
import { SupabaseAnnouncementReadModel } from "@/modules/announcements/infrastructure/read-models/SupabaseAnnouncementReadModel";
import { GetActiveAnnouncementsQueryHandler } from "@/modules/announcements/application/queries/GetActiveAnnouncements/handler";
import { AnnouncementNotice } from "@/modules/announcements/presentation/components/AnnouncementNotice";

export default async function ApplicationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const announcementsRepo = new SupabaseAnnouncementReadModel(supabase);
  const announcementsQuery = new GetActiveAnnouncementsQueryHandler(announcementsRepo);

  const [profileResult, activeAnnouncements] = await Promise.all([
    user
      ? supabase
          .from("profiles")
          .select("display_name, avatar_url")
          .eq("id", user.id)
          .single()
      : Promise.resolve({ data: null }),
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
      <AnnouncementNotice announcements={activeAnnouncements} />
      <main className="flex-1 w-full flex flex-col">
        {children}
      </main>
    </div>
  );
}

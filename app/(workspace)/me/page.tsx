import { createSupabaseServerClient } from "@/modules/shared/core/database/server";
import { getProfile } from "@/modules/user/profile/application/queries/GetProfile/handler";
import { SupabaseProfileRepository } from "@/modules/user/profile/infrastructure/repositories/SupabaseProfileRepository";
import { getDashboardOverview } from "@/modules/me/application/queries/GetDashboardOverview/handler";
import { SupabaseDashboardReadModel } from "@/modules/me/infrastructure/read-models/SupabaseDashboardReadModel";
import { redirect } from "next/navigation";
import TodayScreen from "@/modules/me/presentation/screens/TodayScreen";

export const dynamic = "force-dynamic";

export default async function TodayPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const profileRepo = new SupabaseProfileRepository(supabase);
  const dashboardRepo = new SupabaseDashboardReadModel(supabase);

  const [profileData, dashboardData] = await Promise.all([
    getProfile(profileRepo, user.id).catch(() => null),
    getDashboardOverview(dashboardRepo, user.id).catch(() => ({
      currentReading: [],
      recentBooks: [],
      progress: { booksRead: 0, totalBooksGoal: null },
      streak: { current: 0, best: 0 },
      librarySummary: { totalBooks: 0, currentlyReadingCount: 0, wantToReadCount: 0 },
      collectionsSummary: { totalCollections: 0 }
    })),
  ]);

  return (
    <TodayScreen
      user={user}
      profileData={profileData}
      dashboardData={dashboardData}
    />
  );
}

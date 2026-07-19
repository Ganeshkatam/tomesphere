import { createSupabaseServerClient } from "@/shared/core/database/server";
import { executeAccountDashboardFacade } from "@/modules/account/application/facades";
import { redirect } from "next/navigation";
import TodayScreen from "@/modules/account/presentation/screens/TodayScreen";

export const dynamic = "force-dynamic";

export default async function TodayPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const data = await executeAccountDashboardFacade(user.id);

  return (
    <TodayScreen
      user={user}
      profileData={data.profile}
      dashboardData={data.dashboard}
    />
  );
}

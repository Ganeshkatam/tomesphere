import { createSupabaseServerClient } from "@/modules/shared/core/database/server";
import { getDashboardOverview } from "@/modules/me/application/queries/GetDashboardOverview/handler";
import { SupabaseDashboardReadModel } from "@/modules/me/infrastructure/read-models/SupabaseDashboardReadModel";
import { redirect } from "next/navigation";
import CollectionsScreen from "@/modules/me/presentation/screens/CollectionsScreen";

export const dynamic = "force-dynamic";

export default async function CollectionsPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const dashboardRepo = new SupabaseDashboardReadModel(supabase);
  const dashboardDto = await getDashboardOverview(dashboardRepo, user.id).catch(() => ({
    recentBooks: []
  }));

  return <CollectionsScreen recentBooks={dashboardDto.recentBooks || []} />;
}

import { createSupabaseServerClient } from "@/shared/core/database/server";
import { executeAccountDashboardFacade } from "@/modules/account/application/facades";
import { redirect } from "next/navigation";
import CollectionsScreen from "@/modules/account/presentation/screens/CollectionsScreen";

export const dynamic = "force-dynamic";

export default async function CollectionsPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const data = await executeAccountDashboardFacade(user.id);

  return <CollectionsScreen recentBooks={data.dashboard.recentBooks || []} />;
}

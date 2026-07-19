import { createSupabaseServerClient } from "@/shared/core/database/server";
import { SupabaseProfileRepository } from "../../../user/profile/infrastructure/repositories/SupabaseProfileRepository";
import { SupabaseDashboardReadModel } from "../../infrastructure/read-models/SupabaseDashboardReadModel";
import { AccountDashboardFacade } from "./AccountDashboardFacade";

export async function executeAccountDashboardFacade(userId: string) {
  const supabase = await createSupabaseServerClient();
  const profileRepo = new SupabaseProfileRepository(supabase);
  const dashboardRepo = new SupabaseDashboardReadModel(supabase);
  
  const facade = new AccountDashboardFacade(profileRepo, dashboardRepo);
  return facade.get(userId);
}

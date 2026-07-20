import { createSupabaseServerClient } from "@/shared/core/database/server";
import { SupabaseProfileRepository } from "../../infrastructure/repositories/SupabaseProfileRepository";
import { SupabaseProgressRepository } from "../../../../progress/infrastructure/repositories/SupabaseProgressRepository";
import { GetProgressDashboard } from "../../../../progress/application/queries/GetProgressDashboard/handler";
import { SupabaseUserAchievementsReadModel } from "../../../../progress/infrastructure/read-models/SupabaseUserAchievementsReadModel";
import { ProfilePageFacade } from "./ProfilePageFacade";

export async function executeProfilePageFacade(userId: string) {
  const supabase = await createSupabaseServerClient();
  const profileRepo = new SupabaseProfileRepository(supabase);
  const progressRepo = new SupabaseProgressRepository(supabase);
  const progressQuery = new GetProgressDashboard(progressRepo);
  const achievementsReadModel = new SupabaseUserAchievementsReadModel(supabase);

  const facade = new ProfilePageFacade(
    profileRepo,
    progressQuery,
    achievementsReadModel,
  );
  return facade.get(userId);
}

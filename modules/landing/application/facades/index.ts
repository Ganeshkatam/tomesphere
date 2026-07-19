import { createSupabaseServerClient } from "@/shared/core/database/server";
import { SupabaseDiscoveryReadModel } from "@/modules/discovery/infrastructure/read-models/SupabaseDiscoveryReadModel";
import { SupabasePlatformStatisticsReadModel } from "@/modules/statistics/infrastructure/read-models/SupabasePlatformStatisticsReadModel";
import { SupabaseAnnouncementReadModel } from "@/modules/announcements/infrastructure/read-models/SupabaseAnnouncementReadModel";
import { GetPlatformStatisticsQueryHandler } from "@/modules/statistics/application/queries/GetPlatformStatistics/handler";
import { GetActiveAnnouncementsQueryHandler } from "@/modules/announcements/application/queries/GetActiveAnnouncements/handler";
import { LandingPageFacade } from "./LandingPageFacade";

export async function executeLandingPageFacade() {
  const supabase = await createSupabaseServerClient();
  const repo = new SupabaseDiscoveryReadModel(supabase);
  const statsRepo = new SupabasePlatformStatisticsReadModel(supabase);
  const announcementsRepo = new SupabaseAnnouncementReadModel(supabase);
  
  const facade = new LandingPageFacade(
    repo,
    new GetPlatformStatisticsQueryHandler(statsRepo),
    new GetActiveAnnouncementsQueryHandler(announcementsRepo)
  );
  return facade.get();
}

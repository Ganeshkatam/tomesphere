import { createSupabaseServerClient } from "@/shared/core/database/server";
import { SupabaseIdentityProvider } from "@/shared/infrastructure/identity/SupabaseIdentityProvider";
import { HomePageFacade } from "./HomePageFacade";

// Repositories
import { SupabaseContinueReadingReadModel } from "@/modules/library/infrastructure/read-models/SupabaseContinueReadingReadModel";
import { SupabaseCurrentReadingReadModel } from "@/modules/library/infrastructure/read-models/SupabaseCurrentReadingReadModel";
import { SupabaseLibrarySnapshotReadModel } from "@/modules/library/infrastructure/read-models/SupabaseLibrarySnapshotReadModel";
import { SupabaseReadingGoalReadModel } from "@/modules/progress/infrastructure/read-models/SupabaseReadingGoalReadModel";
import { SupabaseReadingStreakReadModel } from "@/modules/progress/infrastructure/read-models/SupabaseReadingStreakReadModel";
import { SupabaseReadingStatisticsReadModel } from "@/modules/progress/infrastructure/read-models/SupabaseReadingStatisticsReadModel";
import { SupabaseReadingCalendarReadModel } from "@/modules/progress/infrastructure/read-models/SupabaseReadingCalendarReadModel";
import { SupabaseSuggestedReadsReadModel } from "@/modules/discovery/infrastructure/read-models/SupabaseSuggestedReadsReadModel";
import { SupabaseRecentActivityReadModel } from "@/modules/account/infrastructure/read-models/SupabaseRecentActivityReadModel";

// Queries
import { GetContinueReadingQuery } from "@/modules/library/application/queries/GetContinueReadingQuery";
import { GetCurrentReadingQuery } from "@/modules/library/application/queries/GetCurrentReadingQuery";
import { GetLibrarySnapshotQuery } from "@/modules/library/application/queries/GetLibrarySnapshotQuery";
import { GetReadingGoalQuery } from "@/modules/progress/application/queries/GetReadingGoalQuery";
import { GetReadingStreakQuery } from "@/modules/progress/application/queries/GetReadingStreakQuery";
import { GetReadingStatisticsQuery } from "@/modules/progress/application/queries/GetReadingStatisticsQuery";
import { GetReadingCalendarQuery } from "@/modules/progress/application/queries/GetReadingCalendarQuery";
import { GetSuggestedReadsQuery } from "@/modules/discovery/application/queries/GetSuggestedReadsQuery";
import { GetRecentActivityQuery } from "@/modules/account/application/queries/GetRecentActivityQuery";

export async function executeHomePageFacade() {
  const supabase = await createSupabaseServerClient();
  const identityProvider = new SupabaseIdentityProvider(supabase);

  const facade = new HomePageFacade(
    identityProvider,
    new GetContinueReadingQuery(new SupabaseContinueReadingReadModel(supabase)),
    new GetCurrentReadingQuery(new SupabaseCurrentReadingReadModel(supabase)),
    new GetLibrarySnapshotQuery(new SupabaseLibrarySnapshotReadModel(supabase)),
    new GetReadingGoalQuery(new SupabaseReadingGoalReadModel(supabase)),
    new GetReadingStreakQuery(new SupabaseReadingStreakReadModel(supabase)),
    new GetReadingStatisticsQuery(
      new SupabaseReadingStatisticsReadModel(supabase),
    ),
    new GetReadingCalendarQuery(new SupabaseReadingCalendarReadModel(supabase)),
    new GetSuggestedReadsQuery(new SupabaseSuggestedReadsReadModel(supabase)),
    new GetRecentActivityQuery(new SupabaseRecentActivityReadModel(supabase)),
  );

  return facade.get();
}

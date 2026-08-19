import { createSupabaseServerClient } from "@/shared/core/database/server";
import { SupabaseIdentityProvider } from "@/shared/infrastructure/identity/SupabaseIdentityProvider";
import { MePageFacade } from "./MePageFacade";
import { GetContinueReadingQuery } from "@/modules/library/application/queries/GetContinueReadingQuery";
import { GetCurrentReadingQuery } from "@/modules/library/application/queries/GetCurrentReadingQuery";
import { GetLibrarySnapshotQuery } from "@/modules/library/application/queries/GetLibrarySnapshotQuery";
import { SupabaseContinueReadingReadModel } from "@/modules/library/infrastructure/read-models/SupabaseContinueReadingReadModel";
import { SupabaseCurrentReadingReadModel } from "@/modules/library/infrastructure/read-models/SupabaseCurrentReadingReadModel";
import { SupabaseLibrarySnapshotReadModel } from "@/modules/library/infrastructure/read-models/SupabaseLibrarySnapshotReadModel";
import { DiscoveryFacade } from "@/modules/discovery/application/facades/DiscoveryFacade";
import { SupabaseDiscoveryReadModel } from "@/modules/discovery/infrastructure/read-models/SupabaseDiscoveryReadModel";

export async function executeMePageFacade() {
  const supabase = await createSupabaseServerClient();
  const identityProvider = new SupabaseIdentityProvider(supabase);
  const discoveryReadModel = new SupabaseDiscoveryReadModel(supabase);
  const discoveryFacade = new DiscoveryFacade(discoveryReadModel);

  const facade = new MePageFacade(
    identityProvider,
    new GetContinueReadingQuery(new SupabaseContinueReadingReadModel(supabase)),
    new GetCurrentReadingQuery(new SupabaseCurrentReadingReadModel(supabase)),
    new GetLibrarySnapshotQuery(new SupabaseLibrarySnapshotReadModel(supabase)),
    discoveryFacade,
  );

  return facade.get();
}

import { SupabaseIdentityProvider } from "@/modules/shared/infrastructure/identity/SupabaseIdentityProvider";
import { createSupabaseServerClient } from "@/modules/shared/core/database/server";
import { SupabaseDiscoveryReadModel } from "@/modules/discovery/infrastructure/read-models/SupabaseDiscoveryReadModel";
import { getDiscoveryOverview } from "@/modules/discovery/application/queries/GetDiscoveryOverview/handler";
import ExploreClient from "@/modules/reading/books/components/ExploreClient";

export default async function ExplorePage() {
  const supabase = await createSupabaseServerClient();
  const identityProvider = new SupabaseIdentityProvider(supabase);
    const user = await identityProvider.currentUser();

  const repository = new SupabaseDiscoveryReadModel(supabase);
  const exploreData = await getDiscoveryOverview(repository);

  return <ExploreClient user={user} initialData={exploreData} />;
}

import { createSupabaseServerClient } from "@/modules/shared/core/database/server";
import { SupabaseDiscoveryReadModel } from "../../../infrastructure/read-models/SupabaseDiscoveryReadModel";
import { getDiscoveryOverview } from "./handler";

export async function executeGetDiscoveryOverviewQuery() {
  const supabase = await createSupabaseServerClient();
  const repo = new SupabaseDiscoveryReadModel(supabase);
  return getDiscoveryOverview(repo);
}

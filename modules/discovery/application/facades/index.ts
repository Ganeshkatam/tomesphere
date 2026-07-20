import { createSupabaseServerClient } from "@/shared/core/database/server";
import { SupabaseDiscoveryReadModel } from "../../infrastructure/read-models/SupabaseDiscoveryReadModel";
import { DiscoveryFacade } from "./DiscoveryFacade";

export async function getDiscoveryFacade() {
  const supabase = await createSupabaseServerClient();
  const repo = new SupabaseDiscoveryReadModel(supabase);
  return new DiscoveryFacade(repo);
}

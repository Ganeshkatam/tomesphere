import { createSupabaseServerClient } from "@/shared/core/database/server";
import { SupabasePlatformStatisticsReadModel } from "../../../infrastructure/read-models/SupabasePlatformStatisticsReadModel";
import { GetPlatformStatisticsQueryHandler } from "./handler";

export async function executeGetPlatformStatisticsQuery() {
  const supabase = await createSupabaseServerClient();
  const repo = new SupabasePlatformStatisticsReadModel(supabase);
  const handler = new GetPlatformStatisticsQueryHandler(repo);
  return handler.execute();
}

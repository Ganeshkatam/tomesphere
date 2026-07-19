import { createSupabaseServerClient } from "@/modules/shared/core/database/server";
import { SupabaseAnnouncementReadModel } from "../../../infrastructure/read-models/SupabaseAnnouncementReadModel";
import { GetActiveAnnouncementsQueryHandler } from "./handler";

export async function executeGetActiveAnnouncementsQuery() {
  const supabase = await createSupabaseServerClient();
  const repo = new SupabaseAnnouncementReadModel(supabase);
  const handler = new GetActiveAnnouncementsQueryHandler(repo);
  return handler.execute();
}

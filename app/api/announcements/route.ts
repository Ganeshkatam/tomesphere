import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/shared/core/database/server";
import { SupabaseAnnouncementReadModel } from "@/modules/announcements/infrastructure/read-models/SupabaseAnnouncementReadModel";
import { GetActiveAnnouncementsQueryHandler } from "@/modules/announcements/application/queries/GetActiveAnnouncements/handler";

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const readModel = new SupabaseAnnouncementReadModel(supabase);
    const handler = new GetActiveAnnouncementsQueryHandler(readModel);
    const announcements = await handler.execute();

    return NextResponse.json({ announcements });
  } catch (error) {
    console.error("[API] Failed to fetch announcements:", error);
    return NextResponse.json({ announcements: [] });
  }
}

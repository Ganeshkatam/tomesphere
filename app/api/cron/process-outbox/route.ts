import { NextResponse } from "next/server";
import { processOutbox } from "@/shared/core/jobs/outbox-relay";
import { eventBus } from "@/shared/core/events/EventBus";
import { AnalyticsModule } from "@/modules/analytics/AnalyticsModule";
import { NotificationsModule } from "@/modules/notifications/NotificationsModule";
import { SupabaseNotificationRepository } from "@/modules/notifications/infrastructure/SupabaseNotificationRepository";
import { createSupabaseServerClient } from "@/shared/core/database/server";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  // Register handlers before processing
  await AnalyticsModule.registerEventHandlers(eventBus);

  const supabase = await createSupabaseServerClient();
  const notificationRepository = new SupabaseNotificationRepository(supabase);
  await NotificationsModule.registerEventHandlers(eventBus, notificationRepository);

  const result = await processOutbox(eventBus);

  return NextResponse.json(result);
}

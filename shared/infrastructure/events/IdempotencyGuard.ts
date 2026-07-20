import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/shared/core/types/database";

export class IdempotencyGuard {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  /**
   * Executes a handler only if the event hasn't been processed by this handler before.
   * Leverages the composite primary key (event_id, handler) in `processed_events`.
   */
  async execute(
    eventId: string,
    handlerName: string,
    handler: () => Promise<void>,
  ): Promise<void> {
    // 1. Check if already processed
    const { data } = await this.supabase
      .from("processed_events")
      .select("event_id")
      .eq("event_id", eventId)
      .eq("handler", handlerName)
      .single();

    if (data) {
      console.log(`[IdempotencyGuard] Skipping event ${eventId} for ${handlerName}. Already processed.`);
      return;
    }

    const startTime = performance.now();

    // 2. Execute handler
    await handler();

    // 3. Mark processed
    const durationMs = Math.round(performance.now() - startTime);

    const { error } = await this.supabase.from("processed_events").insert({
      event_id: eventId,
      handler: handlerName,
      processed_at: new Date().toISOString(),
      duration_ms: durationMs,
    });

    if (error) {
      // We might throw here, or just warn if we're okay with potential replay in worst case
      console.error(`[IdempotencyGuard] Failed to mark event ${eventId} as processed by ${handlerName}:`, error);
    }
  }
}

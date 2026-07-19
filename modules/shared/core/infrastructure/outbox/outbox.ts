import { SupabaseClient } from "@supabase/supabase-js";
import { PlatformEventName, EventPayloads } from "../../events/types";
import { Database } from "../../types/database";

/**
 * Emits an event to the Transactional Outbox for asynchronous processing.
 */
export async function emitOutboxEvent<T extends PlatformEventName>(
  supabase: SupabaseClient<Database>,
  eventName: T,
  payload: EventPayloads[T],
  aggregateType: string = "reader",
  aggregateId: string = (payload as any).userId || "system",
): Promise<void> {
  const { error } = await supabase.from("outbox_messages").insert({
    event_type: eventName,
    payload: payload as any,
    aggregate_type: aggregateType,
    aggregate_id: aggregateId,
    status: "pending",
    retry_count: 0,
  });

  if (error) {
    console.error("Failed to emit outbox event:", error);
    throw new Error("Failed to emit outbox event");
  }
}

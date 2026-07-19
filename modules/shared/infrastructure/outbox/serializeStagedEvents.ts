import { DomainEvent } from "../../../core/domain/DomainEvent";

/**
 * Serializes domain events staged on an aggregate into the JSONB array
 * format expected by the thin persistence RPCs (e.g., save_reader_session_with_events).
 *
 * The RPCs expect each event to have:
 *   aggregate_type, aggregate_id, event_type, event_version, payload, occurred_at
 *
 * This keeps serialization concerns out of both the domain and the RPCs.
 */
export function serializeStagedEvents(
  aggregateType: string,
  events: readonly DomainEvent[],
): object[] {
  return events.map((event) => ({
    aggregate_type: aggregateType,
    aggregate_id: event.aggregateId,
    event_type: event.eventName,
    event_version: event.schemaVersion ?? 1,
    payload: {
      eventId: event.eventId,
      aggregateId: event.aggregateId,
      ...((event as any).payload ?? event),
    },
    occurred_at: event.occurredAt.toISOString(),
  }));
}

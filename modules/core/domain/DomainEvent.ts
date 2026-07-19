/**
 * Domain Event interface providing identity and tracking details for events
 * emitted by aggregates.
 */
export interface DomainEvent {
  readonly eventId: string;
  readonly occurredAt: Date;
  readonly aggregateId: any;
  readonly eventName: string;
  readonly aggregateVersion?: number;
  readonly schemaVersion?: number;
}

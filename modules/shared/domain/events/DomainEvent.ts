import { DomainEvent as LegacyDomainEvent } from "../../../core/domain/DomainEvent";

export abstract class DomainEvent<
  TAggregateId = string,
> implements LegacyDomainEvent {
  public abstract readonly eventName: string;
  public readonly occurredAt: Date;
  public readonly eventId: string;
  public readonly aggregateId: TAggregateId;
  public readonly aggregateVersion: number;
  public readonly schemaVersion: number;

  constructor(
    aggregateId: TAggregateId,
    aggregateVersion: number,
    schemaVersion: number = 1,
  ) {
    this.aggregateId = aggregateId;
    this.aggregateVersion = aggregateVersion;
    this.schemaVersion = schemaVersion;
    this.occurredAt = new Date();
    this.eventId = crypto.randomUUID();
  }
}

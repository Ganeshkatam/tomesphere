import { Entity } from "./Entity";
import { DomainEvent } from "./DomainEvent";

/**
 * Base AggregateRoot class that extends Entity and tracks domain events
 * for cross-boundary side effects.
 */
export abstract class AggregateRoot<T> extends Entity<T> {
  private readonly _domainEvents: DomainEvent[] = [];

  get domainEvents(): DomainEvent[] {
    return this._domainEvents;
  }

  protected addDomainEvent(domainEvent: DomainEvent): void {
    this._domainEvents.push(domainEvent);
  }

  public collectDomainEvents(): readonly DomainEvent[] {
    return Object.freeze([...this._domainEvents]);
  }

  public clearDomainEvents(): void {
    this._domainEvents.splice(0, this._domainEvents.length);
  }

  public clearEvents(): void {
    this.clearDomainEvents();
  }

  public pullDomainEvents(): DomainEvent[] {
    const events = [...this._domainEvents];
    this.clearDomainEvents();
    return events;
  }
}

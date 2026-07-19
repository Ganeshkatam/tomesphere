import { EventBus } from "../../application/events/EventBus";
import { DomainEventPublisher } from "../../application/events/DomainEventPublisher";
import {
  EventRegistry,
  EventClass,
} from "../../application/events/EventRegistry";
import { EventHandler } from "../../application/events/EventHandler";
import { DomainEvent } from "../../../core/domain/DomainEvent";
import { EventMetadata } from "../../application/events/EventMetadata";
import { EventDispatcher } from "./EventDispatcher";
import { AggregateRoot } from "../../../core/domain/AggregateRoot";

export class InProcessEventBus implements EventBus, DomainEventPublisher {
  private readonly registry = new EventRegistry();
  private readonly dispatcher = new EventDispatcher(this.registry);

  public getRegistry(): EventRegistry {
    return this.registry;
  }

  async publish(
    eventsOrAggregate: readonly DomainEvent[] | AggregateRoot<any>,
    metadata?: EventMetadata,
  ): Promise<void> {
    if (eventsOrAggregate instanceof AggregateRoot) {
      const events = eventsOrAggregate.collectDomainEvents();
      try {
        await this.publishEvents(events, metadata);
        eventsOrAggregate.clearDomainEvents();
      } catch (error) {
        console.error(
          `[InProcessEventBus] DomainEventPublisher failed. Aggregate events NOT cleared.`,
          error,
        );
        throw error;
      }
    } else {
      await this.publishEvents(eventsOrAggregate, metadata);
    }
  }

  private async publishEvents(
    events: readonly DomainEvent[],
    metadata?: EventMetadata,
  ): Promise<void> {
    for (const event of events) {
      await this.dispatcher.dispatch(event, metadata);
    }
  }

  subscribe<T extends DomainEvent>(
    eventClass: EventClass<T>,
    handler: EventHandler<T>,
  ): void {
    this.registry.register(eventClass, handler);
  }
}

import {  DomainEvent  } from "@/shared/kernel/DomainEvent";
import { EventMetadata } from "./EventMetadata";
import { EventClass } from "./EventRegistry";
import { EventHandler } from "./EventHandler";

export interface EventBus {
  publish(
    events: readonly DomainEvent[],
    metadata?: EventMetadata,
  ): Promise<void>;
  subscribe<T extends DomainEvent>(
    eventClass: EventClass<T>,
    handler: EventHandler<T>,
  ): void;
}

import {  AggregateRoot  } from "@/shared/kernel/AggregateRoot";
import { EventMetadata } from "./EventMetadata";

export interface DomainEventPublisher {
  publish(
    aggregate: AggregateRoot<any>,
    metadata?: EventMetadata,
  ): Promise<void>;
}

import { DomainEvent } from "../../../core/domain/DomainEvent";
import { EventMetadata } from "./EventMetadata";

export interface EventEnvelope<T extends DomainEvent = DomainEvent> {
  readonly event: T;
  readonly envelopeId: string;
  readonly correlationId: string;
  readonly causationId: string;
  readonly publishedAt: Date;
  readonly metadata: Readonly<EventMetadata>;
}

import { DomainEvent } from "../../../core/domain/DomainEvent";
import { EventEnvelope } from "./EventEnvelope";

export interface HandlerExecutionResult {
  readonly handlerName: string;
  readonly durationMs: number;
  readonly succeeded: boolean;
  readonly error?: Error;
}

export interface EventHandler<T extends DomainEvent = DomainEvent> {
  handle(envelope: EventEnvelope<T>): Promise<void>;
}

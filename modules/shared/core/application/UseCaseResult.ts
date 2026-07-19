import { DomainEvent } from "@/modules/core/domain/DomainEvent";

export interface UseCaseResult<T> {
  readonly output: T;
  readonly events: DomainEvent[];
}

import { DomainEvent } from "@/shared/kernel/DomainEvent";

export interface UseCaseResult<T> {
  readonly output: T;
  readonly events: DomainEvent[];
}

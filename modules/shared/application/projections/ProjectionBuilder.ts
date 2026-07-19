import { DomainEvent } from "../../domain/events/DomainEvent";

export interface ProjectionBuilder<TEvent extends DomainEvent, TProjection> {
  build(event: TEvent): TProjection;
}

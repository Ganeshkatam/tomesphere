import { EventModule } from "../../shared/application/events/EventModule";
import { EventRegistry } from "../../shared/application/events/EventRegistry";
import { RecommendationContextStore } from "./application/projections/RecommendationContextStore";
import { ReadingCompletedHandler } from "./application/event-handlers/RecommendationHandlers";
import { ReadingCompletedEvent } from "../../reading/reader/domain/events/ReaderEvents";

export class RecommendationModule implements EventModule {
  constructor(private readonly contextStore: RecommendationContextStore) {}

  registerEventHandlers(registry: EventRegistry): void {
    registry.register(
      ReadingCompletedEvent,
      new ReadingCompletedHandler(this.contextStore),
    );
  }
}

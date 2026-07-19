import { EventModule } from "../../shared/application/events/EventModule";
import { EventRegistry } from "../../shared/application/events/EventRegistry";
import { SearchRepository } from "./domain/repositories/SearchRepository";
import {
  BookPublishedHandler,
  BookUpdatedHandler,
  BookDeletedHandler,
} from "./application/event-handlers/SearchHandlers";
import {
  BookPublishedEvent,
  BookUpdatedEvent,
  BookDeletedEvent,
} from "../../reading/books/domain/events/BookEvents";

export class SearchModule implements EventModule {
  constructor(private readonly searchRepository: SearchRepository) {}

  registerEventHandlers(registry: EventRegistry): void {
    registry.register(
      BookPublishedEvent,
      new BookPublishedHandler(this.searchRepository),
    );
    registry.register(
      BookUpdatedEvent,
      new BookUpdatedHandler(this.searchRepository),
    );
    registry.register(
      BookDeletedEvent,
      new BookDeletedHandler(this.searchRepository),
    );
  }
}

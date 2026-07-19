import { EventHandler } from "@/shared/application/events/EventHandler";
import { EventEnvelope } from "@/shared/application/events/EventEnvelope";
import {
  BookPublishedEvent,
  BookUpdatedEvent,
  BookDeletedEvent,
} from "@/modules/books/domain/events/BookEvents";
import { SearchRepository } from "../../domain/repositories/SearchRepository";
import { SearchIndexProjectionBuilder } from "../projections/SearchIndexProjectionBuilder";

export class BookPublishedHandler implements EventHandler<BookPublishedEvent> {
  private readonly projectionBuilder = new SearchIndexProjectionBuilder();

  constructor(private readonly searchRepository: SearchRepository) {}

  async handle(envelope: EventEnvelope<BookPublishedEvent>): Promise<void> {
    const document = this.projectionBuilder.build(envelope.event);
    await this.searchRepository.index(document as any);
  }
}

export class BookUpdatedHandler implements EventHandler<BookUpdatedEvent> {
  constructor(private readonly searchRepository: SearchRepository) {}

  async handle(envelope: EventEnvelope<BookUpdatedEvent>): Promise<void> {
    const event = envelope.event;
    await this.searchRepository.updateIndex(event.aggregateId, event.updates);
  }
}

export class BookDeletedHandler implements EventHandler<BookDeletedEvent> {
  constructor(private readonly searchRepository: SearchRepository) {}

  async handle(envelope: EventEnvelope<BookDeletedEvent>): Promise<void> {
    await this.searchRepository.removeIndex(envelope.event.aggregateId);
  }
}

import { IEventBus } from "@/shared/core/events/types";
import { SearchIndexer } from "../../infrastructure/projections/SearchIndexer";
import { IdempotencyGuard } from "@/shared/infrastructure/events/IdempotencyGuard";

/**
 * Handles domain events that affect the search indexing projection.
 * Responsible for updating `discovery_search_documents` and `discovery_category_documents`.
 */
export class SearchDocumentEventHandlers {
  constructor(
    private readonly eventBus: IEventBus,
    private readonly indexer: SearchIndexer,
    private readonly guard: IdempotencyGuard,
  ) {
    this.registerHandlers();
  }

  private registerHandlers() {
    this.eventBus.subscribe("catalog.book.published", async (payload: any) => {
      await this.guard.execute(
        payload.eventId,
        "SearchDocumentEventHandlers.bookPublished",
        async () => {
          console.log(`[Search Indexer] Book published: ${payload.bookId}`);
          await this.indexer.buildAndUpsert(payload.bookId);
        },
      );
    });

    this.eventBus.subscribe("catalog.book.updated", async (payload: any) => {
      await this.guard.execute(
        payload.eventId,
        "SearchDocumentEventHandlers.bookUpdated",
        async () => {
          console.log(`[Search Indexer] Book updated: ${payload.bookId}`);
          await this.indexer.buildAndUpsert(payload.bookId);
        },
      );
    });

    this.eventBus.subscribe("catalog.book.deleted", async (payload: any) => {
      await this.guard.execute(
        payload.eventId,
        "SearchDocumentEventHandlers.bookDeleted",
        async () => {
          console.log(`[Search Indexer] Book deleted: ${payload.bookId}`);
          await this.indexer.remove(payload.bookId);
        },
      );
    });
  }
}

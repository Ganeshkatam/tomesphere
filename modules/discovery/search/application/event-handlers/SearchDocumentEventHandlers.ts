import { IEventBus } from '../../../../shared/core/events/types';
import { SearchRepository } from '../../domain/repositories/SearchRepository';

/**
 * Handles domain events that affect the search indexing projection.
 * Responsible for updating `discovery_search_documents` and `discovery_category_documents`.
 */
export class SearchDocumentEventHandlers {
    constructor(
        private readonly eventBus: IEventBus,
        private readonly searchRepository: SearchRepository
    ) {
        this.registerHandlers();
    }

    private registerHandlers() {
        this.eventBus.subscribe('catalog:book_published', async (payload) => {
            console.log(`[Search Indexer] Book published, triggering index refresh for book: ${payload.bookId}`);
            // The repository implementation handles calling the RPC
            await this.searchRepository.index({ bookId: payload.bookId } as any);
        });

        this.eventBus.subscribe('catalog:book_updated', async (payload) => {
            console.log(`[Search Indexer] Book updated, triggering index refresh for book: ${payload.bookId}`);
            await this.searchRepository.updateIndex(payload.bookId, {});
        });

        this.eventBus.subscribe('catalog:book_deleted', async (payload) => {
            console.log(`[Search Indexer] Book deleted, removing from index: ${payload.bookId}`);
            await this.searchRepository.removeIndex(payload.bookId);
        });
    }
}

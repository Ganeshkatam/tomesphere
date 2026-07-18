import { IndexBookCommand } from './command';
import { IndexBookOutput } from './output';
import { SearchRepository } from '../../../domain/repositories/SearchRepository';
import { BookSearchDocument } from '../../../infrastructure/models/BookSearchDocument';
import { ActionResult } from '../../../../../shared/core/types/ActionResult';

export class IndexBookHandler {
    constructor(private readonly searchRepository: SearchRepository) {}

    async execute(command: IndexBookCommand): Promise<ActionResult<IndexBookOutput>> {
        try {
            const { input } = command;

            // Simple keyword generation (e.g., lowercasing words, removing punctuation)
            // In a real system, the DB FTS often handles this, but explicit keywords can boost accuracy.
            const keywords = Array.from(new Set([
                ...input.title.toLowerCase().split(/\s+/),
                ...input.authors.map(a => a.toLowerCase()),
                ...(input.categories || []).map(c => c.toLowerCase())
            ]));

            const document: BookSearchDocument = {
                bookId: input.bookId,
                title: input.title,
                subtitle: input.subtitle,
                authors: input.authors,
                categories: input.categories || [],
                language: input.language,
                description: input.description,
                keywords,
                publicationYear: input.publicationYear,
                availabilityStatus: 'available', // Default
                popularityScore: 0,
                rating: 0,
            };

            await this.searchRepository.index(document);

            return {
                success: true,
                data: { success: true },
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error indexing book',
            };
        }
    }
}

import { BookRepository } from '../../../domain/repositories/BookRepository';
import { SearchBooksInput } from './query';
import { SearchBooksOutput } from './read-model';
import { mapBookToOutput } from '../GetBook/handler';

export async function searchBooks(
    repository: BookRepository,
    input: SearchBooksInput
): Promise<SearchBooksOutput> {
    const paginatedResult = await repository.search({
        term: input.term,
        genre: input.genreFilters,
        limit: input.limit,
        offset: input.offset,
    });

    return {
        items: paginatedResult.items.map(mapBookToOutput),
        totalCount: paginatedResult.totalCount,
    };
}

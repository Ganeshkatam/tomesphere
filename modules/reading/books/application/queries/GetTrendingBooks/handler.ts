import { BookRepository } from '../../../domain/repositories/BookRepository';
import { GetTrendingBooksOutput } from './read-model';
import { mapBookToOutput } from '../GetBook/handler';

export async function getTrendingBooks(
    repository: BookRepository,
    limit: number = 10,
    category?: string
): Promise<GetTrendingBooksOutput> {
    const domainBooks = await repository.getTrending({ limit, category });

    return {
        items: domainBooks.map(mapBookToOutput),
    };
}

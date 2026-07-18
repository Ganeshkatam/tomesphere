import { BookRepository } from '../../../domain/repositories/BookRepository';
import { GetBookInput } from './query';
import { GetBookOutput } from './read-model';
import { Book } from '../../../domain/entities/Book';

export async function getBook(
    repository: BookRepository, 
    input: GetBookInput
): Promise<GetBookOutput | null> {
    const book = await repository.findById(input.bookId);

    if (!book) {
        return null;
    }

    return mapBookToOutput(book);
}

export function mapBookToOutput(book: Book): GetBookOutput {
    return {
        id: book.id,
        title: book.title,
        author: book.author,
        coverUrl: book.coverUrl ?? undefined,
        description: book.description ?? undefined,
        genre: book.genre ?? undefined,
        isTextbook: book.isTextbook,
        academicSubject: book.academicSubject ?? undefined,
        publishedDate: book.publishedDate ?? undefined,
        pageCount: book.pageCount ?? undefined,
    };
}

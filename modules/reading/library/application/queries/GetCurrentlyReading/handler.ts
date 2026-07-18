import { LibraryRepository } from '../../../domain/repositories/LibraryRepository';
import { BookRepository } from '../../../../books/domain/repositories/BookRepository';
import { CurrentlyReadingOutput, mapLibraryBookToOutput } from '../../Outputs';
import { mapBookToOutput } from '../../../../books/application/queries/GetBook/handler';

export async function getCurrentlyReading(
    libraryRepo: LibraryRepository,
    bookRepo: BookRepository,
    userId: string
): Promise<CurrentlyReadingOutput[]> {
    const libraryBooks = await libraryRepo.getCurrentlyReading(userId);
    if (libraryBooks.length === 0) return [];

    // Fetch the corresponding books from the Book domain
    const compositeOutputs: CurrentlyReadingOutput[] = [];
    
    // In a real scenario with a lot of books, you might want a `bookRepo.findManyByIds`, 
    // but for now we fetch individually or use `search` if possible.
    // For Phase 5A, we can just fetch individually since it's a limited list per user usually,
    // or add `findMany` to BookRepository later.
    for (const lb of libraryBooks) {
        const domainBook = await bookRepo.findById(lb.bookId as any); // Assuming BookId compatibility
        if (domainBook) {
            compositeOutputs.push({
                library: mapLibraryBookToOutput(lb),
                book: mapBookToOutput(domainBook)
            });
        }
    }

    return compositeOutputs;
}

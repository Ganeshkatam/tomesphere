import { LibraryRepository } from '../../../domain/repositories/LibraryRepository';
import { BookRepository } from '../../../../books/domain/repositories/BookRepository';
import { CurrentlyReadingOutput, mapLibraryBookToOutput } from '../../Outputs';
import { mapBookToOutput } from '../../../../books/application/queries/GetBook/handler';

export async function getAllLibraryBooks(
    libraryRepo: LibraryRepository,
    bookRepo: BookRepository,
    userId: string
): Promise<CurrentlyReadingOutput[]> {
    const reading = await libraryRepo.getCurrentlyReading(userId);
    const finished = await libraryRepo.getFinished(userId);
    const want = await libraryRepo.getWantToRead(userId);

    const libraryBooks = [...reading, ...finished, ...want];
    
    // Sort by updated_at descending
    libraryBooks.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

    const compositeOutputs: CurrentlyReadingOutput[] = [];
    
    for (const lb of libraryBooks) {
        const domainBook = await bookRepo.findById(lb.bookId as any); 
        if (domainBook) {
            compositeOutputs.push({
                library: mapLibraryBookToOutput(lb),
                book: mapBookToOutput(domainBook)
            });
        }
    }

    return compositeOutputs;
}

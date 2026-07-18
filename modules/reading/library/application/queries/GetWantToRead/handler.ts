import { LibraryRepository } from '../../../domain/repositories/LibraryRepository';
import { BookRepository } from '../../../../books/domain/repositories/BookRepository';
import { CurrentlyReadingOutput, mapLibraryBookToOutput } from '../../Outputs';
import { mapBookToOutput } from '../../../../books/application/queries/GetBook/handler';

export async function getWantToRead(
    libraryRepo: LibraryRepository,
    bookRepo: BookRepository,
    userId: string
): Promise<CurrentlyReadingOutput[]> {
    const libraryBooks = await libraryRepo.getWantToRead(userId);
    if (libraryBooks.length === 0) return [];

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

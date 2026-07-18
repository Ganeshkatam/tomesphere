import { LibraryRepository } from '../../../domain/repositories/LibraryRepository';
import { ChangeReadingStateInput } from './input';
import { UseCaseResult, LibraryEntryOutput, mapLibraryBookToOutput } from '../../Outputs';

export async function changeReadingState(
    repository: LibraryRepository,
    input: ChangeReadingStateInput
): Promise<UseCaseResult<LibraryEntryOutput>> {
    const libraryBook = await repository.getLibraryEntry(input.userId, input.bookId);
    if (!libraryBook) {
        throw new Error('Book is not in the library');
    }

    switch (input.newState) {
        case 'want_to_read':
            libraryBook.restoreToWantToRead();
            break;
        case 'currently_reading':
            libraryBook.startReading();
            break;
        case 'finished':
            libraryBook.finish();
            break;
        case 'abandoned':
            libraryBook.abandon();
            break;
    }

    await repository.save(libraryBook);

    return {
        output: mapLibraryBookToOutput(libraryBook),
        events: libraryBook.pullDomainEvents()
    };
}

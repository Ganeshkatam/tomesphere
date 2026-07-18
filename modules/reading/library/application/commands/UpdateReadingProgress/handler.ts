import { LibraryRepository } from '../../../domain/repositories/LibraryRepository';
import { UpdateReadingProgressInput } from './input';
import { UseCaseResult, LibraryEntryOutput, mapLibraryBookToOutput } from '../../Outputs';

export async function updateReadingProgress(
    repository: LibraryRepository,
    input: UpdateReadingProgressInput
): Promise<UseCaseResult<LibraryEntryOutput>> {
    const libraryBook = await repository.getLibraryEntry(input.userId, input.bookId);
    if (!libraryBook) {
        throw new Error('Book is not in the library');
    }

    libraryBook.updateProgress(input.progress);

    await repository.save(libraryBook);

    return {
        output: mapLibraryBookToOutput(libraryBook),
        events: libraryBook.pullDomainEvents()
    };
}

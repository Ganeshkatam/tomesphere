import { LibraryBook } from '../../entities/LibraryBook';
import { ReadingState } from '../../value-objects';

export function runLibraryRepositoryContract() {
    console.log('LibraryRepository contract tests pending testing framework installation');
    
    // Test: Progress Cannot Exceed 100
    try {
        const book = LibraryBook.add('user1', 'book1', 'currently_reading');
        book.updateProgress(150);
        console.error('FAILED: Progress should not exceed 100');
    } catch (error) {
        // Expected
    }

    // Test: Progress Cannot Be Negative
    try {
        const book = LibraryBook.add('user1', 'book1', 'currently_reading');
        book.updateProgress(-10);
        console.error('FAILED: Progress should not be negative');
    } catch (error) {
        // Expected
    }

    // Test: WantToRead to Reading transition
    try {
        const book = LibraryBook.add('user1', 'book1', 'want_to_read');
        book.startReading();
        if (book.state.value !== 'currently_reading') throw new Error();
        if (!book.timeline.startedAt) throw new Error();
    } catch (error) {
        console.error('FAILED: Valid transition from want_to_read to currently_reading failed');
    }

    // Test: Reading to Finished transition automatically sets completion date
    try {
        const book = LibraryBook.add('user1', 'book1', 'currently_reading');
        book.finish();
        if (book.progress.value !== 100) throw new Error();
        if (!book.timeline.finishedAt) throw new Error();
    } catch (error) {
        console.error('FAILED: Finishing a book did not update progress and timeline correctly');
    }

    // Test: Finished -> WantToRead transition clears completion date
    try {
        const book = LibraryBook.add('user1', 'book1', 'finished');
        book.restoreToWantToRead();
        if (book.timeline.finishedAt) throw new Error('FinishedAt should be null');
        if (book.progress.value !== 0) throw new Error('Progress should be 0');
    } catch (error) {
        console.error('FAILED: Restoring to want_to_read failed to clear finished state: ', error);
    }
    
    // Test: Cannot update progress when finished
    try {
        const book = LibraryBook.add('user1', 'book1', 'finished');
        book.updateProgress(50);
        console.error('FAILED: Should not allow progress update when finished');
    } catch (error) {
        // Expected
    }
}

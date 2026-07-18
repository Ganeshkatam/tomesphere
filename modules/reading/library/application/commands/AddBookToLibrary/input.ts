export interface AddBookToLibraryInput {
    readonly userId: string;
    readonly bookId: string;
    readonly initialState?: 'want_to_read' | 'currently_reading' | 'finished' | 'abandoned';
}

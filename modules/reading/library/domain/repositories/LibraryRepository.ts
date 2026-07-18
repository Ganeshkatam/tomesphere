import { LibraryBook } from '../entities/LibraryBook';

export interface LibraryRepository {
    // Intent-based methods
    add(book: LibraryBook): Promise<void>;
    remove(userId: string, bookId: string): Promise<void>;
    
    // Core persistence
    save(book: LibraryBook): Promise<void>;

    // Capability queries
    getLibraryEntry(userId: string, bookId: string): Promise<LibraryBook | null>;
    getCurrentlyReading(userId: string): Promise<LibraryBook[]>;
    getFinished(userId: string): Promise<LibraryBook[]>;
    getWantToRead(userId: string): Promise<LibraryBook[]>;
    getFavorites(userId: string): Promise<LibraryBook[]>;
}

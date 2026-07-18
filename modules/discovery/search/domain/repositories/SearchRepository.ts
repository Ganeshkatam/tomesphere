import { SearchQuery } from '../value-objects/SearchQuery';
import { BookSearchDocument } from '../../infrastructure/models/BookSearchDocument';

export interface SearchRepository {
    // Queries
    search(query: SearchQuery): Promise<{ documents: BookSearchDocument[], totalCount: number }>;
    
    // Index Lifecycle
    index(document: BookSearchDocument): Promise<void>;
    updateIndex(bookId: string, updates: Partial<BookSearchDocument>): Promise<void>;
    removeIndex(bookId: string): Promise<void>;
}

import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/modules/shared/core/types/database';
import { LibraryRepository } from '../domain/repositories/LibraryRepository';
import { LibraryBook } from '../domain/entities/LibraryBook';
import { LibraryMapper } from './mappers/LibraryMapper';

type Client = SupabaseClient<Database>;

export class SupabaseLibraryRepository implements LibraryRepository {
    constructor(private readonly supabase: Client) {}

    async add(book: LibraryBook): Promise<void> {
        return this.save(book);
    }

    async remove(userId: string, bookId: string): Promise<void> {
        const { error } = await this.supabase
            .from('library_books')
            .delete()
            .match({ user_id: userId, book_id: bookId });
            
        if (error) throw new Error(`Failed to remove book from library: ${error.message}`);
    }

    async save(book: LibraryBook): Promise<void> {
        const row = LibraryMapper.toPersistence(book);
        
        // Remove fields that should not be explicitly updated
        const { id, added_at, ...updateData } = row;

        const { error } = await this.supabase
            .from('library_books')
            .upsert(
                { ...updateData },
                { onConflict: 'user_id, book_id' }
            );

        if (error) throw new Error(`Failed to save library book: ${error.message}`);
        
        // Note: The aggregate's pullDomainEvents() would be called by the Application layer 
        // to persist or publish events, rather than inside the repository itself.
    }

    async getLibraryEntry(userId: string, bookId: string): Promise<LibraryBook | null> {
        const { data, error } = await this.supabase
            .from('library_books')
            .select('*')
            .match({ user_id: userId, book_id: bookId })
            .maybeSingle();

        if (error) throw new Error(error.message);
        if (!data) return null;

        // Fetch favorite status (simulated or joined from another table if needed, for now false)
        return LibraryMapper.toDomain(data, false);
    }

    async getCurrentlyReading(userId: string): Promise<LibraryBook[]> {
        return this.getByState(userId, 'currently_reading');
    }

    async getFinished(userId: string): Promise<LibraryBook[]> {
        return this.getByState(userId, 'finished');
    }

    async getWantToRead(userId: string): Promise<LibraryBook[]> {
        return this.getByState(userId, 'want_to_read');
    }

    async getFavorites(userId: string): Promise<LibraryBook[]> {
        // Since favorites is managed elsewhere (e.g. book_likes table), we would need a join.
        // For Phase 5A, we will query book_likes and then library_books, or do a joined query.
        const { data, error } = await this.supabase
            .from('library_books')
            .select('*, book_likes!inner(book_id)')
            .eq('user_id', userId)
            .eq('book_likes.user_id', userId);

        if (error) throw new Error(error.message);
        return (data || []).map(row => LibraryMapper.toDomain(row, true));
    }

    private async getByState(userId: string, state: string): Promise<LibraryBook[]> {
        const { data, error } = await this.supabase
            .from('library_books')
            .select('*')
            .eq('user_id', userId)
            .eq('status', state as any)
            .order('updated_at', { ascending: false });

        if (error) throw new Error(error.message);
        return (data || []).map(row => LibraryMapper.toDomain(row, false));
    }
}

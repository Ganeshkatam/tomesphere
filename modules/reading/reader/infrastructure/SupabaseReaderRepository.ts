import { ReaderSession } from '../domain/ReaderSession';
import { ReaderRepository } from './ReaderRepository';

// Note: This is a placeholder for the actual Supabase implementation.
// In a full implementation, this would map the ReaderSession aggregate to DB rows.
export class SupabaseReaderRepository implements ReaderRepository {
    constructor(private readonly supabase: any) {}

    async save(session: ReaderSession): Promise<void> {
        // Implementation: upsert session, delete/insert bookmarks, highlights
        throw new Error('Not implemented');
    }

    async findById(id: string): Promise<ReaderSession | null> {
        // Implementation: join session with bookmarks and highlights, restore aggregate
        throw new Error('Not implemented');
    }

    async getActiveSession(readerId: string): Promise<ReaderSession | null> {
        // Implementation: query for status='active' and readerId
        throw new Error('Not implemented');
    }
}

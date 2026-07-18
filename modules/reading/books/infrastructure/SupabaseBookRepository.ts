import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/modules/shared/core/types/database';
import type { BookRepository, BookSearchQuery, TrendingQuery, PaginatedResult } from '../domain/repositories/BookRepository';
import type { BookId } from '../domain/value-objects';
import { Book } from '../domain/entities/Book';
import { BookMapper } from './mappers/BookMapper';
import type { BookRow } from './models/BookRow';

export class SupabaseBookRepository implements BookRepository {
    constructor(private readonly client: SupabaseClient<Database>) {}

    async findById(id: BookId): Promise<Book | null> {
        const { data, error } = await this.client
            .from('books')
            .select('*')
            .eq('id', id.value)
            .single();

        if (error || !data) {
            // Depending on the domain, we might throw a custom DomainError here, 
            // but returning null is acceptable for 'not found'.
            return null;
        }

        return BookMapper.toDomain(data as BookRow);
    }

    async search(query: BookSearchQuery): Promise<PaginatedResult<Book>> {
        let dbQuery = this.client
            .from('books')
            .select('*', { count: 'exact' });

        if (query.term) {
            // Because full-text search requires exact matches or lexemes, 
            // fallback to ilike if textSearch isn't heavily configured yet,
            // or use simple textSearch. For the old behavior:
            dbQuery = dbQuery.or(`title.ilike.%${query.term}%,author.ilike.%${query.term}%,description.ilike.%${query.term}%`);
        }

        if (query.genre && query.genre.length > 0) {
            dbQuery = dbQuery.in('genre', query.genre);
        }

        if (query.limit) {
            dbQuery = dbQuery.limit(query.limit);
        }

        if (query.offset) {
            const limit = query.limit || 50;
            dbQuery = dbQuery.range(query.offset, query.offset + limit - 1);
        }

        const { data, error, count } = await dbQuery;

        if (error || !data) {
            return { items: [], totalCount: 0 };
        }

        return {
            items: (data as BookRow[]).map(BookMapper.toDomain),
            totalCount: count ?? undefined,
        };
    }

    async getTrending(query: TrendingQuery): Promise<Book[]> {
        // Step 1: get likes in last 7 days
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
        
        const { data: likes, error: likesError } = await this.client
            .from('book_likes')
            .select('book_id, created_at')
            .gte('created_at', sevenDaysAgo);

        if (likesError || !likes || likes.length === 0) {
            // Fallback if no recent likes: just return most recent books
            const { data: fallbackBooks } = await this.client
                .from('books')
                .select('*')
                .limit(query.limit)
                .order('created_at', { ascending: false });
                
            return (fallbackBooks as BookRow[] || []).map(BookMapper.toDomain);
        }

        // Step 2: count likes per book
        const countMap: Record<string, number> = {};
        for (const like of likes) {
            countMap[like.book_id] = (countMap[like.book_id] || 0) + 1;
        }

        // Step 3: sort book_ids by count
        const sortedIds = Object.entries(countMap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, query.limit)
            .map(([id]) => id);

        if (sortedIds.length === 0) return [];

        // Step 4: fetch books
        const { data: books } = await this.client
            .from('books')
            .select('*')
            .in('id', sortedIds);

        if (!books) return [];

        // Step 5: Preserve the sort order (most liked first)
        const sortedBooks = (books as BookRow[]).sort(
            (a, b) => sortedIds.indexOf(a.id) - sortedIds.indexOf(b.id)
        );

        return sortedBooks.map(BookMapper.toDomain);
    }
}

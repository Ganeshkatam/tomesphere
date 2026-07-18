import { SearchRepository } from '../../domain/repositories/SearchRepository';
import { SearchQuery } from '../../domain/value-objects/SearchQuery';
import { BookSearchDocument } from '../models/BookSearchDocument';

// Placeholder for Supabase implementation.
// In Phase 7A, this uses PostgreSQL Full-Text Search via RPC or direct PostgREST querying.
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../../../../shared/core/types/database';

export class SupabaseSearchRepository implements SearchRepository {
    constructor(private readonly supabase: SupabaseClient<Database>) {}

    async search(query: SearchQuery): Promise<{ documents: BookSearchDocument[], totalCount: number }> {
        let dbQuery = this.supabase
            .from('discovery_search_documents')
            .select('*', { count: 'exact' });

        // Apply Text Search (Phase 7A Keyword mode)
        if (query.text) {
            // Using websearch_to_tsquery equivalent or just textSearch
            dbQuery = dbQuery.textSearch('fts_tokens', query.text, { config: 'english' });
        }

        // Apply Filters
        if (query.filters.language) {
            dbQuery = dbQuery.eq('language', query.filters.language);
        }
        if (query.filters.categories && query.filters.categories.length > 0) {
            dbQuery = dbQuery.contains('categories', query.filters.categories);
        }
        if (query.filters.authors && query.filters.authors.length > 0) {
            dbQuery = dbQuery.contains('authors', query.filters.authors);
        }
        if (query.filters.publicationYear) {
            dbQuery = dbQuery.eq('publication_year', query.filters.publicationYear);
        }
        if (query.filters.availability) {
            dbQuery = dbQuery.eq('availability_status', query.filters.availability);
        }

        // Apply Sorting
        switch (query.sort) {
            case 'popularity':
                dbQuery = dbQuery.order('popularity_score', { ascending: false });
                break;
            case 'rating':
                dbQuery = dbQuery.order('rating', { ascending: false });
                break;
            case 'newest':
                dbQuery = dbQuery.order('publication_year', { ascending: false });
                break;
            case 'relevance':
            default:
                // If there's text, Postgres textSearch orders by rank by default.
                // Otherwise, fallback to popularity
                if (!query.text) {
                    dbQuery = dbQuery.order('popularity_score', { ascending: false });
                }
                break;
        }

        // Apply Pagination
        dbQuery = dbQuery.range(
            query.pagination.offset,
            query.pagination.offset + query.pagination.limit - 1
        );

        const { data, count, error } = await dbQuery;

        if (error) {
            throw new Error(`Search failed: ${error.message}`);
        }

        const documents = (data || []).map(row => ({
            bookId: row.book_id,
            title: row.title,
            subtitle: row.subtitle || undefined,
            authors: row.authors,
            categories: row.categories,
            language: row.language,
            description: row.description || undefined,
            keywords: row.keywords,
            publicationYear: row.publication_year || undefined,
            availabilityStatus: row.availability_status as 'available' | 'coming_soon' | 'out_of_print',
            popularityScore: row.popularity_score || 0,
            rating: row.rating || 0
        }));

        return {
            documents,
            totalCount: count || 0
        };
    }

    async index(document: BookSearchDocument): Promise<void> {
        // Just trigger the RPC to pull from source of truth
        await this.supabase.rpc('refresh_search_document', { target_book_id: document.bookId });
    }

    async updateIndex(bookId: string, updates: Partial<BookSearchDocument>): Promise<void> {
        await this.supabase.rpc('refresh_search_document', { target_book_id: bookId });
    }

    async removeIndex(bookId: string): Promise<void> {
        // For deletion, we just delete the row if it exists
        await this.supabase.from('discovery_search_documents').delete().eq('book_id', bookId);
    }
}

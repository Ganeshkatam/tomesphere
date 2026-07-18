'use server';

import { createSupabaseServerClient } from '@/modules/shared/core/database/server';
import type { ActionResult } from '@/modules/shared/core/types/ActionResult';
import type { Book } from '@/modules/shared/core/database/client';

const PAGE_SIZE = 20;

export async function searchBooks(
    query: string,
    genre: string,
    page: number = 1
): Promise<ActionResult<{ books: Book[]; count: number; page: number; pageSize: number; hasMore: boolean }>> {
    try {
        const supabase = await createSupabaseServerClient();

        // Sanitize inputs
        const sanitizedQuery = query.replace(/[\\'";<>]/g, '').trim();
        const sanitizedGenre = genre.replace(/[\\'";<>]/g, '').trim();
        // Support comma-separated genres: take the first one for the DB function
        const primaryGenre = sanitizedGenre.split(',')[0]?.trim() || '';

        // Use the PostgreSQL FTS function — index-based, ranked, with trigram fallback
        const { data, error } = await supabase.rpc('search_books_fts', {
            search_query: sanitizedQuery,
            genre_filter: primaryGenre,
            page_number: page,
            page_size: PAGE_SIZE,
        });

        if (error) {
            console.error('FTS search error:', error.message);
            return { success: false, error: error.message };
        }

        const books: Book[] = (data || []).map((row: Record<string, unknown>) => {
            // Strip the rank and total_count fields added by the function
            const { rank, total_count, ...bookData } = row as Record<string, unknown>;
            return bookData as unknown as Book;
        });

        const totalCount = data?.[0]?.total_count || 0;

        return {
            success: true,
            data: {
                books,
                count: Number(totalCount),
                page,
                pageSize: PAGE_SIZE,
                hasMore: (page * PAGE_SIZE) < Number(totalCount),
            },
        };
    } catch (error: unknown) {
        return { success: false, error: error instanceof Error ? error.message : 'Search failed' };
    }
}

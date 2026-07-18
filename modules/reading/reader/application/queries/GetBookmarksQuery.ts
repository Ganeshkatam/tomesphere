'use server';

import { createSupabaseServerClient } from '@/modules/shared/core/database/server';
import { ReaderBookmark } from '@/modules/shared/core/events/types';

export interface GetBookmarksRequest {
    userId: string;
    bookId: string;
}

export async function executeGetBookmarks(request: GetBookmarksRequest): Promise<ReaderBookmark[]> {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
        .from('reader_bookmarks')
        .select('*')
        .match({ user_id: request.userId, book_id: request.bookId })
        .order('created_at', { ascending: false }); // Newest first

    if (error) {
        console.error('Failed to fetch bookmarks:', error);
        throw new Error('Failed to fetch bookmarks');
    }

    if (!data) return [];

    return data.map((row: any) => ({
        id: row.id,
        userId: row.user_id,
        bookId: row.book_id,
        anchor: row.location_anchor,
        label: row.label || undefined,
        createdAt: row.created_at
    }));
}

'use server';

import { createSupabaseServerClient } from '@/modules/shared/core/database/server';
import { ReaderHighlight } from '@/modules/shared/core/events/types';

export interface GetHighlightsRequest {
    userId: string;
    bookId: string;
}

export async function executeGetHighlights(request: GetHighlightsRequest): Promise<ReaderHighlight[]> {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
        .from('reader_highlights')
        .select('*')
        .match({ user_id: request.userId, book_id: request.bookId });

    if (error) {
        console.error('Failed to fetch highlights:', error);
        throw new Error('Failed to fetch highlights');
    }

    if (!data) return [];

    return data.map((row: any) => ({
        id: row.id,
        userId: row.user_id,
        bookId: row.book_id,
        selectionAnchor: row.location_anchor,
        selectedText: row.selected_text,
        color: row.color,
        hasNote: false // Computed later by ReaderService after notes are loaded
    }));
}

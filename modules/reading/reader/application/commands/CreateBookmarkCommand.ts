'use server';

import { createSupabaseServerClient } from '@/modules/shared/core/database/server';
import { LocationAnchor } from '@/modules/shared/core/events/types';
import { emitOutboxEvent } from '@/modules/shared/core/infrastructure/outbox/outbox';

export interface CreateBookmarkRequest {
    userId: string;
    bookId: string;
    anchor: LocationAnchor;
    label?: string;
}

export async function executeCreateBookmark(request: CreateBookmarkRequest): Promise<{ id: string }> {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
        .from('reader_bookmarks')
        .insert({
            user_id: request.userId,
            book_id: request.bookId,
            location_anchor: request.anchor as any,
            label: request.label || null
        })
        .select('id')
        .single();

    if (error || !data) {
        console.error('Failed to create bookmark:', error);
        throw new Error('Failed to create bookmark');
    }

    const bookmarkId = data.id;

    await emitOutboxEvent(supabase, 'reader:bookmark_created', {
        userId: request.userId,
        bookId: request.bookId,
        bookmarkId,
        anchor: request.anchor
    });

    return { id: bookmarkId };
}

'use server';

import { createSupabaseServerClient } from '@/modules/shared/core/database/server';
import { SelectionAnchor } from '@/modules/shared/core/events/types';
import { emitOutboxEvent } from '@/modules/shared/core/infrastructure/outbox/outbox';

export interface CreateHighlightRequest {
    userId: string;
    bookId: string;
    selectionAnchor: SelectionAnchor;
    selectedText: string;
    color?: string;
}

export async function executeCreateHighlight(request: CreateHighlightRequest): Promise<{ id: string }> {
    const supabase = await createSupabaseServerClient();

    // 1. Insert the highlight
    const { data, error } = await supabase
        .from('reader_highlights')
        .insert({
            user_id: request.userId,
            book_id: request.bookId,
            location_anchor: request.selectionAnchor as any, // jsonb implicitly handles SelectionAnchor
            selected_text: request.selectedText,
            color: request.color || 'yellow'
        })
        .select('id')
        .single();

    if (error || !data) {
        console.error('Failed to create highlight:', error);
        throw new Error('Failed to create highlight');
    }

    const highlightId = data.id;

    // 2. Emit highlight_created event
    await emitOutboxEvent(supabase, 'reader:highlight_created', {
        userId: request.userId,
        bookId: request.bookId,
        highlightId: highlightId,
        selectionAnchor: request.selectionAnchor,
        selectedText: request.selectedText,
        color: request.color || 'yellow'
    });

    return { id: highlightId };
}


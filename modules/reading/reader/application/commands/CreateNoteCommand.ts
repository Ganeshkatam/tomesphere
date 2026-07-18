import { createSupabaseServerClient } from '@/modules/shared/core/database/server';
import { LocationAnchor } from '@/modules/shared/core/events/types';
import { emitOutboxEvent } from '@/modules/shared/core/infrastructure/outbox/outbox';

export interface CreateNoteRequest {
    userId: string;
    bookId: string;
    locationAnchor: LocationAnchor;
    bodyMarkdown: string;
    highlightId?: string; // Optional: attached to a highlight
}

export async function executeCreateNote(request: CreateNoteRequest): Promise<{ id: string }> {
    const supabase = await createSupabaseServerClient();

    // 1. Insert the note
    const { data, error } = await supabase
        .from('reader_notes')
        .insert({
            user_id: request.userId,
            book_id: request.bookId,
            highlight_id: request.highlightId || null,
            location_anchor: request.locationAnchor as any,
            body_markdown: request.bodyMarkdown
        })
        .select('id')
        .single();

    if (error || !data) {
        console.error('Failed to create note:', error);
        throw new Error('Failed to create note');
    }

    const noteId = data.id;

    // 2. Emit note_created event
    await emitOutboxEvent(supabase, 'reader:note_created', {
        userId: request.userId,
        bookId: request.bookId,
        noteId: noteId,
        locationAnchor: request.locationAnchor,
        highlightId: request.highlightId
    });

    return { id: noteId };
}

'use server';

import { createSupabaseServerClient } from '@/modules/shared/core/database/server';
import { AnnotationTarget, LocationAnchor } from '@/modules/shared/core/events/types';
import { emitOutboxEvent } from '@/modules/shared/core/infrastructure/outbox/outbox';

export interface CreateNoteRequest {
    userId: string;
    bookId: string;
    target: AnnotationTarget;
    bodyMarkdown: string;
}

export async function executeCreateNote(request: CreateNoteRequest): Promise<{ id: string }> {
    const supabase = await createSupabaseServerClient();

    // Resolve highlight_id and location_anchor from the AnnotationTarget
    let highlightId: string | null = null;
    let locationAnchor: LocationAnchor;

    if (request.target.type === 'highlight') {
        highlightId = request.target.highlightId;

        // Fetch the highlight's anchor to store alongside the note
        const { data: highlight } = await supabase
            .from('reader_highlights')
            .select('location_anchor')
            .eq('id', highlightId)
            .single();

        // Use the highlight's stored anchor as the note's location
        locationAnchor = highlight?.location_anchor?.start || { type: 'epubcfi', value: '' };
    } else {
        locationAnchor = request.target.anchor;
    }

    // 1. Insert the note
    const { data, error } = await supabase
        .from('reader_notes')
        .insert({
            user_id: request.userId,
            book_id: request.bookId,
            highlight_id: highlightId,
            location_anchor: locationAnchor as any,
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
        target: request.target
    });

    return { id: noteId };
}

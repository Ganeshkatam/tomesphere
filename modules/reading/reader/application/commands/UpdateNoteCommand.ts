import { createSupabaseServerClient } from '@/modules/shared/core/database/server';

export interface UpdateNoteRequest {
    userId: string;
    noteId: string;
    bodyMarkdown: string;
}

export async function executeUpdateNote(request: UpdateNoteRequest): Promise<void> {
    const supabase = await createSupabaseServerClient();

    const { error } = await supabase
        .from('reader_notes')
        .update({
            body_markdown: request.bodyMarkdown
            // updated_at is handled by Postgres trigger
        })
        .match({ id: request.noteId, user_id: request.userId });

    if (error) {
        console.error('Failed to update note:', error);
        throw new Error('Failed to update note');
    }
}

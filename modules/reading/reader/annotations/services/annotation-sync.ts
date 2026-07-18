import { supabase } from '@/modules/shared/core/database/client';
import type { Annotation } from '../types/models';
import { useAnnotationStore } from '../state/annotation-store';

/**
 * 🚨 ANNOTATION SYNC ENGINE
 * 
 * This service handles pushing pending annotations to the backend and
 * pulling remote annotations down.
 * 
 * It runs completely detached from the UI thread.
 */

export class AnnotationSyncService {
    private bookId: string;
    private userId: string;
    private isSyncing = false;

    constructor(bookId: string, userId: string) {
        this.bookId = bookId;
        this.userId = userId;
    }

    /**
     * Pulls the latest annotations from the backend and initializes the store.
     */
    async pullRemote(): Promise<void> {
        try {
            const { data, error } = await supabase
                .from('annotations')
                .select('*')
                .eq('book_id', this.bookId)
                .eq('user_id', this.userId);

            if (error) throw error;

            if (data) {
                // Map DB schema to our internal domain models
                const mapped: Annotation[] = data.map(row => ({
                    id: row.id,
                    bookId: row.book_id,
                    userId: row.user_id,
                    type: row.type as any,
                    anchor: row.anchor as any, // JSONB in postgres
                    color: row.color,
                    noteText: row.note_text,
                    createdAt: row.created_at,
                    updatedAt: row.updated_at,
                    syncState: 'synced'
                }));

                useAnnotationStore.getState().setAnnotations(mapped);
            }
        } catch (err) {
            console.error('Failed to pull annotations:', err);
        }
    }

    /**
     * Pushes any pending creations, updates, or deletions to the backend.
     */
    async pushPending(): Promise<void> {
        if (this.isSyncing) return;
        this.isSyncing = true;

        const store = useAnnotationStore.getState();
        const pendingAnnotations = Object.values(store.annotations).filter(a => a.syncState !== 'synced');

        if (pendingAnnotations.length === 0) {
            this.isSyncing = false;
            return;
        }

        for (const annotation of pendingAnnotations) {
            try {
                if (annotation.syncState === 'pending_create') {
                    const { error } = await supabase.from('annotations').insert({
                        id: annotation.id.startsWith('temp_') ? undefined : annotation.id,
                        book_id: annotation.bookId,
                        user_id: annotation.userId,
                        type: annotation.type,
                        anchor: annotation.anchor as any,
                        color: annotation.color,
                        note_text: annotation.noteText
                    });

                    if (!error) {
                        store.updateAnnotation(annotation.id, { syncState: 'synced' });
                    }
                } 
                else if (annotation.syncState === 'pending_update') {
                    const { error } = await supabase.from('annotations')
                        .update({
                            anchor: annotation.anchor as any,
                            color: annotation.color,
                            note_text: annotation.noteText,
                            updated_at: new Date().toISOString()
                        })
                        .eq('id', annotation.id);

                    if (!error) {
                        store.updateAnnotation(annotation.id, { syncState: 'synced' });
                    }
                }
                else if (annotation.syncState === 'pending_delete') {
                    const { error } = await supabase.from('annotations')
                        .delete()
                        .eq('id', annotation.id);

                    if (!error) {
                        store.removeAnnotation(annotation.id); // Removes entirely from local store
                    }
                }
            } catch (err) {
                console.error(`Failed to sync annotation ${annotation.id}:`, err);
            }
        }

        this.isSyncing = false;
    }
}

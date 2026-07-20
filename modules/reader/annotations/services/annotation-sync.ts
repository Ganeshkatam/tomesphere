import { fetchAnnotations, pushAnnotationChanges } from "../actions/sync";
import type { Annotation } from "../types/models";
import { useAnnotationStore } from "../state/annotation-store";

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
      const res = await fetchAnnotations(this.bookId);

      if (res.success && res.data) {
        // Map DB schema to our internal domain models
        const mapped: Annotation[] = res.data.map((row: any) => ({
          id: row.id,
          bookId: row.book_id,
          userId: row.user_id,
          type: row.type as any,
          anchor: row.anchor as any, // JSONB in postgres
          color: row.color,
          noteText: row.note_text,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
          syncState: "synced",
        }));

        useAnnotationStore.getState().setAnnotations(mapped);
      }
    } catch (err) {
      console.error("Failed to pull annotations:", err);
    }
  }

  /**
   * Pushes any pending creations, updates, or deletions to the backend.
   */
  async pushPending(): Promise<void> {
    if (this.isSyncing) return;
    this.isSyncing = true;

    const store = useAnnotationStore.getState();
    const pendingAnnotations = Object.values(store.annotations).filter(
      (a) => a.syncState !== "synced",
    );

    if (pendingAnnotations.length === 0) {
      this.isSyncing = false;
      return;
    }

    const creates: any[] = [];
    const updates: any[] = [];
    const deletes: string[] = [];

    for (const annotation of pendingAnnotations) {
      if (annotation.syncState === "pending_create") {
        creates.push({
          id: annotation.id.startsWith("temp_") ? undefined : annotation.id,
          book_id: annotation.bookId,
          type: annotation.type,
          anchor: annotation.anchor as any,
          color: annotation.color,
          note_text: annotation.noteText,
        });
      } else if (annotation.syncState === "pending_update") {
        updates.push({
          id: annotation.id,
          data: {
            anchor: annotation.anchor as any,
            color: annotation.color,
            note_text: annotation.noteText,
            updated_at: new Date().toISOString(),
          },
        });
      } else if (annotation.syncState === "pending_delete") {
        deletes.push(annotation.id);
      }
    }

    try {
      const res = await pushAnnotationChanges({ creates, updates, deletes });
      if (res.success) {
        for (const annotation of pendingAnnotations) {
          if (annotation.syncState === "pending_delete") {
            store.removeAnnotation(annotation.id);
          } else {
            store.updateAnnotation(annotation.id, { syncState: "synced" });
          }
        }
      } else {
        console.error(`Failed to sync annotations:`, res.error.message);
      }
    } catch (err) {
      console.error(`Failed to sync annotations:`, err);
    }

    this.isSyncing = false;
  }
}

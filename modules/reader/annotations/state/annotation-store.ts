import { create } from "zustand";
import type { Annotation, AnnotationCreatePayload } from "../types/models";

/**
 * 🚨 ANNOTATION SUBSYSTEM STATE
 *
 * This store is strictly for Annotation data.
 * It is completely separated from the base `reader-store.ts` to prevent
 * massive array mutations (e.g. loading 500 highlights) from triggering
 * re-renders in the core document viewer toolbar/shell.
 */

interface AnnotationState {
  annotations: Record<string, Annotation>; // Keyed by ID for O(1) lookups
  activeAnnotationId: string | null; // Currently selected/hovered annotation
  isCreating: boolean;

  // Actions
  setAnnotations: (annotations: Annotation[]) => void;
  addAnnotation: (
    payload: AnnotationCreatePayload,
    bookId: string,
    userId: string,
  ) => void;
  updateAnnotation: (id: string, updates: Partial<Annotation>) => void;
  removeAnnotation: (id: string) => void;
  setActiveAnnotation: (id: string | null) => void;
  setIsCreating: (isCreating: boolean) => void;
}

export const useAnnotationStore = create<AnnotationState>((set) => ({
  annotations: {},
  activeAnnotationId: null,
  isCreating: false,

  setAnnotations: (annotationsList) => {
    const map: Record<string, Annotation> = {};
    annotationsList.forEach((a) => {
      map[a.id] = a;
    });
    set({ annotations: map });
  },

  addAnnotation: (payload, bookId, userId) =>
    set((state) => {
      const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const newAnnotation: Annotation = {
        id: tempId,
        bookId,
        userId,
        ...payload,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        syncState: "pending_create",
      };

      return {
        annotations: { ...state.annotations, [tempId]: newAnnotation },
      };
    }),

  updateAnnotation: (id, updates) =>
    set((state) => {
      const existing = state.annotations[id];
      if (!existing) return state;

      return {
        annotations: {
          ...state.annotations,
          [id]: {
            ...existing,
            ...updates,
            updatedAt: new Date().toISOString(),
            syncState:
              existing.syncState === "synced"
                ? "pending_update"
                : existing.syncState,
          },
        },
      };
    }),

  removeAnnotation: (id) =>
    set((state) => {
      const existing = state.annotations[id];
      if (!existing) return state;

      // If it was only local, we can delete it outright.
      if (existing.syncState === "pending_create") {
        const nextAnnotations = { ...state.annotations };
        delete nextAnnotations[id];
        return { annotations: nextAnnotations };
      }

      // Otherwise, mark for deletion sync
      return {
        annotations: {
          ...state.annotations,
          [id]: { ...existing, syncState: "pending_delete" },
        },
      };
    }),

  setActiveAnnotation: (id) => set({ activeAnnotationId: id }),
  setIsCreating: (isCreating) => set({ isCreating }),
}));

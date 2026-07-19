import type { AnnotationAnchor } from "../../application/ports/AnnotationAnchor";

export type AnnotationType = "highlight" | "note" | "drawing" | "citation";
export type AnnotationColor = "yellow" | "green" | "blue" | "pink" | "purple";

export interface Annotation {
  id: string;
  bookId: string;
  userId: string;

  type: AnnotationType;
  anchor: AnnotationAnchor;

  // For highlights/drawings
  color?: AnnotationColor;

  // For text notes attached to highlights or areas
  noteText?: string;

  // Metadata
  createdAt: string;
  updatedAt: string;

  // Sync state: allows optimistic UI and offline creation
  syncState: "synced" | "pending_create" | "pending_update" | "pending_delete";
}

export interface AnnotationCreatePayload {
  type: AnnotationType;
  anchor: AnnotationAnchor;
  color?: AnnotationColor;
  noteText?: string;
}

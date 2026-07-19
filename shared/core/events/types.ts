/**
 * 🚨 PLATFORM EVENT SYSTEM TYPES
 *
 * Defines the strict, typed payloads for inter-domain communication.
 * Domains must NEVER call each other directly for side effects.
 * They must emit an event on the bus instead.
 */

// Format-agnostic value object for Reader Domain single positions
export interface LocationAnchor {
  type: "epubcfi" | "pdf" | "html" | "custom";
  value: string;
}

// Format-agnostic value object for ranges/highlights
export interface SelectionAnchor {
  version: 1;
  start: LocationAnchor;
  end: LocationAnchor;
}

// Domain Object for Rendering
export interface ReaderHighlight {
  id: string;
  userId: string;
  bookId: string;
  selectionAnchor: SelectionAnchor;
  selectedText: string;
  color: string;
  hasNote: boolean; // Derived at load time, not persisted
}

// Discriminated union: what a Note is attached to
export type AnnotationTarget =
  | { type: "highlight"; highlightId: string }
  | { type: "location"; anchor: LocationAnchor };

// Domain Object for Notes
export interface ReaderNote {
  id: string;
  userId: string;
  bookId: string;
  target: AnnotationTarget;
  bodyMarkdown: string;
  createdAt: string;
  updatedAt: string;
}

// Domain Object for Bookmarks
export interface ReaderBookmark {
  id: string;
  userId: string;
  bookId: string;
  anchor: LocationAnchor;
  label?: string;
  createdAt: string;
}

// UI Projection: Annotation (Highlight + Note)
export interface ReaderAnnotation {
  highlight: ReaderHighlight;
  note?: ReaderNote;
}

// UI Projection: Bookmark View (Bookmark + Context)
export interface ReaderBookmarkView {
  bookmark: ReaderBookmark;
  isCurrent: boolean;
  preview?: string;
}

// 1. Define standard event names as a strict union to prevent typos
export type PlatformEventName =
  | "reader:progress_updated"
  | "reader:position_updated"
  | "reader:highlight_created"
  | "reader:note_created"
  | "reader:page_completed"
  | "reader:session_ended"
  | "reader:bookmark_created"
  | "auth:user_logged_in"
  | "library:book_added"
  | "profile:identity_updated"
  | "profile:avatar_changed"
  | "progress:level_up"
  | "progress:achievement_unlocked"
  | "book:liked"
  | "book:rated"
  | "reader:book_completed"
  | "catalog:book_published"
  | "catalog:book_updated"
  | "catalog:book_deleted";

// 2. Define the payload structure for every single event
export interface EventPayloads {
  "reader:progress_updated": {
    userId: string;
    bookId: string;
    readerSessionId: string;
    previousPage: number;
    currentPage: number;
    pagesReadDelta: number;
    occurredAt: string;
  };
  "reader:position_updated": {
    userId: string;
    bookId: string;
    locationAnchor: LocationAnchor;
    occurredAt: string;
  };
  "reader:highlight_created": {
    userId: string;
    bookId: string;
    highlightId: string;
    selectionAnchor: SelectionAnchor;
    selectedText: string;
    color: string;
  };
  "reader:note_created": {
    userId: string;
    bookId: string;
    noteId: string;
    target: AnnotationTarget;
  };
  "reader:bookmark_created": {
    userId: string;
    bookId: string;
    bookmarkId: string;
    anchor: LocationAnchor;
  };
  "reader:page_completed": {
    userId: string;
    bookId: string;
    pageNumber: number;
    timestamp: number;
  };
  "reader:session_ended": {
    userId: string;
    bookId: string;
    durationSeconds: number;
  };
  "auth:user_logged_in": { userId: string; timestamp: number };
  "library:book_added": { userId: string; bookId: string; status?: string };
  "profile:identity_updated": {
    userId: string;
    displayName: string;
    biography: string;
    location: string;
  };
  "profile:avatar_changed": { userId: string; avatarUrl: string };
  "progress:level_up": { userId: string; level: number; title: string };
  "progress:achievement_unlocked": { userId: string; achievementId: string };
  "book:liked": { userId: string; bookId: string };
  "book:rated": { userId: string; bookId: string; rating: number };
  "reader:book_completed": { userId: string; bookId: string };
  "catalog:book_published": { bookId: string };
  "catalog:book_updated": { bookId: string };
  "catalog:book_deleted": { bookId: string };
}

// 3. The Contract for the Event Bus
export interface IEventBus {
  emit<T extends PlatformEventName>(event: T, payload: EventPayloads[T]): void;
  subscribe<T extends PlatformEventName>(
    event: T,
    handler: (payload: EventPayloads[T]) => void | Promise<void>,
  ): () => void;
}

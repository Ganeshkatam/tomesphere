import type { DocumentMetadata } from "./DocumentEngine";

/**
 * 🚨 PLATFORM CONTRACT: ReaderSession
 *
 * Defines the strict boundaries of a single user reading session.
 * Used for syncing progress, enforcing limits, and analytics.
 */

export interface ReaderSession {
  sessionId: string;
  userId: string;
  bookId: string;

  // Derived from the active document engine
  documentMetadata: DocumentMetadata;

  // Core session state
  startedAt: string;
  lastActivityAt: string;

  // Progress
  maxPageReached: number;
  currentPage: number;
  totalTimeSpentSeconds: number;

  // Capabilities (e.g. offline permitted)
  isOfflineMode: boolean;
  canAnnotate: boolean;
}

import { LocationAnchor } from "@/shared/core/events/types";
import {
  startReadingSessionAction,
  updateReaderPositionAction,
  completeReadingSessionAction,
  completeBookAction,
} from "../../presentation/actions/reader";

export class ReaderSessionFacade {
  private bookId: string;
  private sessionId: string | null = null;

  constructor(bookId: string) {
    this.bookId = bookId;
  }

  async startSession(initialPage: number = 1): Promise<void> {
    try {
      const res = await startReadingSessionAction({
        bookId: this.bookId,
        initialPage,
      });
      if (res.success && res.data?.sessionId) {
        this.sessionId = res.data.sessionId;
      }
    } catch (error) {
      console.error("Failed to start reading session", error);
    }
  }

  async saveProgress(anchor: LocationAnchor): Promise<void> {
    try {
      await updateReaderPositionAction({
        bookId: this.bookId,
        locationAnchor: anchor,
      });
    } catch (error) {
      console.error("Failed to save progress", error);
    }
  }

  async completeSession(
    durationSeconds: number,
    pagesRead: number = 0,
    currentPage?: number,
  ): Promise<void> {
    try {
      if (durationSeconds <= 0 && pagesRead <= 0) return;
      await completeReadingSessionAction({
        bookId: this.bookId,
        sessionId: this.sessionId || undefined,
        durationSeconds,
        pagesRead,
        currentPage,
      });
    } catch (error) {
      console.error("Failed to complete session", error);
    }
  }

  async markBookCompleted(): Promise<void> {
    try {
      await completeBookAction({ bookId: this.bookId });
    } catch (error) {
      console.error("Failed to mark book completed", error);
    }
  }
}

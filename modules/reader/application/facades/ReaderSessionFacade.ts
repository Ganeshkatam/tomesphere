import { LocationAnchor } from "@/shared/core/events/types";
import {
  updateReaderPositionAction,
  completeReadingSessionAction,
} from "../../presentation/actions/reader";

export class ReaderSessionFacade {
  private bookId: string;

  constructor(bookId: string) {
    this.bookId = bookId;
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

  async completeSession(durationSeconds: number, pagesRead: number = 0): Promise<void> {
    try {
      await completeReadingSessionAction({
        bookId: this.bookId,
        durationSeconds,
        pagesRead,
      });
    } catch (error) {
      console.error("Failed to complete session", error);
    }
  }

  async markBookCompleted(): Promise<void> {
    try {
      const { completeBookAction } = await import("../../presentation/actions/reader");
      await completeBookAction({ bookId: this.bookId });
    } catch (error) {
      console.error("Failed to mark book completed", error);
    }
  }
}

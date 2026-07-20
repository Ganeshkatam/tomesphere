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

  async completeSession(durationSeconds: number): Promise<void> {
    try {
      await completeReadingSessionAction({
        bookId: this.bookId,
        durationSeconds,
      });
    } catch (error) {
      console.error("Failed to complete session", error);
    }
  }
}

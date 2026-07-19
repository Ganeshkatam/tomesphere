import {
  EventPayloads,
  PlatformEventName,
} from "@/modules/shared/core/events/types";
import { AnalyticsProjectionStore } from "../../infrastructure/SupabaseAnalyticsProjectionStore";

export class AnalyticsEventHandlers {
  constructor(private readonly store: AnalyticsProjectionStore) {}

  async handleReaderProgressUpdated(
    payload: EventPayloads["reader:progress_updated"],
  ): Promise<void> {
    const { userId, bookId, pagesReadDelta, occurredAt } = payload;
    const dateStr = (occurredAt || new Date().toISOString()).split("T")[0];

    if (pagesReadDelta && pagesReadDelta > 0) {
      await this.store.recordPagesRead(userId, bookId, pagesReadDelta, dateStr);
    }
  }

  async handleReaderBookCompleted(
    payload: EventPayloads["reader:book_completed"],
  ): Promise<void> {
    const { userId, bookId } = payload;
    const dateStr = new Date().toISOString().split("T")[0];
    await this.store.recordBookCompleted(userId, bookId, dateStr);
  }

  async handleLibraryBookAdded(
    payload: EventPayloads["library:book_added"],
  ): Promise<void> {
    const { userId, bookId, status } = payload;
    const dateStr = new Date().toISOString().split("T")[0];
    // We consider it "started" if they add it as currently reading.
    if (status === "currently_reading") {
      await this.store.recordBookStarted(userId, bookId, dateStr);
    }
  }

  async handleBookRated(payload: EventPayloads["book:rated"]): Promise<void> {
    const { userId, bookId, rating } = payload;
    await this.store.updateBookRating(userId, bookId, rating || 0);
  }

  async handleBookLiked(payload: EventPayloads["book:liked"]): Promise<void> {
    const { userId, bookId } = payload;
    await this.store.recordBookLiked(userId, bookId);
  }
}

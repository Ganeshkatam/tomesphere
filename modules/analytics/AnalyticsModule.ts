import { IEventBus } from "@/shared/core/events/types";
import { AnalyticsEventHandlers } from "./application/event-handlers/AnalyticsEventHandlers";
import { SupabaseAnalyticsProjectionStore } from "./infrastructure/SupabaseAnalyticsProjectionStore";
import { createSupabaseServerClient } from "@/shared/core/database/server";

export class AnalyticsModule {
  static async registerEventHandlers(bus: IEventBus): Promise<void> {
    const supabase = await createSupabaseServerClient();
    const store = new SupabaseAnalyticsProjectionStore(supabase);
    const handlers = new AnalyticsEventHandlers(store);

    bus.subscribe("reader:progress_updated", async (payload) => {
      await handlers.handleReaderProgressUpdated(payload);
    });

    bus.subscribe("reader:book_completed", async (payload) => {
      await handlers.handleReaderBookCompleted(payload);
    });

    bus.subscribe("library:book_added", async (payload) => {
      await handlers.handleLibraryBookAdded(payload);
    });

    bus.subscribe("book:rated", async (payload) => {
      await handlers.handleBookRated(payload);
    });

    bus.subscribe("book:liked", async (payload) => {
      await handlers.handleBookLiked(payload);
    });
  }
}

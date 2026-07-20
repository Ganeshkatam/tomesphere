import { IEventBus } from "@/shared/core/events/types";
import { NotificationEventHandlers } from "./application/event-handlers/NotificationEventHandlers";

export class NotificationsModule {
  public static async registerEventHandlers(eventBus: IEventBus): Promise<void> {
    const handlers = new NotificationEventHandlers(eventBus);
    handlers.register();
  }
}

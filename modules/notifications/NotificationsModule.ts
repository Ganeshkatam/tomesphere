import { IEventBus } from "@/shared/core/events/types";
import { NotificationEventHandlers } from "./application/event-handlers/NotificationEventHandlers";
import { INotificationRepository } from "./domain/repositories/INotificationRepository";

export class NotificationsModule {
  public static async registerEventHandlers(
    eventBus: IEventBus,
    notificationRepository: INotificationRepository,
  ): Promise<void> {
    const handlers = new NotificationEventHandlers(eventBus, notificationRepository);
    handlers.register();
  }
}

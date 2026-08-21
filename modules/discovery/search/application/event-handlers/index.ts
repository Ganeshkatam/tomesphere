import { IEventBus } from "@/shared/core/events/types";
import { SearchAnalyticsHandler } from "./SearchAnalyticsHandler";

declare global {
  var __searchEventHandlersSubscribed: boolean | undefined;
}

export function initializeSearchEventHandlers(
  eventBus: IEventBus,
  analyticsHandler: SearchAnalyticsHandler,
) {
  if (globalThis.__searchEventHandlersSubscribed) {
    return;
  }
  globalThis.__searchEventHandlersSubscribed = true;

  eventBus.subscribe("discovery.search.executed", async (payload: any) => {
    await analyticsHandler.handle(payload);
  });
}

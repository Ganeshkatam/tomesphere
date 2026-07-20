import { IEventBus } from "@/shared/core/events/types";
import { SearchAnalyticsHandler } from "./SearchAnalyticsHandler";

export function initializeSearchEventHandlers(
  eventBus: IEventBus,
  analyticsHandler: SearchAnalyticsHandler,
) {
  eventBus.subscribe("discovery.search.executed", async (payload: any) => {
    await analyticsHandler.handle(payload);
  });
}

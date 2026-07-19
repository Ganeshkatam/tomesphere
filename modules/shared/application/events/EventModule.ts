import { EventRegistry } from "./EventRegistry";

export interface EventModule {
  registerEventHandlers(registry: EventRegistry): void;
}

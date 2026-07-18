import { IEventBus, PlatformEventName, EventPayloads } from './types';

/**
 * 🚨 CORE SYSTEM EVENT BUS
 * 
 * An in-memory, strongly typed publisher/subscriber bus.
 * This prevents domains from importing each other to trigger side effects.
 */
class MemoryEventBus implements IEventBus {
    private handlers: Map<PlatformEventName, Set<Function>> = new Map();

    /**
     * Emits an event to all registered subscribers asynchronously
     * to prevent blocking the main thread or the publisher.
     */
    emit<T extends PlatformEventName>(event: T, payload: EventPayloads[T]): void {
        const eventHandlers = this.handlers.get(event);
        if (!eventHandlers || eventHandlers.size === 0) return;

        // Execute handlers in the next tick to prevent blocking the publisher
        setTimeout(() => {
            eventHandlers.forEach(async (handler) => {
                try {
                    await handler(payload);
                } catch (error) {
                    console.error(`Event handler failed for event: ${event}`, { error, payload });
                }
            });
        }, 0);
    }

    /**
     * Subscribes to an event. Returns an unsubscribe function to prevent memory leaks.
     */
    subscribe<T extends PlatformEventName>(event: T, handler: (payload: EventPayloads[T]) => void | Promise<void>): () => void {
        if (!this.handlers.has(event)) {
            this.handlers.set(event, new Set());
        }
        
        const eventHandlers = this.handlers.get(event)!;
        eventHandlers.add(handler);

        // Return unsubscribe function
        return () => {
            const handlers = this.handlers.get(event);
            if (handlers) {
                handlers.delete(handler);
                if (handlers.size === 0) {
                    this.handlers.delete(event);
                }
            }
        };
    }
}

// Export a singleton instance
export const eventBus = new MemoryEventBus();

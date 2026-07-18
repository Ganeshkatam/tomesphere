import { DomainEvent } from '../../../core/domain/DomainEvent';
import { EventHandler } from './EventHandler';

export interface EventClass<T extends DomainEvent> {
    readonly prototype: T;
}

export class EventRegistry {
    private readonly mappings = new Map<any, EventHandler<any>[]>();
    private isFrozen = false;

    public freeze(): void {
        this.isFrozen = true;
    }

    public register<T extends DomainEvent>(
        eventClass: EventClass<T>,
        handler: EventHandler<T>
    ): void {
        if (this.isFrozen) {
            throw new Error('EventRegistry is frozen and cannot accept new registrations.');
        }

        const handlers = this.mappings.get(eventClass) || [];
        if (handlers.includes(handler)) {
            throw new Error(`Handler is already registered for this event type.`);
        }
        handlers.push(handler);
        this.mappings.set(eventClass, handlers);
    }

    public getHandlers<T extends DomainEvent>(
        eventClass: EventClass<T>
    ): readonly EventHandler<T>[] {
        return (this.mappings.get(eventClass) || []) as EventHandler<T>[];
    }
}

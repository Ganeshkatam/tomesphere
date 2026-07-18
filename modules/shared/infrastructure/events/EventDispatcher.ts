import { DomainEvent } from '../../../core/domain/DomainEvent';
import { EventEnvelope } from '../../application/events/EventEnvelope';
import { EventMetadata } from '../../application/events/EventMetadata';
import { EventRegistry } from '../../application/events/EventRegistry';
import { HandlerExecutionResult } from '../../application/events/EventHandler';

export class EventDispatcher {
    constructor(private readonly registry: EventRegistry) {}

    async dispatch(
        event: DomainEvent, 
        metadata?: EventMetadata
    ): Promise<readonly HandlerExecutionResult[]> {
        const eventClass = event.constructor as any;
        const handlers = this.registry.getHandlers(eventClass);
        const results: HandlerExecutionResult[] = [];

        const envelope: EventEnvelope<any> = {
            event,
            envelopeId: crypto.randomUUID(),
            correlationId: metadata?.correlationId || `corr-${Date.now()}`,
            causationId: metadata?.causationId || `caus-${Date.now()}`,
            publishedAt: new Date(),
            metadata: metadata || {}
        };

        for (const handler of handlers) {
            const start = Date.now();
            const handlerName = handler.constructor.name;
            try {
                await handler.handle(envelope);
                
                results.push({
                    handlerName,
                    durationMs: Date.now() - start,
                    succeeded: true
                });
            } catch (error) {
                const executionError = error instanceof Error ? error : new Error(String(error));
                console.error(`[EventDispatcher] Handler ${handlerName} failed:`, executionError);
                throw executionError;
            }
        }

        return results;
    }
}

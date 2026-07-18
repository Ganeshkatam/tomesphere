import { EventModule } from '../../shared/application/events/EventModule';
import { EventRegistry } from '../../shared/application/events/EventRegistry';
import { ProgressRepository } from './domain/repositories/ProgressRepository';
import { DomainEventPublisher } from '../../shared/application/events/DomainEventPublisher';
import { ProgressReadingCompletedHandler } from './application/event-handlers/ProgressHandlers';
import { ReadingCompletedEvent } from '../../reading/reader/domain/events/ReaderEvents';

export class ProgressModule implements EventModule {
    constructor(
        private readonly progressRepository: ProgressRepository,
        private readonly eventPublisher: DomainEventPublisher
    ) {}

    registerEventHandlers(registry: EventRegistry): void {
        registry.register(ReadingCompletedEvent, new ProgressReadingCompletedHandler(this.progressRepository, this.eventPublisher));
    }
}

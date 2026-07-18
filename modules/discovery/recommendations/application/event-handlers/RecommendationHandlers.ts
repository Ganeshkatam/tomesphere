import { EventHandler } from '../../../../shared/application/events/EventHandler';
import { EventEnvelope } from '../../../../shared/application/events/EventEnvelope';
import { ReadingCompletedEvent } from '../../../../reading/reader/domain/events/ReaderEvents';
import { RecommendationContextStore } from '../projections/RecommendationContextStore';

export class ReadingCompletedHandler implements EventHandler<ReadingCompletedEvent> {
    constructor(private readonly contextStore: RecommendationContextStore) {}

    async handle(envelope: EventEnvelope<ReadingCompletedEvent>): Promise<void> {
        // Recommendations handler reads read-models or updates affinities signals.
        // We simulate this by recording an affinity for a specific topic (e.g. Sci-Fi/Fantasy based on the book)
        // In a real application, we would look up the book categories and update signals.
        const userId = envelope.event.aggregateId;
        
        // Simulating record affinity
        this.contextStore.recordAffinity(userId, 'Sci-Fi');
    }
}

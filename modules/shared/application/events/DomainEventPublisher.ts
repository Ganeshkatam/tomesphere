import { AggregateRoot } from '../../../core/domain/AggregateRoot';
import { EventMetadata } from './EventMetadata';

export interface DomainEventPublisher {
    publish(aggregate: AggregateRoot<any>, metadata?: EventMetadata): Promise<void>;
}

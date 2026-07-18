import { DomainEvent } from '../../../../shared/domain/events/DomainEvent';

export class ReadingCompletedEvent extends DomainEvent<string> {
    public static readonly EVENT_NAME = 'ReadingCompleted';
    public readonly eventName = ReadingCompletedEvent.EVENT_NAME;

    constructor(
        aggregateId: string, // sessionId or userId
        aggregateVersion: number,
        public readonly bookId: string,
        public readonly completedAt: Date
    ) {
        super(aggregateId, aggregateVersion, 1);
        Object.freeze(this);
    }
}

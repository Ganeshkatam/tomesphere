import { DomainEvent } from '../../../../shared/domain/events/DomainEvent';

export class BookAddedToLibraryEvent extends DomainEvent<string> {
    public static readonly EVENT_NAME = 'BookAddedToLibrary';
    public readonly eventName = BookAddedToLibraryEvent.EVENT_NAME;

    constructor(
        aggregateId: string, // userId
        aggregateVersion: number,
        public readonly bookId: string
    ) {
        super(aggregateId, aggregateVersion, 1);
        Object.freeze(this);
    }
}

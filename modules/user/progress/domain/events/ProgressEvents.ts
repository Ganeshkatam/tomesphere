import { DomainEvent } from '../../../../shared/domain/events/DomainEvent';

export class XPAwardedEvent extends DomainEvent<string> {
    public static readonly EVENT_NAME = 'XPAwarded';
    public readonly eventName = XPAwardedEvent.EVENT_NAME;

    constructor(
        aggregateId: string, // userId
        aggregateVersion: number,
        public readonly amount: number,
        public readonly reason: string
    ) {
        super(aggregateId, aggregateVersion, 1);
        Object.freeze(this);
    }
}

import { DomainEvent } from "@/modules/core/domain/DomainEvent";

export class BookAddedToLibrary implements DomainEvent {
  readonly eventId: string;
  readonly occurredAt: Date;
  readonly eventName = "BookAddedToLibrary";

  constructor(
    public readonly aggregateId: string,
    public readonly userId: string,
    public readonly bookId: string,
    public readonly state: string,
  ) {
    this.eventId = crypto.randomUUID();
    this.occurredAt = new Date();
  }
}

export class BookFinished implements DomainEvent {
  readonly eventId: string;
  readonly occurredAt: Date;
  readonly eventName = "BookFinished";

  constructor(
    public readonly aggregateId: string,
    public readonly userId: string,
    public readonly bookId: string,
    public readonly completionDate: Date,
  ) {
    this.eventId = crypto.randomUUID();
    this.occurredAt = new Date();
  }
}

export class ReadingStateChanged implements DomainEvent {
  readonly eventId: string;
  readonly occurredAt: Date;
  readonly eventName = "ReadingStateChanged";

  constructor(
    public readonly aggregateId: string,
    public readonly userId: string,
    public readonly bookId: string,
    public readonly previousState: string,
    public readonly newState: string,
  ) {
    this.eventId = crypto.randomUUID();
    this.occurredAt = new Date();
  }
}

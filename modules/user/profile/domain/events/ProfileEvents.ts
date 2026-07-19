import { DomainEvent } from "../../../../shared/domain/events/DomainEvent";

export class AvatarChangedEvent extends DomainEvent<string> {
  public static readonly EVENT_NAME = "AvatarChanged";
  public readonly eventName = AvatarChangedEvent.EVENT_NAME;

  constructor(
    aggregateId: string, // userId
    aggregateVersion: number,
    public readonly avatarUrl: string,
  ) {
    super(aggregateId, aggregateVersion, 1);
    Object.freeze(this);
  }
}

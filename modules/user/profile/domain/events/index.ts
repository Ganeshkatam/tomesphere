import { DomainEvent } from "@/shared/kernel/DomainEvent";
import * as crypto from "crypto";

export class ProfileIdentityUpdated implements DomainEvent {
  readonly eventId: string;
  readonly occurredAt: Date;
  readonly eventName = "ProfileIdentityUpdated";

  constructor(
    public readonly aggregateId: string,
    public readonly displayName: string,
    public readonly biography: string,
    public readonly location: string,
  ) {
    this.eventId = crypto.randomUUID();
    this.occurredAt = new Date();
  }
}

export class AvatarChanged implements DomainEvent {
  readonly eventId: string;
  readonly occurredAt: Date;
  readonly eventName = "AvatarChanged";

  constructor(
    public readonly aggregateId: string,
    public readonly avatarUrl: string,
  ) {
    this.eventId = crypto.randomUUID();
    this.occurredAt = new Date();
  }
}

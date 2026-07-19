import { EventHandler } from "@/shared/application/events/EventHandler";
import { EventEnvelope } from "@/shared/application/events/EventEnvelope";
import { ReadingCompletedEvent } from "../../../reader/domain/events/ReaderEvents";
import { ProgressRepository } from "../../domain/repositories/ProgressRepository";
import { DomainEventPublisher } from "@/shared/application/events/DomainEventPublisher";
import { ReadingActivity } from "../../domain/value-objects/ReadingActivity";
import {  UserId  } from "@/shared/kernel/UserId";

export class ProgressReadingCompletedHandler implements EventHandler<ReadingCompletedEvent> {
  constructor(
    private readonly progressRepository: ProgressRepository,
    private readonly eventPublisher: DomainEventPublisher,
  ) {}

  async handle(envelope: EventEnvelope<ReadingCompletedEvent>): Promise<void> {
    const userId = UserId.create(envelope.event.aggregateId);
    const progress = await this.progressRepository.findByUserId(userId);
    if (!progress) {
      console.warn(
        `[ProgressReadingCompletedHandler] UserProgress not found for user: ${userId.value}`,
      );
      return;
    }

    // Award XP (0 minutes, 0 pages, 1 book completed)
    const activity = ReadingActivity.create(0, 0, 1);
    progress.applyReadingActivity(activity);

    // Persist progress
    await this.progressRepository.save(progress);

    // Publish progress domain events post-commit
    await this.eventPublisher.publish(progress, {
      correlationId: envelope.correlationId,
      causationId: envelope.envelopeId,
    });
  }
}

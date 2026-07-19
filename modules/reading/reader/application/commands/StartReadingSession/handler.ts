import { StartReadingSessionCommand } from "./command";
import { StartReadingSessionOutput } from "./output";
import { ReaderRepository } from "../../../infrastructure/ReaderRepository";
import { ReaderSession } from "../../../domain/ReaderSession";
import { ReadingPosition } from "../../../domain/ReadingPosition";
// Note: In a real system we'd inject an EventDispatcher
// import { EventDispatcher } from '../../../../shared/core/events/EventDispatcher';

export class StartReadingSessionHandler {
  constructor(
    private readonly readerRepository: ReaderRepository,
    // private readonly eventDispatcher: EventDispatcher
  ) {}

  async execute(
    command: StartReadingSessionCommand,
  ): Promise<StartReadingSessionOutput> {
    try {
      const { sessionId, readerId, bookId, location, chapter, page, progress } =
        command.input;

      // Optional: Check if there's already an active session for this user/book, and resume instead?
      // For now, we follow the straightforward "start new session" logic.

      const position = ReadingPosition.create({
        location,
        chapter,
        page,
        progress,
        updatedAt: new Date(),
      });

      const session = ReaderSession.start(
        sessionId,
        readerId,
        bookId,
        position,
      );

      await this.readerRepository.save(session);

      // Extract and dispatch events
      // const events = session.getDomainEvents();
      // this.eventDispatcher.dispatchAll(events);
      session.clearDomainEvents();

      return { sessionId: session.id };
    } catch (error) {
      throw new Error(error instanceof Error
            ? error.message
            : "Unknown error starting session",
      );
    }
  }
}

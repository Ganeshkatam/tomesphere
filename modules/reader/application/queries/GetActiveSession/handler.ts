import { GetActiveSessionQuery } from "./query";
import { ActiveSessionReadModel } from "./read-model";
import { ReaderRepository } from "../../../infrastructure/ReaderRepository";

export class GetActiveSessionHandler {
  constructor(private readonly readerRepository: ReaderRepository) {}

  async execute(
    query: GetActiveSessionQuery,
  ): Promise<ActiveSessionReadModel | null> {
    try {
      const session = await this.readerRepository.getActiveSession(
        query.readerId,
      );
      if (!session) {
        return null;
      }

      const readModel: ActiveSessionReadModel = {
        sessionId: session.id,
        bookId: session.bookId,
        progress: session.position.progress,
        location: session.position.location,
        chapter: session.position.chapter,
        startedAt: session.startedAt.toISOString(),
        durationSeconds: session.totalDurationSeconds,
      };

      return readModel;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Unknown error fetching session",
      );
    }
  }
}

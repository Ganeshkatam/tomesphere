import { LogHighlightCommand } from "./command";
import { LogHighlightOutput } from "./output";
import { ReaderRepository } from "../../../infrastructure/ReaderRepository";
import { Highlight } from "../../../domain/Highlight";

export class LogHighlightHandler {
  constructor(private readonly readerRepository: ReaderRepository) {}

  async execute(
    command: LogHighlightCommand,
  ): Promise<LogHighlightOutput> {
    try {
      const { sessionId, highlightId, text, location, chapter, color } =
        command.input;

      const session = await this.readerRepository.findById(sessionId);
      if (!session) {
        throw new Error("Session not found" );
      }

      const highlight = Highlight.create({
        id: highlightId,
        bookId: session.bookId,
        readerId: session.readerId,
        text,
        location,
        chapter,
        color,
      });

      session.addHighlight(highlight);

      await this.readerRepository.save(session);

      return { highlightId };
    } catch (error) {
      throw new Error(error instanceof Error
            ? error.message
            : "Unknown error adding highlight",
      );
    }
  }
}

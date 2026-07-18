import { LogHighlightCommand } from './command';
import { LogHighlightOutput } from './output';
import { ReaderRepository } from '../../../infrastructure/ReaderRepository';
import { Highlight } from '../../../domain/Highlight';
import { ActionResult } from '../../../../../shared/core/types/ActionResult';

export class LogHighlightHandler {
    constructor(private readonly readerRepository: ReaderRepository) {}

    async execute(command: LogHighlightCommand): Promise<ActionResult<LogHighlightOutput>> {
        try {
            const { sessionId, highlightId, text, location, chapter, color } = command.input;

            const session = await this.readerRepository.findById(sessionId);
            if (!session) {
                return { success: false, error: 'Session not found' };
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

            return {
                success: true,
                data: { highlightId },
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error adding highlight',
            };
        }
    }
}

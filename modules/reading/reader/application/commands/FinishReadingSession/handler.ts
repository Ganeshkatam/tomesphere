import { FinishReadingSessionCommand } from './command';
import { FinishReadingSessionOutput } from './output';
import { ReaderRepository } from '../../../infrastructure/ReaderRepository';
import { ReadingPosition } from '../../../domain/ReadingPosition';
import { ActionResult } from '../../../../../shared/core/types/ActionResult';

export class FinishReadingSessionHandler {
    constructor(private readonly readerRepository: ReaderRepository) {}

    async execute(command: FinishReadingSessionCommand): Promise<ActionResult<FinishReadingSessionOutput>> {
        try {
            const { sessionId, location, chapter, page, progress, pagesRead } = command.input;

            const session = await this.readerRepository.findById(sessionId);
            if (!session) {
                return { success: false, error: 'Session not found' };
            }

            const endPosition = ReadingPosition.create({
                location,
                chapter,
                page,
                progress,
                updatedAt: new Date(),
            });

            session.complete(endPosition, pagesRead);
            
            await this.readerRepository.save(session);
            
            // Domain events dispatch here (e.g., orchestrating ApplyReadingActivity)
            // const events = session.getDomainEvents();
            // this.eventDispatcher.dispatchAll(events);
            
            const finishEvent = session.getDomainEvents().find(e => e.type === 'ReadingSessionCompleted');
            
            session.clearDomainEvents();

            return {
                success: true,
                data: { 
                    sessionId: session.id,
                    // @ts-ignore
                    durationSeconds: finishEvent?.durationSeconds || 0 
                },
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error finishing session',
            };
        }
    }
}

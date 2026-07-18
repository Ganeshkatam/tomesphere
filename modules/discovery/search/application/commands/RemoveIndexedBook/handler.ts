import { RemoveIndexedBookCommand } from './command';
import { RemoveIndexedBookOutput } from './output';
import { SearchRepository } from '../../../domain/repositories/SearchRepository';
import { ActionResult } from '../../../../../shared/core/types/ActionResult';

export class RemoveIndexedBookHandler {
    constructor(private readonly searchRepository: SearchRepository) {}

    async execute(command: RemoveIndexedBookCommand): Promise<ActionResult<RemoveIndexedBookOutput>> {
        try {
            await this.searchRepository.removeIndex(command.input.bookId);

            return {
                success: true,
                data: { success: true }
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error removing index',
            };
        }
    }
}

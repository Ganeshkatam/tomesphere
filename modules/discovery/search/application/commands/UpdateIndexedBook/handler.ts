import { UpdateIndexedBookCommand } from './command';
import { UpdateIndexedBookOutput } from './output';
import { SearchRepository } from '../../../domain/repositories/SearchRepository';
import { ActionResult } from '../../../../../shared/core/types/ActionResult';

export class UpdateIndexedBookHandler {
    constructor(private readonly searchRepository: SearchRepository) {}

    async execute(command: UpdateIndexedBookCommand): Promise<ActionResult<UpdateIndexedBookOutput>> {
        try {
            const { bookId, updates } = command.input;
            
            // Recalculate keywords if necessary
            let newKeywords: string[] | undefined = undefined;
            if (updates.title || updates.authors || updates.categories) {
                newKeywords = Array.from(new Set([
                    ...(updates.title?.toLowerCase().split(/\s+/) || []),
                    ...(updates.authors?.map(a => a.toLowerCase()) || []),
                    ...(updates.categories?.map(c => c.toLowerCase()) || [])
                ]));
            }

            const repoUpdates = {
                ...updates,
                ...(newKeywords ? { keywords: newKeywords } : {})
            };

            await this.searchRepository.updateIndex(bookId, repoUpdates);

            return {
                success: true,
                data: { success: true }
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error updating index',
            };
        }
    }
}

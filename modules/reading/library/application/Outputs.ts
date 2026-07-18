import { LibraryBook } from '../domain/entities/LibraryBook';
import { GetBookOutput } from '../../books/application/queries/GetBook/read-model';
import { DomainEvent } from '@/modules/core/domain/DomainEvent';

export interface LibraryEntryOutput {
    readonly userId: string;
    readonly bookId: string;
    readonly state: string;
    readonly progress: number;
    readonly startedAt?: string;
    readonly finishedAt?: string;
    readonly lastOpenedAt?: string;
    readonly isFavorite: boolean;
}

// Composite output combining catalog book and library state
export interface CurrentlyReadingOutput {
    readonly book: GetBookOutput;
    readonly library: LibraryEntryOutput;
}

export interface UseCaseResult<T> {
    readonly output: T;
    readonly events: DomainEvent[];
}

export function mapLibraryBookToOutput(entity: LibraryBook): LibraryEntryOutput {
    return {
        userId: entity.userId.value,
        bookId: entity.bookId,
        state: entity.state.value,
        progress: entity.progress.value,
        startedAt: entity.timeline.startedAt?.toISOString(),
        finishedAt: entity.timeline.finishedAt?.toISOString(),
        lastOpenedAt: entity.timeline.lastOpenedAt?.toISOString(),
        isFavorite: entity.isFavorite
    };
}

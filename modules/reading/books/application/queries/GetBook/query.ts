import { BookId } from '../../../domain/value-objects';

export interface GetBookInput {
    readonly bookId: BookId;
}

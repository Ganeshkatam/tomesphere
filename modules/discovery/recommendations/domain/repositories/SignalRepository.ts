import { UserInteractionFact } from '../value-objects/UserInteractionFact';
import { BookFeature } from '../value-objects/BookFeature';

export interface SignalRepository {
    getUserInteractions(userId: string): Promise<UserInteractionFact[]>;
    getBookFeatures(bookIds: string[]): Promise<BookFeature[]>;
}

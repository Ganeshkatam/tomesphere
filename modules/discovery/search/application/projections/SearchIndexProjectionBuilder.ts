import { ProjectionBuilder } from '../../../../shared/application/projections/ProjectionBuilder';
import { BookPublishedEvent } from '../../../../reading/books/domain/events/BookEvents';

export interface BookSearchDocument {
    bookId: string;
    title: string;
    authors: string[];
    categories: string[];
    language: string;
    popularityScore: number;
    description?: string;
}

export class SearchIndexProjectionBuilder implements ProjectionBuilder<BookPublishedEvent, BookSearchDocument> {
    build(event: BookPublishedEvent): BookSearchDocument {
        // A projection builder is deterministic and side-effect free.
        // It transforms the domain event data into the document representation.
        return {
            bookId: event.aggregateId,
            title: event.title,
            authors: [...event.authors],
            categories: [...event.categories],
            language: event.language,
            popularityScore: event.popularity
        };
    }
}

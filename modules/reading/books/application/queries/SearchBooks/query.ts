export interface SearchBooksInput {
    readonly term?: string;
    readonly genreFilters?: string[];
    readonly limit?: number;
    readonly offset?: number;
}

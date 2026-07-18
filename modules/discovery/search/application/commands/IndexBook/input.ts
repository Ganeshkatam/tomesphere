export interface IndexBookInput {
    bookId: string;
    title: string;
    subtitle?: string;
    authors: string[];
    categories: string[];
    language: string;
    description?: string;
    publicationYear?: number;
}

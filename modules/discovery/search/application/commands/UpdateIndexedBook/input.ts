export interface UpdateIndexedBookInput {
    bookId: string;
    updates: {
        title?: string;
        subtitle?: string;
        authors?: string[];
        categories?: string[];
        language?: string;
        description?: string;
        publicationYear?: number;
        availabilityStatus?: 'available' | 'coming_soon' | 'out_of_print';
    };
}

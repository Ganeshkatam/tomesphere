export interface GetBookOutput {
    readonly id: string;
    readonly title: string;
    readonly author: string;
    readonly coverUrl?: string;
    readonly description?: string;
    readonly genre?: string;
    readonly isTextbook: boolean;
    readonly academicSubject?: string;
    readonly publishedDate?: string;
    readonly pageCount?: number;
}

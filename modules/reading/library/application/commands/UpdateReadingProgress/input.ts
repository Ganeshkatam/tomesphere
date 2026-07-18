export interface UpdateReadingProgressInput {
    readonly userId: string;
    readonly bookId: string;
    readonly progress: number;
}

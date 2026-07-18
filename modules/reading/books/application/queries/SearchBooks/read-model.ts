import { GetBookOutput } from '../GetBook/read-model';

export interface SearchBooksOutput {
    readonly items: GetBookOutput[];
    readonly totalCount?: number;
}

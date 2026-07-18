import { GetBookOutput } from '../GetBook/read-model';

export interface GetTrendingBooksOutput {
    readonly items: GetBookOutput[];
}

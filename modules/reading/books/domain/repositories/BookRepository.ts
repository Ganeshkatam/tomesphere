import { Book } from "../entities/Book";
import { BookId } from "../value-objects";

export interface BookSearchQuery {
  readonly term?: string;
  readonly genre?: string[];
  readonly limit?: number;
  readonly offset?: number;
}

export interface TrendingQuery {
  readonly limit: number;
  readonly timeframe?: "day" | "week" | "month" | "all-time";
  readonly category?: string;
}

export interface PaginatedResult<T> {
  readonly items: T[];
  readonly totalCount?: number;
}

export interface BookRepository {
  findById(id: BookId): Promise<Book | null>;
  search(query: BookSearchQuery): Promise<PaginatedResult<Book>>;
  getTrending(query: TrendingQuery): Promise<Book[]>;
}

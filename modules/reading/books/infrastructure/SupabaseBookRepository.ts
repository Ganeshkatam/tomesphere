import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/modules/shared/core/types/database";
import type {
  BookRepository,
  BookSearchQuery,
  TrendingQuery,
  PaginatedResult,
} from "../domain/repositories/BookRepository";
import type { BookId } from "../domain/value-objects";
import { Book } from "../domain/entities/Book";
import { BookMapper } from "./mappers/BookMapper";
import type { BookRow } from "./models/BookRow";

export class SupabaseBookRepository implements BookRepository {
  constructor(private readonly client: SupabaseClient<Database>) {}

  async findById(id: BookId): Promise<Book | null> {
    const { data, error } = await this.client
      .from("books")
      .select("*")
      .eq("id", id.value)
      .single();

    if (error || !data) {
      // Depending on the domain, we might throw a custom DomainError here,
      // but returning null is acceptable for 'not found'.
      return null;
    }

    return BookMapper.toDomain(data as BookRow);
  }

  async search(query: BookSearchQuery): Promise<PaginatedResult<Book>> {
    let dbQuery = this.client.from("books").select("*", { count: "exact" });

    if (query.term) {
      // Because full-text search requires exact matches or lexemes,
      // fallback to ilike if textSearch isn't heavily configured yet,
      // or use simple textSearch. For the old behavior:
      dbQuery = dbQuery.or(
        `title.ilike.%${query.term}%,author.ilike.%${query.term}%,description.ilike.%${query.term}%`,
      );
    }

    if (query.genre && query.genre.length > 0) {
      dbQuery = dbQuery.in("genre", query.genre);
    }

    if (query.limit) {
      dbQuery = dbQuery.limit(query.limit);
    }

    if (query.offset) {
      const limit = query.limit || 50;
      dbQuery = dbQuery.range(query.offset, query.offset + limit - 1);
    }

    const { data, error, count } = await dbQuery;

    if (error || !data) {
      return { items: [], totalCount: 0 };
    }

    return {
      items: (data as BookRow[]).map(BookMapper.toDomain),
      totalCount: count ?? undefined,
    };
  }

  async getTrending(query: TrendingQuery): Promise<Book[]> {
    const { data: books } = await this.client
      .from("books")
      .select("*")
      .limit(query.limit)
      .order("view_count", { ascending: false, nullsFirst: false });

    return ((books as BookRow[]) || []).map(BookMapper.toDomain);
  }
}

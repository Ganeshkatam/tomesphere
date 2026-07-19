"use server";

import { createSupabaseServerClient } from "@/modules/shared/core/database/server";
import { BookDto } from "@/modules/library/application/dto/response/BookDto";
import { BookMapper } from "@/modules/library/application/mappers/BookMapper";

import { ServerActionResult } from "@/lib/actions/action-result";

const PAGE_SIZE = parseInt(process.env.SEARCH_PAGE_SIZE || "20", 10);

export async function searchBooks(
  query: string,
  genre: string,
  page: number = 1,
): Promise<ServerActionResult<{
  books: BookDto[];
  count: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}>> {
  try {
    const supabase = await createSupabaseServerClient();

    const sanitizedQuery = query.replace(/[\\\\'\";<>]/g, "").trim();
    const sanitizedGenre = genre.replace(/[\\\\'\";<>]/g, "").trim();
    const primaryGenre = sanitizedGenre.split(",")[0]?.trim() || "";

    const { data, error } = await supabase.rpc("search_books_fts", {
      search_query: sanitizedQuery,
      genre_filter: primaryGenre,
      page_number: page,
      page_size: PAGE_SIZE,
    });

    if (error) {
      console.error("FTS search error:", error.message);
      return { success: false, error: { message: error.message } };
    }

    const books: BookDto[] = (data || []).map((row: Record<string, unknown>) => {
      const { rank, total_count, ...bookData } = row as Record<string, unknown>;
      return BookMapper.toDto(bookData);
    });

    const totalCount = data?.[0]?.total_count || 0;

    return {
      success: true,
      data: {
        books,
        count: Number(totalCount),
        page,
        pageSize: PAGE_SIZE,
        hasMore: page * PAGE_SIZE < Number(totalCount),
      }
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: { message: error instanceof Error ? error.message : "Search failed" }
    };
  }
}

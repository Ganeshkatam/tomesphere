import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/shared/core/types/database";
import {
  LibraryReadModel,
  LibraryQueryParams,
} from "../../application/ports/read-models/LibraryReadModel";
import {
  LibraryBooksPageDto,
  LibrarySummaryDto,
} from "../../application/dto/response/LibraryPageDto";
import { LibraryBookDto } from "../../application/dto/response/LibraryBookDto";

export class SupabaseLibraryReadModel implements LibraryReadModel {
  constructor(private supabase: SupabaseClient<Database>) {}

  async getLibraryBooks(
    userId: string,
    params: LibraryQueryParams,
  ): Promise<LibraryBooksPageDto> {
    const {
      viewType,
      viewId,
      sortBy = "date_added",
      sortDirection = "desc",
      page = 1,
      pageSize = 24,
    } = params;

    let query = this.supabase
      .from("library_books")
      .select(
        `
        id,
        user_id,
        book_id,
        status,
        queue_order,
        added_at,
        updated_at,
        books (
          id,
          title,
          cover_url,
          created_at,
          book_authors (
            authors (
              id,
              name
            )
          )
        )
      `,
        { count: "exact" },
      )
      .eq("user_id", userId);

    // View Filtering
    if (viewType === "status") {
      const dbStatus = viewId === "reading" ? "currently_reading" : viewId;
      query = query.eq("status", dbStatus as any);
    } else if (viewType === "collection") {
      const { data: shelfItems } = await this.supabase
        .from("shelf_items")
        .select("book_id")
        .eq("shelf_id", viewId);

      const bookIds = shelfItems?.map((s) => s.book_id) || [];
      if (bookIds.length === 0) {
        return this.createEmptyPage(page, pageSize);
      }
      query = query.in("book_id", bookIds);
    }

    // Sorting
    if (sortBy === "date_added") {
      query = query.order("added_at", { ascending: sortDirection === "asc" });
    } else if (sortBy === "title") {
      query = query.order("title", {
        referencedTable: "books",
        ascending: sortDirection === "asc",
      });
    }

    // Pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    const { data, count, error } = await query;

    if (error || !data) {
      console.error("SupabaseLibraryReadModel.getLibraryBooks error:", error);
      return this.createEmptyPage(page, pageSize);
    }

    const items = data.map((row) => this.mapToBookDto(row));

    return {
      items,
      page,
      pageSize,
      totalItems: count || 0,
      totalPages: Math.ceil((count || 0) / pageSize),
      hasNext: page * pageSize < (count || 0),
      hasPrevious: page > 1,
    };
  }

  async getLibrarySummary(userId: string): Promise<LibrarySummaryDto> {
    const { data: libraryData } = await this.supabase
      .from("library_books")
      .select("status, book_id")
      .eq("user_id", userId);

    const { count: collectionsCount } = await this.supabase
      .from("shelves")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    const summary: LibrarySummaryDto = {
      totalBooks: libraryData?.length || 0,
      totalCollections: collectionsCount || 0,
      currentlyReading:
        libraryData?.filter((d) => d.status === "currently_reading").length || 0,
      wantToRead:
        libraryData?.filter((d) => d.status === "want_to_read").length || 0,
      finished: libraryData?.filter((d) => d.status === "finished").length || 0,
      downloaded: 0,
      pagesRead: 0,
      hoursRead: 0,
      lastOpened: null,
    };

    return summary;
  }

  private mapToBookDto(row: any): LibraryBookDto {
    const book = row.books || {};

    // Extract authors
    const authors = (book.book_authors || [])
      .map((ba: any) => ba.authors)
      .filter(Boolean)
      .map((a: any) => ({ id: a.id || "", name: a.name || "" }));

    return {
      bookId: row.book_id,
      title: book.title || "Unknown Title",
      coverUrl: book.cover_url ? book.cover_url.replace(/ /g, "%20") : null,
      authors: authors,
      progress: 0,
      status: (row.status === "currently_reading"
        ? "reading"
        : row.status || "want_to_read") as any,
      collections: [],
      dateAdded: row.added_at || new Date().toISOString(),
      lastOpened: row.updated_at || null,
      downloaded: false,
      favorite: false,
      format: "pdf",
    };
  }

  private createEmptyPage(page: number, pageSize: number): LibraryBooksPageDto {
    return {
      items: [],
      page,
      pageSize,
      totalItems: 0,
      totalPages: 0,
      hasNext: false,
      hasPrevious: false,
    };
  }
}

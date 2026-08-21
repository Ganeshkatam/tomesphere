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
import { CanonicalBookProgressProjection } from "../../application/projections/CanonicalBookProgressProjection";

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
          pages,
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

    if (error || !data || data.length === 0) {
      if (error) {
        console.error("SupabaseLibraryReadModel.getLibraryBooks error:", error);
      }
      return this.createEmptyPage(page, pageSize);
    }

    const bookIds = data.map((row) => row.book_id);

    // Fetch corresponding reading progress and sessions for accurate progress calculations
    const [{ data: progressData }, { data: sessionData }] = await Promise.all([
      this.supabase
        .from("reading_progress")
        .select("book_id, location_anchor, last_read_at")
        .eq("user_id", userId)
        .in("book_id", bookIds),
      this.supabase
        .from("reading_sessions")
        .select("book_id, percentage, current_page, last_read_at")
        .eq("user_id", userId)
        .in("book_id", bookIds)
        .order("last_read_at", { ascending: false }),
    ]);

    const progressMap = new Map<string, any>();
    if (progressData) {
      progressData.forEach((p) => progressMap.set(p.book_id, p));
    }

    const sessionMap = new Map<string, any>();
    if (sessionData) {
      sessionData.forEach((s) => {
        if (!sessionMap.has(s.book_id)) {
          sessionMap.set(s.book_id, s);
        }
      });
    }

    const items = data.map((row) => {
      const prog = progressMap.get(row.book_id);
      const sess = sessionMap.get(row.book_id);
      return this.mapToBookDto(row, prog, sess);
    });

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
    const [{ data: libraryData }, { count: collectionsCount }, { data: statsData }] =
      await Promise.all([
        this.supabase
          .from("library_books")
          .select("status, book_id, updated_at")
          .eq("user_id", userId),
        this.supabase
          .from("shelves")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId),
        this.supabase
          .from("user_statistics")
          .select("pages_read, minutes_read, updated_at")
          .eq("user_id", userId)
          .maybeSingle(),
      ]);

    const pagesRead = statsData?.pages_read || 0;
    const hoursRead = Math.round((statsData?.minutes_read || 0) / 60);

    const summary: LibrarySummaryDto = {
      totalBooks: libraryData?.length || 0,
      totalCollections: collectionsCount || 0,
      currentlyReading:
        libraryData?.filter((d) => d.status === "currently_reading").length || 0,
      wantToRead:
        libraryData?.filter((d) => d.status === "want_to_read").length || 0,
      finished: libraryData?.filter((d) => d.status === "finished").length || 0,
      downloaded: 0,
      pagesRead,
      hoursRead,
      lastOpened: statsData?.updated_at || null,
    };

    return summary;
  }

  private mapToBookDto(row: any, prog?: any, sess?: any): LibraryBookDto {
    const book = row.books || {};

    // Extract authors
    const authors = (book.book_authors || [])
      .map((ba: any) => ba.authors)
      .filter(Boolean)
      .map((a: any) => ({ id: a.id || "", name: a.name || "" }));

    const canonicalProgress = CanonicalBookProgressProjection.project({
      libraryStatus: row.status,
      locationAnchor: prog?.location_anchor,
      totalPages: book.pages,
      sessionPercentage: sess?.percentage ? Number(sess.percentage) : null,
      sessionCurrentPage: sess?.current_page,
      lastReadAt: prog?.last_read_at || sess?.last_read_at || row.updated_at,
    });

    return {
      bookId: row.book_id,
      title: book.title || "Unknown Title",
      coverUrl: book.cover_url ? book.cover_url.replace(/ /g, "%20") : null,
      authors: authors,
      progress: canonicalProgress.progressPercentage,
      currentPage: canonicalProgress.currentPage,
      totalPages: canonicalProgress.totalPages,
      status: (row.status === "currently_reading"
        ? "reading"
        : row.status || "want_to_read") as any,
      collections: [],
      dateAdded: row.added_at || new Date().toISOString(),
      lastOpened: canonicalProgress.lastReadAt || row.updated_at || null,
      downloaded: false,
      favorite: false,
      format: canonicalProgress.format || "pdf",
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

import { createSupabaseServerClient } from "@/shared/core/database/server";
import { CanonicalBookProgressProjection } from "@/modules/library/application/projections/CanonicalBookProgressProjection";

export interface BookViewerContextDto {
  authenticated: boolean;
  readingStatus: "none" | "want_to_read" | "currently_reading" | "finished";
  libraryStatus: "not_in_library" | "in_library";
  progressPercentage: number;
  currentPage?: number;
  totalPages?: number;
  lastReadAt?: string;
  collections: string[];
  permissions: {
    read: boolean;
    download: boolean;
    bookmark: boolean;
    highlight: boolean;
    addToLibrary: boolean;
    addToCollection: boolean;
  };
}

export async function getBookViewerContext(
  bookId: string,
): Promise<BookViewerContextDto> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      authenticated: false,
      readingStatus: "none",
      libraryStatus: "not_in_library",
      progressPercentage: 0,
      collections: [],
      permissions: {
        read: false,
        download: false,
        bookmark: false,
        highlight: false,
        addToLibrary: false,
        addToCollection: false,
      },
    };
  }

  // Query live database records for this user and book
  const [{ data: libraryEntry }, { data: progressEntry }, { data: sessionEntry }, { data: bookMeta }] =
    await Promise.all([
      supabase
        .from("library_books")
        .select("id, status, updated_at")
        .eq("user_id", user.id)
        .eq("book_id", bookId)
        .maybeSingle(),
      supabase
        .from("reading_progress")
        .select("location_anchor, last_read_at")
        .eq("user_id", user.id)
        .eq("book_id", bookId)
        .maybeSingle(),
      supabase
        .from("reading_sessions")
        .select("percentage, current_page, last_read_at")
        .eq("user_id", user.id)
        .eq("book_id", bookId)
        .order("last_read_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("books")
        .select("pages")
        .eq("id", bookId)
        .maybeSingle(),
    ]);

  const canonicalProgress = CanonicalBookProgressProjection.project({
    libraryStatus: libraryEntry?.status,
    locationAnchor: progressEntry?.location_anchor as any,
    totalPages: bookMeta?.pages,
    sessionPercentage: sessionEntry?.percentage ? Number(sessionEntry.percentage) : null,
    sessionCurrentPage: sessionEntry?.current_page,
    lastReadAt: progressEntry?.last_read_at || sessionEntry?.last_read_at || libraryEntry?.updated_at,
  });

  return {
    authenticated: true,
    readingStatus: canonicalProgress.status,
    libraryStatus: canonicalProgress.inLibrary ? "in_library" : "not_in_library",
    progressPercentage: canonicalProgress.progressPercentage,
    currentPage: canonicalProgress.currentPage,
    totalPages: canonicalProgress.totalPages,
    lastReadAt: canonicalProgress.lastReadAt,
    collections: [],
    permissions: {
      read: true,
      download: true,
      bookmark: true,
      highlight: true,
      addToLibrary: true,
      addToCollection: true,
    },
  };
}

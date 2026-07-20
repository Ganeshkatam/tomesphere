import { createSupabaseServerClient } from "@/shared/core/database/server";

export interface BookViewerContextDto {
  authenticated: boolean;
  readingStatus: "none" | "want_to_read" | "currently_reading" | "finished";
  libraryStatus: "not_in_library" | "in_library";
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

  // TODO: Actually query the Library/Progress/Collections modules for real data.
  // For now, we mock the authenticated state.
  return {
    authenticated: true,
    readingStatus: "none", // Query from progress module
    libraryStatus: "not_in_library",
    collections: [], // Query from collections module
    permissions: {
      read: true, // E.g., true if no premium wall
      download: true, // E.g., based on role or subscription
      bookmark: true,
      highlight: true,
      addToLibrary: true,
      addToCollection: true,
    },
  };
}

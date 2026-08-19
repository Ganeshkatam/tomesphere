"use server";

import { ServerActionResult } from "@/lib/actions/action-result";
import { requireAuth } from "@/modules/security/application/requireAuth";
import { executeGetHighlights } from "../../application/queries/GetHighlightsQuery";
import { executeGetBookmarks } from "../../application/queries/GetBookmarksQuery";
import { executeGetNotes } from "../../application/queries/GetNotesQuery";
import { executeCreateHighlight } from "../../application/commands/CreateHighlightCommand";
import { executeDeleteHighlight } from "../../application/commands/DeleteHighlightCommand";
import { executeCreateNote } from "../../application/commands/CreateNoteCommand";
import { executeUpdateNote } from "../../application/commands/UpdateNoteCommand";
import { executeDeleteNote } from "../../application/commands/DeleteNoteCommand";
import { executeCreateBookmark } from "../../application/commands/CreateBookmarkCommand";
import { executeDeleteBookmark } from "../../application/commands/DeleteBookmarkCommand";
import { executeUpdateReaderPosition } from "../../application/commands/UpdateReaderPositionCommand";
import { executeCompleteReadingSession } from "../../application/commands/CompleteReadingSessionCommand";
import { HighlightDto } from "../../application/dto/response/HighlightDto";
import { BookmarkDto } from "../../application/dto/response/BookmarkDto";
import { createSupabaseServerClient } from "@/shared/core/database/server";
import { SupabaseHighlightRepository } from "../../infrastructure/repositories/SupabaseHighlightRepository";
import { SupabaseBookmarkRepository } from "../../infrastructure/repositories/SupabaseBookmarkRepository";
import { SupabaseReaderPositionRepository } from "../../infrastructure/repositories/SupabaseReaderPositionRepository";

export async function getHighlightsAction(
  bookId: string,
): Promise<ServerActionResult<HighlightDto[]>> {
  try {
    const user = await requireAuth();
    const supabase = await createSupabaseServerClient();
    const repository = new SupabaseHighlightRepository(supabase);

    const result = await executeGetHighlights(repository, {
      userId: user.id,
      bookId,
    });

    return { success: true, data: result };
  } catch (error: any) {
    return {
      success: false,
      error: { message: error.message || "An unexpected error occurred" },
    };
  }
}

export async function getBookmarksAction(
  bookId: string,
): Promise<ServerActionResult<BookmarkDto[]>> {
  try {
    const user = await requireAuth();
    const supabase = await createSupabaseServerClient();
    const repository = new SupabaseBookmarkRepository(supabase);

    const result = await executeGetBookmarks(repository, {
      userId: user.id,
      bookId,
    });

    return { success: true, data: result };
  } catch (error: any) {
    return {
      success: false,
      error: { message: error.message || "An unexpected error occurred" },
    };
  }
}

export async function getNotesAction(
  bookId: string,
): Promise<ServerActionResult<any>> {
  try {
    const user = await requireAuth();
    // For now, assume executeGetNotes returns the raw ReaderNote or we will refactor it
    const data = await executeGetNotes({ userId: user.id, bookId });
    return { success: true, data: data };
  } catch (error: any) {
    return {
      success: false,
      error: { message: error.message || "An unexpected error occurred" },
    };
  }
}

export async function createHighlightAction(
  payload: any,
): Promise<ServerActionResult<any>> {
  try {
    const user = await requireAuth();
    const supabase = await createSupabaseServerClient();
    const repository = new SupabaseHighlightRepository(supabase);

    const data = await executeCreateHighlight(repository, {
      ...payload,
      userId: user.id,
    });
    return { success: true, data: data };
  } catch (error: any) {
    return {
      success: false,
      error: { message: error.message || "An unexpected error occurred" },
    };
  }
}

export async function deleteHighlightAction(
  highlightId: string,
): Promise<ServerActionResult<any>> {
  try {
    const user = await requireAuth();
    const data = await executeDeleteHighlight({ highlightId, userId: user.id });
    return { success: true, data: data };
  } catch (error: any) {
    return {
      success: false,
      error: { message: error.message || "An unexpected error occurred" },
    };
  }
}

export async function createNoteAction(
  payload: any,
): Promise<ServerActionResult<any>> {
  try {
    const user = await requireAuth();
    const data = await executeCreateNote({ ...payload, userId: user.id });
    return { success: true, data: data };
  } catch (error: any) {
    return {
      success: false,
      error: { message: error.message || "An unexpected error occurred" },
    };
  }
}

export async function updateNoteAction(
  payload: any,
): Promise<ServerActionResult<any>> {
  try {
    const user = await requireAuth();
    const data = await executeUpdateNote({ ...payload, userId: user.id });
    return { success: true, data: data };
  } catch (error: any) {
    return {
      success: false,
      error: { message: error.message || "An unexpected error occurred" },
    };
  }
}

export async function deleteNoteAction(
  noteId: string,
): Promise<ServerActionResult<any>> {
  try {
    const user = await requireAuth();
    const data = await executeDeleteNote({ noteId, userId: user.id });
    return { success: true, data: data };
  } catch (error: any) {
    return {
      success: false,
      error: { message: error.message || "An unexpected error occurred" },
    };
  }
}

export async function createBookmarkAction(
  payload: any,
): Promise<ServerActionResult<any>> {
  try {
    const user = await requireAuth();
    const supabase = await createSupabaseServerClient();
    const repository = new SupabaseBookmarkRepository(supabase);

    const data = await executeCreateBookmark(repository, {
      ...payload,
      userId: user.id,
    });
    return { success: true, data: data };
  } catch (error: any) {
    return {
      success: false,
      error: { message: error.message || "An unexpected error occurred" },
    };
  }
}

export async function deleteBookmarkAction(
  bookmarkId: string,
): Promise<ServerActionResult<any>> {
  try {
    const user = await requireAuth();
    const data = await executeDeleteBookmark({ bookmarkId, userId: user.id });
    return { success: true, data: data };
  } catch (error: any) {
    return {
      success: false,
      error: { message: error.message || "An unexpected error occurred" },
    };
  }
}

export async function updateReaderPositionAction(
  payload: any,
): Promise<ServerActionResult<any>> {
  try {
    const user = await requireAuth();
    const supabase = await createSupabaseServerClient();
    const repository = new SupabaseReaderPositionRepository(supabase);

    const data = await executeUpdateReaderPosition(repository, {
      ...payload,
      userId: user.id,
    });
    return { success: true, data: data };
  } catch (error: any) {
    return {
      success: false,
      error: { message: error.message || "An unexpected error occurred" },
    };
  }
}

export async function completeReadingSessionAction(
  payload: any,
): Promise<ServerActionResult<any>> {
  try {
    const user = await requireAuth();
    const data = await executeCompleteReadingSession({
      ...payload,
      userId: user.id,
    });
    return { success: true, data: data };
  } catch (error: any) {
    return {
      success: false,
      error: { message: error.message || "An unexpected error occurred" },
    };
  }
}

export async function completeBookAction(
  payload: { bookId: string },
): Promise<ServerActionResult<any>> {
  try {
    const user = await requireAuth();
    const { executeCompleteBookCommand } = await import("../../application/commands/CompleteBookCommand");
    await executeCompleteBookCommand({
      ...payload,
      userId: user.id,
    });
    return { success: true, data: null };
  } catch (error: any) {
    return {
      success: false,
      error: { message: error.message || "An unexpected error occurred" },
    };
  }
}

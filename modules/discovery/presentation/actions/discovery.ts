"use server";

import { ServerActionResult } from "@/lib/actions/action-result";
import { SupabaseIdentityProvider } from "@/shared/infrastructure/identity/SupabaseIdentityProvider";
import { createSupabaseServerClient } from "@/shared/core/database/server";
import { revalidatePath } from "next/cache";
import { addBookToLibrary } from "@/modules/library/application/commands/AddBookToLibrary/handler";
import { changeReadingState } from "@/modules/library/application/commands/ChangeReadingState/handler";
import { SupabaseLibraryRepository } from "@/modules/library/infrastructure/SupabaseLibraryRepository";
import { LibraryEntryDto } from "@/modules/library/application/dto/response/LibraryEntryDto";
import { emitOutboxEvent } from "@/shared/core/infrastructure/outbox/outbox";

export async function addBookToLibraryAction(
  bookId: string,
  initialState?: "want_to_read" | "currently_reading" | "finished" | "abandoned"
): Promise<ServerActionResult<LibraryEntryDto>> {
  try {
    const supabase = await createSupabaseServerClient();
    const identityProvider = new SupabaseIdentityProvider(supabase);
    const user = await identityProvider.currentUser();

    if (!user) {
      return {
        success: false,
        error: { message: "You must be logged in to manage your library" },
      };
    }

    const libraryRepo = new SupabaseLibraryRepository(supabase);

    const existing = await libraryRepo.getLibraryEntry(user.id, bookId);
    if (existing) {
      const { output } = await changeReadingState(libraryRepo, {
        userId: user.id,
        bookId,
        newState: initialState || "want_to_read",
      });
      revalidatePath("/discover");
      revalidatePath(`/book/${bookId}`);
      revalidatePath("/me/library");
      revalidatePath("/me/shelves");
      return { success: true, data: output };
    }

    const { output, events } = await addBookToLibrary(libraryRepo, {
      userId: user.id,
      bookId,
      initialState: initialState || "want_to_read",
    });

    // Bridge domain events to the platform outbox
    for (const event of events) {
      if (event.eventName === "BookAddedToLibrary") {
        const e = event as any;
        await emitOutboxEvent(supabase, "library.book.added", {
          userId: e.userId,
          bookId: e.bookId,
          status: e.state,
        }, "library_book", e.aggregateId);
      }
    }

    revalidatePath("/discover");
    revalidatePath(`/book/${bookId}`);
    revalidatePath("/me/library");
    revalidatePath("/me/shelves");

    return { success: true, data: output };
  } catch (error: any) {
    return {
      success: false,
      error: { message: error.message || "Failed to add book to library" },
    };
  }
}

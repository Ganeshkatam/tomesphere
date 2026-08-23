"use server";

import { ServerActionResult } from "@/lib/actions/action-result";
import { SupabaseIdentityProvider } from "@/shared/infrastructure/identity/SupabaseIdentityProvider";
import { createSupabaseServerClient } from "@/shared/core/database/server";
import { revalidatePath } from "next/cache";
import { addBookToLibrary } from "@/modules/library/application/commands/AddBookToLibrary/handler";
import { changeReadingState } from "@/modules/library/application/commands/ChangeReadingState/handler";
import { SupabaseLibraryRepository } from "@/modules/library/infrastructure/SupabaseLibraryRepository";
import { LibraryEntryDto } from "@/modules/library/application/dto/response/LibraryEntryDto";

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

    const { output } = await addBookToLibrary(libraryRepo, {
      userId: user.id,
      bookId,
      initialState: initialState || "want_to_read",
    });

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

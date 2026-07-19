"use server";
import { ServerActionResult } from "@/lib/actions/action-result";
import { SupabaseIdentityProvider } from "@/shared/infrastructure/identity/SupabaseIdentityProvider";

import { createSupabaseServerClient } from "@/shared/core/database/server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

// Use Cases
import { addBookToLibrary } from "../../application/commands/AddBookToLibrary/handler";
import { changeReadingState } from "../../application/commands/ChangeReadingState/handler";
import { updateReadingProgress } from "../../application/commands/UpdateReadingProgress/handler";
import { getCurrentlyReading } from "../../application/queries/GetCurrentlyReading/handler";
import { getFinishedBooks } from "../../application/queries/GetFinishedBooks/handler";
import { getWantToReadBooks } from "../../application/queries/GetWantToRead/handler";
import { getAllLibraryBooks } from "../../application/queries/GetAllLibraryBooks/handler";

// Repositories
import { SupabaseLibraryRepository } from "../../infrastructure/SupabaseLibraryRepository";
import { SupabaseBookRepository } from "../../../books/infrastructure/SupabaseBookRepository";

// Outputs
import { LibraryEntryDto, LibraryCollectionItemDto } from "@/modules/library/application/dto/response/LibraryEntryDto";

// Input Schemas
const AddBookInputSchema = z.object({
  bookId: z.string(),
  initialState: z
    .enum(["want_to_read", "currently_reading", "finished", "abandoned"])
    .optional(),
});

const ChangeStateInputSchema = z.object({
  bookId: z.string(),
  newState: z.enum([
    "want_to_read",
    "currently_reading",
    "finished",
    "abandoned",
  ]),
});

const UpdateProgressInputSchema = z.object({
  bookId: z.string(),
  progress: z.number().min(0).max(100),
});

// Actions
export async function addBookToLibraryAction(
  bookId: string,
  initialState?:
    "want_to_read" | "currently_reading" | "finished" | "abandoned",
): Promise<ServerActionResult<LibraryEntryDto>> {
  try {
    const validated = AddBookInputSchema.parse({ bookId, initialState });
    const supabase = await createSupabaseServerClient();
    const identityProvider = new SupabaseIdentityProvider(supabase);
    const user = await identityProvider.currentUser();
    if (!user) throw new Error("Unauthorized" );

    const libraryRepo = new SupabaseLibraryRepository(supabase);

    // If it exists, change state instead of failing, as users might use "Add" button interchangeably
    const existing = await libraryRepo.getLibraryEntry(
      user.id,
      validated.bookId,
    );
    if (existing) {
      const { output } = await changeReadingState(libraryRepo, {
        userId: user.id,
        bookId: validated.bookId,
        newState: validated.initialState || "want_to_read",
      });
      revalidatePath("/home");
      return { success: true, data: output };
    }

    const { output } = await addBookToLibrary(libraryRepo, {
      userId: user.id,
      ...validated,
    });

    revalidatePath("/home");
    return { success: true, data: output };
  } catch (error: any) {
    return { success: false, error: { message: error.message || "An unexpected error occurred" } };
  }
}

export async function changeReadingStateAction(
  bookId: string,
  newState: "want_to_read" | "currently_reading" | "finished" | "abandoned",
): Promise<ServerActionResult<LibraryEntryDto>> {
  try {
    const validated = ChangeStateInputSchema.parse({ bookId, newState });
    const supabase = await createSupabaseServerClient();
    const identityProvider = new SupabaseIdentityProvider(supabase);
    const user = await identityProvider.currentUser();
    if (!user) throw new Error("Unauthorized" );

    const libraryRepo = new SupabaseLibraryRepository(supabase);
    const { output } = await changeReadingState(libraryRepo, {
      userId: user.id,
      ...validated,
    });

    revalidatePath("/home");
    return { success: true, data: output };
  } catch (error: any) {
    return { success: false, error: { message: error.message || "An unexpected error occurred" } };
  }
}

export async function updateReadingProgressAction(
  bookId: string,
  progress: number,
): Promise<ServerActionResult<LibraryEntryDto>> {
  try {
    const validated = UpdateProgressInputSchema.parse({ bookId, progress });
    const supabase = await createSupabaseServerClient();
    const identityProvider = new SupabaseIdentityProvider(supabase);
    const user = await identityProvider.currentUser();
    if (!user) throw new Error("Unauthorized" );

    const libraryRepo = new SupabaseLibraryRepository(supabase);
    const { output } = await updateReadingProgress(libraryRepo, {
      userId: user.id,
      ...validated,
    });

    revalidatePath("/home");
    return { success: true, data: output };
  } catch (error: any) {
    return { success: false, error: { message: error.message || "An unexpected error occurred" } };
  }
}

export async function getCurrentlyReadingAction(): Promise<ServerActionResult<
  LibraryCollectionItemDto[]
>> {
  try {
    const supabase = await createSupabaseServerClient();
    const identityProvider = new SupabaseIdentityProvider(supabase);
    const user = await identityProvider.currentUser();
    if (!user) throw new Error("Unauthorized" );

    const libraryRepo = new SupabaseLibraryRepository(supabase);
    const bookRepo = new SupabaseBookRepository(supabase);

    const output = await getCurrentlyReading(libraryRepo, bookRepo, user.id);
    return { success: true, data: output };
  } catch (error: any) {
    return { success: false, error: { message: error.message || "An unexpected error occurred" } };
  }
}

export async function getFinishedBooksAction(): Promise<ServerActionResult<
  LibraryCollectionItemDto[]
>> {
  try {
    const supabase = await createSupabaseServerClient();
    const identityProvider = new SupabaseIdentityProvider(supabase);
    const user = await identityProvider.currentUser();
    if (!user) throw new Error("Unauthorized" );

    const libraryRepo = new SupabaseLibraryRepository(supabase);
    const bookRepo = new SupabaseBookRepository(supabase);

    const output = await getFinishedBooks(libraryRepo, bookRepo, user.id);
    return { success: true, data: output };
  } catch (error: any) {
    return { success: false, error: { message: error.message || "An unexpected error occurred" } };
  }
}

export async function getWantToReadAction(): Promise<ServerActionResult<
  LibraryCollectionItemDto[]
>> {
  try {
    const supabase = await createSupabaseServerClient();
    const identityProvider = new SupabaseIdentityProvider(supabase);
    const user = await identityProvider.currentUser();
    if (!user) throw new Error("Unauthorized" );

    const libraryRepo = new SupabaseLibraryRepository(supabase);
    const bookRepo = new SupabaseBookRepository(supabase);

    const output = await getWantToReadBooks(libraryRepo, bookRepo, user.id);
    return { success: true, data: output };
  } catch (error: any) {
    return { success: false, error: { message: error.message || "An unexpected error occurred" } };
  }
}

export async function getPublicFinishedBooksAction(
  profileId: string,
): Promise<ServerActionResult<LibraryCollectionItemDto[]>> {
  try {
    const supabase = await createSupabaseServerClient();
    const libraryRepo = new SupabaseLibraryRepository(supabase);
    const bookRepo = new SupabaseBookRepository(supabase);

    const output = await getFinishedBooks(libraryRepo, bookRepo, profileId);
    return { success: true, data: output };
  } catch (error: any) {
    return { success: false, error: { message: error.message || "An unexpected error occurred" } };
  }
}

export async function getAllLibraryBooksAction(): Promise<ServerActionResult<
  LibraryCollectionItemDto[]
>> {
  try {
    const supabase = await createSupabaseServerClient();
    const identityProvider = new SupabaseIdentityProvider(supabase);
    const user = await identityProvider.currentUser();
    if (!user) throw new Error("Unauthorized" );

    const libraryRepo = new SupabaseLibraryRepository(supabase);
    const bookRepo = new SupabaseBookRepository(supabase);

    const output = await getAllLibraryBooks(libraryRepo, bookRepo, user.id);
    return { success: true, data: output };
  } catch (error: any) {
    return { success: false, error: { message: error.message || "An unexpected error occurred" } };
  }
}

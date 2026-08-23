"use server";

import { createSupabaseServerClient } from "@/shared/core/database/server";
import { SupabaseIdentityProvider } from "@/shared/infrastructure/identity/SupabaseIdentityProvider";
import { SupabaseCollectionRepository } from "@/modules/library/infrastructure/repositories/SupabaseCollectionRepository";
import { createCollection } from "@/modules/library/application/commands/CreateCollection/handler";
import { updateCollection } from "@/modules/library/application/commands/UpdateCollection/handler";
import { deleteCollection } from "@/modules/library/application/commands/DeleteCollection/handler";
import { revalidatePath } from "next/cache";

export async function createShelfAction(data: {
  name: string;
  description?: string;
  isPublic?: boolean;
  coverImage?: string | null;
}) {
  const supabase = await createSupabaseServerClient();
  const identityProvider = new SupabaseIdentityProvider(supabase);
  const user = await identityProvider.currentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const repository = new SupabaseCollectionRepository(supabase);
  
  const created = await createCollection(repository, {
    userId: user.id,
    name: data.name,
    description: data.description,
    isPublic: data.isPublic,
    coverImage: data.coverImage,
  });

  revalidatePath("/me/shelves");
  revalidatePath("/me/library");
  return created;
}

export async function updateShelfAction(
  id: string,
  data: { name?: string; description?: string; isPublic?: boolean; coverImage?: string | null },
) {
  const supabase = await createSupabaseServerClient();
  const identityProvider = new SupabaseIdentityProvider(supabase);
  const user = await identityProvider.currentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const repository = new SupabaseCollectionRepository(supabase);
  
  await updateCollection(repository, {
    id,
    userId: user.id,
    name: data.name,
    description: data.description,
    isPublic: data.isPublic,
    coverImage: data.coverImage,
  });

  revalidatePath("/me/shelves");
  revalidatePath(`/me/shelves/${id}`);
  revalidatePath("/me/library");
}

export async function deleteShelfAction(id: string) {
  const supabase = await createSupabaseServerClient();
  const identityProvider = new SupabaseIdentityProvider(supabase);
  const user = await identityProvider.currentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const repository = new SupabaseCollectionRepository(supabase);
  
  await deleteCollection(repository, {
    id,
    userId: user.id,
  });

  revalidatePath("/me/shelves");
  revalidatePath("/me/library");
}

export async function removeBookFromShelfAction(shelfId: string, bookId: string) {
  const supabase = await createSupabaseServerClient();
  const identityProvider = new SupabaseIdentityProvider(supabase);
  const user = await identityProvider.currentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const repository = new SupabaseCollectionRepository(supabase);
  await repository.removeBook(shelfId, bookId, user.id);

  revalidatePath(`/me/shelves/${shelfId}`);
  revalidatePath("/me/shelves");
  revalidatePath("/me/library");
}

export async function getBookShelvesAction(bookId: string) {
  const supabase = await createSupabaseServerClient();
  const identityProvider = new SupabaseIdentityProvider(supabase);
  const user = await identityProvider.currentUser();
  if (!user) return { shelves: [], containingShelfIds: [] };

  const repository = new SupabaseCollectionRepository(supabase);
  const shelves = await repository.getCollections(user.id);

  const { data: items } = await supabase
    .from("shelf_items")
    .select("shelf_id")
    .eq("book_id", bookId);

  const containingShelfIds = (items || []).map((i: any) => i.shelf_id);

  return {
    shelves,
    containingShelfIds,
  };
}

export async function toggleBookInShelfAction(shelfId: string, bookId: string, shouldAdd: boolean) {
  const supabase = await createSupabaseServerClient();
  const identityProvider = new SupabaseIdentityProvider(supabase);
  const user = await identityProvider.currentUser();
  if (!user) throw new Error("Unauthorized");

  const repository = new SupabaseCollectionRepository(supabase);
  if (shouldAdd) {
    await repository.addBook(shelfId, bookId, user.id);
  } else {
    await repository.removeBook(shelfId, bookId, user.id);
  }

  revalidatePath(`/me/shelves/${shelfId}`);
  revalidatePath("/me/shelves");
  revalidatePath("/me/library");
}



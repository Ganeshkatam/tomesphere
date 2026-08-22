"use server";

import { createSupabaseServerClient } from "@/shared/core/database/server";
import { SupabaseIdentityProvider } from "@/shared/infrastructure/identity/SupabaseIdentityProvider";
import { SupabaseCollectionRepository } from "@/modules/library/infrastructure/repositories/SupabaseCollectionRepository";
import { createCollection } from "@/modules/library/application/commands/CreateCollection/handler";
import { updateCollection } from "@/modules/library/application/commands/UpdateCollection/handler";
import { deleteCollection } from "@/modules/library/application/commands/DeleteCollection/handler";

export async function createShelfAction(data: { name: string; description?: string; isPublic?: boolean }) {
  const supabase = await createSupabaseServerClient();
  const identityProvider = new SupabaseIdentityProvider(supabase);
  const user = await identityProvider.currentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const repository = new SupabaseCollectionRepository(supabase);
  
  await createCollection(repository, {
    userId: user.id,
    name: data.name,
    description: data.description,
    isPublic: data.isPublic,
  });
}

export async function updateShelfAction(id: string, data: { name?: string; description?: string; isPublic?: boolean }) {
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
  });
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
}

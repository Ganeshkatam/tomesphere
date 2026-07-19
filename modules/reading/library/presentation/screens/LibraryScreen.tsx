import { SupabaseIdentityProvider } from "@/modules/shared/infrastructure/identity/SupabaseIdentityProvider";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/modules/shared/core/database/server";
import {
  getCurrentlyReadingAction,
  getFinishedBooksAction,
  getWantToReadAction,
} from "@/modules/reading/library/actions/library";
import LibraryClient from "@/modules/reading/library/components/LibraryClient";
import { LibraryCollectionItemDto } from "@/modules/library/application/dto/response/LibraryEntryDto";

export default async function LibraryPage() {
  const supabase = await createSupabaseServerClient();
  const identityProvider = new SupabaseIdentityProvider(supabase);
    const user = await identityProvider.currentUser();

  if (!user) {
    redirect("/login");
  }

  const [readingRes, finishedRes, wantRes] = await Promise.all([
    getCurrentlyReadingAction(),
    getFinishedBooksAction(),
    getWantToReadAction(),
  ]);

  const initialLibrary: LibraryCollectionItemDto[] = [
    ...(readingRes.success ? readingRes.data : []),
    ...(finishedRes.success ? finishedRes.data : []),
    ...(wantRes.success ? wantRes.data : []),
  ];

  return <LibraryClient user={user} initialLibrary={initialLibrary} />;
}

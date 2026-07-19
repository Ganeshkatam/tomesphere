import { executeLibraryPageFacade } from "../../application/facades";
import { SupabaseIdentityProvider } from "@/shared/infrastructure/identity/SupabaseIdentityProvider";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/shared/core/database/server";
import LibraryClient from "../../components/LibraryClient";

export default async function LibraryPage() {
  const supabase = await createSupabaseServerClient();
  const identityProvider = new SupabaseIdentityProvider(supabase);
  const user = await identityProvider.currentUser();

  if (!user) {
    redirect("/login");
  }

  const data = await executeLibraryPageFacade(user.id);

  const initialLibrary = [
    ...data.reading,
    ...data.finished,
    ...data.wantToRead,
  ];

  return <LibraryClient user={user} initialLibrary={initialLibrary} />;
}

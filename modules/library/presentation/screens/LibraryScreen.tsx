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

  // Initial fetch for the overview view
  const pageData = await executeLibraryPageFacade(user.id, {
    viewType: "overview",
    viewId: "overview",
    sortBy: "date_added",
    sortDirection: "desc",
    page: 1,
    pageSize: 24,
  });

  return <LibraryClient initialData={pageData} />;
}

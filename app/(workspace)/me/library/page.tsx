import { createSupabaseServerClient } from "@/shared/core/database/server";
import { executeLibraryPageFacade } from "@/modules/library/application/facades";
import LibraryClient from "@/modules/library/components/LibraryClient";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Personal Library",
};

export const dynamic = "force-dynamic";

export default async function LibraryPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

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

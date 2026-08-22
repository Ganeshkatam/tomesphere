import { createSupabaseServerClient } from "@/shared/core/database/server";
import { executeNotesPageFacade } from "@/modules/reader/annotations/application/facades";
import { NotesClient } from "@/modules/reader/annotations/components/NotesClient";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function NotesPage({
  searchParams,
}: {
  searchParams: { cursor?: string };
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const cursor = searchParams.cursor || null;
  const pageData = await executeNotesPageFacade(supabase, user.id, 24, cursor);

  return <NotesClient initialData={pageData} />;
}

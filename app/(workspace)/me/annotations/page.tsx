import { createSupabaseServerClient } from "@/shared/core/database/server";
import { executeAnnotationsPageFacade } from "@/modules/reader/annotations/application/facades";
import { AnnotationsClient } from "@/modules/reader/annotations/components/AnnotationsClient";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AnnotationsPage({
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
  const pageData = await executeAnnotationsPageFacade(supabase, user.id, 24, cursor);

  return <AnnotationsClient initialData={pageData} />;
}

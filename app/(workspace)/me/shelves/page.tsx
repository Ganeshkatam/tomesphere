import { createSupabaseServerClient } from "@/shared/core/database/server";
import { executeShelvesPageFacade } from "@/modules/library/application/facades";
import ShelvesClient from "@/modules/library/components/ShelvesClient";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ShelvesPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const pageData = await executeShelvesPageFacade(user.id);

  return <ShelvesClient initialData={pageData} />;
}

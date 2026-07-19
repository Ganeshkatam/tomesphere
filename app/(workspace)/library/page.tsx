import LibraryScreen from "@/modules/library/presentation/screens/LibraryScreen";
import { createSupabaseServerClient } from "@/shared/core/database/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Page() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return <LibraryScreen />;
}

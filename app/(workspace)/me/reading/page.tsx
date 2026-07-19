import { executeLibraryPageFacade } from "@/modules/library/application/facades";
import { createSupabaseServerClient } from "@/shared/core/database/server";
import { redirect } from "next/navigation";
import ReadingScreen from "@/modules/account/presentation/screens/ReadingScreen";

export const dynamic = "force-dynamic";

export default async function ReadingPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const data = await executeLibraryPageFacade(user.id);

  const readingList = [
    ...data.reading,
    ...data.finished,
    ...data.wantToRead,
  ];

  return <ReadingScreen readingList={readingList} />;
}

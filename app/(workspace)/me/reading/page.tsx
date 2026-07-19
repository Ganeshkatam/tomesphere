import { createSupabaseServerClient } from "@/modules/shared/core/database/server";
import {
  getCurrentlyReadingAction,
  getFinishedBooksAction,
  getWantToReadAction,
} from "@/modules/reading/library/actions/library";
import { redirect } from "next/navigation";
import ReadingScreen from "@/modules/me/presentation/screens/ReadingScreen";
import { LibraryCollectionItemDto } from "@/modules/library/application/dto/response/LibraryEntryDto";

export const dynamic = "force-dynamic";

export default async function ReadingPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [readingRes, finishedRes, wantRes] = await Promise.all([
    getCurrentlyReadingAction(),
    getFinishedBooksAction(),
    getWantToReadAction(),
  ]);

  const readingList: LibraryCollectionItemDto[] = [
    ...(readingRes.success ? readingRes.data : []),
    ...(finishedRes.success ? finishedRes.data : []),
    ...(wantRes.success ? wantRes.data : []),
  ];

  return <ReadingScreen readingList={readingList} />;
}

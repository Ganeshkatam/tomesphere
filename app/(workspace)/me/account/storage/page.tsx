import { createSupabaseServerClient } from "@/shared/core/database/server";
import {
  StorageSettingsScreen,
  ServerLibraryStatsDto,
} from "@/modules/me/account/storage/presentation/components/StorageSettingsScreen";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function StorageSettingsPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/auth/sign-in");
  }

  // Fetch real library books and notes counts from the authoritative database
  const [libraryRes, notesRes] = await Promise.all([
    supabase
      .from("library_books")
      .select("status")
      .eq("user_id", user.id),
    supabase
      .from("notes")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id),
  ]);

  const libraryItems = libraryRes.data || [];
  const readingBooksCount = libraryItems.filter((item) => item.status === "reading").length;
  const completedBooksCount = libraryItems.filter((item) => item.status === "completed").length;

  const statsDto: ServerLibraryStatsDto = {
    totalBooksInLibrary: libraryItems.length,
    readingBooksCount,
    completedBooksCount,
    totalNotesCount: notesRes.count || 0,
  };

  return (
    <div>
      <StorageSettingsScreen serverStats={statsDto} />
    </div>
  );
}

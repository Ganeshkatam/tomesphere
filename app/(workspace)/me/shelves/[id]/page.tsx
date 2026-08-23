import { notFound, redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/shared/core/database/server";
import { SupabaseCollectionRepository } from "@/modules/library/infrastructure/repositories/SupabaseCollectionRepository";
import { SupabaseLibraryReadModel } from "@/modules/library/infrastructure/read-models/SupabaseLibraryReadModel";
import { getCollection } from "@/modules/library/application/queries/GetCollection/handler";
import ShelfDetailClient from "@/modules/library/components/ShelfDetailClient";

export const dynamic = "force-dynamic";

interface ShelfDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ShelfDetailPage({ params }: ShelfDetailPageProps) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const collectionRepo = new SupabaseCollectionRepository(supabase);
  const shelf = await getCollection(collectionRepo, id, user.id);

  if (!shelf) {
    notFound();
  }

  const libraryReadModel = new SupabaseLibraryReadModel(supabase);
  const booksData = await libraryReadModel.getLibraryBooks(user.id, {
    viewType: "collection",
    viewId: id,
    page: 1,
    pageSize: 100,
  });

  return (
    <ShelfDetailClient
      shelf={shelf}
      initialBooks={booksData.items}
    />
  );
}

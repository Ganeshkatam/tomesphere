import { SupabaseIdentityProvider } from "@/shared/infrastructure/identity/SupabaseIdentityProvider";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/shared/core/database/server";
import { SupabaseBookRepository } from "@/modules/books/infrastructure/SupabaseBookRepository";
import { getBook } from "@/modules/books/application/queries/GetBook/handler";
import { BookId } from "@/modules/books/domain/value-objects";
import BookDetailClient from "@/modules/books/components/BookDetailClient";

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createSupabaseServerClient();
  const identityProvider = new SupabaseIdentityProvider(supabase);
  const user = await identityProvider.currentUser();

  const repo = new SupabaseBookRepository(supabase);
  const bookData = await getBook(repo, { bookId: BookId.create(id) });

  if (!bookData) {
    return (
      <div className="min-h-screen bg-gradient-page flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Book Not Found</h1>
          <a href="/home" className="btn btn-primary inline-block">
            Go Back
          </a>
        </div>
      </div>
    );
  }

  return <BookDetailClient user={user} book={bookData as any} />;
}

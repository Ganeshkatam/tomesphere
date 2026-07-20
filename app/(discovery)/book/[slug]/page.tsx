import { getBookPageFacade } from "@/modules/books/application/facades";
import BookDetailClient from "@/modules/books/components/BookDetailClient";

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const facade = await getBookPageFacade();
  const data = await facade.getPageData(id);

  if (!data.book) {
    return (
      <div className="min-h-screen bg-gradient-page flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4 text-white">Book Not Found</h1>
          <a href="/home" className="btn btn-primary inline-block">
            Go Back
          </a>
        </div>
      </div>
    );
  }

  return <BookDetailClient bookPage={data} />;
}

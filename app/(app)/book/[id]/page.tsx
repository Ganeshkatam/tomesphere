import { getBookPageFacade } from "@/modules/books/application/facades";
import { BookDetailHero } from "@/modules/books/components/BookDetailHero";
import { notFound } from "next/navigation";

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const bookFacade = await getBookPageFacade();
  const data = await bookFacade.getPageData(id);

  if (!data.book) {
    notFound();
  }

  return (
    <div className="w-full max-w-[1760px] mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8 xl:px-12">
      <BookDetailHero
        book={data.book}
        viewer={data.viewer}
        relatedBooks={data.relatedBooks}
        authorWorks={data.authorWorks}
      />
    </div>
  );
}

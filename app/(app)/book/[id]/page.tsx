import { getBookPageFacade } from "@/modules/books/application/facades";
import { getDiscoveryFacade } from "@/modules/discovery/application/facades";
import { BookDetailHero } from "@/modules/books/components/BookDetailHero";
import { notFound } from "next/navigation";

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [bookFacade, discoveryFacade] = await Promise.all([
    getBookPageFacade(),
    getDiscoveryFacade(),
  ]);
  
  const [data, discovery] = await Promise.all([
    bookFacade.getPageData(id),
    discoveryFacade.getOverview().catch(() => null),
  ]);

  if (!data.book) {
    notFound();
  }

  const relatedBooks = (
    discovery?.trending?.books ||
    discovery?.featured?.items ||
    []
  ).filter((b: any) => b.id !== id);

  return (
    <div className="w-full max-w-[1760px] mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8 xl:px-12">
      <BookDetailHero
        book={data.book}
        viewer={data.viewer}
        relatedBooks={relatedBooks}
      />
    </div>
  );
}

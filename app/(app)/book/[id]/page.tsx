import { getBookPageFacade } from "@/modules/books/application/facades";
import { BookDetailHero } from "@/modules/books/components/BookDetailHero";
import { BookDetailActions } from "@/modules/books/components/BookDetailActions";
import { notFound } from "next/navigation";

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>; // The user accesses `/book/[id]`
}) {
  const { id } = await params;
  const facade = await getBookPageFacade();
  
  const data = await facade.getPageData(id);

  if (!data.book) {
    notFound();
  }

  return (
    <div className="w-full flex flex-col items-center pt-12 pb-24 px-4 sm:px-6">
      <div className="w-full max-w-4xl mx-auto flex flex-col items-start">
        <BookDetailHero book={data.book} />
        
        <BookDetailActions book={data.book} viewer={data.viewer} />
        
        {/* We can add RelatedBooks or extra sections here later */}
      </div>
    </div>
  );
}

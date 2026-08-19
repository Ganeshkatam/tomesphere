import Link from "next/link";
import { BookDetailDto } from "@/modules/library/application/dto/response/BookDetailDto";
import { BookViewerContextDto } from "@/modules/books/application/queries/GetBookViewerContext/handler";
import { BookOpen, Heart } from "lucide-react";
import { AuthGuard } from "@/shared/ui/components/AuthGuard";
import { addBookToLibraryAction } from "@/modules/library/presentation/actions/library";

interface BookDetailActionsProps {
  book: BookDetailDto;
  viewer: BookViewerContextDto;
}

export function BookDetailActions({ book, viewer }: BookDetailActionsProps) {
  const handleAddToLibrary = async () => {
    "use server";
    await addBookToLibraryAction(book.id, "want_to_read");
  };

  return (
    <div className="flex flex-wrap items-center gap-4 mt-8 pt-8 border-t border-[var(--border-default)] w-full max-w-3xl">
      <Link
        href={`/read/${book.id}`}
        className="flex-1 min-w-[200px] h-12 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-sm transition-colors"
      >
        <BookOpen size={18} />
        Start Reading
      </Link>

      <AuthGuard
        authenticated={viewer.authenticated}
        fallbackRedirect={`/book/${book.id}`}
      >
        <form action={handleAddToLibrary} className="flex items-center">
          <button
            type="submit"
            disabled={!viewer.permissions.addToLibrary}
            className="h-12 px-5 flex items-center justify-center gap-2 rounded-lg border border-[var(--border-default)] bg-[var(--surface-default)] hover:bg-[var(--surface-raised)] text-[var(--text-primary)] font-medium transition-colors"
          >
            <Heart
              size={18}
              fill={viewer.libraryStatus === "in_library" ? "currentColor" : "none"}
              className={viewer.libraryStatus === "in_library" ? "text-indigo-600 dark:text-indigo-400" : ""}
            />
            {viewer.libraryStatus === "in_library" ? "In Library" : "Add to Library"}
          </button>
        </form>
      </AuthGuard>
    </div>
  );
}

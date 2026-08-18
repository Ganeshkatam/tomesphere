import { BookDetailDto } from "@/modules/library/application/dto/response/BookDetailDto";
import { BookViewerContextDto } from "@/modules/books/application/queries/GetBookViewerContext/handler";
import { BookOpen, Heart, Download } from "lucide-react";
import { AuthGuard } from "@/shared/ui/components/AuthGuard";
import { addBookToLibraryAction } from "@/modules/library/presentation/actions/library";

interface BookDetailActionsProps {
  book: BookDetailDto;
  viewer: BookViewerContextDto;
}

export function BookDetailActions({ book, viewer }: BookDetailActionsProps) {
  const handleAddToLibrary = async (formData: FormData) => {
    "use server";
    await addBookToLibraryAction(book.id, "want_to_read");
  };

  return (
    <div className="flex flex-wrap gap-4 mt-8 pt-8 border-t border-surface-variant/30 w-full max-w-3xl">
      <AuthGuard
        authenticated={viewer.authenticated}
        fallbackRedirect={`/book/${book.id}`}
        className="flex-1 min-w-[140px]"
      >
        <form action="/api/todo-read-action" method="POST" className="w-full">
          <input type="hidden" name="bookId" value={book.id} />
          <button
            type="submit"
            disabled={!viewer.permissions.read}
            className="w-full h-12 flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <BookOpen size={18} />
            Read
          </button>
        </form>
      </AuthGuard>

      <AuthGuard
        authenticated={viewer.authenticated}
        fallbackRedirect={`/book/${book.id}`}
        className="flex-1 min-w-[140px]"
      >
        <form action={`/api/book-resources/${book.id}/download`} method="GET" className="w-full">
          <button
            type="submit"
            disabled={!viewer.permissions.download}
            className="w-full h-12 flex items-center justify-center gap-2 bg-surface-variant text-foreground font-medium rounded-md hover:bg-surface-variant/80 transition-colors disabled:opacity-50"
          >
            <Download size={18} />
            Download
          </button>
        </form>
      </AuthGuard>

      <AuthGuard
        authenticated={viewer.authenticated}
        fallbackRedirect={`/book/${book.id}`}
      >
        <form action={handleAddToLibrary}>
          <button
            type="submit"
            disabled={!viewer.permissions.addToLibrary}
            className="h-12 w-12 flex items-center justify-center rounded-md border border-surface-variant/50 hover:bg-surface-variant/30 text-foreground/70 transition-colors"
          >
            <Heart
              size={20}
              fill={viewer.libraryStatus === "in_library" ? "currentColor" : "none"}
              className={viewer.libraryStatus === "in_library" ? "text-primary" : ""}
            />
          </button>
        </form>
      </AuthGuard>
    </div>
  );
}

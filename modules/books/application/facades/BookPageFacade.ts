import { getBookDetail } from "../queries/GetBookDetail/handler";
import {
  getBookViewerContext,
  BookViewerContextDto,
} from "../queries/GetBookViewerContext/handler";
import { getRelatedBooks, RelatedBookDto } from "../queries/GetRelatedBooks/handler";
import { getBooksByAuthor, AuthorBooksDto } from "../queries/GetBooksByAuthor/handler";
import { incrementBookViewCount } from "../commands/IncrementBookViewCountCommand";
import { BookDetailDto } from "@/modules/library/application/dto/response/BookDetailDto";

export interface BookPageDto {
  book: BookDetailDto | null;
  viewer: BookViewerContextDto;
  relatedBooks: RelatedBookDto[];
  authorWorks: AuthorBooksDto | null;
}

export class BookPageFacade {
  constructor() {}

  async getPageData(bookIdStr: string): Promise<BookPageDto> {
    const [book, viewer, relatedBooks, authorWorks] = await Promise.all([
      getBookDetail(bookIdStr),
      getBookViewerContext(bookIdStr),
      getRelatedBooks(bookIdStr),
      getBooksByAuthor(bookIdStr),
    ]);

    // Record view asynchronously without blocking page rendering TTFB
    if (book) {
      void incrementBookViewCount(bookIdStr);
    }

    return {
      book,
      viewer,
      relatedBooks,
      authorWorks,
    };
  }
}


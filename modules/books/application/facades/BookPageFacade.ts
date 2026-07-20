import { getBook } from "../queries/GetBook/handler";
import {
  getBookViewerContext,
  BookViewerContextDto,
} from "../queries/GetBookViewerContext/handler";
import { BookDetailDto } from "@/modules/library/application/dto/response/BookDetailDto";
import { SupabaseBookRepository } from "../../infrastructure/SupabaseBookRepository";
import { BookId } from "../../domain/value-objects";

export interface BookPageDto {
  book: BookDetailDto | null;
  viewer: BookViewerContextDto;
}

export class BookPageFacade {
  constructor(private readonly bookRepository: SupabaseBookRepository) {}

  async getPageData(bookIdStr: string): Promise<BookPageDto> {
    const [book, viewer] = await Promise.all([
      getBook(this.bookRepository, { bookId: BookId.create(bookIdStr) }),
      getBookViewerContext(bookIdStr),
    ]);

    return {
      book,
      viewer,
    };
  }
}

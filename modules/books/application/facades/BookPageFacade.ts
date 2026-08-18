import { getBookDetail } from "../queries/GetBookDetail/handler";
import {
  getBookViewerContext,
  BookViewerContextDto,
} from "../queries/GetBookViewerContext/handler";
import { BookDetailDto } from "@/modules/library/application/dto/response/BookDetailDto";

export interface BookPageDto {
  book: BookDetailDto | null;
  viewer: BookViewerContextDto;
}

export class BookPageFacade {
  constructor() {}

  async getPageData(bookIdStr: string): Promise<BookPageDto> {
    const [book, viewer] = await Promise.all([
      getBookDetail(bookIdStr),
      getBookViewerContext(bookIdStr),
    ]);

    return {
      book,
      viewer,
    };
  }
}

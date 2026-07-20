import { BookmarkDto } from "../../application/dto/response/BookmarkDto";

export interface BookmarkRepository {
  getBookmarks(userId: string, bookId: string): Promise<BookmarkDto[]>;
  createBookmark(
    userId: string,
    bookId: string,
    location: string,
    name?: string,
  ): Promise<BookmarkDto>;
  deleteBookmark(id: string, userId: string): Promise<boolean>;
}

import { BookmarkRecord } from "../models/ReaderTypes";

export interface BookmarkRepository {
  getBookmarks(userId: string, bookId: string): Promise<BookmarkRecord[]>;
  createBookmark(
    userId: string,
    bookId: string,
    location: string,
    name?: string,
  ): Promise<BookmarkRecord>;
  deleteBookmark(id: string, userId: string): Promise<boolean>;
}

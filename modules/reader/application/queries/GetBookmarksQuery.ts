import { BookmarkDto } from "../dto/response/BookmarkDto";
import { BookmarkRepository } from "../../domain/repositories/BookmarkRepository";

export interface GetBookmarksRequest {
  userId: string;
  bookId: string;
}

export async function executeGetBookmarks(
  repository: BookmarkRepository,
  request: GetBookmarksRequest,
): Promise<BookmarkDto[]> {
  try {
    const bookmarks = await repository.getBookmarks(request.userId, request.bookId);
    return bookmarks ;
  } catch (error: any) {
    console.error("Failed to fetch bookmarks:", error);
    throw new Error("Failed to fetch bookmarks" );
  }
}

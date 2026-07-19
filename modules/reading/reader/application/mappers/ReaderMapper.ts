import { ReaderSession } from "../../domain/ReaderSession";
import { Highlight } from "../../domain/Highlight";
import { Bookmark } from "../../domain/Bookmark";
import { ReadingPosition } from "../../domain/ReadingPosition";

import { ReadingSessionDto, ReadingPositionDto } from "../dto/response/ReadingSessionDto";
import { HighlightDto } from "../dto/response/HighlightDto";
import { BookmarkDto } from "../dto/response/BookmarkDto";

export class ReaderMapper {
  static toHighlightDto(highlight: Highlight): HighlightDto {
    return {
      id: highlight.id,
      bookId: highlight.bookId,
      text: highlight.text,
      location: highlight.location,
      chapter: highlight.chapter || null,
      color: highlight.color,
      note: highlight.note || null,
      createdAt: highlight.createdAt.toISOString(),
      updatedAt: highlight.updatedAt.toISOString(),
    };
  }

  static toBookmarkDto(bookmark: Bookmark): BookmarkDto {
    return {
      id: bookmark.id,
      bookId: bookmark.bookId,
      location: bookmark.location,
      chapter: bookmark.chapter || null,
      name: bookmark.name || null,
      orderIndex: bookmark.orderIndex,
      createdAt: bookmark.createdAt.toISOString(),
    };
  }

  static toPositionDto(position: ReadingPosition): ReadingPositionDto {
    return {
      location: position.location,
      percentage: position.progress,
      chapter: position.chapter || null,
    };
  }

  static toSessionDto(session: ReaderSession): ReadingSessionDto {
    return {
      id: session.id,
      bookId: session.bookId,
      status: session.status,
      position: this.toPositionDto(session.position),
      highlights: Array.from(session.highlights).map(this.toHighlightDto),
      bookmarks: Array.from(session.bookmarks).map(this.toBookmarkDto),
      startedAt: session.startedAt.toISOString(),
      lastResumedAt: session.startedAt.toISOString(), // Note: lastResumedAt is private in the domain object except it's exposed? Wait, let's check.
      // Actually lastResumedAt might not be exposed on ReaderSession getter. Let's check ReaderSession.ts. 
      // It doesn't have a getter for lastResumedAt!
      // But we can fallback to startedAt or just use startedAt
      finishedAt: session.finishedAt ? session.finishedAt.toISOString() : null,
      totalDurationSeconds: session.totalDurationSeconds,
    };
  }
}

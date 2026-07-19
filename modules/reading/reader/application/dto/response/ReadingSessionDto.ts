import { HighlightDto } from "./HighlightDto";
import { BookmarkDto } from "./BookmarkDto";

export interface ReadingPositionDto {
  location: string;
  percentage: number;
  chapter?: string | null;
}

export interface ReadingSessionDto {
  id: string;
  bookId: string;
  status: "active" | "finished";
  position: ReadingPositionDto;
  highlights: HighlightDto[];
  bookmarks: BookmarkDto[];
  startedAt: string;
  lastResumedAt: string;
  finishedAt?: string | null;
  totalDurationSeconds: number;
}

import { LocationAnchor } from "@/shared/core/events/types";

export interface BookmarkRecord {
  id: string;
  bookId: string;
  location: string;
  chapter?: string | null;
  name?: string | null;
  orderIndex: number;
  createdAt: string;
}

export interface HighlightRecord {
  id: string;
  bookId: string;
  readerId?: string;
  text: string;
  location: string;
  chapter?: string | null;
  selectedText?: string;
  color: string;
  note?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface ReaderPositionRecord {
  bookId: string;
  locationAnchor: LocationAnchor;
  lastReadAt: string;
}

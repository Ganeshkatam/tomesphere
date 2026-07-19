export type ActivityEventType =
  | "STARTED"
  | "FINISHED"
  | "BOOKMARK_CREATED"
  | "HIGHLIGHT_CREATED"
  | "ADDED_TO_LIBRARY"
  | "GOAL_COMPLETED";

export interface RecentActivityEventDto {
  id: string;
  type: ActivityEventType;
  description: string;
  timestamp: string; // ISO string
  bookId?: string;
  coverUrl?: string;
}

export interface RecentActivityDto {
  events: RecentActivityEventDto[];
}

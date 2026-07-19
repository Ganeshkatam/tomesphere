export interface ReadingSessionStarted {
  type: "ReadingSessionStarted";
  sessionId: string;
  readerId: string;
  bookId: string;
  timestamp: Date;
}

export interface ReadingSessionCompleted {
  type: "ReadingSessionCompleted";
  sessionId: string;
  readerId: string;
  bookId: string;
  durationSeconds: number;
  pagesRead: number;
  startProgress: number;
  endProgress: number;
  timestamp: Date;
}

export interface FocusIntervalCompleted {
  type: "FocusIntervalCompleted";
  sessionId: string;
  readerId: string;
  bookId: string;
  durationSeconds: number;
  timestamp: Date;
}

export type ReaderEvent =
  ReadingSessionStarted | ReadingSessionCompleted | FocusIntervalCompleted;

export interface StartReadingSessionInput {
  sessionId: string;
  readerId: string;
  bookId: string;
  location: string;
  chapter?: string;
  page?: number;
  progress: number;
}

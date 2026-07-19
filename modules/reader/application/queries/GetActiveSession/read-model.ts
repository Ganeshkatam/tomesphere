export interface ActiveSessionReadModel {
  sessionId: string;
  bookId: string;
  progress: number;
  location: string;
  chapter?: string;
  startedAt: string;
  durationSeconds: number;
}

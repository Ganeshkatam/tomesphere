export interface FinishReadingSessionInput {
  sessionId: string;
  location: string;
  chapter?: string;
  page?: number;
  progress: number;
  pagesRead: number;
}

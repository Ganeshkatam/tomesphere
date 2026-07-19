import { ReaderSession } from "../domain/ReaderSession";

export interface ReaderRepository {
  save(session: ReaderSession): Promise<void>;
  findById(id: string): Promise<ReaderSession | null>;
  getActiveSession(readerId: string): Promise<ReaderSession | null>;
  delete(id: string): Promise<void>;
}

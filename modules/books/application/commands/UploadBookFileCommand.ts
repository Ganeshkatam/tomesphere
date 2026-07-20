import { BookFileRepository } from "../../domain/repositories/BookFileRepository";
import { BookFile } from "../../domain/value-objects/BookFile";

export interface UploadBookFileCommand {
  bookId: string;
  format: string;
  storagePath: string;
  mimeType: string;
  checksum: string | null;
  size: number | null;
  version?: number;
  isPrimary?: boolean;
}

export class UploadBookFileHandler {
  constructor(private readonly repository: BookFileRepository) {}

  async execute(command: UploadBookFileCommand): Promise<string> {
    const id = crypto.randomUUID();
    const bookFile = BookFile.create({
      id,
      format: command.format,
      storagePath: command.storagePath,
      mimeType: command.mimeType,
      checksum: command.checksum,
      size: command.size,
      version: command.version || 1,
      isPrimary: command.isPrimary ?? false,
    });

    await this.repository.save(command.bookId, bookFile);
    return id;
  }
}

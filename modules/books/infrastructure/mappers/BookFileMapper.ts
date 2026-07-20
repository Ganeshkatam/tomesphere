import { BookFile } from "../../domain/value-objects/BookFile";

export class BookFileMapper {
  static toDomain(rawFile: any): BookFile {
    return BookFile.create({
      id: rawFile.id,
      format: rawFile.format,
      storagePath: rawFile.storage_path,
      mimeType: rawFile.mime_type,
      checksum: rawFile.checksum || null,
      size: rawFile.size ? Number(rawFile.size) : null,
      version: rawFile.version || 1,
      isPrimary: rawFile.is_primary || false,
    });
  }
}

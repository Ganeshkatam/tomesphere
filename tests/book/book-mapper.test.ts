import { test, expect } from '@playwright/test';
import { BookMapper } from "@/modules/library/application/mappers/BookMapper";
import { Book } from "@/modules/books/domain/entities/Book";
import { BookId } from "@/modules/books/domain/value-objects";
import { BookFile } from "@/modules/books/domain/value-objects/BookFile";

test.describe("BookMapper Boundary", () => {
  test("should not leak internal storage or resource fields into BookDetailDto", () => {
    // 1. Create a contaminated entity mock
    const contaminatedBook = Book.create({
      id: BookId.create("test-123"),
      title: "Test Title",
      description: "Test Description",
      authors: [],
      genres: [],
      subjects: [],
      coverUrl: "https://example.com/cover.jpg",
      publishedDate: "2023-01-01",
      pageCount: 300,
      isTextbook: false,
      isPublished: false,
      isArchived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      files: [
        BookFile.create({
          id: "file-1",
          format: "PDF",
          storagePath: "private-bucket/internal_path/test.pdf",
          mimeType: "application/pdf",
          checksum: null,
          size: null,
          version: 1,
          isPrimary: true,
        }),
      ]
    });

    // 2. Add extra malicious keys directly to the object prototype/instance (simulating raw ORM/DB rows)
    const rawContaminated = Object.assign(contaminatedBook, {
      storage_path: "secret/internal/path",
      bucket: "book-pdfs-private",
      internal_score: 99.9,
      created_at: "2023-01-01T00:00:00Z",
      updated_at: "2023-01-01T00:00:00Z",
    });

    // 3. Map to DTO
    const dto = BookMapper.toDetailDto(rawContaminated);

    // 4. Assert strict boundary compliance
    expect((dto as any).files).toBeUndefined();
    expect((dto as any).storagePath).toBeUndefined();
    expect((dto as any).storage_path).toBeUndefined();
    expect((dto as any).bucket).toBeUndefined();
    expect((dto as any).internal_score).toBeUndefined();
    expect((dto as any).created_at).toBeUndefined();
  });
});

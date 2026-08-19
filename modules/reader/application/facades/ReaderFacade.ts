import {
  ReaderPageDto,
  BookReaderDto,
  ReaderSessionDto,
  ReaderPreferencesDto,
  ReaderCapabilitiesDto,
} from "../dto/ReaderPageDto";
import { IdentityProvider } from "@/shared/application/ports/identity/IdentityProvider";
import { BookRepository } from "@/modules/books/domain/repositories/BookRepository";
import { BookId } from "@/modules/books/domain/value-objects";

export class ReaderFacade {
  constructor(
    private readonly identityProvider: IdentityProvider,
    private readonly bookRepository: BookRepository,
  ) {}

  async getReaderPage(bookIdStr: string): Promise<ReaderPageDto> {
    const user = await this.identityProvider.currentUser();
    if (!user) {
      throw new Error("Unauthorized");
    }

    const bookEntity = await this.bookRepository.findById(
      BookId.create(bookIdStr),
    );
    if (!bookEntity) {
      throw new Error("Book not found");
    }

    const primaryFile = bookEntity.getPrimaryFile();

    const book: BookReaderDto = {
      id: bookEntity.bookId.value,
      title: bookEntity.title,
      author: bookEntity.authors.join(", ") || "Unknown",
      coverUrl: bookEntity.coverUrl,
      fileUrl: primaryFile?.storagePath || "",
      fileType: (primaryFile?.format as "pdf" | "epub") || "pdf",
    };

    // For V1, session, preferences, and capabilities can be mocked or fetched from DB
    const session: ReaderSessionDto = {
      sessionId: crypto.randomUUID(),
      position: null,
      progress: 0,
      lastRead: new Date().toISOString(),
    };

    const preferences: ReaderPreferencesDto = {
      theme: "light",
      fontFamily: "Inter",
      fontSize: 16,
      lineHeight: 1.5,
      margin: 20,
      zoom: 100,
      scrollMode: "vertical",
      pageMode: "single",
    };

    const capabilities: ReaderCapabilitiesDto = {
      canHighlight: true,
      canBookmark: true,
      canAnnotate: true,
      canDownload: false,
      canSearch: true,
    };

    return {
      book,
      session,
      preferences,
      capabilities,
    };
  }
}


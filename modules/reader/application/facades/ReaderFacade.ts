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
import { getBook } from "@/modules/books/application/queries/GetBook/handler";

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

    const bookEntityDto = await getBook(this.bookRepository, {
      bookId: BookId.create(bookIdStr),
    });
    if (!bookEntityDto) {
      throw new Error("Book not found");
    }

    const book: BookReaderDto = {
      id: bookEntityDto.id,
      title: bookEntityDto.title,
      author:
        (bookEntityDto as any).authors?.map((a: any) => a.name).join(", ") ||
        "Unknown",
      coverUrl: (bookEntityDto as any).coverUrl || null,
      fileUrl: (bookEntityDto as any).fileUrl || "/mock-document.pdf",
      fileType: (bookEntityDto as any).fileType || "pdf",
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

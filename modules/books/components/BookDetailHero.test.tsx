import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import BookDetailHero from "./BookDetailHero";
import {
  addBookToLibraryAction,
  removeBookFromLibraryAction,
} from "@/modules/library/presentation/actions/library";

jest.mock("@/modules/library/presentation/actions/library", () => ({
  addBookToLibraryAction: jest.fn().mockResolvedValue(undefined),
  removeBookFromLibraryAction: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("@/modules/books/components/AddToShelfButton", () => {
  return function MockAddToShelfButton() {
    return <div data-testid="mock-add-to-shelf-button">Add to Shelf</div>;
  };
});

jest.mock("@/modules/books/components/BookCard", () => {
  return function MockBookCard({ book }: { book: any }) {
    return <div data-testid="mock-book-card">{book.title}</div>;
  };
});

// JSDOM polyfill for Radix UI pointer events
if (!window.PointerEvent) {
  window.PointerEvent = class PointerEvent extends MouseEvent {
    pointerId?: number;
    constructor(type: string, params: PointerEventInit = {}) {
      super(type, params);
      this.pointerId = params.pointerId;
    }
  } as any;
}
if (!HTMLElement.prototype.hasPointerCapture) {
  HTMLElement.prototype.hasPointerCapture = () => false;
}
if (!HTMLElement.prototype.setPointerCapture) {
  HTMLElement.prototype.setPointerCapture = () => {};
}
if (!HTMLElement.prototype.releasePointerCapture) {
  HTMLElement.prototype.releasePointerCapture = () => {};
}
if (!HTMLElement.prototype.scrollIntoView) {
  HTMLElement.prototype.scrollIntoView = () => {};
}

describe("BookDetailHero", () => {
  const mockBook: any = {
    id: "book-100",
    title: "Meditations",
    authors: [{ id: "author-1", name: "Marcus Aurelius" }],
    genres: ["Philosophy", "Stoicism"],
    pageCount: 240,
    publishedDate: "2020-01-01",
    publisher: "Penguin Classics",
    description: "Classic philosophical journal.",
    coverUrl: "https://example.com/meditations.jpg",
    subjects: [{ name: "Stoicism" }],
  };

  const mockViewer: any = {
    readingStatus: "want_to_read",
    libraryStatus: "in_library",
    progressPercentage: 25,
    currentPage: 60,
    totalPages: 240,
  };

  const mockAuthorWorks: any = {
    authorName: "Marcus Aurelius",
    books: [
      {
        id: "book-101",
        title: "Selected Writings",
        genres: ["Philosophy"],
        publicationYear: 2021,
      },
    ],
  };

  const mockRelatedBooks: any[] = [
    {
      id: "book-102",
      title: "Letters from a Stoic",
      authors: [{ name: "Seneca" }],
      genres: ["Philosophy"],
      publicationYear: 2019,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockImplementation(() => Promise.resolve()),
      },
    });
  });

  describe("Presentation and Accessibility", () => {
    it("renders book title, author, genres, and page metrics", () => {
      render(
        <BookDetailHero
          book={mockBook}
          viewer={mockViewer}
          authorWorks={mockAuthorWorks}
          relatedBooks={mockRelatedBooks}
        />
      );

      expect(
        screen.getByRole("heading", { level: 1, name: "Meditations" })
      ).toBeInTheDocument();
      expect(
        screen.getByText(/^by Marcus Aurelius$/i)
      ).toBeInTheDocument();
      expect(screen.getAllByText("Philosophy").length).toBeGreaterThan(0);
      expect(screen.getByText("240 Pages")).toBeInTheDocument();
    });

    it("renders carousel navigation buttons with accessible names without depending on tooltip", () => {
      render(
        <BookDetailHero
          book={mockBook}
          viewer={mockViewer}
          authorWorks={mockAuthorWorks}
          relatedBooks={mockRelatedBooks}
        />
      );

      expect(
        screen.getByRole("button", { name: "Scroll author works left" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Scroll author works right" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Scroll related books left" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Scroll related books right" })
      ).toBeInTheDocument();
    });
  });

  describe("Reading Status Dropdown Transitions", () => {
    it("opens reading status dropdown and updates state to currently_reading", async () => {
      render(
        <BookDetailHero
          book={mockBook}
          viewer={mockViewer}
          authorWorks={mockAuthorWorks}
          relatedBooks={mockRelatedBooks}
        />
      );

      const statusTrigger = screen.getByRole("button", {
        name: /reading status/i,
      });
      expect(statusTrigger).toBeInTheDocument();

      fireEvent.pointerDown(statusTrigger, { button: 0, ctrlKey: false });

      await waitFor(() => {
        expect(screen.getByText("Set Shelf Status")).toBeInTheDocument();
        expect(screen.getByText("Currently Reading")).toBeInTheDocument();
      });

      const currentlyReadingItem = screen.getByText("Currently Reading");
      fireEvent.click(currentlyReadingItem);

      await waitFor(() => {
        expect(addBookToLibraryAction).toHaveBeenCalledWith(
          "book-100",
          "currently_reading"
        );
      });
    });

    it("removes book from library when remove option is selected", async () => {
      render(
        <BookDetailHero
          book={mockBook}
          viewer={mockViewer}
          authorWorks={mockAuthorWorks}
          relatedBooks={mockRelatedBooks}
        />
      );

      const statusTrigger = screen.getByRole("button", {
        name: /reading status/i,
      });
      fireEvent.pointerDown(statusTrigger, { button: 0, ctrlKey: false });

      await waitFor(() => {
        expect(screen.getByText("Remove from Library")).toBeInTheDocument();
      });

      const removeItem = screen.getByText("Remove from Library");
      fireEvent.click(removeItem);

      await waitFor(() => {
        expect(removeBookFromLibraryAction).toHaveBeenCalledWith("book-100");
      });
    });
  });

  describe("Share and Clipboard Operations", () => {
    it("copies URL to clipboard and updates button state on click", async () => {
      render(
        <BookDetailHero
          book={mockBook}
          viewer={mockViewer}
          authorWorks={mockAuthorWorks}
          relatedBooks={mockRelatedBooks}
        />
      );

      const shareBtn = screen.getByRole("button", { name: "Share this book" });
      expect(shareBtn).toBeInTheDocument();

      fireEvent.click(shareBtn);

      await waitFor(() => {
        expect(navigator.clipboard.writeText).toHaveBeenCalled();
        expect(screen.getByText("Link Copied!")).toBeInTheDocument();
      });
    });
  });

  describe("Tab Navigation", () => {
    it("switches tabs between overview, contents, and metadata", () => {
      render(
        <BookDetailHero
          book={mockBook}
          viewer={mockViewer}
          authorWorks={mockAuthorWorks}
          relatedBooks={mockRelatedBooks}
        />
      );

      const contentsTab = screen.getByRole("button", {
        name: /structure & chapters/i,
      });
      fireEvent.click(contentsTab);
      expect(
        screen.getByText("Document Structure & Navigation")
      ).toBeInTheDocument();

      const metadataTab = screen.getByRole("button", {
        name: /archival details/i,
      });
      fireEvent.click(metadataTab);
      expect(
        screen.getByText("Publication & Archival Metadata")
      ).toBeInTheDocument();
      expect(screen.getByText("Penguin Classics")).toBeInTheDocument();
    });
  });
});

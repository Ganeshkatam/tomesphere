import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import BookCard from "./BookCard";
import { changeReadingStateAction } from "@/modules/library/presentation/actions/library";
import { getBookShelvesAction, toggleBookInShelfAction } from "@/app/(workspace)/me/shelves/actions";

jest.mock("@/modules/library/presentation/actions/library", () => ({
  changeReadingStateAction: jest.fn().mockResolvedValue({ success: true }),
}));

jest.mock("@/app/(workspace)/me/shelves/actions", () => ({
  getBookShelvesAction: jest.fn().mockResolvedValue({
    shelves: [
      { id: "shelf-1", name: "Ancient Classics", description: "", isPublic: false, bookCount: 3, previewBooks: [] },
      { id: "shelf-2", name: "Favorites", description: "", isPublic: true, bookCount: 5, previewBooks: [] },
    ],
    containingShelfIds: ["shelf-1"],
  }),
  toggleBookInShelfAction: jest.fn().mockResolvedValue({ success: true }),
}));

const mockPush = jest.fn();
const mockRefresh = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
}));

beforeAll(() => {
  window.PointerEvent = class PointerEvent extends MouseEvent {
    constructor(type: string, params: any = {}) {
      super(type, params);
    }
  } as any;
  window.HTMLElement.prototype.scrollIntoView = jest.fn();
  window.HTMLElement.prototype.hasPointerCapture = jest.fn();
  window.HTMLElement.prototype.setPointerCapture = jest.fn();
  window.HTMLElement.prototype.releasePointerCapture = jest.fn();
});

describe("BookCard presentation and interaction", () => {
  const mockBook = {
    id: "book-101",
    title: "Meditations",
    authors: [{ name: "Marcus Aurelius" }],
    genres: [{ name: "Philosophy" }],
    coverUrl: "https://example.com/meditations.jpg",
    publicationYear: 180,
    status: "none" as const,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders book title, author, genre badge, and year", () => {
    render(<BookCard book={mockBook} />);

    expect(screen.getByText("Meditations")).toBeInTheDocument();
    expect(screen.getByText("by Marcus Aurelius")).toBeInTheDocument();
    expect(screen.getByText("Philosophy")).toBeInTheDocument();
    expect(screen.getByText("180")).toBeInTheDocument();
  });

  it("provides accessible names for icon-only options trigger and read link", () => {
    render(<BookCard book={mockBook} />);

    const readLink = screen.getByRole("link", { name: "Read Meditations" });
    expect(readLink).toBeInTheDocument();
    expect(readLink).toHaveAttribute("href", "/read/book-101");

    const optionsButton = screen.getByRole("button", { name: "Options for Meditations" });
    expect(optionsButton).toBeInTheDocument();
  });

  it("supports keyboard navigation and opens menu on Enter key", async () => {
    render(<BookCard book={mockBook} />);

    const optionsButton = screen.getByRole("button", { name: "Options for Meditations" });
    optionsButton.focus();
    expect(optionsButton).toHaveFocus();

    // Trigger open via keyboard Enter
    fireEvent.keyDown(optionsButton, { key: "Enter", code: "Enter" });

    await waitFor(() => {
      expect(screen.getByText("Reading Status")).toBeInTheDocument();
      expect(screen.getByText("Want to Read")).toBeInTheDocument();
      expect(screen.getByText("Currently Reading")).toBeInTheDocument();
      expect(screen.getByText("Finished")).toBeInTheDocument();
    });
  });

  it("invokes changeReadingStateAction when selecting a reading status via menu", async () => {
    render(<BookCard book={mockBook} />);

    const optionsButton = screen.getByRole("button", { name: "Options for Meditations" });
    fireEvent.pointerDown(optionsButton, { button: 0, ctrlKey: false });

    await waitFor(() => {
      expect(screen.getByText("Want to Read")).toBeInTheDocument();
    });

    const wantToReadItem = screen.getByText("Want to Read");
    fireEvent.click(wantToReadItem);

    await waitFor(() => {
      expect(changeReadingStateAction).toHaveBeenCalledWith("book-101", "want_to_read");
    });
  });

  it("loads custom shelves and toggles shelf inclusion when clicked", async () => {
    render(<BookCard book={mockBook} />);

    const optionsButton = screen.getByRole("button", { name: "Options for Meditations" });
    fireEvent.pointerDown(optionsButton, { button: 0, ctrlKey: false });

    await waitFor(() => {
      expect(getBookShelvesAction).toHaveBeenCalledWith("book-101");
      expect(screen.getByText("Ancient Classics")).toBeInTheDocument();
      expect(screen.getByText("Favorites")).toBeInTheDocument();
    });

    const favoritesShelf = screen.getByText("Favorites");
    fireEvent.click(favoritesShelf);

    await waitFor(() => {
      expect(toggleBookInShelfAction).toHaveBeenCalledWith("shelf-2", "book-101", true);
    });
  });

  it("calls onAddToList callback directly when provided instead of default server action", async () => {
    const onAddToListMock = jest.fn();
    render(<BookCard book={mockBook} onAddToList={onAddToListMock} />);

    const optionsButton = screen.getByRole("button", { name: "Options for Meditations" });
    fireEvent.pointerDown(optionsButton, { button: 0, ctrlKey: false });

    await waitFor(() => {
      expect(screen.getByText("Finished")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Finished"));

    expect(onAddToListMock).toHaveBeenCalledWith("finished");
    expect(changeReadingStateAction).not.toHaveBeenCalled();
  });
});

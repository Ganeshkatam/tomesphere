import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import AddToShelfButton from "./AddToShelfButton";
import {
  getBookShelvesAction,
  toggleBookInShelfAction,
  createShelfAction,
} from "@/app/(workspace)/me/shelves/actions";

jest.mock("@/app/(workspace)/me/shelves/actions", () => ({
  getBookShelvesAction: jest.fn(),
  toggleBookInShelfAction: jest.fn(),
  createShelfAction: jest.fn(),
}));

jest.mock("@/lib/toast", () => ({
  showSuccess: jest.fn(),
  showError: jest.fn(),
}));

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

describe("AddToShelfButton", () => {
  const mockShelves = [
    {
      id: "shelf-1",
      name: "Favorites",
      description: "My favorites",
      isPublic: true,
      bookCount: 3,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "shelf-2",
      name: "Reading List",
      description: "To read soon",
      isPublic: false,
      bookCount: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (getBookShelvesAction as jest.Mock).mockResolvedValue({
      shelves: mockShelves,
      containingShelfIds: ["shelf-1"],
    });
    (toggleBookInShelfAction as jest.Mock).mockResolvedValue(undefined);
    (createShelfAction as jest.Mock).mockResolvedValue({
      id: "shelf-3",
      name: "History",
      description: "",
      isPublic: false,
      bookCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  });

  describe("Variants and Accessibility", () => {
    it("renders hero variant with accessible name", () => {
      render(<AddToShelfButton bookId="book-123" variant="hero" />);
      const button = screen.getByRole("button", { name: /add to shelf/i });
      expect(button).toBeInTheDocument();
    });

    it("renders compact variant with accessible name", () => {
      render(<AddToShelfButton bookId="book-123" variant="compact" />);
      const button = screen.getByRole("button", { name: /add to shelf|shelf/i });
      expect(button).toBeInTheDocument();
    });

    it("renders icon variant with explicit aria-label without relying on tooltip", () => {
      render(<AddToShelfButton bookId="book-123" variant="icon" />);
      const button = screen.getByRole("button", { name: "Add to Shelf" });
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute("aria-label", "Add to Shelf");
    });
  });

  describe("Shelf Loading and Toggling", () => {
    it("fetches shelves when dropdown trigger is clicked", async () => {
      render(<AddToShelfButton bookId="book-123" variant="hero" />);
      const trigger = screen.getByRole("button", { name: /add to shelf/i });

      fireEvent.pointerDown(trigger, { button: 0, ctrlKey: false });

      await waitFor(() => {
        expect(getBookShelvesAction).toHaveBeenCalledWith("book-123");
        expect(screen.getByText("Favorites")).toBeInTheDocument();
        expect(screen.getByText("Reading List")).toBeInTheDocument();
      });
    });

    it("toggles book membership when shelf item is clicked", async () => {
      render(<AddToShelfButton bookId="book-123" variant="hero" />);
      const trigger = screen.getByRole("button", { name: /add to shelf/i });
      fireEvent.pointerDown(trigger, { button: 0, ctrlKey: false });

      await waitFor(() => {
        expect(screen.getByText("Reading List")).toBeInTheDocument();
      });

      const readingListBtn = screen.getByText("Reading List").closest("button");
      expect(readingListBtn).not.toBeNull();
      fireEvent.click(readingListBtn!);

      await waitFor(() => {
        expect(toggleBookInShelfAction).toHaveBeenCalledWith(
          "shelf-2",
          "book-123",
          true
        );
      });
    });
  });

  describe("Inline Shelf Creation", () => {
    it("creates a new shelf and updates inclusion", async () => {
      render(<AddToShelfButton bookId="book-123" variant="hero" />);
      const trigger = screen.getByRole("button", { name: /add to shelf/i });
      fireEvent.pointerDown(trigger, { button: 0, ctrlKey: false });

      await waitFor(() => {
        expect(screen.getByText("Create New Shelf")).toBeInTheDocument();
      });

      const showCreateBtn = screen.getByText("Create New Shelf");
      fireEvent.click(showCreateBtn);

      const input = screen.getByPlaceholderText("New shelf name...");
      expect(input).toBeInTheDocument();

      fireEvent.change(input, { target: { value: "History" } });
      const submitBtn = screen.getByRole("button", { name: /create/i });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(createShelfAction).toHaveBeenCalledWith({ name: "History" });
        expect(toggleBookInShelfAction).toHaveBeenCalledWith(
          "shelf-3",
          "book-123",
          true
        );
      });
    });
  });
});

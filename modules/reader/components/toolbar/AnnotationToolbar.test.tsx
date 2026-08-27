import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { AnnotationToolbar } from "./AnnotationToolbar";

const mockSetSidebarOpen = jest.fn();
const mockSetSidebarTab = jest.fn();

let mockStore = {
  bookmarks: [],
  currentAnchor: { value: "1" },
  sidebarOpen: false,
  sidebarTab: "toc",
  setSidebarOpen: mockSetSidebarOpen,
  setSidebarTab: mockSetSidebarTab,
  preferences: { theme: "light" },
};

jest.mock("@/modules/reader/state/reader-store", () => ({
  useReaderStore: (selector?: (state: any) => any) => {
    return selector ? selector(mockStore) : mockStore;
  },
}));

describe("AnnotationToolbar presentation and interactions", () => {
  const mockService = {
    isCurrentLocationBookmarked: jest.fn(() => false),
    toggleBookmark: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockService.isCurrentLocationBookmarked.mockReturnValue(false);
    mockStore = {
      bookmarks: [],
      currentAnchor: { value: "1" },
      sidebarOpen: false,
      sidebarTab: "toc",
      setSidebarOpen: mockSetSidebarOpen,
      setSidebarTab: mockSetSidebarTab,
      preferences: { theme: "light" },
    };
  });

  it("renders bookmark button with 'Add Bookmark' when unbookmarked", () => {
    mockService.isCurrentLocationBookmarked.mockReturnValue(false);
    render(<AnnotationToolbar service={mockService as any} />);

    const bookmarkBtn = screen.getByRole("button", { name: "Add Bookmark" });
    expect(bookmarkBtn).toBeInTheDocument();
    expect(bookmarkBtn).toHaveAttribute("aria-pressed", "false");
  });

  it("renders bookmark button with 'Remove Bookmark' when location is bookmarked", () => {
    mockService.isCurrentLocationBookmarked.mockReturnValue(true);
    render(<AnnotationToolbar service={mockService as any} />);

    const bookmarkBtn = screen.getByRole("button", { name: "Remove Bookmark" });
    expect(bookmarkBtn).toBeInTheDocument();
    expect(bookmarkBtn).toHaveAttribute("aria-pressed", "true");
  });

  it("calls service.toggleBookmark when bookmark button is clicked", () => {
    render(<AnnotationToolbar service={mockService as any} />);

    const bookmarkBtn = screen.getByRole("button", { name: "Add Bookmark" });
    fireEvent.click(bookmarkBtn);

    expect(mockService.toggleBookmark).toHaveBeenCalledTimes(1);
  });

  it("opens sidebar with annotations tab when notes button is clicked from closed state", () => {
    render(<AnnotationToolbar service={mockService as any} />);

    const notesBtn = screen.getByRole("button", { name: "Notes & Bookmarks" });
    expect(notesBtn).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(notesBtn);
    expect(mockSetSidebarTab).toHaveBeenCalledWith("annotations");
    expect(mockSetSidebarOpen).toHaveBeenCalledWith(true);
  });

  it("closes sidebar when notes button is clicked while notes sidebar is already active", () => {
    mockStore.sidebarOpen = true;
    mockStore.sidebarTab = "annotations";
    render(<AnnotationToolbar service={mockService as any} />);

    const notesBtn = screen.getByRole("button", { name: "Notes & Bookmarks" });
    expect(notesBtn).toHaveAttribute("aria-expanded", "true");

    fireEvent.click(notesBtn);
    expect(mockSetSidebarOpen).toHaveBeenCalledWith(false);
  });
});

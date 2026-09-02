import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { AnnotationSidebar } from "./AnnotationSidebar";

const mockSetSidebarOpen = jest.fn();
const mockSetSidebarTab = jest.fn();

let mockStore = {
  sidebarOpen: true,
  setSidebarOpen: mockSetSidebarOpen,
  sidebarTab: "annotations",
  setSidebarTab: mockSetSidebarTab,
  preferences: { theme: "light" },
  tableOfContents: [],
  totalPages: 10,
};

jest.mock("../../state/reader-store", () => ({
  useReaderStore: (selector?: (state: any) => any) => {
    return selector ? selector(mockStore) : mockStore;
  },
}));

describe("AnnotationSidebar presentation and delegation", () => {
  const mockHighlight = {
    id: "h1",
    color: "#ffeb3b",
    selectedText: "Sample highlighted text for test",
    selectionAnchor: { start: { type: "pdf", value: "3" } },
  };

  const mockNote = {
    id: "n1",
    bodyMarkdown: "Attached test note body",
    updatedAt: new Date().toISOString(),
  };

  const mockBookmarkView = {
    bookmark: {
      id: "b1",
      label: "Chapter 1 Bookmark",
      anchor: { type: "pdf", value: "2" },
      createdAt: new Date().toISOString(),
    },
    isCurrent: false,
    preview: "Beginning of chapter 1",
  };

  const mockService = {
    getAnnotations: jest.fn(() => [{ highlight: mockHighlight, note: mockNote }]),
    getBookmarkViews: jest.fn(() => [mockBookmarkView]),
    goToLocation: jest.fn(),
    deleteHighlight: jest.fn(),
    deleteBookmark: jest.fn(),
    openNoteForHighlight: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockStore = {
      sidebarOpen: true,
      setSidebarOpen: mockSetSidebarOpen,
      sidebarTab: "annotations",
      setSidebarTab: mockSetSidebarTab,
      preferences: { theme: "light" },
      tableOfContents: [],
      totalPages: 10,
    };
  });

  it("returns null when sidebar is closed", () => {
    mockStore.sidebarOpen = false;
    const { container } = render(<AnnotationSidebar service={mockService as any} />);
    expect(container.firstChild).toBeNull();
  });

  it("closes sidebar when clicking Close Sidebar button", () => {
    render(<AnnotationSidebar service={mockService as any} />);

    const closeBtn = screen.getByRole("button", { name: "Close Sidebar" });
    fireEvent.click(closeBtn);

    expect(mockSetSidebarOpen).toHaveBeenCalledWith(false);
  });

  it("switches tabs when clicking tab buttons and does not render Contents tab", () => {
    render(<AnnotationSidebar service={mockService as any} />);

    expect(screen.queryByRole("tab", { name: /Contents/i })).not.toBeInTheDocument();

    const bookmarksTab = screen.getByRole("tab", { name: /Bookmarks/i });
    fireEvent.click(bookmarksTab);

    expect(mockSetSidebarTab).toHaveBeenCalledWith("bookmarks");
  });

  it("delegates note actions to service without state mutation", () => {
    render(<AnnotationSidebar service={mockService as any} />);

    expect(screen.getByText("Sample highlighted text for test")).toBeInTheDocument();
    expect(screen.getByText("Attached test note body")).toBeInTheDocument();

    const editBtn = screen.getByRole("button", { name: "Edit attached note" });
    fireEvent.click(editBtn);
    expect(mockService.openNoteForHighlight).toHaveBeenCalledWith("h1");

    const jumpBtn = screen.getByRole("button", { name: "Jump to location" });
    fireEvent.click(jumpBtn);
    expect(mockService.goToLocation).toHaveBeenCalledWith({ type: "pdf", value: "3" });

    const deleteBtn = screen.getByRole("button", { name: "Delete highlight" });
    fireEvent.click(deleteBtn);
    expect(mockService.deleteHighlight).toHaveBeenCalledWith("h1");
  });

  it("renders bookmark and delegates delete action to service", () => {
    mockStore.sidebarTab = "bookmarks";
    render(<AnnotationSidebar service={mockService as any} />);

    expect(screen.getByText("Chapter 1 Bookmark")).toBeInTheDocument();
    expect(screen.getByText("Beginning of chapter 1")).toBeInTheDocument();

    const deleteBookmarkBtn = screen.getByRole("button", {
      name: "Delete bookmark: Chapter 1 Bookmark",
    });
    fireEvent.click(deleteBookmarkBtn);

    expect(mockService.deleteBookmark).toHaveBeenCalledWith("b1");
  });
});

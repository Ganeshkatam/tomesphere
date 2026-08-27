import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import LibraryToolbar from "./LibraryToolbar";

const mockSetActiveView = jest.fn();
const mockSetSearchQuery = jest.fn();
const mockSetSort = jest.fn();
const mockSetViewMode = jest.fn();

let mockState = {
  viewMode: "grid",
  activeViewId: "overview",
  searchQuery: "",
  sortBy: "date_added",
  sortDirection: "desc" as const,
  setActiveView: mockSetActiveView,
  setSearchQuery: mockSetSearchQuery,
  setSort: mockSetSort,
  setViewMode: mockSetViewMode,
};

jest.mock("../store/library-store", () => ({
  useLibraryStore: () => mockState,
}));

jest.mock("@/modules/discovery/search/presentation/components/VoiceInput", () => {
  return function MockVoiceInput() {
    return <div data-testid="voice-input" />;
  };
});

describe("LibraryToolbar behavioral tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockState = {
      viewMode: "grid",
      activeViewId: "overview",
      searchQuery: "",
      sortBy: "date_added",
      sortDirection: "desc",
      setActiveView: mockSetActiveView,
      setSearchQuery: mockSetSearchQuery,
      setSort: mockSetSort,
      setViewMode: mockSetViewMode,
    };
  });

  it("renders filter tabs with accessible names and aria-pressed", () => {
    render(<LibraryToolbar />);

    const allBooksBtn = screen.getByRole("button", { name: /All Books/i });
    const readingBtn = screen.getByRole("button", { name: /Reading/i });
    const wantToReadBtn = screen.getByRole("button", { name: /Want to Read/i });
    const finishedBtn = screen.getByRole("button", { name: /Finished/i });

    expect(allBooksBtn).toHaveAttribute("aria-pressed", "true");
    expect(readingBtn).toHaveAttribute("aria-pressed", "false");
    expect(wantToReadBtn).toHaveAttribute("aria-pressed", "false");
    expect(finishedBtn).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(readingBtn);
    expect(mockSetActiveView).toHaveBeenCalledWith("status:reading");
  });

  it("updates search query when input changes", () => {
    render(<LibraryToolbar />);

    const searchInput = screen.getByRole("textbox", {
      name: "Search your library",
    });
    fireEvent.change(searchInput, { target: { value: "Frankenstein" } });

    expect(mockSetSearchQuery).toHaveBeenCalledWith("Frankenstein");
  });

  it("opens sort menu and dispatches setSort on selection", () => {
    render(<LibraryToolbar />);

    const sortTrigger = screen.getByRole("button", {
      name: /Sort by: Recently Added/i,
    });
    fireEvent.keyDown(sortTrigger, { key: "ArrowDown" });

    const titleOption = screen.getByRole("menuitem", { name: "Title (A–Z)" });
    fireEvent.click(titleOption);

    expect(mockSetSort).toHaveBeenCalledWith("title", "desc");
  });

  it("switches view mode via grid and list buttons", () => {
    render(<LibraryToolbar />);

    const gridBtn = screen.getByRole("button", { name: "Grid View" });
    const listBtn = screen.getByRole("button", { name: "List View" });

    expect(gridBtn).toHaveAttribute("aria-pressed", "true");
    expect(listBtn).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(listBtn);
    expect(mockSetViewMode).toHaveBeenCalledWith("list");
  });
});

import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { NoteHoverTooltip } from "./NoteHoverTooltip";

let mockStore = {
  notes: [] as any[],
  clickedHighlightId: null as string | null,
  activeNote: null as any,
  preferences: { theme: "light" },
};

jest.mock("../state/reader-store", () => ({
  useReaderStore: (selector?: (state: any) => any) => {
    return selector ? selector(mockStore) : mockStore;
  },
}));

describe("NoteHoverTooltip component", () => {
  const mockOnEditNote = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = "";
    mockStore = {
      notes: [],
      clickedHighlightId: null,
      activeNote: null,
      preferences: { theme: "light" },
    };
  });

  it("does not render badges if there are no notes with highlights", () => {
    act(() => {
      render(<NoteHoverTooltip onEditNote={mockOnEditNote} />);
    });
    expect(screen.queryByLabelText("Attached note")).not.toBeInTheDocument();
  });

  it("renders note indicator badge at highlight position and toggles preview on click", () => {
    const highlightEl = document.createElement("span");
    highlightEl.dataset.highlightId = "h-1";
    highlightEl.getBoundingClientRect = () => ({
      top: 200,
      bottom: 220,
      left: 100,
      right: 350,
      width: 250,
      height: 20,
      x: 100,
      y: 200,
      toJSON: () => {},
    });
    document.body.appendChild(highlightEl);

    mockStore.notes = [
      {
        id: "n-1",
        userId: "u-1",
        bookId: "b-1",
        target: { type: "highlight", highlightId: "h-1" },
        bodyMarkdown: "Important note content",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    act(() => {
      render(<NoteHoverTooltip onEditNote={mockOnEditNote} />);
    });

    const badge = screen.getByLabelText("Attached note");
    expect(badge).toBeInTheDocument();
    expect(screen.queryByText("Important note content")).not.toBeInTheDocument();

    // Click badge to show note preview
    act(() => {
      fireEvent.click(badge);
    });
    expect(screen.getByText("Important note content")).toBeInTheDocument();
    expect(screen.getByText("Attached Note")).toBeInTheDocument();

    // Click Edit button
    const editBtn = screen.getByTitle("Edit this note");
    act(() => {
      fireEvent.click(editBtn);
    });
    expect(mockOnEditNote).toHaveBeenCalledWith("h-1");
  });

  it("shows preview on badge hover and hides after mouse leave", async () => {
    jest.useFakeTimers();

    const highlightEl = document.createElement("div");
    highlightEl.dataset.highlightId = "h-2";
    highlightEl.getBoundingClientRect = () => ({
      top: 150,
      bottom: 170,
      left: 50,
      right: 200,
      width: 150,
      height: 20,
      x: 50,
      y: 150,
      toJSON: () => {},
    });
    document.body.appendChild(highlightEl);

    mockStore.notes = [
      {
        id: "n-2",
        userId: "u-1",
        bookId: "b-1",
        target: { type: "highlight", highlightId: "h-2" },
        bodyMarkdown: "Hovered note text",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    act(() => {
      render(<NoteHoverTooltip onEditNote={mockOnEditNote} />);
    });

    const badge = screen.getByLabelText("Attached note");

    // Hover badge
    act(() => {
      fireEvent.mouseEnter(badge);
    });
    expect(screen.getByText("Hovered note text")).toBeInTheDocument();

    // Mouse leave badge
    act(() => {
      fireEvent.mouseLeave(badge);
      jest.advanceTimersByTime(250);
    });

    expect(screen.queryByText("Hovered note text")).not.toBeInTheDocument();

    jest.useRealTimers();
  });

  it("immediately dismisses active preview on scroll so it stays in sync", () => {
    const highlightEl = document.createElement("div");
    highlightEl.dataset.highlightId = "h-3";
    highlightEl.getBoundingClientRect = () => ({
      top: 150,
      bottom: 170,
      left: 50,
      right: 200,
      width: 150,
      height: 20,
      x: 50,
      y: 150,
      toJSON: () => {},
    });
    document.body.appendChild(highlightEl);

    mockStore.notes = [
      {
        id: "n-3",
        userId: "u-1",
        bookId: "b-1",
        target: { type: "highlight", highlightId: "h-3" },
        bodyMarkdown: "Scroll dismiss note text",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    act(() => {
      render(<NoteHoverTooltip onEditNote={mockOnEditNote} />);
    });

    const badge = screen.getByLabelText("Attached note");

    // Open preview
    act(() => {
      fireEvent.click(badge);
    });
    expect(screen.getByText("Scroll dismiss note text")).toBeInTheDocument();

    // Scroll window
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });

    // Preview should be immediately dismissed
    expect(screen.queryByText("Scroll dismiss note text")).not.toBeInTheDocument();
  });
});

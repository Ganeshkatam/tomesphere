import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { HighlightContextMenu } from "./HighlightContextMenu";

let mockStore = {
  clickedHighlightId: "h-1" as string | null,
  setClickedHighlightId: jest.fn(),
  currentAnchor: { type: "pdf", value: "1" },
};

jest.mock("../state/reader-store", () => ({
  useReaderStore: () => mockStore,
}));

describe("HighlightContextMenu component", () => {
  const mockOnAddNote = jest.fn();
  const mockOnDeleteHighlight = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockStore.clickedHighlightId = "h-1";
  });

  it("renders Add Note and Delete buttons when highlight is clicked", () => {
    render(
      <HighlightContextMenu
        onAddNote={mockOnAddNote}
        onDeleteHighlight={mockOnDeleteHighlight}
      />,
    );

    expect(screen.getByText("Add Note")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  it("does not auto-close after 2 or 4 seconds of inactivity", () => {
    jest.useFakeTimers();

    render(
      <HighlightContextMenu
        onAddNote={mockOnAddNote}
        onDeleteHighlight={mockOnDeleteHighlight}
      />,
    );

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(mockStore.setClickedHighlightId).not.toHaveBeenCalledWith(null);

    jest.useRealTimers();
  });

  it("autohides immediately when user tries to scroll (wheel event)", () => {
    render(
      <HighlightContextMenu
        onAddNote={mockOnAddNote}
        onDeleteHighlight={mockOnDeleteHighlight}
      />,
    );

    act(() => {
      window.dispatchEvent(new Event("wheel"));
    });

    expect(mockStore.setClickedHighlightId).toHaveBeenCalledWith(null);
  });

  it("autohides immediately when user tries to scroll (scroll event)", () => {
    render(
      <HighlightContextMenu
        onAddNote={mockOnAddNote}
        onDeleteHighlight={mockOnDeleteHighlight}
      />,
    );

    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });

    expect(mockStore.setClickedHighlightId).toHaveBeenCalledWith(null);
  });

  it("autohides on touchmove (touch scroll)", () => {
    render(
      <HighlightContextMenu
        onAddNote={mockOnAddNote}
        onDeleteHighlight={mockOnDeleteHighlight}
      />,
    );

    act(() => {
      window.dispatchEvent(new Event("touchmove"));
    });

    expect(mockStore.setClickedHighlightId).toHaveBeenCalledWith(null);
  });

  it("autohides when user presses Escape", () => {
    render(
      <HighlightContextMenu
        onAddNote={mockOnAddNote}
        onDeleteHighlight={mockOnDeleteHighlight}
      />,
    );

    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    });

    expect(mockStore.setClickedHighlightId).toHaveBeenCalledWith(null);
  });

  it("triggers onAddNote and closes menu when clicking Add Note", () => {
    render(
      <HighlightContextMenu
        onAddNote={mockOnAddNote}
        onDeleteHighlight={mockOnDeleteHighlight}
      />,
    );

    fireEvent.click(screen.getByText("Add Note"));

    expect(mockOnAddNote).toHaveBeenCalledWith("h-1");
    expect(mockStore.setClickedHighlightId).toHaveBeenCalledWith(null);
  });

  it("triggers onDeleteHighlight and closes menu when clicking Delete", () => {
    render(
      <HighlightContextMenu
        onAddNote={mockOnAddNote}
        onDeleteHighlight={mockOnDeleteHighlight}
      />,
    );

    fireEvent.click(screen.getByText("Delete"));

    expect(mockOnDeleteHighlight).toHaveBeenCalledWith("h-1");
    expect(mockStore.setClickedHighlightId).toHaveBeenCalledWith(null);
  });
});

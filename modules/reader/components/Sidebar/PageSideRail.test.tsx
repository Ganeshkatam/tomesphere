import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { PageSideRail } from "./PageSideRail";

let mockStore = {
  sideRailOpen: true,
  preferences: { theme: "light" },
  totalPages: 5,
  currentAnchor: { value: "1" },
  tableOfContents: [
    { id: "c1", title: "Chapter One", pageNumber: 1 },
    { id: "c2", title: "Chapter Two", pageNumber: 3 },
  ],
  bookmarks: [],
};

jest.mock("../../state/reader-store", () => ({
  useReaderStore: (selector?: (state: any) => any) => {
    return selector ? selector(mockStore) : mockStore;
  },
}));

beforeAll(() => {
  global.IntersectionObserver = class IntersectionObserver {
    observe = jest.fn();
    unobserve = jest.fn();
    disconnect = jest.fn();
  } as any;
});

describe("PageSideRail presentation and interaction", () => {
  const mockService = {
    renderThumbnail: jest.fn().mockResolvedValue(undefined),
    goToLocation: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders mini strip tab buttons with accessible names", () => {
    render(<PageSideRail service={mockService as any} />);

    const thumbBtn = screen.getByRole("button", { name: "Page Thumbnails" });
    const outlineBtn = screen.getByRole("button", { name: "Document Outline" });

    expect(thumbBtn).toBeInTheDocument();
    expect(thumbBtn).toHaveAttribute("aria-pressed", "true");
    expect(outlineBtn).toBeInTheDocument();
    expect(outlineBtn).toHaveAttribute("aria-pressed", "false");
  });

  it("switches to outline view when clicking Document Outline button", () => {
    render(<PageSideRail service={mockService as any} />);

    const outlineBtn = screen.getByRole("button", { name: "Document Outline" });
    fireEvent.click(outlineBtn);

    expect(outlineBtn).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("Chapter One")).toBeInTheDocument();
    expect(screen.getByText("Chapter Two")).toBeInTheDocument();
  });
});

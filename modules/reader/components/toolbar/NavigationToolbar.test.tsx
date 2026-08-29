import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { NavigationToolbar } from "./NavigationToolbar";

const mockBack = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    back: mockBack,
  }),
}));

let mockSideRailOpen = false;
const mockSetSideRailOpen = jest.fn((val: boolean) => {
  mockSideRailOpen = val;
});

jest.mock("@/modules/reader/state/reader-store", () => ({
  useReaderStore: (selector: (state: any) => any) => {
    return selector({
      sideRailOpen: mockSideRailOpen,
      setSideRailOpen: mockSetSideRailOpen,
      preferences: { theme: "light" },
    });
  },
}));

describe("NavigationToolbar presentation and interactions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSideRailOpen = false;
  });

  it("renders back and side rail toggle buttons with accessible names", () => {
    render(<NavigationToolbar />);

    const backBtn = screen.getByRole("button", { name: "Back to Library" });
    const sideRailBtn = screen.getByRole("button", { name: "Toggle Pages Side Rail" });

    expect(backBtn).toBeInTheDocument();
    expect(sideRailBtn).toBeInTheDocument();
    expect(sideRailBtn).toHaveAttribute("aria-expanded", "false");
  });

  it("navigates back when clicking Back to Library", () => {
    render(<NavigationToolbar />);

    const backBtn = screen.getByRole("button", { name: "Back to Library" });
    fireEvent.click(backBtn);

    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it("toggles side rail state when clicking Toggle Pages Side Rail", () => {
    render(<NavigationToolbar />);

    const sideRailBtn = screen.getByRole("button", { name: "Toggle Pages Side Rail" });
    fireEvent.click(sideRailBtn);

    expect(mockSetSideRailOpen).toHaveBeenCalledWith(true);
  });

  it("renders book title when provided", () => {
    render(<NavigationToolbar bookTitle="Grade 10 Physical Science" />);

    expect(screen.getByRole("heading", { name: "Grade 10 Physical Science" })).toBeInTheDocument();
  });
});

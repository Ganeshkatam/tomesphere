import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ProgressToolbar } from "./ProgressToolbar";

const mockUpdatePreference = jest.fn();

let mockStore = {
  sessionState: "reading",
  rendererReady: true,
  isReading: true,
  currentAnchor: { value: "5" },
  preferences: { theme: "light", zoom: 100 },
  updatePreference: mockUpdatePreference,
};

jest.mock("@/modules/reader/state/reader-store", () => ({
  useReaderStore: (selector?: (state: any) => any) => {
    return selector ? selector(mockStore) : mockStore;
  },
}));

describe("ProgressToolbar presentation and interactions", () => {
  const mockService = {
    previous: jest.fn(),
    next: jest.fn(),
    applyPreferences: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockStore = {
      sessionState: "reading",
      rendererReady: true,
      isReading: true,
      currentAnchor: { value: "5" },
      preferences: { theme: "light", zoom: 100 },
      updatePreference: mockUpdatePreference,
    };
  });

  it("renders page number, zoom level, and accessible buttons", () => {
    render(<ProgressToolbar service={mockService as any} />);

    expect(screen.getByText("Page 5")).toBeInTheDocument();
    expect(screen.getByText("100%")).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "Previous Page" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Next Page" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Zoom Out" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Zoom In" })).toBeInTheDocument();
  });

  it("invokes service.previous and service.next on page button clicks", () => {
    render(<ProgressToolbar service={mockService as any} />);

    fireEvent.click(screen.getByRole("button", { name: "Previous Page" }));
    expect(mockService.previous).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole("button", { name: "Next Page" }));
    expect(mockService.next).toHaveBeenCalledTimes(1);
  });

  it("adjusts zoom and applies preferences on zoom button clicks", () => {
    render(<ProgressToolbar service={mockService as any} />);

    fireEvent.click(screen.getByRole("button", { name: "Zoom Out" }));
    expect(mockUpdatePreference).toHaveBeenCalledWith("zoom", 90);
    expect(mockService.applyPreferences).toHaveBeenCalledWith({ theme: "light", zoom: 90 });

    fireEvent.click(screen.getByRole("button", { name: "Zoom In" }));
    expect(mockUpdatePreference).toHaveBeenCalledWith("zoom", 110);
    expect(mockService.applyPreferences).toHaveBeenCalledWith({ theme: "light", zoom: 110 });
  });

  it("opens zoom selection menu and applies selected zoom option", () => {
    render(<ProgressToolbar service={mockService as any} />);

    const selectZoomBtn = screen.getByRole("button", { name: "Select Zoom Level" });
    fireEvent.click(selectZoomBtn);

    expect(screen.getByRole("menu", { name: "Zoom Level Options" })).toBeInTheDocument();
    
    const zoom150Option = screen.getByRole("menuitem", { name: "150%" });
    fireEvent.click(zoom150Option);

    expect(mockUpdatePreference).toHaveBeenCalledWith("zoom", 150);
    expect(mockService.applyPreferences).toHaveBeenCalledWith({ theme: "light", zoom: 150 });
  });

  it("disables controls when renderer is not ready", () => {
    mockStore.rendererReady = false;
    render(<ProgressToolbar service={mockService as any} />);

    expect(screen.getByRole("button", { name: "Previous Page" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next Page" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Zoom Out" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Zoom In" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Select Zoom Level" })).toBeDisabled();
  });
});

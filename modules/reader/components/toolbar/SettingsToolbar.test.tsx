import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { SettingsToolbar } from "./SettingsToolbar";

const mockUpdatePreference = jest.fn();
const mockSetSidebarOpen = jest.fn();
const mockSetSidebarTab = jest.fn();
const mockSetAppTheme = jest.fn();

let mockStore = {
  preferences: { theme: "light", fontSize: 16, zoom: 100 },
  updatePreference: mockUpdatePreference,
  sidebarOpen: false,
  sidebarTab: "toc",
  setSidebarOpen: mockSetSidebarOpen,
  setSidebarTab: mockSetSidebarTab,
};

jest.mock("@/modules/reader/state/reader-store", () => ({
  useReaderStore: (selector?: (state: any) => any) => {
    return selector ? selector(mockStore) : mockStore;
  },
}));

jest.mock("@/shared/providers/theme-context", () => ({
  useTheme: () => ({
    theme: "system",
    setTheme: mockSetAppTheme,
  }),
}));

describe("SettingsToolbar presentation and Popover interaction", () => {
  const mockService = {
    applyPreferences: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockStore = {
      preferences: { theme: "light", fontSize: 16, zoom: 100 },
      updatePreference: mockUpdatePreference,
      sidebarOpen: false,
      sidebarTab: "toc",
      setSidebarOpen: mockSetSidebarOpen,
      setSidebarTab: mockSetSidebarTab,
    };
  });

  it("renders toolbar buttons with accessible names", () => {
    render(<SettingsToolbar service={mockService as any} />);

    expect(screen.getByRole("button", { name: "Search in Volume" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Table of Contents" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Fullscreen Mode" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reader Settings" })).toBeInTheDocument();
  });

  it("toggles search sidebar when clicking Search in Volume", () => {
    render(<SettingsToolbar service={mockService as any} />);

    fireEvent.click(screen.getByRole("button", { name: "Search in Volume" }));
    expect(mockSetSidebarTab).toHaveBeenCalledWith("search");
    expect(mockSetSidebarOpen).toHaveBeenCalledWith(true);
  });

  it("opens Reader Settings popover when clicking Settings button", () => {
    render(<SettingsToolbar service={mockService as any} />);

    const settingsTrigger = screen.getByRole("button", { name: "Reader Settings" });
    fireEvent.click(settingsTrigger);

    expect(screen.getByRole("heading", { name: "Reader Settings" })).toBeInTheDocument();
    expect(screen.getByText("Customize themes, typography, and display zoom.")).toBeInTheDocument();
  });

  it("switches reader theme when clicking theme buttons inside popover", () => {
    render(<SettingsToolbar service={mockService as any} />);

    fireEvent.click(screen.getByRole("button", { name: "Reader Settings" }));

    const sepiaBtn = screen.getByRole("button", { name: "Sepia" });
    fireEvent.click(sepiaBtn);

    expect(mockUpdatePreference).toHaveBeenCalledWith("theme", "sepia");
    expect(mockService.applyPreferences).toHaveBeenCalledWith({
      theme: "sepia",
      fontSize: 16,
      zoom: 100,
    });
  });

  it("adjusts font size and zoom steppers inside popover", () => {
    render(<SettingsToolbar service={mockService as any} />);

    fireEvent.click(screen.getByRole("button", { name: "Reader Settings" }));

    const increaseFontBtn = screen.getByRole("button", { name: "Increase Font Size" });
    fireEvent.click(increaseFontBtn);

    expect(mockUpdatePreference).toHaveBeenCalledWith("fontSize", 18);
    expect(mockService.applyPreferences).toHaveBeenCalledWith({
      theme: "light",
      fontSize: 18,
      zoom: 100,
    });

    const zoomInBtn = screen.getByRole("button", { name: "Zoom In" });
    fireEvent.click(zoomInBtn);

    expect(mockUpdatePreference).toHaveBeenCalledWith("zoom", 110);
    expect(mockService.applyPreferences).toHaveBeenCalledWith({
      theme: "light",
      fontSize: 16,
      zoom: 110,
    });
  });
});

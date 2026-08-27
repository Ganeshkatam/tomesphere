import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { SearchFacetSidebar } from "./SearchFacetSidebar";

const mockPush = jest.fn();
let mockSearchParams = new URLSearchParams();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useSearchParams: () => mockSearchParams,
}));

describe("SearchFacetSidebar presentation and interaction", () => {
  const mockFacets = [
    {
      key: "genres",
      label: "Genres",
      type: "category",
      values: [
        { value: "philosophy", label: "Philosophy", count: 12, selected: false },
        { value: "history", label: "History", count: 8, selected: true },
      ],
    },
    {
      key: "languages",
      label: "Languages",
      type: "language",
      values: [
        { value: "en", label: "English", count: 20, selected: false },
      ],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockSearchParams = new URLSearchParams();
  });

  it("renders filter toggle button with accessible label and collapsed state by default", () => {
    render(<SearchFacetSidebar facets={mockFacets} />);

    const toggleBtn = screen.getByRole("button", { name: /filter results/i });
    expect(toggleBtn).toBeInTheDocument();
    expect(toggleBtn).toHaveAttribute("aria-expanded", "false");
  });

  it("toggles filter expansion when clicking the filter toggle button", () => {
    render(<SearchFacetSidebar facets={mockFacets} />);

    const toggleBtn = screen.getByRole("button", { name: /filter results/i });
    fireEvent.click(toggleBtn);
    expect(toggleBtn).toHaveAttribute("aria-expanded", "true");

    fireEvent.click(toggleBtn);
    expect(toggleBtn).toHaveAttribute("aria-expanded", "false");
  });

  it("displays Clear Filters button and handles reset when active filters exist", () => {
    mockSearchParams = new URLSearchParams("q=marcus&facet.genres=history");
    render(<SearchFacetSidebar facets={mockFacets} />);

    const clearBtn = screen.getByRole("button", { name: /clear filters/i });
    expect(clearBtn).toBeInTheDocument();

    fireEvent.click(clearBtn);
    expect(mockPush).toHaveBeenCalledWith("/search?q=marcus");
  });

  it("invokes router.push with updated facet param when checking a facet option", () => {
    mockSearchParams = new URLSearchParams("q=marcus");
    render(<SearchFacetSidebar facets={mockFacets} />);

    const checkboxes = screen.getAllByRole("checkbox");
    const philosophyCheckbox = checkboxes[0];

    fireEvent.click(philosophyCheckbox);

    expect(mockPush).toHaveBeenCalledWith("/search?q=marcus&facet.genres=philosophy&page=1");
  });
});

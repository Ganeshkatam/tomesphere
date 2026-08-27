import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { DiscoverySearch } from "./DiscoverySearch";

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe("DiscoverySearch presentation controls and navigation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders scope buttons, accessible search input, and submit action", () => {
    render(<DiscoverySearch />);

    expect(screen.getByRole("button", { name: /all archives/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /books/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /authors/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /subjects/i })).toBeInTheDocument();

    const input = screen.getByRole("searchbox", { name: /search digital archives/i });
    expect(input).toBeInTheDocument();

    const submitBtn = screen.getByRole("button", { name: /^search$/i });
    expect(submitBtn).toBeInTheDocument();
  });

  it("toggles scope button selection and updates aria-pressed", () => {
    render(<DiscoverySearch />);

    const allBtn = screen.getByRole("button", { name: /all archives/i });
    const booksBtn = screen.getByRole("button", { name: /books/i });

    expect(allBtn).toHaveAttribute("aria-pressed", "true");
    expect(booksBtn).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(booksBtn);

    expect(allBtn).toHaveAttribute("aria-pressed", "false");
    expect(booksBtn).toHaveAttribute("aria-pressed", "true");
  });

  it("submits search with default all scope and navigates to /search?q=query", () => {
    render(<DiscoverySearch />);

    const input = screen.getByRole("searchbox", { name: /search digital archives/i });
    fireEvent.change(input, { target: { value: "Stoicism" } });

    const submitBtn = screen.getByRole("button", { name: /^search$/i });
    fireEvent.click(submitBtn);

    expect(mockPush).toHaveBeenCalledWith("/search?q=Stoicism");
  });

  it("submits search with specific scope and appends type query parameter", () => {
    render(<DiscoverySearch />);

    const authorsBtn = screen.getByRole("button", { name: /authors/i });
    fireEvent.click(authorsBtn);

    const input = screen.getByRole("searchbox", { name: /search digital archives/i });
    fireEvent.change(input, { target: { value: "Seneca" } });

    const submitBtn = screen.getByRole("button", { name: /^search$/i });
    fireEvent.click(submitBtn);

    expect(mockPush).toHaveBeenCalledWith("/search?q=Seneca&type=authors");
  });

  it("does not navigate when query is empty or only whitespace", () => {
    render(<DiscoverySearch />);

    const input = screen.getByRole("searchbox", { name: /search digital archives/i });
    fireEvent.change(input, { target: { value: "   " } });

    const submitBtn = screen.getByRole("button", { name: /^search$/i });
    fireEvent.click(submitBtn);

    expect(mockPush).not.toHaveBeenCalled();
  });
});

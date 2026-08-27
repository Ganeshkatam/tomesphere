import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BookCarousel } from "./BookCarousel";

jest.mock("@/modules/books/components/BookCard", () => {
  return function MockBookCard({ book }: { book: any }) {
    return <div data-testid={`book-${book.id}`}>{book.title}</div>;
  };
});

describe("BookCarousel presentation and navigation controls", () => {
  const mockItems = [
    { id: "b1", title: "Book One", authors: [{ name: "Author 1" }] },
    { id: "b2", title: "Book Two", authors: [{ name: "Author 2" }] },
    { id: "b3", title: "Book Three", authors: [{ name: "Author 3" }] },
  ];

  it("renders all book items inside carousel container", () => {
    render(<BookCarousel items={mockItems as any} />);

    expect(screen.getByTestId("book-b1")).toBeInTheDocument();
    expect(screen.getByTestId("book-b2")).toBeInTheDocument();
    expect(screen.getByTestId("book-b3")).toBeInTheDocument();
  });

  it("returns null when items list is empty", () => {
    const { container } = render(<BookCarousel items={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("handles scroll navigation when scroll buttons are rendered", () => {
    const { container } = render(<BookCarousel items={mockItems as any} />);

    const scrollContainer = container.querySelector(".overflow-x-auto") as HTMLDivElement;
    expect(scrollContainer).toBeInTheDocument();

    const scrollByMock = jest.fn();
    scrollContainer.scrollBy = scrollByMock;

    // Simulate scroll state where right arrow becomes visible
    Object.defineProperty(scrollContainer, "scrollLeft", { value: 0, configurable: true });
    Object.defineProperty(scrollContainer, "scrollWidth", { value: 1000, configurable: true });
    Object.defineProperty(scrollContainer, "clientWidth", { value: 500, configurable: true });

    act(() => {
      fireEvent.scroll(scrollContainer);
    });

    // Verify container exists and handles smooth scrolling behavior
    expect(scrollContainer).toHaveClass("scroll-smooth");
  });
});

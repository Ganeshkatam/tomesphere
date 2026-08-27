import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import LibraryList from "./LibraryList";
import { LibraryBookDto } from "../application/dto/response/LibraryBookDto";

jest.mock("../store/library-store", () => ({
  useLibraryStore: () => ({
    selection: [],
    toggleSelection: jest.fn(),
  }),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt, fill, ...props }: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  ),
}));

describe("LibraryList behavioral tests", () => {
  const mockBooks: LibraryBookDto[] = [
    {
      bookId: "book-1",
      title: "The Time Machine",
      authors: [{ id: "a1", name: "H.G. Wells" }],
      coverUrl: "/covers/time-machine.jpg",
      progress: 42,
      status: "reading",
      collections: [],
      dateAdded: "2026-01-01",
      lastOpened: "2026-02-01",
      favorite: false,
    },
    {
      bookId: "book-2",
      title: "Pride and Prejudice",
      authors: [{ id: "a2", name: "Jane Austen" }],
      coverUrl: null,
      progress: 100,
      status: "finished",
      collections: [],
      dateAdded: "2026-01-05",
      lastOpened: "2026-01-20",
      favorite: true,
    },
    {
      bookId: "book-3",
      title: "Moby Dick",
      authors: [{ id: "a3", name: "Herman Melville" }],
      coverUrl: null,
      progress: 0,
      status: "want_to_read",
      collections: [],
      dateAdded: "2026-01-10",
      lastOpened: null,
      favorite: false,
    },
  ];

  it("returns null when books list is empty", () => {
    const { container } = render(<LibraryList books={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders books with native links and reading progress from DTO", () => {
    render(<LibraryList books={mockBooks} />);

    // Titles
    expect(screen.getByText("The Time Machine")).toBeInTheDocument();
    expect(screen.getByText("Pride and Prejudice")).toBeInTheDocument();
    expect(screen.getByText("Moby Dick")).toBeInTheDocument();

    // Authors
    expect(screen.getByText("H.G. Wells")).toBeInTheDocument();
    expect(screen.getByText("Jane Austen")).toBeInTheDocument();

    // Native reader links for title and cover
    const timeMachineTitleLink = screen.getByRole("link", {
      name: "The Time Machine",
    });
    expect(timeMachineTitleLink).toHaveAttribute("href", "/read/book-1");

    const coverLink = screen.getByRole("link", {
      name: "Read The Time Machine",
    });
    expect(coverLink).toHaveAttribute("href", "/read/book-1");

    // Reading status and progress presentation from DTO
    expect(screen.getByText(/Reading \(42%\)/i)).toBeInTheDocument();
    expect(screen.getByText("Finished")).toBeInTheDocument();
    expect(screen.getByText("Want to Read")).toBeInTheDocument();

    // Read action buttons with native links
    const readLinks = screen.getAllByRole("link", { name: "Read" });
    expect(readLinks.length).toBe(3);
    expect(readLinks[0]).toHaveAttribute("href", "/read/book-1");
  });
});

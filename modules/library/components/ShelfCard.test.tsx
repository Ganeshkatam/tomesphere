import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ShelfCard from "./ShelfCard";
import { ShelfSummaryDto } from "../application/dto/response/ShelvesPageDto";

const pushMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt, fill, ...props }: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  ),
}));

describe("ShelfCard", () => {
  const mockShelf: ShelfSummaryDto = {
    id: "shelf-123",
    name: "Science Fiction Favorites",
    description: "Best sci-fi books in my collection",
    coverImage: null,
    isPublic: true,
    bookCount: 3,
    previewBooks: [
      { bookId: "b1", title: "Dune", coverUrl: "/dune.jpg" },
      { bookId: "b2", title: "Neuromancer", coverUrl: null },
    ],
  };

  const onEditMock = jest.fn();
  const onDeleteMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders shelf details correctly", () => {
    render(
      <ShelfCard
        shelf={mockShelf}
        onEdit={onEditMock}
        onDelete={onDeleteMock}
      />
    );

    expect(screen.getByText("Science Fiction Favorites")).toBeDefined();
    expect(screen.getByText("Best sci-fi books in my collection")).toBeDefined();
    expect(screen.getByText("3 books")).toBeDefined();
    expect(screen.getByTitle("Public")).toBeDefined();
  });

  it("navigates to shelf detail page when title is clicked", () => {
    render(
      <ShelfCard
        shelf={mockShelf}
        onEdit={onEditMock}
        onDelete={onDeleteMock}
      />
    );

    const titleElement = screen.getByText("Science Fiction Favorites");
    fireEvent.click(titleElement);
    expect(pushMock).toHaveBeenCalledWith("/me/shelves/shelf-123");
  });

  it("renders the actions dropdown trigger with accessible label", () => {
    render(
      <ShelfCard
        shelf={mockShelf}
        onEdit={onEditMock}
        onDelete={onDeleteMock}
      />
    );

    const triggerButton = screen.getByRole("button", {
      name: `Actions for ${mockShelf.name}`,
    });
    expect(triggerButton).toBeDefined();
  });

  it("renders private icon when isPublic is false", () => {
    const privateShelf: ShelfSummaryDto = {
      ...mockShelf,
      isPublic: false,
    };

    render(
      <ShelfCard
        shelf={privateShelf}
        onEdit={onEditMock}
        onDelete={onDeleteMock}
      />
    );

    expect(screen.getByTitle("Private")).toBeDefined();
  });
});

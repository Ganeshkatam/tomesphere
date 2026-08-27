import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ShelvesClient from "./ShelvesClient";
import { ShelvesPageDto } from "../application/dto/response/ShelvesPageDto";

const pushMock = jest.fn();
const refreshMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
    refresh: refreshMock,
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

// Mock toast notifications
jest.mock("@/lib/toast", () => ({
  showSuccess: jest.fn(),
  showError: jest.fn(),
}));

// Mock actions
jest.mock("@/app/(workspace)/me/shelves/actions", () => ({
  createShelfAction: jest.fn().mockResolvedValue({ id: "new-shelf", name: "New Shelf", isPublic: false }),
  updateShelfAction: jest.fn().mockResolvedValue(undefined),
  deleteShelfAction: jest.fn().mockResolvedValue(undefined),
}));

// Mock ShelfCard to isolate ShelvesClient unit testing
jest.mock("./ShelfCard", () => ({
  __esModule: true,
  default: ({ shelf, onEdit, onDelete }: any) => (
    <div data-testid={`shelf-card-${shelf.id}`}>
      <span>{shelf.name}</span>
      <button onClick={() => onEdit(shelf)}>Mock Edit {shelf.name}</button>
      <button onClick={() => onDelete(shelf)}>Mock Delete {shelf.name}</button>
    </div>
  ),
}));

describe("ShelvesClient", () => {
  const initialData: ShelvesPageDto = {
    shelves: [
      {
        id: "shelf-1",
        name: "Fantasy Epics",
        description: "High fantasy and epic tales",
        coverImage: null,
        isPublic: true,
        bookCount: 5,
        previewBooks: [],
      },
      {
        id: "shelf-2",
        name: "Non-Fiction History",
        description: "World history and biographies",
        coverImage: null,
        isPublic: false,
        bookCount: 2,
        previewBooks: [],
      },
    ],
    totalShelves: 2,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the shelves page header and shelf cards", () => {
    render(<ShelvesClient initialData={initialData} />);

    expect(screen.getByText("My Shelves")).toBeDefined();
    expect(screen.getByPlaceholderText("Search shelves...")).toBeDefined();
    expect(screen.getByRole("button", { name: "New Shelf" })).toBeDefined();
    expect(screen.getByRole("button", { name: "Filter and sort shelves" })).toBeDefined();
    expect(screen.getByText("Fantasy Epics")).toBeDefined();
    expect(screen.getByText("Non-Fiction History")).toBeDefined();
  });

  it("filters shelves by text search", () => {
    render(<ShelvesClient initialData={initialData} />);

    const searchInput = screen.getByPlaceholderText("Search shelves...");
    fireEvent.change(searchInput, { target: { value: "Fantasy" } });

    expect(screen.getByText("Fantasy Epics")).toBeDefined();
    expect(screen.queryByText("Non-Fiction History")).toBeNull();
  });

  it("shows empty search message when no shelves match query", () => {
    render(<ShelvesClient initialData={initialData} />);

    const searchInput = screen.getByPlaceholderText("Search shelves...");
    fireEvent.change(searchInput, { target: { value: "NonExistentShelfName123" } });

    expect(screen.getByText("No shelves match your filter criteria.")).toBeDefined();
    expect(screen.getByRole("button", { name: /Reset filters/i })).toBeDefined();
  });

  it("renders empty state when initial data has no shelves", () => {
    const emptyData: ShelvesPageDto = { shelves: [], totalShelves: 0 };
    render(<ShelvesClient initialData={emptyData} />);

    expect(screen.getByText("No shelves yet")).toBeDefined();
    expect(screen.getByRole("button", { name: /Create your first shelf/i })).toBeDefined();
  });

  it("opens create shelf dialog when New Shelf is clicked", async () => {
    render(<ShelvesClient initialData={initialData} />);

    const newShelfButton = screen.getByRole("button", { name: "New Shelf" });
    fireEvent.click(newShelfButton);

    expect(screen.getByRole("heading", { name: "Create New Shelf" })).toBeDefined();
    expect(screen.getByLabelText(/^Name/i)).toBeDefined();
    expect(screen.getByLabelText(/Description/i)).toBeDefined();
  });

  it("opens delete confirmation dialog when delete is triggered and confirms deletion", async () => {
    render(<ShelvesClient initialData={initialData} />);

    // Trigger delete from shelf card
    const deleteButton = screen.getByRole("button", {
      name: "Mock Delete Fantasy Epics",
    });
    fireEvent.click(deleteButton);

    // Verify Delete Shelf confirmation dialog is rendered
    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "Delete Shelf" })).toBeDefined();
      expect(
        screen.getByText(/Are you sure you want to delete/i)
      ).toBeDefined();
    });

    // Confirm deletion
    const confirmDeleteBtn = screen.getByRole("button", { name: "Delete Shelf" });
    fireEvent.click(confirmDeleteBtn);

    await waitFor(() => {
      expect(screen.queryByText("Fantasy Epics")).toBeNull();
    });
  });
});

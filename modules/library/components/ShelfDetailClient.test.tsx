import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ShelfDetailClient from "./ShelfDetailClient";
import { CollectionDto } from "../application/dto/response/CollectionDto";
import { LibraryBookDto } from "../application/dto/response/LibraryBookDto";
import {
  deleteShelfAction,
  updateShelfAction,
  removeBookFromShelfAction,
} from "@/app/(workspace)/me/shelves/actions";

const pushMock = jest.fn();
const refreshMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
    refresh: refreshMock,
  }),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt, fill, ...props }: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  ),
}));

jest.mock("@/app/(workspace)/me/shelves/actions", () => ({
  deleteShelfAction: jest.fn().mockResolvedValue({ success: true }),
  updateShelfAction: jest.fn().mockResolvedValue({ success: true }),
  removeBookFromShelfAction: jest.fn().mockResolvedValue({ success: true }),
}));

jest.mock("@/shared/hooks/usePhotoUploadPermission", () => ({
  usePhotoUploadPermission: () => ({
    pendingFile: null,
    hasPermission: true,
    requestPhotoUpload: jest.fn(),
    handleAllow: jest.fn(),
    handleDeny: jest.fn(),
  }),
}));

jest.mock("@/lib/toast", () => ({
  showSuccess: jest.fn(),
  showError: jest.fn(),
}));

jest.mock("@/modules/books/components/BookCard", () => {
  return function MockBookCard({ book }: any) {
    return <div data-testid={`book-${book.id}`}>{book.title}</div>;
  };
});

describe("ShelfDetailClient behavioral tests", () => {
  const mockShelf: CollectionDto = {
    id: "shelf-100",
    name: "Philosophy Classics",
    description: "Foundational philosophy texts",
    coverImage: undefined,
    isPublic: true,
    itemCount: 1,
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01",
  };

  const mockBooks: LibraryBookDto[] = [
    {
      bookId: "b-meditations",
      title: "Meditations",
      authors: [{ id: "a1", name: "Marcus Aurelius" }],
      coverUrl: null,
      progress: 50,
      status: "reading",
      collections: ["shelf-100"],
      dateAdded: "2026-01-01",
      lastOpened: "2026-01-10",
      favorite: true,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deletes shelf via rendered Dialog and never calls window.confirm", async () => {
    const confirmSpy = jest.spyOn(window, "confirm").mockImplementation(() => {
      throw new Error("window.confirm should never be called");
    });

    render(<ShelfDetailClient shelf={mockShelf} initialBooks={mockBooks} />);

    // Click Delete button in header
    const deleteBtn = screen.getByRole("button", { name: "Delete Shelf" });
    fireEvent.click(deleteBtn);

    // Assert window.confirm was NOT called
    expect(confirmSpy).not.toHaveBeenCalled();

    // Assert Dialog is rendered
    expect(
      screen.getByRole("heading", { name: "Delete Shelf" })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Are you sure you want to delete "Philosophy Classics"?/i)
    ).toBeInTheDocument();

    // Confirm deletion inside dialog
    const confirmDialogDeleteBtn = screen.getByRole("button", {
      name: "Delete Shelf",
    });
    fireEvent.click(confirmDialogDeleteBtn);

    await waitFor(() => {
      expect(deleteShelfAction).toHaveBeenCalledWith("shelf-100");
      expect(pushMock).toHaveBeenCalledWith("/me/shelves");
    });

    confirmSpy.mockRestore();
  });

  it("opens edit dialog and updates shelf details", async () => {
    render(<ShelfDetailClient shelf={mockShelf} initialBooks={mockBooks} />);

    const editBtn = screen.getByRole("button", { name: "Edit Shelf" });
    fireEvent.click(editBtn);

    // Edit Dialog is open
    expect(
      screen.getByRole("heading", { name: "Edit Shelf" })
    ).toBeInTheDocument();

    const nameInput = screen.getByLabelText("Name");
    fireEvent.change(nameInput, {
      target: { value: "Ancient Philosophy Classics" },
    });

    const saveBtn = screen.getByRole("button", { name: "Save Changes" });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(updateShelfAction).toHaveBeenCalledWith("shelf-100", {
        name: "Ancient Philosophy Classics",
        description: "Foundational philosophy texts",
        coverImage: null,
        isPublic: true,
      });
    });
  });

  it("removes book from shelf via action button", async () => {
    render(<ShelfDetailClient shelf={mockShelf} initialBooks={mockBooks} />);

    const removeBtn = screen.getByRole("button", {
      name: "Remove Meditations from shelf",
    });
    fireEvent.click(removeBtn);

    await waitFor(() => {
      expect(removeBookFromShelfAction).toHaveBeenCalledWith(
        "shelf-100",
        "b-meditations"
      );
    });
  });
});

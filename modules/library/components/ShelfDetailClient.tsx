"use client";

import React, { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CollectionDto } from "../application/dto/response/CollectionDto";
import { LibraryBookDto } from "../application/dto/response/LibraryBookDto";
import BookCard from "@/modules/books/components/BookCard";
import { 
  ArrowLeft, 
  Library, 
  Search, 
  Edit2, 
  Trash2, 
  Globe, 
  Lock, 
  Compass, 
  BookMarked, 
  Loader2,
  Upload,
  X
} from "lucide-react";
import { updateShelfAction, deleteShelfAction, removeBookFromShelfAction } from "@/app/(workspace)/me/shelves/actions";
import { uploadFileToStorage } from "@/modules/storage/presentation/actions/storage";
import { showSuccess, showError } from "@/lib/toast";
import { PhotoUploadConsentModal } from "@/shared/ui/PhotoUploadConsentModal";
import { usePhotoUploadPermission } from "@/shared/hooks/usePhotoUploadPermission";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const PRESET_COVERS = [
  { label: "Sanctuary", url: "/hero_sanctuary_bg.jpg" },
  { label: "Archival", url: "/hero_library_bg.jpg" },
  { label: "Vintage", url: "/default_book_cover.jpg" },
  { label: "Study", url: "/library_bg.png" },
  { label: "Midnight", url: "/about_cta_banner.jpg" },
];

interface ShelfDetailClientProps {
  shelf: CollectionDto;
  initialBooks: LibraryBookDto[];
}

export default function ShelfDetailClient({ shelf: initialShelf, initialBooks }: ShelfDetailClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [shelf, setShelf] = useState<CollectionDto>(initialShelf);
  const [books, setBooks] = useState<LibraryBookDto[]>(initialBooks);
  const [searchQuery, setSearchQuery] = useState("");

  // Delete Dialog State
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [name, setName] = useState(shelf.name);
  const [description, setDescription] = useState(shelf.description || "");
  const [coverImage, setCoverImage] = useState(shelf.coverImage || "");
  const [isPublic, setIsPublic] = useState(shelf.isPublic);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const {
    pendingFile: pendingCoverFile,
    requestPhotoUpload,
    handleAllow: handleConfirmCoverUpload,
    handleDeny: handleCancelCoverUpload,
  } = usePhotoUploadPermission();

  const performCoverUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await uploadFileToStorage("user-images", formData);
      if (res.success) {
        setCoverImage(res.data.url);
        showSuccess("Cover image uploaded");
      } else {
        showError(res.error.message || "Failed to upload image");
      }
    } catch (err: any) {
      showError(err.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showError("Image must be smaller than 5MB");
      return;
    }

    requestPhotoUpload(file, performCoverUpload);
  };

  const filteredBooks = books.filter((b) =>
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (b.authors || []).some((a) => (typeof a === "string" ? a : a.name).toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSaving(true);
    try {
      await updateShelfAction(shelf.id, {
        name: name.trim(),
        description: description.trim() || undefined,
        isPublic,
        coverImage: coverImage.trim() || null,
      });
      setShelf((prev) => ({
        ...prev,
        name: name.trim(),
        description: description.trim() || undefined,
        coverImage: coverImage.trim() || undefined,
        isPublic,
      }));
      showSuccess("Shelf updated");
      setIsEditModalOpen(false);
      startTransition(() => {
        router.refresh();
      });
    } catch (err: any) {
      showError(err.message || "Failed to update shelf");
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteShelfAction(shelf.id);
      showSuccess("Shelf deleted");
      setIsDeleteDialogOpen(false);
      router.push("/me/shelves");
    } catch (err: any) {
      showError(err.message || "Failed to delete shelf");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRemoveBook = async (bookId: string, bookTitle: string) => {
    try {
      // Optimistic removal
      setBooks((prev) => prev.filter((b) => b.bookId !== bookId));
      setShelf((prev) => ({ ...prev, itemCount: Math.max(0, prev.itemCount - 1) }));
      await removeBookFromShelfAction(shelf.id, bookId);
      showSuccess(`Removed "${bookTitle}" from shelf`);
    } catch (err: any) {
      showError(err.message || "Failed to remove book");
      startTransition(() => {
        router.refresh();
      });
    }
  };

  return (
    <div className="min-h-screen relative w-full flex flex-col pb-16">
      <div className="p-6 md:p-8 max-w-7xl mx-auto w-full flex-1">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Button asChild variant="ghost" className="gap-2 text-sm font-semibold p-0 hover:bg-transparent h-auto">
            <Link
              href="/me/shelves"
              className="text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors inline-flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              <span>Back to My Shelves</span>
            </Link>
          </Button>
        </div>

        {/* Shelf Header Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 md:p-10 mb-8 shadow-xl shadow-slate-950/20">
          {shelf.coverImage ? (
            <Image
              src={shelf.coverImage}
              alt={shelf.name}
              fill
              className="object-cover opacity-30 scale-105"
              priority
              sizes="100vw"
            />
          ) : (
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/70 to-slate-900/80 pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
            
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
                  <Library size={20} />
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-white/10 text-indigo-200 border border-white/10">
                    {shelf.isPublic ? <Globe size={12} /> : <Lock size={12} />}
                    <span>{shelf.isPublic ? "Public Shelf" : "Private Shelf"}</span>
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-600/30 text-indigo-200 border border-indigo-500/30">
                    {books.length} {books.length === 1 ? "volume" : "volumes"}
                  </span>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight text-white">
                {shelf.name}
              </h1>

              {shelf.description && (
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  {shelf.description}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5 self-start shrink-0">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => {
                  setName(shelf.name);
                  setDescription(shelf.description || "");
                  setCoverImage(shelf.coverImage || "");
                  setIsPublic(shelf.isPublic);
                  setIsEditModalOpen(true);
                }}
                className="gap-2 rounded-xl text-xs font-bold"
              >
                <Edit2 size={14} />
                <span>Edit Shelf</span>
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => setIsDeleteDialogOpen(true)}
                className="gap-2 rounded-xl text-xs font-bold"
                aria-label="Delete Shelf"
              >
                <Trash2 size={14} />
                <span className="hidden sm:inline">Delete</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Search & Filter Toolbar inside Shelf */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              placeholder="Search books in this shelf..."
              aria-label="Search books in this shelf"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          <Button asChild size="sm" className="gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-sm shrink-0 self-end sm:self-auto">
            <Link href="/discover">
              <Compass size={14} />
              <span>Discover More Books</span>
            </Link>
          </Button>
        </div>

        {/* Books Content */}
        {books.length === 0 ? (
          /* Empty Shelf State */
          <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-slate-50/50 dark:bg-slate-900/20 p-8">
            <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mb-4">
              <BookMarked className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              This shelf is currently empty
            </h3>
            <p className="text-slate-500 max-w-md text-sm mb-6">
              You haven&apos;t added any volumes to &quot;{shelf.name}&quot; yet. Add books from your library or explore our public domain catalog.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button asChild variant="secondary" className="rounded-xl text-xs font-bold">
                <Link href="/me/library">Go to My Library</Link>
              </Button>
              <Button asChild className="rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm">
                <Link href="/discover">Explore Discover Hub</Link>
              </Button>
            </div>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="py-20 text-center text-slate-500 text-sm">
            No books in this shelf match your search for &quot;{searchQuery}&quot;.
          </div>
        ) : (
          /* Shelf Books Grid */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 sm:gap-8">
            {filteredBooks.map((item, idx) => (
              <div key={item.bookId} className="relative group flex flex-col h-full">
                <BookCard
                  priority={idx < 6}
                  book={{
                    id: item.bookId,
                    title: item.title,
                    authors: item.authors || [],
                    coverUrl: item.coverUrl,
                    progress: item.progress,
                    currentPage: item.currentPage,
                    totalPages: item.totalPages,
                    status: item.status,
                  }}
                />
                
                {/* Remove Book Button on Card Hover */}
                <div className="mt-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveBook(item.bookId, item.title)}
                    aria-label={`Remove ${item.title} from shelf`}
                    className="text-[11px] font-semibold text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 gap-1 h-auto p-1 cursor-pointer"
                  >
                    <X size={12} />
                    <span>Remove from shelf</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Shelf Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Shelf</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{shelf.name}&quot;? Books will remain in your library.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Shelf"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Shelf Dialog */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Shelf</DialogTitle>
            <DialogDescription>
              Update the name, description, and cover artwork for this shelf.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleEditSave} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold mb-1.5 text-slate-700 dark:text-slate-300">Name</label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="e.g. Science Fiction"
                className="w-full"
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-semibold mb-1.5 text-slate-700 dark:text-slate-300">Description (optional)</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What kind of books belong here?"
                rows={2}
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5 text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Cover Artwork</span>
                {coverImage && (
                  <button
                    type="button"
                    onClick={() => setCoverImage("")}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer font-medium"
                  >
                    Reset to default
                  </button>
                )}
              </label>
              
              {/* Preset Swatches */}
              <p className="text-xs text-slate-500 mb-2">Select a theme or upload your own image</p>
              <div className="grid grid-cols-5 gap-2 mb-3">
                {PRESET_COVERS.map((preset) => {
                  const isSelected = coverImage === preset.url;
                  return (
                    <button
                      key={preset.url}
                      type="button"
                      onClick={() => setCoverImage(preset.url)}
                      className={`relative aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        isSelected ? "border-indigo-600 ring-2 ring-indigo-500/30 scale-105" : "border-slate-200 dark:border-slate-700 opacity-70 hover:opacity-100"
                      }`}
                      title={preset.label}
                    >
                      <Image src={preset.url} alt={preset.label} fill className="object-cover" sizes="80px" />
                    </button>
                  );
                })}
              </div>

              {/* Upload Image Button */}
              <label className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 text-xs font-semibold cursor-pointer transition-colors">
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                    <span>Uploading image...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>{coverImage && !PRESET_COVERS.some(p => p.url === coverImage) ? "Change Custom Image" : "Upload Custom Image"}</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>

              {/* Active Custom Preview if uploaded */}
              {coverImage && !PRESET_COVERS.some(p => p.url === coverImage) && (
                <div className="mt-2.5 relative h-16 rounded-xl overflow-hidden border border-indigo-500/40">
                  <Image src={coverImage} alt="Selected Cover" fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/35 flex items-center justify-between px-3">
                    <span className="text-[11px] font-semibold text-white">Custom Upload Active</span>
                    <button
                      type="button"
                      onClick={() => setCoverImage("")}
                      className="text-[11px] bg-rose-600 hover:bg-rose-700 text-white px-2 py-0.5 rounded-md font-medium cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 p-4 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/50">
              <input
                id="isPublic"
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
              <div>
                <label htmlFor="isPublic" className="font-semibold text-sm cursor-pointer block">Make Public</label>
                <p className="text-xs text-slate-500 leading-tight">Allow other users to see and follow this shelf</p>
              </div>
            </div>

            <DialogFooter className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!name.trim() || isSaving}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <PhotoUploadConsentModal
        isOpen={!!pendingCoverFile}
        file={pendingCoverFile}
        onConfirm={handleConfirmCoverUpload}
        onCancel={handleCancelCoverUpload}
        isUploading={isUploading}
        title="Shelf Cover Photo Permission"
      />
    </div>
  );
}

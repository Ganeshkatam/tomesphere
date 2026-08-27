"use client";

import React, { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShelvesPageDto, ShelfSummaryDto } from "../application/dto/response/ShelvesPageDto";
import {
  Plus,
  Library,
  Search,
  Loader2,
  Upload,
  Filter,
  RotateCcw,
  AlertTriangle,
  Trash2,
} from "lucide-react";
import ShelfCard from "./ShelfCard";
import { createShelfAction, updateShelfAction, deleteShelfAction } from "@/app/(workspace)/me/shelves/actions";
import { uploadFileToStorage } from "@/modules/storage/presentation/actions/storage";
import { showSuccess, showError } from "@/lib/toast";
import { PhotoUploadConsentModal } from "@/shared/ui/PhotoUploadConsentModal";
import { usePhotoUploadPermission } from "@/shared/hooks/usePhotoUploadPermission";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";

const PRESET_COVERS = [
  { label: "Sanctuary", url: "/hero_sanctuary_bg.jpg" },
  { label: "Archival", url: "/hero_library_bg.jpg" },
  { label: "Vintage", url: "/default_book_cover.jpg" },
  { label: "Study", url: "/library_bg.png" },
  { label: "Midnight", url: "/about_cta_banner.jpg" },
];

interface ShelvesClientProps {
  initialData: ShelvesPageDto;
}

export default function ShelvesClient({ initialData }: ShelvesClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [data, setData] = useState<ShelvesPageDto>(initialData);
  const [searchQuery, setSearchQuery] = useState("");
  const [visibilityFilter, setVisibilityFilter] = useState<"all" | "public" | "private">("all");
  const [sortBy, setSortBy] = useState<"name-asc" | "name-desc" | "books-desc" | "books-asc">("name-asc");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShelf, setEditingShelf] = useState<ShelfSummaryDto | null>(null);
  const [deletingShelf, setDeletingShelf] = useState<ShelfSummaryDto | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const {
    pendingFile: pendingCoverFile,
    requestPhotoUpload,
    handleAllow: handleConfirmCoverUpload,
    handleDeny: handleCancelCoverUpload,
  } = usePhotoUploadPermission();

  // Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState<string>("");
  const [isPublic, setIsPublic] = useState(false);

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

  const hasActiveFilter = searchQuery.trim() !== "" || visibilityFilter !== "all" || sortBy !== "name-asc";

  const filteredShelves = data.shelves
    .filter((s) => {
      // 1. Text Search Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = s.name.toLowerCase().includes(q);
        const matchesDesc = (s.description?.toLowerCase() || "").includes(q);
        if (!matchesName && !matchesDesc) return false;
      }

      // 2. Visibility Filter
      if (visibilityFilter === "public" && !s.isPublic) return false;
      if (visibilityFilter === "private" && s.isPublic) return false;

      return true;
    })
    .sort((a, b) => {
      if (sortBy === "name-asc") return a.name.localeCompare(b.name);
      if (sortBy === "name-desc") return b.name.localeCompare(a.name);
      if (sortBy === "books-desc") return b.bookCount - a.bookCount;
      if (sortBy === "books-asc") return a.bookCount - b.bookCount;
      return 0;
    });

  const clearAllFilters = () => {
    setSearchQuery("");
    setVisibilityFilter("all");
    setSortBy("name-asc");
  };

  const openCreateModal = () => {
    setEditingShelf(null);
    setName("");
    setDescription("");
    setCoverImage("");
    setIsPublic(false);
    setIsModalOpen(true);
  };

  const openEditModal = (shelf: ShelfSummaryDto) => {
    setEditingShelf(shelf);
    setName(shelf.name);
    setDescription(shelf.description || "");
    setCoverImage(shelf.coverImage || "");
    setIsPublic(shelf.isPublic);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSaving(true);
    try {
      if (editingShelf) {
        await updateShelfAction(editingShelf.id, {
          name: name.trim(),
          description: description.trim() || undefined,
          isPublic,
          coverImage: coverImage.trim() || null,
        });
        setData((prev) => ({
          ...prev,
          shelves: prev.shelves.map((s) =>
            s.id === editingShelf.id
              ? {
                  ...s,
                  name: name.trim(),
                  description: description.trim() || null,
                  coverImage: coverImage.trim() || null,
                  isPublic,
                }
              : s,
          ),
        }));
        showSuccess("Shelf updated");
      } else {
        const created = await createShelfAction({
          name: name.trim(),
          description: description.trim() || undefined,
          isPublic,
          coverImage: coverImage.trim() || null,
        });
        if (created) {
          setData((prev) => ({
            ...prev,
            shelves: [
              {
                id: created.id,
                name: created.name,
                description: created.description || null,
                coverImage: created.coverImage || null,
                isPublic: created.isPublic,
                bookCount: 0,
                previewBooks: [],
              },
              ...prev.shelves.filter((s) => s.id !== created.id),
            ],
          }));
        }
        showSuccess("Shelf created");
      }
      
      closeModal();
      startTransition(() => {
        router.refresh();
      });
    } catch (error: any) {
      console.error("Failed to save shelf", error);
      showError(error.message || "Failed to save shelf. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (shelf: ShelfSummaryDto) => {
    setDeletingShelf(shelf);
  };

  const confirmDelete = async () => {
    if (!deletingShelf) return;
    const shelfToDelete = deletingShelf;
    setIsDeleting(true);

    try {
      // Optimistically remove from state instantly
      setData((prev) => ({
        ...prev,
        shelves: prev.shelves.filter((s) => s.id !== shelfToDelete.id),
      }));
      await deleteShelfAction(shelfToDelete.id);
      showSuccess("Shelf deleted");
      setDeletingShelf(null);
      startTransition(() => {
        router.refresh();
      });
    } catch (error: any) {
      console.error("Failed to delete shelf", error);
      showError("Failed to delete shelf.");
      startTransition(() => {
        router.refresh();
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen relative w-full flex flex-col bg-[var(--surface-canvas)]">
      <div className="p-6 md:p-8 max-w-7xl mx-auto w-full flex-1">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
              <Library className="w-8 h-8 text-primary" />
              My Shelves
            </h1>
            <p className="text-slate-500 mt-2">
              Organize your reading into curated collections.
            </p>
          </div>
          
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                type="text"
                placeholder="Search shelves..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4"
                aria-label="Search shelves"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant={hasActiveFilter ? "default" : "outline"}
                  size="sm"
                  className="h-10 px-3.5 gap-2 text-xs font-semibold shrink-0 cursor-pointer"
                  aria-label="Filter and sort shelves"
                >
                  <Filter className="w-4 h-4" />
                  <span className="hidden sm:inline">Filter & Sort</span>
                  {hasActiveFilter && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Visibility</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={visibilityFilter}
                  onValueChange={(val) => setVisibilityFilter(val as any)}
                >
                  <DropdownMenuRadioItem value="all">All shelves</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="public">Public only</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="private">Private only</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>

                <DropdownMenuSeparator />
                <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={sortBy}
                  onValueChange={(val) => setSortBy(val as any)}
                >
                  <DropdownMenuRadioItem value="name-asc">Name (A-Z)</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="name-desc">Name (Z-A)</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="books-desc">Most books</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="books-asc">Fewest books</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>

                {hasActiveFilter && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={clearAllFilters}
                      className="text-xs text-muted-foreground focus:text-destructive focus:bg-destructive/10 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5 mr-2" />
                      Reset filters
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              onClick={openCreateModal}
              className="gap-2 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Shelf</span>
            </Button>
          </div>
        </div>

        {isPending && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}

        {/* Empty State */}
        {data.shelves.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-border rounded-2xl bg-muted/20">
            <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
              <Library className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold mb-2">No shelves yet</h3>
            <p className="text-muted-foreground max-w-sm mb-8">
              Create a shelf to start organizing your books by topic, genre, or reading goal.
            </p>
            <Button
              onClick={openCreateModal}
              size="lg"
              className="gap-2 font-bold shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Create your first shelf
            </Button>
          </div>
        ) : filteredShelves.length === 0 ? (
          <div className="py-24 text-center text-muted-foreground">
            <p className="mb-3">No shelves match your filter criteria.</p>
            <Button variant="outline" size="sm" onClick={clearAllFilters} className="gap-2">
              <RotateCcw className="w-3.5 h-3.5" />
              Reset filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredShelves.map((shelf) => (
              <ShelfCard 
                key={shelf.id} 
                shelf={shelf} 
                onEdit={openEditModal}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleSave}>
            <DialogHeader>
              <DialogTitle>
                {editingShelf ? "Edit Shelf" : "Create New Shelf"}
              </DialogTitle>
              <DialogDescription>
                {editingShelf
                  ? "Update the details and cover artwork for this shelf."
                  : "Organize your reading into curated collections."}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold mb-1.5 text-foreground">
                  Name
                </label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g. Science Fiction"
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-semibold mb-1.5 text-foreground">
                  Description (optional)
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What kind of books belong here?"
                  rows={2}
                  className="w-full px-3 py-2 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring resize-none text-sm text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1.5 text-foreground flex items-center justify-between">
                  <span>Cover Artwork</span>
                  {coverImage && (
                    <button
                      type="button"
                      onClick={() => setCoverImage("")}
                      className="text-xs text-primary hover:underline cursor-pointer font-medium"
                    >
                      Reset to default
                    </button>
                  )}
                </label>
                
                {/* Preset Swatches */}
                <p className="text-xs text-muted-foreground mb-2">Select a theme or upload your own image</p>
                <div className="grid grid-cols-5 gap-2 mb-3">
                  {PRESET_COVERS.map((preset) => {
                    const isSelected = coverImage === preset.url;
                    return (
                      <button
                        key={preset.url}
                        type="button"
                        onClick={() => setCoverImage(preset.url)}
                        className={`relative aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                          isSelected
                            ? "border-primary ring-2 ring-primary/30 scale-105"
                            : "border-border opacity-70 hover:opacity-100"
                        }`}
                        title={preset.label}
                      >
                        <Image src={preset.url} alt={preset.label} fill className="object-cover" sizes="80px" />
                      </button>
                    );
                  })}
                </div>

                {/* Upload Image Button */}
                <label className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl border border-dashed border-input hover:border-primary bg-muted/40 text-foreground text-xs font-semibold cursor-pointer transition-colors">
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      <span>Uploading image...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 text-primary" />
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
                  <div className="mt-2.5 relative h-16 rounded-xl overflow-hidden border border-primary/40">
                    <Image src={coverImage} alt="Selected Cover" fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-between px-3">
                      <span className="text-[11px] font-semibold text-white">Custom Upload Active</span>
                      <button
                        type="button"
                        onClick={() => setCoverImage("")}
                        className="text-[11px] bg-destructive hover:bg-destructive/90 text-destructive-foreground px-2 py-0.5 rounded-md font-medium cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 p-3.5 border border-border rounded-xl bg-muted/30">
                <input
                  id="isPublic"
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="w-4 h-4 rounded border-input text-primary focus:ring-primary"
                />
                <div>
                  <label htmlFor="isPublic" className="font-semibold text-sm cursor-pointer block text-foreground">Make Public</label>
                  <p className="text-xs text-muted-foreground leading-tight">Allow other users to see and follow this shelf</p>
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={closeModal}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!name.trim() || isSaving}
                className="min-w-[100px]"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deletingShelf}
        onOpenChange={(open) => {
          if (!open && !isDeleting) setDeletingShelf(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5 text-destructive shrink-0" />
              Delete Shelf
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &ldquo;{deletingShelf?.name}&rdquo;? The books inside will not be removed from your library.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeletingShelf(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Trash2 className="w-4 h-4 mr-2" />}
              Delete Shelf
            </Button>
          </DialogFooter>
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

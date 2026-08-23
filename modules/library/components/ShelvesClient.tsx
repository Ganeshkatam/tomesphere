"use client";

import { useState, useTransition, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShelvesPageDto, ShelfSummaryDto } from "../application/dto/response/ShelvesPageDto";
import { Plus, Library, Search, Loader2, Upload, ImageIcon, Sparkles } from "lucide-react";
import ShelfCard from "./ShelfCard";
import { createShelfAction, updateShelfAction, deleteShelfAction } from "@/app/(workspace)/me/shelves/actions";
import { uploadFileToStorage } from "@/modules/storage/presentation/actions/storage";
import { showSuccess, showError } from "@/lib/toast";
import { PhotoUploadConsentModal } from "@/shared/ui/PhotoUploadConsentModal";
import { usePhotoUploadPermission } from "@/shared/hooks/usePhotoUploadPermission";

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

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShelf, setEditingShelf] = useState<ShelfSummaryDto | null>(null);
  const [isSaving, setIsSaving] = useState(false);
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

  const filteredShelves = data.shelves.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (s.description?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );

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

  const handleDelete = async (shelf: ShelfSummaryDto) => {
    if (!confirm(`Are you sure you want to delete "${shelf.name}"? The books inside will not be deleted from your library.`)) {
      return;
    }

    try {
      // Optimistically remove from state instantly
      setData((prev) => ({
        ...prev,
        shelves: prev.shelves.filter((s) => s.id !== shelf.id),
      }));
      await deleteShelfAction(shelf.id);
      showSuccess("Shelf deleted");
      startTransition(() => {
        router.refresh();
      });
    } catch (error: any) {
      console.error("Failed to delete shelf", error);
      showError("Failed to delete shelf.");
      startTransition(() => {
        router.refresh();
      });
    }
  };

  return (
    <div className="min-h-screen relative w-full flex flex-col">
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
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search shelves..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-[var(--border-default)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <button
              onClick={openCreateModal}
              className="flex items-center justify-center w-10 h-10 sm:w-auto sm:px-4 sm:py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm whitespace-nowrap"
            >
              <Plus className="w-5 h-5 sm:mr-2" />
              <span className="hidden sm:inline">New Shelf</span>
            </button>
          </div>
        </div>

        {isPending && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}

        {/* Empty State */}
        {data.shelves.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-[var(--border-default)] rounded-2xl bg-slate-50/50 dark:bg-slate-900/20">
            <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-500 rounded-full flex items-center justify-center mb-6">
              <Library className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold mb-2">No shelves yet</h3>
            <p className="text-slate-500 max-w-sm mb-8">
              Create a shelf to start organizing your books by topic, genre, or reading goal.
            </p>
            <button
              onClick={openCreateModal}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg transition-all transform hover:scale-105 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create your first shelf
            </button>
          </div>
        ) : filteredShelves.length === 0 ? (
          <div className="py-24 text-center text-slate-500">
            No shelves match your search for &quot;{searchQuery}&quot;.
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
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-950 w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <form onSubmit={handleSave}>
              <div className="p-6 border-b border-[var(--border-default)]">
                <h2 className="text-xl font-bold">
                  {editingShelf ? "Edit Shelf" : "Create New Shelf"}
                </h2>
              </div>
              
              <div className="p-6 space-y-4 flex flex-col">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold mb-1.5 text-slate-700 dark:text-slate-300">Name</label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="e.g. Science Fiction"
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-[var(--border-default)] rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
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
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-[var(--border-default)] rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none text-sm"
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

                <div className="flex items-center gap-3 p-4 border border-[var(--border-default)] rounded-xl bg-slate-50 dark:bg-slate-900/50">
                  <input
                    id="isPublic"
                    type="checkbox"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                    className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary"
                  />
                  <div>
                    <label htmlFor="isPublic" className="font-semibold text-sm cursor-pointer block">Make Public</label>
                    <p className="text-xs text-slate-500 leading-tight">Allow other users to see and follow this shelf</p>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-4 border-t border-[var(--border-default)] bg-slate-50 dark:bg-slate-900 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!name.trim() || isSaving}
                  className="px-6 py-2 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 flex items-center justify-center min-w-[100px] transition-colors"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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

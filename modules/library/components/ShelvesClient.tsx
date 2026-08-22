"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ShelvesPageDto, ShelfSummaryDto } from "../application/dto/response/ShelvesPageDto";
import { Plus, Library, Search, Loader2 } from "lucide-react";
import ShelfCard from "./ShelfCard";
import { createShelfAction, updateShelfAction, deleteShelfAction } from "@/app/(workspace)/me/shelves/actions";

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

  // Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);

  const filteredShelves = data.shelves.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (s.description?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );

  const openCreateModal = () => {
    setEditingShelf(null);
    setName("");
    setDescription("");
    setIsPublic(false);
    setIsModalOpen(true);
  };

  const openEditModal = (shelf: ShelfSummaryDto) => {
    setEditingShelf(shelf);
    setName(shelf.name);
    setDescription(shelf.description || "");
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
        await updateShelfAction(editingShelf.id, { name, description, isPublic });
      } else {
        await createShelfAction({ name, description, isPublic });
      }
      
      // We can either fetch data again or refresh the page
      startTransition(() => {
        router.refresh();
      });
      closeModal();
    } catch (error) {
      console.error("Failed to save shelf", error);
      alert("Failed to save shelf. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (shelf: ShelfSummaryDto) => {
    if (!confirm(`Are you sure you want to delete "${shelf.name}"? The books inside will not be deleted from your library.`)) {
      return;
    }

    try {
      await deleteShelfAction(shelf.id);
      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      console.error("Failed to delete shelf", error);
      alert("Failed to delete shelf.");
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
                    rows={3}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-[var(--border-default)] rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  />
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
    </div>
  );
}

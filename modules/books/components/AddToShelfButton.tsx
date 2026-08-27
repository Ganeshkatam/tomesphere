"use client";

import React, { useState } from "react";
import { FolderPlus, Plus, Check, Loader2, Library } from "lucide-react";
import {
  getBookShelvesAction,
  toggleBookInShelfAction,
  createShelfAction,
} from "@/app/(workspace)/me/shelves/actions";
import { CollectionDto } from "@/modules/library/application/dto/response/CollectionDto";
import { showSuccess, showError } from "@/lib/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";

interface AddToShelfButtonProps {
  bookId: string;
  bookTitle?: string;
  variant?: "hero" | "compact" | "icon";
  className?: string;
}

export default function AddToShelfButton({
  bookId,
  variant = "hero",
  className = "",
}: AddToShelfButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [shelves, setShelves] = useState<CollectionDto[]>([]);
  const [containingShelfIds, setContainingShelfIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingShelf, setIsCreatingShelf] = useState(false);
  const [newShelfName, setNewShelfName] = useState("");
  const [showNewShelfInput, setShowNewShelfInput] = useState(false);

  const loadShelves = async () => {
    setIsLoading(true);
    try {
      const data = await getBookShelvesAction(bookId);
      setShelves(data.shelves);
      setContainingShelfIds(data.containingShelfIds);
    } catch (err: any) {
      console.error("Failed to load user shelves", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleShelf = async (shelfId: string, shelfName: string) => {
    const isCurrentlyIn = containingShelfIds.includes(shelfId);
    const nextContaining = isCurrentlyIn
      ? containingShelfIds.filter((id) => id !== shelfId)
      : [...containingShelfIds, shelfId];

    setContainingShelfIds(nextContaining);
    try {
      await toggleBookInShelfAction(shelfId, bookId, !isCurrentlyIn);
      showSuccess(
        !isCurrentlyIn
          ? `Added to "${shelfName}"`
          : `Removed from "${shelfName}"`,
      );
    } catch (err: any) {
      setContainingShelfIds(containingShelfIds); // revert on failure
      showError(err.message || "Failed to update shelf");
    }
  };

  const handleCreateShelf = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const trimmed = newShelfName.trim();
    if (!trimmed) return;

    setIsCreatingShelf(true);
    try {
      const created = await createShelfAction({ name: trimmed });
      // Add to containing list and shelves list
      await toggleBookInShelfAction(created.id, bookId, true);
      setShelves((prev) => [created, ...prev]);
      setContainingShelfIds((prev) => [...prev, created.id]);
      setNewShelfName("");
      setShowNewShelfInput(false);
      showSuccess(`Created shelf "${trimmed}" and added book!`);
    } catch (err: any) {
      showError(err.message || "Failed to create shelf");
    } finally {
      setIsCreatingShelf(false);
    }
  };

  const activeCount = containingShelfIds.length;

  return (
    <div className={`relative inline-block ${className}`}>
      <DropdownMenu
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (open) {
            loadShelves();
          } else {
            setShowNewShelfInput(false);
          }
        }}
      >
        <DropdownMenuTrigger asChild>
          {variant === "hero" ? (
            <Button
              type="button"
              variant="outline"
              aria-label={
                activeCount > 0 ? `In ${activeCount} shelves` : "Add to Shelf"
              }
              className={`h-12 sm:h-13 px-5 sm:px-6 rounded-2xl font-bold text-xs sm:text-sm border flex items-center justify-center gap-2.5 shadow-xs transition-all cursor-pointer ${
                activeCount > 0
                  ? "bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-950/80"
                  : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white"
              }`}
            >
              <FolderPlus
                size={16}
                className={
                  activeCount > 0 ? "text-indigo-600 dark:text-indigo-400" : ""
                }
              />
              <span>
                {activeCount > 0
                  ? `In ${activeCount} ${activeCount === 1 ? "Shelf" : "Shelves"}`
                  : "Add to Shelf"}
              </span>
            </Button>
          ) : variant === "compact" ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              aria-label={
                activeCount > 0 ? `In ${activeCount} shelves` : "Shelf"
              }
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs border transition-colors cursor-pointer ${
                activeCount > 0
                  ? "bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-700 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-950/80"
                  : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              <FolderPlus size={13} />
              <span>
                {activeCount > 0 ? `${activeCount} Shelves` : "Shelf"}
              </span>
            </Button>
          ) : (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Add to Shelf"
              className="w-8 h-8 rounded-xl bg-black/60 hover:bg-black/90 backdrop-blur-md text-white border border-white/25 flex items-center justify-center transition-colors cursor-pointer shadow-md"
            >
              <FolderPlus size={14} />
            </Button>
          )}
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="start"
          className="w-72 p-3 text-xs font-semibold"
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-border">
            <div className="flex items-center gap-1.5 font-bold text-xs text-foreground">
              <Library size={14} className="text-indigo-500" />
              <span>Add to Shelf</span>
            </div>
          </div>

          {/* Shelves List */}
          <div className="max-h-52 overflow-y-auto space-y-1 pr-1 scrollbar-thin">
            {isLoading ? (
              <div className="flex items-center justify-center py-8 text-muted-foreground">
                <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
              </div>
            ) : shelves.length === 0 ? (
              <div className="text-center py-5 px-2">
                <p className="text-xs text-muted-foreground mb-1">
                  No custom shelves yet.
                </p>
                <p className="text-[11px] text-muted-foreground/80">
                  Create one below to organize your books.
                </p>
              </div>
            ) : (
              shelves.map((shelf) => {
                const isInShelf = containingShelfIds.includes(shelf.id);
                return (
                  <button
                    key={shelf.id}
                    type="button"
                    onClick={() => handleToggleShelf(shelf.id, shelf.name)}
                    className={`flex items-center justify-between w-full text-left px-3 py-2 rounded-xl transition-colors cursor-pointer text-xs ${
                      isInShelf
                        ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-bold"
                        : "text-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    <span className="truncate pr-2">{shelf.name}</span>
                    <div
                      className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 border transition-all ${
                        isInShelf
                          ? "bg-indigo-600 border-indigo-600 text-white"
                          : "border-input bg-background"
                      }`}
                    >
                      {isInShelf && <Check size={11} strokeWidth={3} />}
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Inline Create Shelf Section */}
          <div className="mt-2 pt-2 border-t border-border">
            {showNewShelfInput ? (
              <form onSubmit={handleCreateShelf} className="space-y-2">
                <Input
                  type="text"
                  value={newShelfName}
                  onChange={(e) => setNewShelfName(e.target.value)}
                  onKeyDown={(e) => e.stopPropagation()}
                  placeholder="New shelf name..."
                  autoFocus
                  maxLength={50}
                  className="h-8 text-xs px-2.5"
                />
                <div className="flex items-center justify-end gap-1.5">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowNewShelfInput(false)}
                    className="h-7 px-2 text-[11px]"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={!newShelfName.trim() || isCreatingShelf}
                    className="h-7 px-2.5 text-[11px] font-bold"
                  >
                    {isCreatingShelf ? (
                      <Loader2 size={11} className="animate-spin" />
                    ) : (
                      <Plus size={11} />
                    )}
                    <span>Create</span>
                  </Button>
                </div>
              </form>
            ) : (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowNewShelfInput(true)}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 h-8 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40"
              >
                <Plus size={13} />
                <span>Create New Shelf</span>
              </Button>
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

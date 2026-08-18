"use client";

import { useState, useEffect } from "react";
import { useReaderStore } from "../state/reader-store";
import { X, Save } from "lucide-react";

interface NoteEditorProps {
  onSave: (bodyMarkdown: string) => void;
  onCancel: () => void;
}

export function NoteEditor({ onSave, onCancel }: NoteEditorProps) {
  const { activeNote } = useReaderStore();
  const [body, setBody] = useState("");

  useEffect(() => {
    if (activeNote?.initialBody) {
      setBody(activeNote.initialBody);
    } else {
      setBody("");
    }
  }, [activeNote]);

  if (!activeNote) return null;

  const isEditing = !!activeNote.existingNoteId;

  const handleSave = () => {
    const trimmed = body.trim();
    if (!trimmed) return;
    onSave(trimmed);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[var(--surface-raised)] border-t border-[var(--border-default)] shadow-2xl z-50 animate-in slide-in-from-bottom">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border-subtle)]">
        <span className="text-sm font-medium text-slate-300">
          {isEditing ? "Edit Note" : "New Note"}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            disabled={!body.trim()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm rounded-lg transition-colors"
          >
            <Save size={14} />
            Save
          </button>
          <button
            onClick={onCancel}
            className="p-1.5 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Editor */}
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Write your thoughts..."
        className="w-full h-32 px-4 py-3 bg-transparent text-slate-200 text-sm placeholder:text-slate-500 resize-none focus:outline-none"
        autoFocus
      />
    </div>
  );
}

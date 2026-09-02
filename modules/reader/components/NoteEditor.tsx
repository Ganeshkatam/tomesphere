"use client";

import React, { useState, useEffect, useRef } from "react";
import { useReaderStore } from "../state/reader-store";
import { X, Save, MessageSquarePlus, Pencil, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NoteEditorProps {
  onSave: (bodyMarkdown: string) => void;
  onCancel: () => void;
}

export function NoteEditor({ onSave, onCancel }: NoteEditorProps) {
  const { activeNote, preferences } = useReaderStore();
  const theme = preferences.theme || "light";
  const [body, setBody] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (activeNote?.initialBody) {
      setBody(activeNote.initialBody);
    } else {
      setBody("");
    }
  }, [activeNote]);

  useEffect(() => {
    // Auto-focus and place cursor at the end
    if (activeNote && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(
        textareaRef.current.value.length,
        textareaRef.current.value.length,
      );
    }
  }, [activeNote]);

  if (!activeNote) return null;

  const isEditing = !!activeNote.existingNoteId;

  const handleSave = () => {
    const trimmed = body.trim();
    if (!trimmed) return;
    onSave(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      e.preventDefault();
      onCancel();
    }
  };

  const themeStyles = {
    light: {
      card: "bg-white border-slate-200/90 text-slate-900 shadow-2xl shadow-slate-900/15",
      header: "bg-slate-50/80 border-b border-slate-100 text-slate-900",
      headerSub: "text-slate-500",
      quoteBox: "bg-slate-50/80 border-slate-200 text-slate-600",
      quoteText: "text-slate-700",
      textarea: "text-slate-900 placeholder:text-slate-400 bg-transparent",
      footer: "bg-slate-50/80 border-t border-slate-100 text-slate-500",
      cancelBtn: "text-slate-600 hover:text-slate-900 hover:bg-slate-100",
      saveBtn: "bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20",
      iconBadge: "bg-indigo-50 text-indigo-600",
    },
    dark: {
      card: "bg-[#1e2227] border-[#2e3440] text-slate-100 shadow-2xl shadow-black/70",
      header: "bg-[#1a1d21] border-b border-[#2e3440] text-slate-100",
      headerSub: "text-slate-400",
      quoteBox: "bg-[#252930] border-[#333a46] text-slate-400",
      quoteText: "text-slate-200",
      textarea: "text-slate-100 placeholder:text-slate-500 bg-transparent",
      footer: "bg-[#1a1d21] border-t border-[#2e3440] text-slate-400",
      cancelBtn: "text-slate-300 hover:text-white hover:bg-white/10",
      saveBtn: "bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-500/25",
      iconBadge: "bg-indigo-950/60 text-indigo-400 border border-indigo-500/20",
    },
    sepia: {
      card: "bg-[#fbf4e2] border-[#dfd3b9] text-[#5b4636] shadow-2xl shadow-[#5b4636]/15",
      header: "bg-[#f4ecd8] border-b border-[#dfd3b9] text-[#382b21]",
      headerSub: "text-[#8a725b]",
      quoteBox: "bg-[#ede3cc] border-[#ddcaa1] text-[#755c48]",
      quoteText: "text-[#382b21]",
      textarea: "text-[#382b21] placeholder:text-[#8a725b]/70 bg-transparent",
      footer: "bg-[#f4ecd8] border-t border-[#dfd3b9] text-[#8a725b]",
      cancelBtn: "text-[#5b4636] hover:text-[#382b21] hover:bg-[#ebdcb8]",
      saveBtn: "bg-[#c87a32] hover:bg-[#b56b26] text-white shadow-md shadow-[#c87a32]/25",
      iconBadge: "bg-[#ede3cc] text-[#8b5a2b] border border-[#c87a32]/20",
    },
  }[theme];

  const highlightBorderColor = activeNote.color || "#fde047";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="note-editor-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/45 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onCancel();
        }
      }}
    >
      <div
        className={`w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden flex flex-col transition-all duration-200 animate-in zoom-in-95 ${themeStyles.card}`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between px-5 py-3.5 transition-colors ${themeStyles.header}`}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl flex items-center justify-center ${themeStyles.iconBadge}`}>
              {isEditing ? <Pencil size={16} /> : <MessageSquarePlus size={16} />}
            </div>
            <div>
              <h3 id="note-editor-title" className="text-sm font-bold leading-tight">
                {isEditing ? "Edit Note" : "Add Note"}
              </h3>
              <p className={`text-[11px] leading-tight mt-0.5 ${themeStyles.headerSub}`}>
                {activeNote.quoteText ? "Attached to highlighted text" : "Annotation note"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onCancel}
            aria-label="Close note editor"
            className={`p-1.5 rounded-xl transition-all cursor-pointer ${themeStyles.cancelBtn}`}
          >
            <X size={17} />
          </button>
        </div>

        {/* Quoted Snippet Preview (Context for highlight) */}
        {activeNote.quoteText && (
          <div className="px-5 pt-4 pb-1">
            <div
              style={{ borderLeftColor: highlightBorderColor }}
              className={`p-3 rounded-r-xl border-l-4 text-xs italic flex items-start gap-2.5 ${themeStyles.quoteBox}`}
            >
              <Quote size={14} className="shrink-0 mt-0.5 opacity-60" />
              <p className={`line-clamp-3 leading-relaxed ${themeStyles.quoteText}`}>
                {activeNote.quoteText}
              </p>
            </div>
          </div>
        )}

        {/* Textarea Editor */}
        <div className="px-5 py-3.5 flex-1 flex flex-col">
          <textarea
            ref={textareaRef}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Write your thoughts, reflections, or takeaways..."
            rows={5}
            className={`w-full text-sm leading-relaxed resize-none focus:outline-none transition-colors ${themeStyles.textarea}`}
          />
        </div>

        {/* Footer Actions */}
        <div
          className={`flex items-center justify-between px-5 py-3 transition-colors ${themeStyles.footer}`}
        >
          <span className="text-[11px] opacity-75 hidden sm:inline-block">
            Press <kbd className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/15">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/15">Enter</kbd> to save
          </span>

          <div className="flex items-center gap-2 ml-auto">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl cursor-pointer ${themeStyles.cancelBtn}`}
            >
              Cancel
            </Button>

            <Button
              type="button"
              size="sm"
              onClick={handleSave}
              disabled={!body.trim()}
              className={`px-4 py-1.5 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed ${themeStyles.saveBtn}`}
            >
              <Save size={14} />
              <span>Save Note</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NoteEditor;

"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { Toolbar } from "./toolbar/Toolbar";
import { Viewer } from "./viewer/Viewer";
import { ReaderService } from "@/modules/reader/application/ReaderService";
import { HighlightPopup } from "./HighlightPopup";
import { HighlightContextMenu } from "./HighlightContextMenu";
import { NoteEditor } from "./NoteEditor";
import { useReaderStore } from "../state/reader-store";
import { AnnotationSidebar } from "./Sidebar/AnnotationSidebar";
import { ReaderPageDto } from "../application/dto/ReaderPageDto";
import { RendererFactory } from "../services/parser/RendererFactory";

interface ReaderShellProps {
  data: ReaderPageDto;
}

export function ReaderShell({ data }: ReaderShellProps) {
  const viewerRef = useRef<HTMLDivElement>(null);
  const serviceRef = useRef<ReaderService | null>(null);
  const [service, setService] = useState<ReaderService | null>(null);

  // We should pass userId from auth session, but for now we'll mock it or rely on existing behavior
  // For V1, user should be in session context or passed down. Let's assume ReaderPageDto includes userId?
  // Ah, the user didn't specify userId in ReaderPageDto. The Facade does Auth check, so we can pass userId if needed.
  // Let's modify ReaderPageDto to include userId if ReaderService needs it, or ReaderService can fetch it.
  // The user says "The page should never know: Supabase, Storage, File URLs, Sessions, Progress, User. Only ReaderPageDto".
  // So ReaderService shouldn't need `userId` to be explicitly passed down, it should just execute commands via Facades that know the user from server session!
  // But ReaderService is client-side. Server Actions automatically know the user from cookies. So `userId` is redundant.
  // I will refactor ReaderService to not require userId later. For now, I'll pass a dummy 'current-user' string since Server Actions don't actually need it passed.
  const userId = "current-user";

  useEffect(() => {
    if (!viewerRef.current) return;

    let mounted = true;

    async function init() {
      try {
        const newService = new ReaderService(userId, data.book.id);
        serviceRef.current = newService;

        const renderer = RendererFactory.create(data.book.fileType);

        if (mounted && viewerRef.current) {
          await newService.initialize(
            renderer,
            data.book.fileUrl,
            viewerRef.current,
          );
          if (mounted) {
            setService(newService);
          }
        }
      } catch (err) {
        console.error("Failed to initialize Reader:", err);
      }
    }

    init();

    return () => {
      mounted = false;
      if (serviceRef.current) {
        serviceRef.current.destroy();
        serviceRef.current = null;
        setService(null);
      }
    };
  }, [data.book.id, data.book.fileUrl, data.book.fileType, userId]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!serviceRef.current) return;
      if (document.hidden) {
        serviceRef.current.pauseSession();
      } else {
        serviceRef.current.startSession();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // ─── Keyboard Shortcuts ──────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (!serviceRef.current) return;

      switch (e.key) {
        case "ArrowRight":
        case "Space":
          e.preventDefault();
          serviceRef.current.next();
          break;
        case "ArrowLeft":
          e.preventDefault();
          serviceRef.current.previous();
          break;
        case "Escape":
          useReaderStore.getState().setSidebarOpen(false);
          useReaderStore.getState().setActiveNote(null);
          useReaderStore.getState().setActiveSelection(null);
          useReaderStore.getState().setClickedHighlightId(null);
          break;
        case "b":
        case "B":
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            serviceRef.current.toggleBookmark();
          }
          break;
        case "h":
        case "H":
          if (!e.ctrlKey && !e.metaKey) {
            const selection = useReaderStore.getState().activeSelection;
            if (selection) {
              e.preventDefault();
              serviceRef.current.createHighlight("#ffeb3b"); // default color
            }
          }
          break;
        case "f":
        case "F":
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            useReaderStore.getState().setSidebarTab("search");
            useReaderStore.getState().setSidebarOpen(true);
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // ─── Highlight callbacks ─────────────────────────────────────────
  const handleCreateHighlight = useCallback((color: string) => {
    serviceRef.current?.createHighlight(color);
  }, []);

  const handleDeleteHighlight = useCallback((highlightId: string) => {
    serviceRef.current?.deleteHighlight(highlightId);
  }, []);

  const handleHighlightAndNote = useCallback(async (color: string) => {
    const service = serviceRef.current;
    if (!service) return;
    await service.createHighlight(color);
  }, []);

  // ─── Note callbacks ──────────────────────────────────────────────
  const handleAddNote = useCallback((highlightId: string) => {
    serviceRef.current?.openNoteForHighlight(highlightId);
  }, []);

  const handleSaveNote = useCallback((bodyMarkdown: string) => {
    serviceRef.current?.saveNote(bodyMarkdown);
  }, []);

  const handleCancelNote = useCallback(() => {
    useReaderStore.getState().setActiveNote(null);
  }, []);

  return (
    <div className="flex flex-col h-screen w-full bg-slate-950 overflow-hidden text-slate-200">
      <Toolbar service={service} />
      <div className="flex flex-1 overflow-hidden relative">
        <main className="flex-1 relative">
          <Viewer ref={viewerRef} />
          <HighlightPopup
            onCreateHighlight={handleCreateHighlight}
            onHighlightAndNote={handleHighlightAndNote}
          />
          <HighlightContextMenu
            onAddNote={handleAddNote}
            onDeleteHighlight={handleDeleteHighlight}
          />
          <NoteEditor onSave={handleSaveNote} onCancel={handleCancelNote} />
        </main>
        <AnnotationSidebar service={service} />
      </div>
    </div>
  );
}

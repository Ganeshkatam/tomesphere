import { NoteSummaryDto } from "../application/dto/response/NotesPageDto";
import { formatDistanceToNow } from "date-fns";
import { Book, FileText, Clock } from "lucide-react";

interface NoteCardProps {
  note: NoteSummaryDto;
}

export function NoteCard({ note }: NoteCardProps) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-[var(--border-default)] rounded-xl p-5 hover:shadow-md transition-shadow">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-1">
        {note.title}
      </h3>
      
      {note.bookTitle && (
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4">
          <Book className="w-3.5 h-3.5" />
          <span className="line-clamp-1">{note.bookTitle}</span>
        </div>
      )}

      <div className="text-sm text-slate-600 dark:text-slate-300 line-clamp-4 mb-4 whitespace-pre-wrap flex-1">
        {note.content || <span className="italic text-slate-400">Empty note</span>}
      </div>

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-[var(--border-default)] text-xs text-slate-400">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          <span>Updated {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}</span>
        </div>
        
        {note.tags && note.tags.length > 0 && (
          <div className="flex gap-1.5">
            {note.tags.slice(0, 2).map((tag: string, i: number) => (
              <span key={i} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md text-[10px] font-semibold text-slate-500">
                {tag}
              </span>
            ))}
            {note.tags.length > 2 && (
              <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md text-[10px] font-semibold text-slate-500">
                +{note.tags.length - 2}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

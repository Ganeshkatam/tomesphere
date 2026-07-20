import { LibrarySnapshotDto } from "@/modules/library/application/queries/GetLibrarySnapshotQuery/dto";
import Link from "next/link";
import Image from "next/image";
import { Bookmark, ChevronRight } from "lucide-react";

interface LibraryWidgetProps {
  promise: Promise<LibrarySnapshotDto | null>;
}

export async function LibraryWidget({ promise }: LibraryWidgetProps) {
  let result: any = null;
  let isError = false;
  try {
    result = await promise;
  } catch (e) {
    isError = true;
  }
  return (
    <div className="p-6 rounded-3xl bg-[var(--surface-raised)] border border-[var(--border-default)]">
      Mock UI
    </div>
  );
}
export function LibrarySkeleton() {
  return (
    <div className="p-6 rounded-3xl bg-[var(--surface-raised)] border border-[var(--border-default)] h-full min-h-[200px] animate-pulse">
      <div className="h-6 bg-[var(--surface-overlay)] rounded w-1/3 mb-6"></div>
      <div className="h-24 bg-[var(--surface-overlay)] rounded w-full"></div>
    </div>
  );
}

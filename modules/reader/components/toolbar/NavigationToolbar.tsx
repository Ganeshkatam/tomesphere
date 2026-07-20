"use client";

import { useReaderStore } from "@/modules/reader/state/reader-store";
import { ChevronLeft, Menu } from "lucide-react";
import { useRouter } from "next/navigation";

export function NavigationToolbar() {
  const router = useRouter();
  const sidebarOpen = useReaderStore((state) => state.sidebarOpen);
  const setSidebarOpen = useReaderStore((state) => state.setSidebarOpen);

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => router.back()}
        className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors"
        title="Back to Library"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className={`p-2 rounded-lg transition-colors ${sidebarOpen ? "bg-indigo-600 text-white" : "hover:bg-white/5 text-slate-400 hover:text-white"}`}
      >
        <Menu size={20} />
      </button>
    </div>
  );
}

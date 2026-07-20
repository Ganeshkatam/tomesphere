"use client";

import { LibraryNavigationDto } from "../application/dto/response/LibraryPageDto";
import { useLibraryStore } from "../store/library-store";

interface LibrarySidebarProps {
  navigation: LibraryNavigationDto;
}

export default function LibrarySidebar({ navigation }: LibrarySidebarProps) {
  const {
    activeViewId,
    setActiveView,
    expandedSidebarGroups,
    toggleSidebarGroup,
  } = useLibraryStore();

  const isExpanded = (groupId: string) =>
    expandedSidebarGroups.includes(groupId);

  const renderViewItem = (item: any) => {
    const isActive = activeViewId === item.id;
    return (
      <button
        key={item.id}
        onClick={() => setActiveView(item.id)}
        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
          isActive
            ? "bg-primary/20 text-primary-light"
            : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
        }`}
      >
        <span>{item.title}</span>
        {item.count !== undefined && (
          <span className="text-xs bg-black/20 px-2 py-0.5 rounded-full">
            {item.count}
          </span>
        )}
      </button>
    );
  };

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col h-[calc(100vh-4rem)] sticky top-16 border-r border-white/5 p-4 overflow-y-auto hidden md:flex">
      {/* Overview */}
      <div className="mb-6">
        <h3 className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2 px-3">
          Library
        </h3>
        <div className="space-y-1">
          {navigation.views
            .filter((v) => v.type === "overview")
            .map(renderViewItem)}
        </div>
      </div>

      {/* Reading Status */}
      <div className="mb-6">
        <h3 className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2 px-3">
          Status
        </h3>
        <div className="space-y-1">
          {navigation.views
            .filter((v) => v.type === "status")
            .map(renderViewItem)}
        </div>
      </div>

      {/* Smart Filters */}
      <div className="mb-6">
        <h3 className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2 px-3">
          Smart Filters
        </h3>
        <div className="space-y-1">
          {navigation.smartFilters.map(renderViewItem)}
        </div>
      </div>

      {/* Collections */}
      <div className="mb-6">
        <button
          onClick={() => toggleSidebarGroup("collections")}
          className="w-full flex items-center justify-between text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2 px-3 hover:text-slate-300"
        >
          <span>Collections</span>
          <span
            className="transform transition-transform duration-200"
            style={{
              transform: isExpanded("collections")
                ? "rotate(90deg)"
                : "rotate(0deg)",
            }}
          >
            ▶
          </span>
        </button>
        {isExpanded("collections") && (
          <div className="space-y-1">
            {navigation.collections.length > 0 ? (
              navigation.collections.map(renderViewItem)
            ) : (
              <p className="px-3 text-xs text-slate-600">No collections yet.</p>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}

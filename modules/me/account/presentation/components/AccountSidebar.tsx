import { User, Settings, Shield } from "lucide-react";

interface AccountSidebarProps {
  activeTab: "profile" | "preferences" | "security";
  onTabChange: (tab: "profile" | "preferences" | "security") => void;
}

export function AccountSidebar({
  activeTab,
  onTabChange,
}: AccountSidebarProps) {
  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "preferences", label: "Preferences", icon: Settings },
    { id: "security", label: "Security", icon: Shield },
  ] as const;

  return (
    <aside className="w-64 border-r border-[var(--border-default)] bg-[var(--surface-default)] py-6 px-4">
      <nav className="space-y-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`w-full flex items-center px-3 py-2 text-sm font-semibold rounded-xl transition-colors cursor-pointer ${
                isActive
                  ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)]"
              }`}
            >
              <Icon
                className={`flex-shrink-0 -ml-1 mr-3 h-5 w-5 ${
                  isActive
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-[var(--text-tertiary)]"
                }`}
              />
              <span className="truncate">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

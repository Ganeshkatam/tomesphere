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
    <aside className="w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 py-6 px-4">
      <nav className="space-y-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive
                  ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300"
                  : "text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
              }`}
            >
              <Icon
                className={`flex-shrink-0 -ml-1 mr-3 h-5 w-5 ${
                  isActive
                    ? "text-indigo-700 dark:text-indigo-300"
                    : "text-gray-400 dark:text-gray-500"
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

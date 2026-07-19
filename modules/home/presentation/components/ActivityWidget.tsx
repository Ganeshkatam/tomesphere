import { RecentActivityDto } from "@/modules/account/application/queries/GetRecentActivityQuery/dto";
import { Activity, BookOpen, Bookmark, CheckCircle, PlusCircle, PlayCircle, Target } from "lucide-react";

interface ActivityWidgetProps {
  result: RecentActivityDto | null;
}

export function ActivityWidget({ result }: ActivityWidgetProps) {
  if (!result) {
    return (
      <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 h-full">
        <p className="font-semibold">Unable to load activity.</p>
        <p className="text-sm opacity-80">{"Error"}</p>
      </div>
    );
  }

  const events = result?.events || [];

  return (
    <div className="flex flex-col p-6 rounded-3xl bg-[var(--surface-raised)] border border-[var(--border-default)] h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-slate-500/10 text-slate-400">
          <Activity size={20} />
        </div>
        <h3 className="font-semibold text-[var(--text-primary)]">Recent Activity</h3>
      </div>

      {events.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
          <p className="text-sm text-[var(--text-secondary)]">No recent activity.</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto pr-2 space-y-6">
          {events.map((event, index) => {
            // Determine icon and color based on event type
            let Icon = Activity;
            let iconColor = "text-slate-400";
            let iconBg = "bg-slate-500/10";

            switch (event.type) {
              case "STARTED":
                Icon = PlayCircle;
                iconColor = "text-indigo-400";
                iconBg = "bg-indigo-500/10";
                break;
              case "FINISHED":
                Icon = CheckCircle;
                iconColor = "text-emerald-400";
                iconBg = "bg-emerald-500/10";
                break;
              case "ADDED_TO_LIBRARY":
                Icon = PlusCircle;
                iconColor = "text-blue-400";
                iconBg = "bg-blue-500/10";
                break;
              case "BOOKMARK_CREATED":
              case "HIGHLIGHT_CREATED":
                Icon = Bookmark;
                iconColor = "text-amber-400";
                iconBg = "bg-amber-500/10";
                break;
              case "GOAL_COMPLETED":
                Icon = Target;
                iconColor = "text-orange-400";
                iconBg = "bg-orange-500/10";
                break;
            }

            // Simple relative time approximation
            const date = new Date(event.timestamp);
            const now = new Date();
            const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 3600 * 24));
            let timeLabel = "Today";
            if (diffDays === 1) timeLabel = "Yesterday";
            else if (diffDays > 1) timeLabel = `${diffDays} days ago`;

            return (
              <div key={event.id} className="flex gap-4 relative">
                {index < events.length - 1 && (
                  <div className="absolute left-4 top-10 bottom-[-24px] w-px bg-[var(--border-default)]"></div>
                )}
                <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center ${iconBg} ${iconColor} relative z-10`}>
                  <Icon size={14} />
                </div>
                <div className="flex-1 pb-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                      {event.type.replace(/_/g, ' ')}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">{timeLabel}</span>
                  </div>
                  <p className="text-sm text-[var(--text-primary)]">{event.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

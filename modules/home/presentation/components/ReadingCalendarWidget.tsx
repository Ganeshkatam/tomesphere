import { ReadingCalendarDto } from "@/modules/progress/application/queries/GetReadingCalendarQuery/dto";
import { Calendar } from "lucide-react";

interface ReadingCalendarWidgetProps {
  result: ReadingCalendarDto | null;
}

export function ReadingCalendarWidget({ result }: ReadingCalendarWidgetProps) {
  if (!result) {
    return (
      <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 h-full">
        <p className="font-semibold">Unable to load calendar.</p>
        <p className="text-sm opacity-80">{"Error"}</p>
      </div>
    );
  }

  const data = result;
  
  // Default to 7 empty days if no data
  const days = data?.days || Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return { date: d.toISOString().split("T")[0], active: false };
  });

  return (
    <div className="flex flex-col p-6 rounded-3xl bg-[var(--surface-raised)] border border-[var(--border-default)] h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400">
          <Calendar size={20} />
        </div>
        <h3 className="font-semibold text-[var(--text-primary)]">Reading Habit</h3>
      </div>

      <div className="flex-1 flex items-center justify-between gap-2">
        {days.map((day, i) => {
          const dateObj = new Date(day.date);
          const dayName = dateObj.toLocaleDateString("en-US", { weekday: "short" }).substring(0, 3);
          
          return (
            <div key={day.date} className="flex flex-col items-center gap-2">
              <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                {dayName}
              </span>
              <div 
                className={`w-8 h-8 rounded-md transition-colors ${
                  day.active 
                    ? "bg-teal-500 shadow-[0_0_10px_rgba(20,184,166,0.3)] border border-teal-400" 
                    : "bg-[var(--surface-base)] border border-[var(--border-default)]"
                }`}
                title={day.date}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

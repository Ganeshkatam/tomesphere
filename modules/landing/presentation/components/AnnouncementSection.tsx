import { AnnouncementDto } from "@/modules/announcements/application/dto/AnnouncementDto";

interface AnnouncementSectionProps {
  announcements: AnnouncementDto[];
}

export default function AnnouncementSection({
  announcements,
}: AnnouncementSectionProps) {
  if (!announcements || announcements.length === 0) return null;

  return (
    <section className="max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 w-full">
      <h2 className="text-3xl font-display font-bold text-[var(--text-primary)] mb-8">
        Announcements
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {announcements.slice(0, 2).map((announcement) => (
          <div
            key={announcement.id}
            className="p-6 rounded-2xl bg-[var(--surface-raised)] border border-[var(--border-default)]"
          >
            <div className="flex items-center gap-2 mb-3">
              <span
                className={`px-2 py-1 rounded text-xs font-bold ${announcement.type === "info" ? "bg-blue-500/20 text-blue-400" : "bg-green-500/20 text-green-400"}`}
              >
                {announcement.type.toUpperCase()}
              </span>
              <span className="text-sm text-[var(--text-tertiary)]">
                {new Date(announcement.startsAt).toLocaleDateString()}
              </span>
            </div>
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
              {announcement.title}
            </h3>
            <p className="text-[var(--text-secondary)]">
              {announcement.content}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

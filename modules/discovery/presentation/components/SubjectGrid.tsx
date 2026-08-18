import Link from "next/link";

interface SubjectGridProps {
  items: readonly string[];
}

export function SubjectGrid({ items }: SubjectGridProps) {
  if (!items || items.length === 0) {
    return null; // Silently omit if empty
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-3 min-w-0">
      {items.map((subject) => (
        <Link
          key={subject}
          href={`/search?q=${encodeURIComponent(subject)}`}
          className="group flex items-center justify-between py-2 border-b border-outline-variant/30 hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm transition-colors duration-200"
        >
          <span className="font-serif text-title-md text-on-surface group-hover:text-primary transition-colors duration-200 truncate">
            {subject}
          </span>
        </Link>
      ))}
    </div>
  );
}

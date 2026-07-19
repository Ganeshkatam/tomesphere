import Link from "next/link";
import { executeGetDiscoveryOverviewQuery } from "@/modules/discovery/application/queries/GetDiscoveryOverview";

export default async function SubjectsPage() {
  const overview = await executeGetDiscoveryOverviewQuery();
  const subjects = overview.subjects || [];

  return (
    <div className="w-full pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-[var(--text-primary)]">Browse by Subject</h1>
        <p className="text-[var(--text-secondary)] mt-2">Explore specific subjects and topics.</p>
      </div>

      {subjects.length === 0 ? (
        <div className="p-12 text-center bg-[var(--surface-raised)] rounded-2xl border border-[var(--border-default)]">
          <p className="text-[var(--text-secondary)]">No subjects available right now.</p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">
          {subjects.map(subject => (
            <Link key={subject} href={`/discover/subjects/${subject.toLowerCase().replace(/\s+/g, '-')}`} className="px-6 py-3 rounded-xl bg-[var(--surface-raised)] border border-[var(--border-default)] hover:border-indigo-500 transition-colors text-[var(--text-primary)] font-medium">
              {subject}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

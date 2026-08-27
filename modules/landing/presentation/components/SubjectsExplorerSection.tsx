import React from "react";
import Link from "next/link";
import { ArrowRight, Tag, Bookmark } from "lucide-react";

interface SubjectsExplorerSectionProps {
  subjects?: string[];
}

export default function SubjectsExplorerSection({
  subjects = [],
}: SubjectsExplorerSectionProps) {
  const displaySubjects =
    subjects.length > 0
      ? subjects
      : [
          "Classic Literature",
          "Philosophy & Ethics",
          "World History",
          "Theoretical Physics",
          "Astronomy & Cosmology",
          "Renaissance Art",
          "Poetry & Anthologies",
          "Psychology & Mind",
          "Political Economy",
          "Mythology & Folklore",
          "Ancient Civilizations",
          "Computer Science",
          "Epistemology",
          "Biological Sciences",
          "Literary Criticism",
        ];

  return (
    <section className="max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 w-full py-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-4 border-b border-slate-200/80 dark:border-slate-800/80">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3 border border-slate-200 dark:border-slate-700">
            <Tag className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Topical Taxonomy</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
            Explore by Subject & Discipline
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
            Navigate through scholarly disciplines, historical eras, and thematic fields across our open catalog.
          </p>
        </div>

        <Link
          href="/discover"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors group"
        >
          <span>All Catalog Subjects</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Subject Pill Badges */}
      <div className="flex flex-wrap gap-2.5 sm:gap-3">
        {displaySubjects.map((subject, idx) => (
          <Link
            key={idx}
            href={`/search?q=${encodeURIComponent(subject)}`}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500/50 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 text-slate-700 dark:text-slate-200 text-sm font-medium transition-all shadow-xs hover:shadow-md hover:-translate-y-0.5"
          >
            <Bookmark className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400 opacity-70" />
            <span>{subject}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

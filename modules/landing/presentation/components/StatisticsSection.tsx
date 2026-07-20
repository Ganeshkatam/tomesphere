import { PlatformStatisticsDto } from "@/modules/statistics/application/queries/GetPlatformStatistics/read-model";

interface StatisticsSectionProps {
  statistics: PlatformStatisticsDto;
}

export default function StatisticsSection({
  statistics,
}: StatisticsSectionProps) {
  if (!statistics) return null;

  return (
    <section className="max-w-[1400px] mx-auto px-8 sm:px-12 lg:px-16 w-full mb-12">
      <div className="p-10 rounded-3xl bg-gradient-to-r from-[var(--surface-raised)] to-[var(--surface-default)] border border-[var(--border-default)] grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div>
          <p className="text-4xl sm:text-5xl font-display font-bold text-primary mb-3">
            {(statistics.booksCount || 0).toLocaleString()}+
          </p>
          <p className="text-[var(--text-secondary)] font-medium">
            Books Available
          </p>
        </div>
        <div className="md:border-l md:border-r border-[var(--border-default)]">
          <p className="text-4xl sm:text-5xl font-display font-bold text-accent mb-3">
            {(statistics.authorsCount || 0).toLocaleString()}+
          </p>
          <p className="text-[var(--text-secondary)] font-medium">Authors</p>
        </div>
        <div>
          <p className="text-4xl sm:text-5xl font-display font-bold text-secondary mb-3">
            {(statistics.genresCount || 0).toLocaleString()}+
          </p>
          <p className="text-[var(--text-secondary)] font-medium">Genres</p>
        </div>
      </div>
    </section>
  );
}

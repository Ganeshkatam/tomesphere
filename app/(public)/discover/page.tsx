import LandingCuratedSections from "@/modules/landing/components/LandingCuratedSections";
import { executeDiscoverPageFacade } from "@/modules/discovery/application/facades";

export default async function DiscoverOverviewPage() {
  const data = await executeDiscoverPageFacade();

  return (
    <div className="w-full">
      <h1 className="text-3xl font-display font-bold text-[var(--text-primary)] mb-8">Discovery Overview</h1>
      <LandingCuratedSections 
        overview={data.overview}
        statistics={data.statistics}
        announcements={data.announcements}
      />
    </div>
  );
}

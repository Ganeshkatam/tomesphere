import LandingClient from "@/modules/landing/components/LandingClient";
import { executeLandingPageFacade } from "@/modules/landing/application/facades";

export const dynamic = "force-dynamic";

export default async function Page() {
  const data = await executeLandingPageFacade();

  return (
    <LandingClient
      overview={data.overview}
      announcements={data.announcements}
      statistics={data.statistics}
    />
  );
}

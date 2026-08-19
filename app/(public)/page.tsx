import LandingClient from "@/modules/landing/presentation/components/LandingClient";
import { executeLandingPageFacade } from "@/modules/landing/application/facades";

export const dynamic = "force-dynamic";

export default async function Page() {
  const landingData = await executeLandingPageFacade();

  return <LandingClient model={landingData} />;
}

import LandingClient from "@/modules/landing/presentation/components/LandingClient";
import { executeLandingPageFacade } from "@/modules/landing/application/facades";
import { createSupabaseServerClient } from "@/shared/core/database/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Page() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/me");
  }

  const landingData = await executeLandingPageFacade();
  return <LandingClient model={landingData} />;
}

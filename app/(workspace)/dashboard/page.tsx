import { HomeClient } from "@/modules/home/presentation/components/HomeClient";
import { executeHomePageFacade } from "@/modules/home/application/facades";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  let data;
  try {
    data = await executeHomePageFacade();
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      const { redirect } = await import("next/navigation");
      redirect("/login");
    }
    throw error;
  }

  return <HomeClient data={data} />;
}

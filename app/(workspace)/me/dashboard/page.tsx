import { DashboardPageFacade } from "@/modules/dashboard/application/facades/DashboardPageFacade";
import DashboardClient from "@/modules/dashboard/presentation/components/DashboardClient";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reading Dashboard",
};

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  let data;
  try {
    data = await DashboardPageFacade.execute();
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      redirect("/login");
    }
    throw error;
  }

  return <DashboardClient data={data} />;
}

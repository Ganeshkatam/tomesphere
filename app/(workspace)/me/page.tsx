import { MeClient } from "@/modules/me/presentation/components/MeClient";
import { executeMePageFacade } from "@/modules/me/application/facades";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Workspace",
};

export const dynamic = "force-dynamic";

export default async function MePage() {
  let data;
  try {
    data = await executeMePageFacade();
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      const { redirect } = await import("next/navigation");
      redirect("/login");
    }
    throw error;
  }

  return <MeClient data={data} />;
}

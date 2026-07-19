import HomeScreen from "@/modules/home/presentation/screens/HomeScreen";
import { executeHomePageFacade } from "@/modules/home/application/facades";

export const dynamic = "force-dynamic";

export default async function Page() {
  try {
    const data = await executeHomePageFacade();
    return <HomeScreen data={data} />;
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      // Typically we'd use next/navigation redirect, but we can't catch redirect() inside try/catch easily in next 13+
      // So we will just handle it or let a middleware handle it. 
      // For now we assume middleware protects it or we redirect.
      const { redirect } = await import("next/navigation");
      redirect("/login");
    }
    throw error;
  }
}

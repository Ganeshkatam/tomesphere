import { getProgressDashboard } from "@/modules/user/progress/presentation/actions/progress";
import { redirect } from "next/navigation";
import ProgressDashboardScreen from "@/modules/user/progress/presentation/components/ProgressDashboardScreen";

export const dynamic = "force-dynamic";

export default async function ProgressPage() {
  const progressResult = await getProgressDashboard();
  const progress = progressResult.success ? progressResult.data : null;

  if (!progress) {
    redirect("/login");
  }

  return (
    <ProgressDashboardScreen
      progress={progress}
      dailyStats={[]}
    />
  );
}

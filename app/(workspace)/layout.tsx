import { UniversalHeader } from "@/exp/navigation/UniversalHeader";
import { createSupabaseServerClient } from "@/shared/core/database/server";
import { redirect } from "next/navigation";
import { getNavigationFacade } from "@/modules/navigation/application/facades";

export default async function WorkspaceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface font-sans">
      <UniversalHeader isLoggedIn={true} />
      <div className="flex-1 w-full mx-auto max-w-container-max px-margin-desktop pt-[152px] pb-32">
        {children}
      </div>
    </div>
  );
}

import Navbar from "@/modules/shared/navigation/components/Navbar";
import { createSupabaseServerClient } from "@/modules/shared/core/database/server";
import { redirect } from "next/navigation";

export default async function WorkspaceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <Navbar user={user} />
      {children}
    </>
  );
}

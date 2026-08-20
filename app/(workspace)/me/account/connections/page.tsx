import { createSupabaseServerClient } from "@/shared/core/database/server";
import {
  ConnectedAccountsScreen,
  UserIdentityDto,
} from "@/modules/me/account/connections/presentation/components/ConnectedAccountsScreen";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ConnectedAccountsPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/auth/sign-in");
  }

  const identities: UserIdentityDto[] = (user.identities || []).map((id) => ({
    id: id.id,
    provider: id.provider,
    email: (id.identity_data as any)?.email || user.email,
    createdAt: id.created_at,
    lastSignInAt: id.last_sign_in_at,
  }));

  return (
    <div>
      <ConnectedAccountsScreen
        primaryEmail={user.email || ""}
        identities={identities}
      />
    </div>
  );
}
